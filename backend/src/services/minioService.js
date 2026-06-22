const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const {
  HeadBucketCommand,
  HeadObjectCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/s3");

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "products";
const PUBLIC_BASE_URL = process.env.MINIO_PUBLIC_URL || "http://localhost:9000";
const LOCAL_IMAGE_DIRS = ["image_slider", "product_images"];

function getPublicObjectUrl(fileName) {
  return `${PUBLIC_BASE_URL}/${BUCKET_NAME}/${fileName}`;
}

async function ensureProductsBucket() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`Bucket MinIO "${BUCKET_NAME}" już istnieje.`);
  } catch (err) {
    const isMissing =
      err.name === "NotFound" ||
      err.name === "NoSuchBucket" ||
      err.$metadata?.httpStatusCode === 404;

    if (!isMissing) {
      throw err;
    }

    await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
    console.log(`Utworzono bucket MinIO "${BUCKET_NAME}".`);
  }

  const publicReadPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { AWS: ["*"] },
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
      },
    ],
  };

  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(publicReadPolicy),
    })
  );
  console.log(`Ustawiono publiczną politykę odczytu dla bucketu "${BUCKET_NAME}".`);
}

async function uploadProductImage(file) {
  const extension = path.extname(file.originalname) || ".jpg";
  const fileName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return getPublicObjectUrl(fileName);
}

function getContentType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const types = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return types[ext] || "application/octet-stream";
}

async function uploadLocalFileToMinIO(filePath, objectKey) {
  try {
    await s3Client.send(
      new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: objectKey })
    );
    return getPublicObjectUrl(objectKey);
  } catch (err) {
    const isMissing =
      err.name === "NotFound" ||
      err.name === "NoSuchKey" ||
      err.$metadata?.httpStatusCode === 404;

    if (!isMissing) {
      throw err;
    }
  }

  const body = fs.readFileSync(filePath);
  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: body,
      ContentType: getContentType(objectKey),
    })
  );

  return getPublicObjectUrl(objectKey);
}

async function migrateLocalImagesToMinIO(db) {
  const srcRoot = path.join(__dirname, "..");
  const localPathToUrl = new Map();

  for (const dir of LOCAL_IMAGE_DIRS) {
    const dirPath = path.join(srcRoot, dir);

    if (!fs.existsSync(dirPath)) {
      console.log(`Katalog ${dir} nie istnieje — pomijam.`);
      continue;
    }

    const files = fs.readdirSync(dirPath).filter((fileName) => {
      const filePath = path.join(dirPath, fileName);
      return fs.statSync(filePath).isFile();
    });

    for (const fileName of files) {
      const filePath = path.join(dirPath, fileName);
      try {
        const publicUrl = await uploadLocalFileToMinIO(filePath, fileName);
        localPathToUrl.set(`/${dir}/${fileName}`, publicUrl);
        console.log(`Przeniesiono do MinIO: ${dir}/${fileName} -> ${publicUrl}`);
      } catch (err) {
        console.error(`Błąd przesyłania ${dir}/${fileName} do MinIO:`, err);
      }
    }
  }

  if (!db) {
    return localPathToUrl;
  }

  try {
    const [products] = await db.promise().execute(
      `SELECT id, imageUrl FROM products
       WHERE imageUrl LIKE '/image_slider/%' OR imageUrl LIKE '/product_images/%'`
    );

    for (const product of products) {
      const fileName = path.basename(product.imageUrl);
      const publicUrl =
        localPathToUrl.get(product.imageUrl) || getPublicObjectUrl(fileName);

      await db.promise().execute("UPDATE products SET imageUrl = ? WHERE id = ?", [
        publicUrl,
        product.id,
      ]);
      console.log(
        `Zaktualizowano imageUrl produktu #${product.id}: ${publicUrl}`
      );
    }
  } catch (err) {
    console.error("Błąd aktualizacji imageUrl w bazie danych:", err);
    throw err;
  }

  return localPathToUrl;
}

async function initializeMinIO() {
  await ensureProductsBucket();
}

module.exports = {
  initializeMinIO,
  uploadProductImage,
  uploadLocalFileToMinIO,
  migrateLocalImagesToMinIO,
  getPublicObjectUrl,
};
