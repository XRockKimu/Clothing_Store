import express from "express";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { Product, Product_Variant, Order_Item, Sequelize } = db;
const router = express.Router();

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// GET /api/products/ranking
router.get("/ranking", async (req, res) => {
  try {
    const results = await Order_Item.findAll({
      attributes: [
        "product_id",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSold"],
      ],
      group: ["product_id"],
      order: [[Sequelize.literal("totalSold"), "DESC"]],
      limit: 5,
      include: {
        model: Product,
        include: [{ model: Product_Variant, as: "variants" }],
      },
    });

    res.json(results);
  } catch (err) {
    console.error("Ranking error:", err);
    res.status(500).json({ message: "Failed to load ranking" });
  }
});

// GET /api/products — All Products (Public)
router.get("/products", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Product_Variant, as: "variants" }],
    });

    res.json(products);
  } catch (err) {
    console.error("Error fetching all products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// GET /api/products/:id — Product Detail (Public)
router.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findByPk(id, {
      include: [{ model: Product_Variant, as: "variants" }],
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Product ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/products — All Products (Admin)
router.get("/admin/products", verifyAdmin, async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Product_Variant,
          as: "variants",
          attributes: ["variant_id", "size", "color", "price", "stock"],
        },
      ],
    });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

// GET /api/admin/products/:id — Product Detail (Admin)
router.get("/admin/products/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  try {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Product_Variant,
          as: "variants",
          attributes: ["variant_id", "size", "color", "price", "stock"],
        },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

// POST /api/admin/products — Create Product (Admin)
router.post("/admin/products", verifyAdmin, async (req, res) => {
  const { product_name, category, image_url, description, variants } = req.body;
  try {
    if (!product_name || !category || !variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: "Product name, category, and at least one variant are required" });
    }
    if (!["Men", "Women", "Girls", "Boys", "Accessories"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    for (const variant of variants) {
      if (!variant.size || !variant.color || !variant.price || !variant.stock) {
        return res.status(400).json({ message: "Each variant must have size, color, price, and stock" });
      }
      if (isNaN(variant.price) || variant.price < 0 || isNaN(variant.stock) || variant.stock < 0) {
        return res.status(400).json({ message: "Price and stock must be non-negative numbers" });
      }
    }

    const product = await Product.create({
      product_name,
      category,
      image_url,
      description,
    });

    const variantData = variants.map((variant) => ({
      product_id: product.product_id,
      size: variant.size,
      color: variant.color,
      price: parseFloat(variant.price),
      stock: parseInt(variant.stock, 10),
    }));
    await Product_Variant.bulkCreate(variantData); // Fixed: Use Product_Variant

    res.status(201).json({ message: "Product created successfully", product_id: product.product_id });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

// PUT /api/admin/products/:id — Update Product (Admin)
router.put("/admin/products/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { product_name, category, image_url, description, variants } = req.body;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  try {
    if (!product_name || !category || !variants || !Array.isArray(variants) || variants.length === 0) {
      return res.status(400).json({ message: "Product name, category, and at least one variant are required" });
    }
    if (!["Men", "Women", "Girls", "Boys", "Accessories"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }
    for (const variant of variants) {
      if (!variant.size || !variant.color || !variant.price || !variant.stock) {
        return res.status(400).json({ message: "Each variant must have size, color, price, and stock" });
      }
      if (isNaN(variant.price) || variant.price < 0 || isNaN(variant.stock) || variant.stock < 0) {
        return res.status(400).json({ message: "Price and stock must be non-negative numbers" });
      }
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.update({
      product_name,
      category,
      image_url,
      description,
    });

    await Product_Variant.destroy({ where: { product_id: id } }); // Fixed: Use Product_Variant

    const variantData = variants.map((variant) => ({
      product_id: id,
      size: variant.size,
      color: variant.color,
      price: parseFloat(variant.price),
      stock: parseInt(variant.stock, 10),
    }));
    await Product_Variant.bulkCreate(variantData); // Fixed: Use Product_Variant

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

// DELETE /api/admin/products/:id — Delete Product (Admin)
router.delete("/admin/products/:id", verifyAdmin, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

export default router;