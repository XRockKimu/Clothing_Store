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
(2, 'S', 'Red', 0, 49.99),
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
