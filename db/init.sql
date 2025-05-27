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

CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  UNIQUE KEY unique_cart_item (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO categories (name) VALUES ('Bluzy'), ('T-shirty'), ('Buty'), ('Akcesoria');

INSERT INTO products (name, price, imageUrl, target_audience, category_id) VALUES
('Bluza z kapturem', 120.00, '/image_slider/img_1.jpg', 'mezczyzna', 1),
('Bluza sportowa', 150.00, '/image_slider/img_1.jpg', 'mezczyzna', 3),
('T-shirt bawelniany', 80.00, '/image_slider/img_2.jpg', 'mezczyzna', 3),
('T-shirt z nadrukiem', 90.00, '/image_slider/img_3.jpg', 'kobieta', 2),
('Sneakersy', 300.00, '/image_slider/img_2.jpg', 'kobieta', 1),
('Buty trekkingowe', 450.00, '/image_slider/img_1.jpg', 'kobieta', 3),
('Czapka z daszkiem', 50.00, '/image_slider/img_3.jpg', 'dziecko', 2),
('Pasek skorzany', 75.00, '/image_slider/img_2.jpg', 'dziecko', 3);