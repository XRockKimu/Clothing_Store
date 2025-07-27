import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./models/index.js";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import checkoutRoutes from './routes/checkout.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use('/api/checkout', checkoutRoutes);

// Start the server after DB connection
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect to the database:", err);
});
