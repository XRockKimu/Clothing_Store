import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    product_name: "",
    category: "Men",
    image_url: "",
    description: "",
    variants: [{ size: "", color: "", price: "", stock: "" }],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to fetch product");
        }
        const data = await res.json();
        setProduct({
          product_name: data.product_name,
          category: data.category,
          image_url: data.image_url || "",
          description: data.description || "",
          variants: data.variants.map((v) => ({
            variant_id: v.variant_id,
            size: v.size || "",
            color: v.color || "",
            price: v.price || "",
            stock: v.stock || "",
          })),
        });
      } catch (err) {
        console.error("Error fetching product:", err);
        setFetchError(`Failed to load product: ${err.message}`);
        toast.error(`Failed to load product: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, e) => {
    const newVariants = [...product.variants];
    newVariants[index][e.target.name] = e.target.value;
    setProduct({ ...product, variants: newVariants });
  };

  const addVariant = () => {
    setProduct({
      ...product,
      variants: [...product.variants, { size: "", color: "", price: "", stock: "" }],
    });
  };

  const removeVariant = (index) => {
    if (product.variants.length === 1) {
      toast.error("At least one variant is required");
      return;
    }
    setProduct({
      ...product,
      variants: product.variants.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!product.product_name) {
      toast.error("Product name is required");
      setIsLoading(false);
      return;
    }
    for (const variant of product.variants) {
      if (!variant.size || !variant.color || !variant.price || !variant.stock) {
        toast.error("All variant fields are required");
        setIsLoading(false);
        return;
      }
      if (isNaN(variant.price) || variant.price < 0 || isNaN(variant.stock) || variant.stock < 0) {
        toast.error("Price and stock must be non-negative numbers");
        setIsLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchError) {
    return <div className="p-8 text-red-600">{fetchError}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            type="text"
            name="product_name"
            value={product.product_name}
            onChange={handleProductChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleProductChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            disabled={isLoading}
          >
            {["Men", "Women", "Girls", "Boys", "Accessories"].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            type="text"
            name="image_url"
            value={product.image_url}
            onChange={handleProductChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleProductChange}
            rows={3}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            disabled={isLoading}
          />
        </div>

        <h3 className="text-xl font-semibold mt-6">Variants</h3>
        {product.variants.map((variant, index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {["size", "color", "price", "stock"].map((field) => (
              <input
                key={field}
                type={field === "price" || field === "stock" ? "number" : "text"}
                name={field}
                value={variant[field]}
                placeholder={field[0].toUpperCase() + field.slice(1)}
                onChange={(e) => handleVariantChange(index, e)}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                disabled={isLoading}
                min={field === "price" || field === "stock" ? 0 : undefined}
                required
              />
            ))}
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="col-span-2 md:col-span-4 text-red-600 hover:text-red-800"
              disabled={isLoading}
            >
              Remove Variant
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addVariant}
          className="mt-2 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          disabled={isLoading}
        >
          Add Another Variant
        </button>

        <button
          type="submit"
          className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-900 disabled:bg-gray-500"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}