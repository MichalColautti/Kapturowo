// backend/src/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const bcrypt = require('bcrypt');

app.use(cors());
app.use(express.json());

app.use('/product_images', express.static(path.join(__dirname, 'product_images')));
app.use('/image_slider', express.static(path.join(__dirname, 'image_slider')));


const db = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'kapturowo_db',
});

// Endpoint do rejestracji
app.post('/api/register', async (req, res) => {
  console.log('recived register req:',req);
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Brak danych' });
  }

  try {
    const [emailResult] = await db.promise().execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    const [usernameResult] = await db.promise().execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (emailResult.length > 0 || usernameResult.length > 0) {
      return res.status(400).json({ message: 'Login lub email już w użyciu.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, results) => {
      if (err) {
        console.error('Błąd przy zapisie:', err);
        return res.status(500).json({ message: 'Błąd serwera xd' });
      }
      // Zwracamy id nowo utworzonego użytkownika
      return res.status(201).json({ 
        message: 'Użytkownik zarejestrowany', 
        id: results.insertId, 
        username: username 
      });
    });
  } catch (err) {
    console.error('Błąd przy rejestracji:', err);
    return res.status(500).json({ message: 'Błąd hashowania hasła' });
  }
});

// Endpoint do logowania
app.post('/api/login', async (req, res) => {
  console.log('recived login req:',req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Brak danych' });
  }

  try {
    const [rows] = await db.promise().execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Nieprawidłowy login lub hasło' });
    }

    const user = rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nieprawidłowy login lub hasło' });
    }

    return res.status(200).json({ 
      message: 'Zalogowano pomyślnie', 
      id: user.id, 
      username: user.username 
    });
  } catch (err) {
    console.error('Błąd przy logowaniu:', err);
    return res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Endpoint do pobierania produktów
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.promise().execute(
      `SELECT products.id, products.name, products.price, products.imageUrl, categories.name AS category
       FROM products
       LEFT JOIN categories ON products.category_id = categories.id`
    );
    res.json(rows);
  } catch (err) {
    console.error('Błąd przy pobieraniu produktów:', err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Endpoint do pobierania po najnowszych produktach
app.get('/api/products/latest', async (req, res) => {
  try {
    const [rows] = await db.promise().execute(
      'SELECT * FROM products ORDER BY id DESC LIMIT 10'
    );
    res.json(rows);
  } catch (err) {
    console.error('Błąd pobierania najnowszych produktów:', err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});


// Endpoint do pobierania produktów według targetu
app.get('/api/products/filter', async (req, res) => {
  const { category, audience } = req.query;

  let query = `
    SELECT products.id, products.name, products.price, products.imageUrl,
           products.target_audience, categories.name AS category
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id
    WHERE 1=1
  `;
  const params = [];

  if (category) {
    query += ' AND categories.name = ?';
    params.push(category);
  }

  if (audience) {
    query += ' AND products.target_audience = ?';
    params.push(audience);
  }

  try {
    const [rows] = await db.promise().execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Błąd przy filtrowaniu produktów:', err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Pobieranie produktów po nazwie
app.get('/api/products/search', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: 'Brak nazwy produktu w zapytaniu.' });
  }

  try {
    const query = `
      SELECT * FROM products
      WHERE name LIKE ?
      ORDER BY id DESC;
    `;
    const [rows] = await db.promise().execute(query, [`%${name}%`]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Nie znaleziono produktów.' });
    }

    res.status(200).json(rows);
  } catch (err) {
    console.error('Błąd przy wyszukiwaniu produktów:', err);
    res.status(500).json({ message: 'Błąd serwera przy wyszukiwaniu produktów.' });
  }
});

// Endpoint do dodawania produktów do ulubionych
app.post('/api/favorites', async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ message: 'Brak danych' });
  }

  try {
    await db.promise().execute(
      'INSERT IGNORE INTO favorites (user_id, product_id) VALUES (?, ?)',
      [userId, productId]
    );
    res.status(200).json({ message: 'Dodano do ulubionych' });
  } catch (err) {
    console.error('Błąd dodawania do ulubionych:', err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Endpoint do usuwania ulubionych produktów
app.delete('/api/favorites', async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ message: 'Brak danych' });
  }

  try {
    await db.promise().execute(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
    res.status(200).json({ message: 'Usunięto z ulubionych' });
  } catch (err) {
    console.error('Błąd usuwania z ulubionych:', err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Endpoint do sprawdzania, czy produkt jest ulubiony
app.get('/api/favorites/check', async (req, res) => {

  const { userId, productId } = req.query;

  if (!userId || !productId) {
    return res.status(400).json({ message: 'Brak wymaganych parametrów' });
  }

  try {
    const [rows] = await db.promise().execute(
      'SELECT 1 FROM favorites WHERE user_id = ? AND product_id = ? LIMIT 1',
      [userId, productId]
    );

    const isFavorite = rows.length > 0;

    res.status(200).json({ isFavorite });  
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
});


app.listen(5000, '0.0.0.0', () => {
  console.log('Serwer backend działa na porcie 5000');
});