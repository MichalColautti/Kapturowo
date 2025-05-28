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

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'kapturowo_db',
  charset: 'utf8mb4',
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
      'SELECT * FROM products ORDER BY id DESC LIMIT 8'
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

// Endpoint do pobierania ulubionych produktów użytkownika
app.get('/api/get-favorites/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [favorites] = await db.promise().execute(
      `SELECT p.* FROM products p
       JOIN favorites f ON p.id = f.product_id
       WHERE f.user_id = ?`,
      [userId]
    );
    res.json(favorites);
  } catch (err) {
    console.error('Błąd pobierania ulubionych:', err);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// Endpoint do pobierania produktu po id
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.promise().execute("SELECT * FROM products WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Produkt nie znaleziony" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Błąd pobierania produktu:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

// Endpoint do dodawania produktu do koszyka
app.post("/api/cart", async (req, res) => {
  const { userId, productId, sizeId, quantity } = req.body;
  console.log('recived add to cart req:',req.body);
  try {
    const [existing] = await db.promise().execute(
      "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND size_id = ?",
      [userId, productId, sizeId]
    );

    if (existing.length > 0) {
      const newQty = existing[0].quantity + quantity;
      await db.promise().execute(
        "UPDATE cart SET quantity = ? WHERE id = ?",
        [newQty, existing[0].id]
      );
    } else {
      await db.promise().execute(
        "INSERT INTO cart (user_id, product_id, size_id, quantity) VALUES (?, ?, ?, ?)",
        [userId, productId, sizeId, quantity]
      );
    }

    res.status(200).json({ message: "Dodano do koszyka" });
  } catch (err) {
    console.error("Błąd dodawania do koszyka:", err);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});

// Usuwanie produktu z koszyka
app.delete("/api/cart", async (req, res) => {
  const { userId, productId, sizeId } = req.body;

  try {
    await db.promise().execute(
      "DELETE FROM cart WHERE user_id = ? AND product_id = ? AND size_id = ?",
      [userId, productId, sizeId]
    );
    res.status(200).json({ message: "Usunięto z koszyka" });
  } catch (err) {
    console.error("Błąd usuwania z koszyka:", err);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});

// Pobieranie produktów w koszyku użytkownika
app.get("/api/cart/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [items] = await db.promise().execute(
      `SELECT c.product_id, c.size_id, c.quantity, p.name, p.price, s.size
       FROM cart c
       JOIN products p ON c.product_id = p.id
       JOIN sizes s ON c.size_id = s.id
       WHERE c.user_id = ?`,
      [userId]
    );

    res.json(items);
  } catch (err) {
    console.error("Błąd pobierania koszyka:", err);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});

// Endpoint do pobierania rozmiarów produktów
app.get("/api/products/:id/sizes", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().execute(
      `SELECT s.id, s.size
       FROM sizes s
       JOIN product_sizes ps ON s.id = ps.size_id
       WHERE ps.product_id = ?`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Błąd pobierania rozmiarów:", err);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});


app.listen(5000, '0.0.0.0', () => {
  console.log('Serwer backend działa na porcie 5000');
});