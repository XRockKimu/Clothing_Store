-- Connect as 'Rock'@'localhost'
USE Clothing_Store_DB;

-- ✅ 1. Show active role
SELECT CURRENT_ROLE();

-- ✅ 2. Allowed: View products
SELECT * FROM Products;
SELECT * FROM Product_Variants;

-- ❌ 3. Not allowed: Insert
INSERT INTO Products (product_name, category, image_url, description)
VALUES ('Illegal Insert', 'Women', 'bad.jpg', 'Should not be allowed');

-- ❌ 4. Not allowed: Update
UPDATE Products
SET product_name = 'Hack Attempt'
WHERE product_name = 'T-Shirt';

-- ❌ 5. Not allowed: Delete
DELETE FROM Products
WHERE product_name = 'T-Shirt';

-- ✅ 6. Optional: View own orders (if granted)
SELECT * FROM Orders WHERE customer_id = 2;