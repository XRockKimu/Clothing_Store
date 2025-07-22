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
    UNIQUE (product_name, category),
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
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. Orders Table
CREATE TABLE Orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NULL,
    employee_id INT NULL,
    order_date DATETIME NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
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
    product_id INT,
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
    product_id INT,
    variant_id INT,
    supplier_id INT NULL,
    employee_id INT NULL,
    quantity INT NOT NULL CHECK (quantity >= 0),
    last_updated DATE NOT NULL,
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
CREATE INDEX idx_product_name ON Products(product_name); -- 🟩 Supports Query #2 (Top 5 Best-Selling Products)
CREATE INDEX idx_product_category ON Products(category); -- 🟩 Supports Query #6 (Revenue by Product Category)
CREATE INDEX idx_order_date ON Orders(order_date); -- 🟩 Supports Query #3 (Monthly Sales Totals)
CREATE INDEX idx_customer_email ON Customers(email); -- 🟩 Useful for searching customers by email (future login/auth)
CREATE INDEX idx_payment_method ON Payments(payment_method); -- 🟩 Supports Query #10 (Failed Payments)
CREATE INDEX idx_orders_customer_id ON Orders(customer_id); -- 🟩 Supports Query #1 (Customers with More Than 3 Orders), #7 (Customers with Highest Spending)

-- 🟩 Supports Query #2 (Best-Selling Products)
-- 🟩 Supports Query #8 (Products Never Ordered)
-- 🟩 Supports Query #9 (Order Details)
CREATE INDEX idx_order_items_order_id ON Order_Items(order_id);
CREATE INDEX idx_order_items_product_id ON Order_Items(product_id); -- 🟩 Supports Query #2, #6, #8, #9

-- 🟩 Supports Query #5 (Products with Zero Stock)
-- 🟩 Supports Query #9 (Order Details with Variant Info)
CREATE INDEX idx_variant_product_id ON Product_Variants(product_id);
CREATE INDEX idx_variant_composite ON Product_Variants(product_id, size, color); -- 🟩 Composite index for Query #5 and general variant filtering

-- 👤 Customers
INSERT INTO Customers (full_name, gender, email, phone, address, password_hash) VALUES
('Alice Johnson', 'Female', 'alice.johnson@gmail.com', '+1234567890', '123 Main St', '$2b$10$qErCTQ/efi9P8ANm.lduveCBZMRzZ98eiFbfCu1KiDv34gXspVRTS'), -- password: user
('Bob Smith', 'Male', 'bob.smith@example.com', '+1122334455', '456 Elm St', '$2b$10$qErCTQ/efi9P8ANm.lduveCBZMRzZ98eiFbfCu1KiDv34gXspVRTS'),
('Carol White', 'Female', 'carol.white@example.com', '+2233445566', '789 Oak St', '$2b$10$qErCTQ/efi9P8ANm.lduveCBZMRzZ98eiFbfCu1KiDv34gXspVRTS');

-- 👨‍💼 Employees
INSERT INTO Employees (full_name, role, hire_date, email, password_hash) VALUES
('Rock Brown', 'Admin', '2025-03-01', 'rock@store.com', '$2b$10$XEtLx7yc/MFZcVhtYDH7rOZsvC8WV2cxj/ykDGHC8ACvADVG2b16C'), -- password: admin
('Lena Chan', 'Admin', '2025-04-10', 'lena@store.com', '$2b$10$XEtLx7yc/MFZcVhtYDH7rOZsvC8WV2cxj/ykDGHC8ACvADVG2b16C');

-- 👕 Products
INSERT INTO Products (product_name, category, image_url, description) VALUES
('Blue T-Shirt', 'Men', 'http://example.com/images/blue_tshirt.jpg', 'Cotton t-shirt'),
('Floral Dress', 'Women', 'http://example.com/images/floral_dress.jpg', 'Elegant dress'),
('Denim Jacket', 'Men', 'http://example.com/images/denim_jacket.jpg', 'Winter jacket'),
('Summer Hat', 'Accessories', 'http://example.com/images/hat.jpg', 'Beach hat'),
('Sunglasses', 'Accessories', 'http://example.com/images/sunglasses.jpg', 'UV protection');

-- 🎨 Product Variants
INSERT INTO Product_Variants (product_id, size, color, stock, price) VALUES
(1, 'M', 'Blue', 50, 19.99),
(2, 'S', 'Red', 0, 49.99),         -- 👈 For zero stock test
(3, 'L', 'Black', 15, 89.99),
(4, 'One Size', 'Yellow', 10, 14.99),
(5, 'One Size', 'Black', 25, 29.99);

-- 🚚 Suppliers
INSERT INTO Suppliers (supplier_name, contact_name, email, contact_phone, address) VALUES
('Textile Co', 'Mary Lee', 'contact@textileco.com', '+1234567890', '789 Industrial St');

-- 🧾 Inventory
INSERT INTO Inventory (product_id, variant_id, supplier_id, employee_id, quantity, last_updated) VALUES
(1, 1, 1, 1, 50, '2025-07-14'),
(2, 2, 1, 1, 0, '2025-07-14'),
(3, 3, 1, 1, 15, '2025-07-14'),
(4, 4, 1, 2, 10, '2025-07-14'),
(5, 5, 1, 2, 25, '2025-07-14');

-- 🛒 Orders (customer_id 1 → 4 orders; customer_id 2 → 2 orders)
INSERT INTO Orders (customer_id, employee_id, order_date, total_amount, status) VALUES
(1, 1, '2025-07-01 10:00:00', 39.98, 'Confirmed'),
(1, 1, '2025-07-02 11:00:00', 29.99, 'Confirmed'),
(1, 2, '2025-07-03 12:00:00', 14.99, 'Confirmed'),
(1, 2, '2025-07-05 13:00:00', 29.99, 'Confirmed'),
(2, 1, '2025-07-06 15:00:00', 89.99, 'Confirmed'),
(2, 2, '2025-07-07 16:00:00', 29.99, 'Pending');

-- 🧾 Order Items
INSERT INTO Order_Items (order_id, variant_id, product_id, quantity, unit_price) VALUES
(1, 1, 1, 2, 19.99),
(2, 5, 5, 1, 29.99),
(3, 4, 4, 1, 14.99),
(4, 5, 5, 1, 29.99),
(5, 3, 3, 1, 89.99),
(6, 5, 5, 1, 29.99);

-- 💳 Payments (including failed payment)
INSERT INTO Payments (order_id, employee_id, payment_method, amount, status, payment_date) VALUES
(1, 1, 'Credit Card', 39.98, 'Paid', '2025-07-01'),
(2, 1, 'PayPal', 29.99, 'Paid', '2025-07-02'),
(3, 2, 'Cash', 14.99, 'Paid', '2025-07-03'),
(4, 2, 'Credit Card', 29.99, 'Failed', '2025-07-05'),
(5, 1, 'Bank Transfer', 89.99, 'Paid', '2025-07-06'),
(6, 2, 'Cash', 29.99, 'Pending', '2025-07-07');

SET PROFILING = 1;

SHOW PROFILES;

-- 1. Customers with More Than 3 Orders
SELECT c.customer_id, c.full_name, COUNT(o.order_id) AS total_orders
FROM Customers c
JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id
HAVING COUNT(o.order_id) > 3;

-- 2. Top 5 Best-Selling Products
SELECT p.product_name, SUM(oi.quantity) AS total_sold
FROM Order_Items oi
JOIN Products p ON oi.product_id = p.product_id
GROUP BY p.product_id
ORDER BY total_sold DESC
LIMIT 5;

-- 3. Monthly Sales Totals
SELECT DATE_FORMAT(order_date, '%Y-%m') AS month, SUM(total_amount) AS total_sales
FROM Orders
GROUP BY month
ORDER BY month DESC;

-- 4. Orders and Assigned Employee Names
SELECT o.order_id, o.order_date, e.full_name AS employee_name
FROM Orders o
LEFT JOIN Employees e ON o.employee_id = e.employee_id
ORDER BY o.order_date DESC;

-- 5. Products with Zero Stock
SELECT p.product_name, v.size, v.color
FROM Product_Variants v
JOIN Products p ON v.product_id = p.product_id
WHERE v.stock = 0;

-- 6. Total Revenue by Product Category
SELECT p.category, SUM(oi.quantity * oi.unit_price) AS revenue
FROM Order_Items oi
JOIN Products p ON oi.product_id = p.product_id
GROUP BY p.category
ORDER BY revenue DESC;

-- 7. Customers with Highest Spending
SELECT c.full_name, SUM(o.total_amount) AS total_spent
FROM Customers c
JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id
ORDER BY total_spent DESC
LIMIT 10;

-- 8. Products Never Ordered
SELECT p.product_id, p.product_name
FROM Products p
LEFT JOIN Order_Items oi ON p.product_id = oi.product_id
WHERE oi.order_id IS NULL;

-- 9. Order Details With Customer and Variant Info
SELECT o.order_id, c.full_name, v.size, v.color, oi.quantity, oi.unit_price
FROM Orders o
JOIN Customers c ON o.customer_id = c.customer_id
JOIN Order_Items oi ON o.order_id = oi.order_id
JOIN Product_Variants v ON oi.variant_id = v.variant_id;


-- 10. Failed Payments With Employee Name
SELECT p.payment_id, o.order_id, e.full_name AS handled_by, p.status
FROM Payments p
JOIN Orders o ON p.order_id = o.order_id
LEFT JOIN Employees e ON p.employee_id = e.employee_id
WHERE p.status = 'Failed';

-- 1. Drop existing roles (optional)
DROP ROLE IF EXISTS 'admin_role';
DROP ROLE IF EXISTS 'customer_role';

-- 2. Create roles
CREATE ROLE IF NOT EXISTS 'admin_role';
CREATE ROLE IF NOT EXISTS 'customer_role';

-- 3. Grant privileges to admin_role (full control on all tables)
GRANT ALL PRIVILEGES ON Clothing_Store_DB.* TO 'admin_role';

-- 4. Grant privileges to customer_role (read-only access to some tables)
GRANT SELECT ON Clothing_Store_DB.Products TO 'customer_role';
GRANT SELECT ON Clothing_Store_DB.Product_Images TO 'customer_role';
GRANT SELECT ON Clothing_Store_DB.Product_Variants TO 'customer_role';
GRANT SELECT ON Clothing_Store_DB.Orders TO 'customer_role';
GRANT SELECT ON Clothing_Store_DB.Order_Items TO 'customer_role';

-- 5. Create users if not exist
CREATE USER IF NOT EXISTS 'Admin'@'localhost' IDENTIFIED BY 'admin123';
CREATE USER IF NOT EXISTS 'Rock'@'localhost' IDENTIFIED BY 'user123';

-- 6. Assign roles to users
GRANT 'admin_role' TO 'Admin'@'localhost';
GRANT 'customer_role' TO 'Rock'@'localhost';

-- 7. Set default roles for users
SET DEFAULT ROLE 'admin_role' TO 'Admin'@'localhost';
SET DEFAULT ROLE 'customer_role' TO 'Rock'@'localhost';

-- 8. Optionally revoke all direct privileges from Rock to enforce role-based permissions
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'Rock'@'localhost';

-- 9. Apply changes
FLUSH PRIVILEGES;

-- 10. (Optional) Verify grants
SHOW GRANTS FOR 'Rock'@'localhost';
SHOW GRANTS FOR 'Admin'@'localhost';

-- Revoke the wrongly formatted role
REVOKE `customer_role`@`%` FROM 'Rock'@'localhost';

-- Grant the correct role format
GRANT 'customer_role' TO 'Rock'@'localhost';

-- Set the role to activate by default on login
SET DEFAULT ROLE 'customer_role' TO 'Rock'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;


