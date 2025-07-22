import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setActiveImage(data.image_url);
        // Update recently viewed
        const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
        if (!viewed.includes(id)) {
          viewed.unshift(id);
          localStorage.setItem("recentlyViewed", JSON.stringify(viewed.slice(0, 5)));
        }
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) {
    return <div className="p-6 text-center text-gray-500 font-['Noto_Sans_JP',sans-serif]">Loading...</div>;
  }

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Please select color and size");
      return;
    }
    if (selectedVariant.stock === 0) {
      alert("This variant is out of stock!");
      return;
    }

    addToCart(product, selectedVariant, quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-['Noto_Sans_JP',sans-serif]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Product Gallery */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-sm shadow-md relative">
            <img
              src={activeImage || "/placeholder.jpg"}
              alt={product.product_name}
              className="w-full h-[450px] object-contain"
            />
          </div>

          <div className="flex gap-3 justify-center">
            <img
              src={product.image_url || "/placeholder.jpg"}
              alt="Thumbnail"
              onClick={() => setActiveImage(product.image_url)}
              className={`w-16 h-16 object-cover border-2 cursor-pointer ${
                activeImage === product.image_url ? "border-black" : "border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-4">
          <h2 className="text-xl font-light text-gray-800">{product.product_name}</h2>
          <p className="text-gray-600 text-sm font-light">{product.description}</p>

          <p className="text-gray-600 text-sm font-light">
            <span className="font-medium">Category:</span> {product.category}
          </p>

          {/* Color selection */}
          <div>
            <p className="font-medium mb-1 text-sm">Color:</p>
            <div className="flex gap-3">
              {colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color ? "border-black" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
            </div>
          </div>

          {/* Size selection */}
          <div>
            <p className="font-medium mb-1 text-sm">Size:</p>
            <div className="flex gap-2">
              {sizes.map((size, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded-sm ${
                    selectedSize === size ? "bg-black text-white" : "bg-white text-black"
                  } text-sm font-light`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <p className="font-medium text-sm">Quantity:</p>
            <div className="flex items-center border rounded-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-lg"
              >
                −
              </button>
              <span className="px-4 text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Price & Add to Cart */}
          <p className="text-xl font-light text-gray-800">
            ${selectedVariant?.price?.toFixed(2) || "N/A"}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className={`mt-4 w-full px-6 py-3 rounded-sm transition ${
              !selectedVariant || selectedVariant.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            } text-sm font-light`}
          >
            {!selectedVariant
              ? "Select Options"
              : selectedVariant.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

          {/* Extra Info */}
          <div className="border-t pt-4">
            <details className="mb-2">
              <summary className="cursor-pointer font-medium text-sm">Description</summary>
              <p className="text-gray-600 mt-2 text-sm font-light">{product.description}</p>
            </details>
            <details>
              <summary className="cursor-pointer font-medium text-sm">Specification</summary>
              <p className="text-gray-600 mt-2 text-sm font-light">
                Material, dimensions, weight, etc.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}