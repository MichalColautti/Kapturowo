console.log('-> Start skryptu: Inicjalizacja modułów...');

﻿const mysql = require('mysql2/promise');
const meiliModule = require('meilisearch');

function getMeiliSearchClass(module) {
  if (!module) throw new Error("Moduł meilisearch jest pusty.");
  if (typeof module === 'function') return module;
  if (module.MeiliSearch && typeof module.MeiliSearch === 'function') return module.MeiliSearch;
  if (module.Meilisearch && typeof module.Meilisearch === 'function') return module.Meilisearch;
  if (module.default) {
    if (typeof module.default === 'function') return module.default;
    if (module.default.MeiliSearch && typeof module.default.MeiliSearch === 'function') return module.default.MeiliSearch;
    if (module.default.Meilisearch && typeof module.default.Meilisearch === 'function') return module.default.Meilisearch;
  }
  const keys = typeof module === 'object' ? Object.keys(module).join(', ') : typeof module;
  throw new Error("Nie znaleziono konstruktora MeiliSearch. Dostępne klucze modułu: " + keys);
}
const MeiliSearch = getMeiliSearchClass(meiliModule);

require('dotenv').config();

async function seed() {
  try {
    console.log('Connecting to MySQL database...');
    const db = await mysql.createConnection({
      host: process.env.DB_HOST || 'mysql',
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'kapturowo_db',
      charset: 'utf8mb4',
    });

    console.log('Downloading products from MySQL...');
    const [rows] = await db.execute(
      'SELECT products.id, products.name, products.price, products.imageUrl, products.target_audience, categories.name AS category FROM products LEFT JOIN categories ON products.category_id = categories.id'
    );

    console.log('Downloaded ' + rows.length + ' products.');

    console.log('Connecting z Meilisearch...');
    const client = new MeiliSearch({
      host: process.env.MEILI_HOST || 'http://meilisearch:7700',
      apiKey: process.env.MEILI_MASTER_KEY || 'kapturowo_meili_secret_key_123!',
    });

    const index = client.index('products');

    console.log('Inserting into Meilisearch...');
    const response = await index.addDocuments(rows);
    console.log('Zadanie dodawania dokumentów rozpoczęte. Task ID:', response.taskUid);

    console.log('Rdy!');
    await db.end();
  } catch (error) {
    console.error('Wystąpił błąd podczas seedowania Meilisearch:', error);
  }
}

seed();
