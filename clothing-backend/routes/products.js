import express from "express";
import verifyAdmin from "../middleware/verifyAdmin.js";
import {
  getAllProducts,
  getProductById,
  getRanking,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Public
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/ranking", getRanking);

// Admin
router.get("/admin/products", verifyAdmin, getAdminProducts);
router.get("/admin/products/:id", verifyAdmin, getAdminProductById);
router.post("/admin/products", verifyAdmin, createProduct);
router.put("/admin/products/:id", verifyAdmin, updateProduct);
router.delete("/admin/products/:id", verifyAdmin, deleteProduct);

export default router;
