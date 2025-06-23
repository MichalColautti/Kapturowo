CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  imageUrl VARCHAR(255),
  target_audience ENUM('mezczyzna', 'kobieta', 'dziecko') NOT NULL,
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  UNIQUE KEY unique_favorite (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sizes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  size VARCHAR(10) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS product_sizes (
  product_id INT NOT NULL,
  size_id INT NOT NULL,
  PRIMARY KEY (product_id, size_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (size_id) REFERENCES sizes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  size_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  UNIQUE KEY unique_cart_item (user_id, product_id, size_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (size_id) REFERENCES sizes(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  street VARCHAR(255) NOT NULL,
  building_number VARCHAR(20) NOT NULL,
  apartment_number VARCHAR(20),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  size_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (size_id) REFERENCES sizes(id)
);

ALTER TABLE products CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 
ALTER TABLE categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cart CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE favorites CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE sizes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE product_sizes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE orders CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE order_items CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE products MODIFY description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO categories (name) VALUES ('Bluzy'), ('T-shirty'), ('Buty'), ('Akcesoria');

INSERT INTO sizes (size) VALUES ('S'), ('M'), ('L'), ('XL'), ('35'), ('36'), ('37'), ('38'), ('39'), ('40'), ('41'), ('42');

INSERT INTO products (name, price, imageUrl, target_audience, category_id) VALUES
-- Bluzy
('Bluza z kapturem', 120.00, '/image_slider/img_1.jpg', 'mezczyzna', 1),
('Bluza sportowa', 150.00, '/image_slider/img_1.jpg', 'mezczyzna', 1),
('Bluza z nadrukiem', 130.00, '/image_slider/img_3.jpg', 'kobieta', 1),
('Bluza oversize', 140.00, '/image_slider/img_2.jpg', 'mezczyzna', 1),
('Bluza dziecięca z kapturem', 60.00, '/image_slider/img_1.jpg', 'dziecko', 1),
-- T-shirty
('T-shirt sportowy', 85.00, '/image_slider/img_1.jpg', 'mezczyzna', 2),
('T-shirt ekologiczny', 95.00, '/image_slider/img_3.jpg', 'kobieta', 2),
('T-shirt bawelniany', 80.00, '/image_slider/img_2.jpg', 'mezczyzna', 2),
('T-shirt z nadrukiem', 90.00, '/image_slider/img_3.jpg', 'kobieta', 2),
('T-shirt dla dziecka', 50.00, '/image_slider/img_3.jpg', 'dziecko', 2),
-- Buty
('Sneakersy', 300.00, '/image_slider/img_4.jpg', 'kobieta', 3),
('Sandały', 200.00, '/image_slider/img_4.jpg', 'kobieta', 3),
('Buty do biegania', 350.00, '/image_slider/img_4.jpg', 'mezczyzna', 3),
('Buty zimowe dla dzieci', 120.00, '/image_slider/img_4.jpg', 'dziecko', 3),
('Sneakersy Classic', 300.00, '/image_slider/img_4.jpg', 'kobieta', 3),
('Buty trekkingowe', 450.00, '/image_slider/img_4.jpg', 'kobieta', 3),
('Buty do biegania', 350.00, '/image_slider/img_4.jpg', 'mezczyzna', 3),
('Sandały letnie', 200.00, '/image_slider/img_4.jpg', 'kobieta', 3),
('Buty zimowe', 400.00, '/image_slider/img_4.jpg', 'mezczyzna', 3),
('Buty dziecięce sportowe', 120.00, '/image_slider/img_4.jpg', 'dziecko', 3),
('Buty na co dzień', 250.00, '/image_slider/img_4.jpg', 'mezczyzna', 3),
('Buty eleganckie', 320.00, '/image_slider/img_4.jpg', 'kobieta', 3),
('Buty trekkingowe damskie', 460.00, '/image_slider/img_4.jpg', 'kobieta', 3),
('Buty sportowe dla dzieci', 130.00, '/image_slider/img_4.jpg', 'dziecko', 3),
('Buty sportowe dla dorosłych', 2.00, '/image_slider/img_4.jpg', 'dziecko', 3)
;

UPDATE products SET description = 'Klasyczna bluza z kapturem, idealna na każdą okazję. Wykonana z wysokiej jakości bawełny.' WHERE id = 1;
UPDATE products SET description = 'Sportowa bluza z oddychającego materiału, doskonała na treningi i aktywny wypoczynek.' WHERE id = 2;
UPDATE products SET description = 'Modna bluza z unikalnym nadrukiem, która wyróżni Cię z tłumu.' WHERE id = 3;
UPDATE products SET description = 'Wygodna bluza o luźnym kroju, zapewniająca swobodę ruchów.' WHERE id = 4;
UPDATE products SET description = 'Urocza bluza z kapturem dla najmłodszych, miękka i przyjemna w dotyku.' WHERE id = 5;
UPDATE products SET description = 'Lekki T-shirt sportowy, idealny do aktywności fizycznej, szybko schnący.' WHERE id = 6;
UPDATE products SET description = 'T-shirt wykonany z ekologicznej bawełny, przyjazny dla skóry i środowiska.' WHERE id = 7;
UPDATE products SET description = 'Podstawowy T-shirt z czystej bawełny, komfortowy na co dzień.' WHERE id = 8;
UPDATE products SET description = 'Stylowy T-shirt z grafiką, wyraź swój styl.' WHERE id = 9;
UPDATE products SET description = 'Wesoły T-shirt dla dzieci, z zabawnym motywem.' WHERE id = 10;


INSERT INTO product_sizes (product_id, size_id) VALUES
(1, 2),(1, 3),(1, 4),
(2, 2),(2, 3),(2, 4), 
(3, 2),(3, 3),(3, 4), 
(4, 2),(4, 3),(4, 4), 
(5, 2),(5, 3),(5, 4), 
(6, 2),(6, 3),(6, 1), 
(7, 2),(7, 3),(7, 1),   
(8, 2),(8, 3),(8, 1),
(9, 2),(9, 3),(9, 4),
(10, 2),(10, 3),(10, 4),
(11, 5),(11, 6),(11, 7),(11, 8),(11, 9),(11, 10),(11, 11),(11, 12),
(12, 5),(12, 6),(12, 7),(12, 8),(12, 9),(12, 10),(12, 11),(12, 12),
(13, 5),(13, 6),(13, 7),(13, 8),(13, 9),(13, 10),(13, 11),(13, 12),
(14, 5),(14, 6),(14, 7),(14, 8),(14, 9),(14, 10),(14, 11),(14, 12),
(15, 5),(15, 6),(15, 7),(15, 8),(15, 9),(15, 10),(15, 11),(15, 12),
(16, 5),(16, 6),(16, 7),(16, 8),(16, 9),(16, 10),(16, 11),(16, 12),
(17, 5),(17, 6),(17, 7),(17, 8),(17, 9),(17, 10),(17, 11),(17, 12),
(18, 5),(18, 6),(18, 7),(18, 8),(18, 9),(18, 10),(18, 11),(18, 12),
(19, 5),(19, 6),(19, 7),(19, 8),(19, 9),(19, 10),(19, 11),(19, 12),
(20, 5),(20, 6),(20, 7),(20, 8),(20, 9),(20, 10),(20, 11),(20, 12),
(21, 5),(21, 6),(21, 7),(21, 8),(21, 9),(21, 10),(21, 11),(21, 12),
(22, 5),(22, 6),(22, 7),(22, 8),(22, 9),(22, 10),(22, 11),(22, 12),
(23, 5),(23, 6),(23, 7),(23, 8),(23, 9),(23, 10),(23, 11),(23, 12),
(24, 5),(24, 6),(24, 7),(24, 8),(24, 9),(24, 10),(24, 11),(24, 12),
(25, 5),(25, 6),(25, 7),(25, 8),(25, 9),(25, 10),(25, 11),(25, 12)
; 

UPDATE products SET name = CONVERT(BINARY CONVERT(name USING latin1) USING utf8mb4);
UPDATE products SET description = CONVERT(BINARY CONVERT(description USING latin1) USING utf8mb4);