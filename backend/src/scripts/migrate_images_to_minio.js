require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mysql = require("mysql2");
const {
  initializeMinIO,
  migrateLocalImagesToMinIO,
} = require("../services/minioService");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "mysql",
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "kapturowo_db",
  charset: "utf8mb4",
});

async function run() {
  try {
    await initializeMinIO();
    await migrateLocalImagesToMinIO(db);
    console.log("Migracja zdjęć do MinIO zakończona pomyślnie.");
    process.exit(0);
  } catch (err) {
    console.error("Migracja zdjęć do MinIO nie powiodła się:", err);
    process.exit(1);
  }
}

run();
