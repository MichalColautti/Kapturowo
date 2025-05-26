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
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO categories (name) VALUES ('Bluzy'), ('T-shirty'), ('Buty'), ('Akcesoria');

INSERT INTO products (name, price, imageUrl, category_id) VALUES
('Bluza z kapturem', 120.00, '/image_slider/img_1.jpg', 1),
('Bluza sportowa', 150.00, '/image_slider/img_1.jpg', 1),
('T-shirt bawelniany', 80.00, '/image_slider/img_2.jpg', 2),
('T-shirt z nadrukiem', 90.00, '/image_slider/img_3.jpg', 2),
('Sneakersy', 300.00, '/image_slider/img_2.jpg', 3),
('Buty trekkingowe', 450.00, '/image_slider/img_1.jpg', 3),
('Czapka z daszkiem', 50.00, '/image_slider/img_3.jpg', 4),
('Pasek skorzany', 75.00, '/image_slider/img_2.jpg', 4);