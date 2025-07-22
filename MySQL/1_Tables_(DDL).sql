-- 1. Create Database
CREATE DATABASE IF NOT EXISTS Clothing_Store_DB;
USE Clothing_Store_DB;

-- 2. Customers Table
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    email VARCHAR(100) UNIQUE CHECK (email LIKE '%_@_%._%'),
    phone VARCHAR(20) CHECK (phone REGEXP '^[0-9+-]+$'),
    address TEXT,
    password_hash VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Employees Table
CREATE TABLE Employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(50) NOT NULL,
    role ENUM('Admin') NOT NULL,
    hire_date DATE NOT NULL,
    email VARCHAR(100) UNIQUE CHECK (email LIKE '%_@_%._%'),
    password_hash VARCHAR(255) NOT NULL
);

-- 4. Products Table
CREATE TABLE Products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    category ENUM('Men', 'Women', 'Girls', 'Boys', 'Accessories') NOT NULL,
    image_url VARCHAR(255),
    description TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Product Images Table
CREATE TABLE Product_Images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 6. Product Variants Table
CREATE TABLE Product_Variants (
    variant_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    size VARCHAR(20),
    color VARCHAR(30),
    stock INT NOT NULL CHECK (stock >= 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    UNIQUE (product_id, size, color),
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. Orders Table
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NULL,
    order_date DATETIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    employee_id INT NULL,
    status ENUM('Pending', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
	    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- 8. Order Items Table
CREATE TABLE Order_Items (
    order_item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    variant_id INT,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES Product_Variants(variant_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 9. Suppliers Table
CREATE TABLE Suppliers (
    supplier_id INT PRIMARY KEY AUTO_INCREMENT,
    supplier_name VARCHAR(100) NOT NULL,
    contact_name VARCHAR(100),
    email VARCHAR(100) UNIQUE CHECK (email LIKE '%_@_%._%'),
    contact_phone VARCHAR(15) CHECK (contact_phone REGEXP '^[0-9+-]+$'),
    address TEXT NOT NULL
);

-- 10. Inventory Table
CREATE TABLE Inventory (
    inventory_id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL, -- Changed to NOT NULL
    variant_id INT, -- Nullable, optional for variant-specific inventory
    supplier_id INT NULL,
    employee_id INT NULL,
    quantity INT NOT NULL CHECK (quantity >= 0),
    last_updated DATETIME NOT NULL,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES Product_Variants(variant_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- 11. Payments Table
CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT,
    employee_id INT NULL,
    payment_method ENUM('Cash', 'Credit Card', 'Paypal', 'Bank Transfer') NOT NULL DEFAULT 'Cash',
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- 12. Indexes for Optimization
CREATE INDEX idx_product_name ON Products(product_name); -- Supports Query #2 (Top 5 Best-Selling Products)
CREATE INDEX idx_product_category ON Products(category); -- Supports Query #6 (Revenue by Product Category)
CREATE INDEX idx_order_date ON Orders(order_date); -- Supports Query #3 (Monthly Sales Totals)
CREATE INDEX idx_customer_email ON Customers(email); -- Useful for searching customers by email
CREATE INDEX idx_payment_method ON Payments(payment_method); -- Supports Query #10 (Failed Payments)
CREATE INDEX idx_orders_customer_id ON Orders(customer_id); -- Supports Query #1 (Customers with More Than 3 Orders), #7 (Customers with Highest Spending)
CREATE INDEX idx_order_items_order_id ON Order_Items(order_id); -- Supports Query #2, #8, #9
CREATE INDEX idx_order_items_product_id ON Order_Items(product_id); -- Supports Query #2, #6, #8, #9
CREATE INDEX idx_variant_product_id ON Product_Variants(product_id); -- Supports Query #5, #9
CREATE INDEX idx_variant_composite ON Product_Variants(product_id, size, color); -- Supports Query #5 and variant filtering

-- 13. Enable Foreign Key Checks for Inserts
SET foreign_key_checks = 0;
-- Placeholder for insert statements
-- Add your insert statements here
SET foreign_key_checks = 1;