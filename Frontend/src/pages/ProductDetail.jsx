import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Fetch product
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setActiveImage(data.image_url || "https://via.placeholder.com/150");
        // Update recently viewed
        const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
        if (!viewed.some((item) => item.id === data.product_id)) {
          viewed.unshift({
            id: data.product_id,
            name: data.product_name,
            image: data.image_url,
          });
          localStorage.setItem("recentlyViewed", JSON.stringify(viewed.slice(0, 5)));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
        setLoading(false);
      });
  }, [id]);

  // Compute selected variant
  const selectedVariant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  // Handle add to cart
  const handleAddToCart = useCallback(() => {
    if (!selectedVariant) {
      alert("Please select color and size");
      return;
    }
    if (selectedVariant.stock === 0) {
      alert("This variant is out of stock!");
      return;
    }
    addToCart(product, selectedVariant, quantity);
    alert("Added to cart!");
  }, [product, selectedVariant, quantity, addToCart]);

  // Compute unique colors and sizes
  const colors = useMemo(() => [...new Set(product?.variants?.map((v) => v.color) || [])], [product]);
  const sizes = useMemo(() => [...new Set(product?.variants?.map((v) => v.size) || [])], [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6 font-['Noto_Sans_JP',sans-serif]">
        <svg
          className="animate-spin h-8 w-8 text-teal-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="status"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6 font-['Noto_Sans_JP',sans-serif]">
        <p className="text-red-600 text-lg font-medium animate-fade-in">{error}</p>
        <Link
          to="/products"
          className="mt-4 px-6 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all duration-200"
          aria-label="Back to shop"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6 font-['Noto_Sans_JP',sans-serif]">
        <p className="text-gray-500 text-lg font-medium animate-fade-in">Product not found</p>
        <Link
          to="/products"
          className="mt-4 px-6 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all duration-200"
          aria-label="Back to shop"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-['Noto_Sans_JP',sans-serif]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Product Gallery */}
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white p-4 rounded-2xl shadow-lg relative overflow-hidden">
            <img
              src={activeImage}
              alt={product.product_name || "Product image"}
              loading="lazy"
              className="w-full h-[450px] object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <img
              src={product.image_url || "https://via.placeholder.com/150"}
              alt={`${product.product_name || "Product"} thumbnail`}
              onClick={() => setActiveImage(product.image_url)}
              className={`w-16 h-16 object-cover border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                activeImage === product.image_url ? "border-teal-600 shadow-md" : "border-gray-300 hover:border-teal-500"
              }`}
            />
            {/* Add more thumbnails if available in product.images */}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6 animate-slide-in">
          <div>
            <h2 className="text-3xl font-medium text-gray-900">{product.product_name || "Unnamed Product"}</h2>
            <p className="text-gray-600 text-base font-light mt-2">{product.description || "No description available"}</p>
          </div>

          <p className="text-gray-600 text-sm font-medium">
            <span className="font-semibold">Category:</span> {product.category || "Uncategorized"}
          </p>

          {/* Color selection */}
          <div>
            <p className="font-semibold text-sm mb-2">Color:</p>
            <div className="flex gap-3 flex-wrap">
              {colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color} color`}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    selectedColor === color ? "border-teal-600 shadow-md" : "border-gray-300 hover:border-teal-500"
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          </div>

          {/* Size selection */}
          <div>
            <p className="font-semibold text-sm mb-2">Size:</p>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(size)}
                  aria-label={`Select ${size} size`}
                  className={`px-4 py-1.5 border rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedSize === size
                      ? "bg-teal-600 text-white border-teal-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-teal-100 hover:text-teal-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <p className="font-semibold text-sm">Quantity:</p>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="px-4 py-2 text-lg font-medium text-gray-700 hover:bg-teal-50 transition-all duration-200"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min((selectedVariant?.stock || 10), q + 1))}
                aria-label="Increase quantity"
                className="px-4 py-2 text-lg font-medium text-gray-700 hover:bg-teal-50 transition-all duration-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock and Price */}
          <div className="flex items-center gap-4">
            <p className="text-2xl font-medium text-gray-900">
              {selectedVariant?.price != null
                ? `$${Number(selectedVariant.price).toFixed(2)}`
                : "Select options to view price"}
            </p>
            {selectedVariant && (
              <p className="text-sm font-medium text-gray-600">
                {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : "Out of stock"}
              </p>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className={`w-full px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              !selectedVariant || selectedVariant.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-700 shadow-md hover:shadow-lg"
            }`}
            aria-label="Add to cart"
          >
            {!selectedVariant
              ? "Select Options"
              : selectedVariant.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          {/* Extra Info */}
          <div className="border-t pt-4">
            <details className="mb-3">
              <summary className="cursor-pointer font-semibold text-sm text-gray-900 hover:text-teal-700 transition-colors duration-200">
                Description
              </summary>
              <p className="text-gray-600 mt-2 text-sm font-light">
                {product.description || "No description available"}
              </p>
            </details>
            <details>
              <summary className="cursor-pointer font-semibold text-sm text-gray-900 hover:text-teal-700 transition-colors duration-200">
                Specification
              </summary>
              <p className="text-gray-600 mt-2 text-sm font-light">
                {product.specification || "Material, dimensions, weight, etc. not specified"}
              </p>
            </details>
          </div>

          {/* Back to Shop */}
          <Link
            to="/products"
            className="inline-block px-6 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all duration-200"
            aria-label="Back to shop"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}