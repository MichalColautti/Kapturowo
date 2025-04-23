CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    item_description TEXT,
    price DECIMAL(10,2),
    item_size ENUM('S', 'M', 'L', 'XL') NOT NULL,
    color VARCHAR(50),
    amount INT DEFAULT 0
);