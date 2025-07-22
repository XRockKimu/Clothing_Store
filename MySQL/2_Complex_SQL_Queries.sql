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


