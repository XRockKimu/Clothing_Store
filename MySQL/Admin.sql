-- Connect as 'Admin'@'localhost'
USE Clothing_Store_DB;

-- ✅ Show Total of Customers
SELECT COUNT(*) FROM Customers;

-- ✅ Show role in use
SELECT CURRENT_ROLE();

-- ✅ Read products
SELECT * FROM Products;

-- ✅ Create product
INSERT INTO Products (product_name, category, image_url, description)
VALUES ('Test Jacket', 'Men', 'https://example.com/jacket.jpg', 'Demo jacket for admin');

-- ✅ Update product
UPDATE Products
SET product_name = 'Updated Jacket'
WHERE product_name = 'Test Jacket';

-- ✅ Delete product
DELETE FROM Products
WHERE product_name = 'Updated Jacket';

-- ✅ Insert into suppliers (cross-table access)
INSERT INTO Suppliers (supplier_name, contact_name, email, contact_phone, address)
VALUES ('Test Supplier', 'Mr. X', 'test@supplier.com', '012345678', 'Phnom Penh');

SELECT c.customer_id, c.full_name, COUNT(o.order_id) AS total_orders
FROM Customers c
JOIN Orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id
HAVING COUNT(o.order_id) > 3;