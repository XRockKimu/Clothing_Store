-- 1. Drop existing roles (optional)
DROP ROLE IF EXISTS 'admin_role';
DROP ROLE IF EXISTS 'customer_role';

-- 2. Create roles
CREATE ROLE IF NOT EXISTS 'admin_role';
CREATE ROLE IF NOT EXISTS 'customer_role';

-- 3. Grant privileges to admin_role (full control on all tables)
GRANT ALL PRIVILEGES ON Clothing_Store_DB.* TO 'admin_role';

-- 4. Grant privileges to customer_role (read and insert, access to some tables)
GRANT SELECT ON Clothing_Store_DB.Products TO 'customer_role';
GRANT SELECT ON Clothing_Store_DB.Product_Images TO 'customer_role';
GRANT SELECT ON Clothing_Store_DB.Product_Variants TO 'customer_role';
GRANT SELECT, INSERT ON Clothing_Store_DB.Orders TO 'customer_role';
GRANT SELECT, INSERT ON Clothing_Store_DB.Order_Items TO 'customer_role';

-- 5. Create users if not exist
CREATE USER IF NOT EXISTS 'Admin'@'localhost' IDENTIFIED BY 'admin123';
CREATE USER IF NOT EXISTS 'Rock'@'localhost' IDENTIFIED BY 'user123';

-- 6. Assign roles to users
GRANT 'admin_role' TO 'Admin'@'localhost';
GRANT 'customer_role' TO 'Rock'@'localhost';

-- 7. Set default roles for users
SET DEFAULT ROLE 'admin_role' TO 'Admin'@'localhost';
SET DEFAULT ROLE 'customer_role' TO 'Rock'@'localhost';

-- 8. Optionally revoke all direct privileges from Rock to enforce role-based permssions
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


