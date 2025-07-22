import db from "../models/index.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await db.Product.findAll({
      include: db.ProductVariant
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};
