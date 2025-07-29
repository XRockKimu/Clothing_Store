import pymysql
from faker import Faker
from tqdm import tqdm
import random
import re

# Initialize Faker
fake = Faker()

# Database connection
try:
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='12345',
        database='Clothing_Store_DB'
    )
    cursor = conn.cursor()
except Exception as e:
    print(f"Database connection failed: {e}")
    exit(1)

# Configuration
num_records = 100  # Reduced to 100 for demo
categories = ['Men', 'Women', 'Girls', 'Boys', 'Accessories']
sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
colors = ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow']
product_types = ['Shirt', 'Pants', 'Jacket', 'Hat', 'Dress', 'Shoes']
genders = ['Male', 'Female', 'Other']

# Batch insert function
def batch_insert(cursor, conn, table, columns, data, batch_size=100):
    query = f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join(['%s'] * len(columns))})"
    for i in range(0, len(data), batch_size):
        try:
            cursor.executemany(query, data[i:i + batch_size])
            conn.commit()
            print(f"Inserted {min(i + batch_size, len(data))} rows into {table}")
        except Exception as e:
            print(f"Error inserting into {table}: {e}")
            conn.rollback()
            cursor.close()
            conn.close()
            exit(1)

# Insert Products
print("Inserting products...")
product_data = []
for _ in tqdm(range(num_records)):
    product_name = (fake.word().capitalize() + " " + random.choice(product_types))[:100]
    category = random.choice(categories)
    image_url = f"https://source.unsplash.com/400x400/?clothes,{category}"
    description = fake.sentence(nb_words=10)
    product_data.append((product_name, category, image_url, description))

batch_insert(cursor, conn, "Products", ["product_name", "category", "image_url", "description"], product_data)

# Fetch product IDs
try:
    cursor.execute("SELECT product_id FROM Products ORDER BY product_id DESC LIMIT %s", (num_records,))
    product_ids = [row[0] for row in cursor.fetchall()]
except Exception as e:
    print(f"Error fetching product IDs: {e}")
    cursor.close()
    conn.close()
    exit(1)

# Insert Product_Images
print("Inserting product images...")
image_data = []
for product_id in tqdm(product_ids):
    for _ in range(random.randint(2, 4)):
        image_url = f"https://source.unsplash.com/400x400/?fashion,{random.choice(product_types)}"
        image_data.append((product_id, image_url))

batch_insert(cursor, conn, "Product_Images", ["product_id", "image_url"], image_data)

# Insert Product_Variants
print("Inserting product variants...")
variant_data = []

for product_id in tqdm(product_ids):
    used_combinations = set()
    variant_count = random.randint(1, 3)

    while len(used_combinations) < variant_count:
        size = random.choice(sizes)
        color = random.choice(colors)
        combo = (size, color)

        if combo not in used_combinations:
            used_combinations.add(combo)
            stock = random.randint(0, 500)
            price = round(random.uniform(10.00, 300.00), 2)
            variant_data.append((product_id, size, color, stock, price))

# Close connection
cursor.close()
conn.close()
print("✅ Insertion complete.")
