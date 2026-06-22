const crypto = require("crypto");
const path = require("path");
const {
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { s3Client } = require("../config/s3");

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "products";
const PUBLIC_BASE_URL = process.env.MINIO_PUBLIC_URL || "http://localhost:9000";

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

async function initializeMinIO() {
  await ensureProductsBucket();
}

module.exports = {
  initializeMinIO,
  uploadProductImage,
  getPublicObjectUrl,
};
