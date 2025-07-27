1. Clone the Project
git clone https://github.com/your-username/clothing-store.git
cd clothing-store

2. Install [ Frontend & Backend ] Dependencies 
cd clothing-backend
cd Frontend

npm install

4.Create a .env file if not exist 
Frontend: .env
VITE_API_URL=http://localhost:5000/api

clothing-backend: .env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=[yourpassword]
DB_NAME=Clothing_Store_DB
JWT_SECRET=your_jwt_secret

