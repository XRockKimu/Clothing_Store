import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFavorite } from "../context/FavoriteContext";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");
  const [loading, setLoading] = useState(true);

  const { toggleFavorite, isFavorite } = useFavorite();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data); // Debug API response
        setProducts(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setLoading(false);
      });
  }, []);

  // Update recently viewed when a product is clicked
  const handleProductView = (productId) => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    if (!viewed.includes(productId)) {
      viewed.unshift(productId);
      localStorage.setItem("recentlyViewed", JSON.stringify(viewed.slice(0, 5)));
    }
  };

  const categories = ["All", "Men", "Women", "Girls", "Boys", "Accessories"];
  const priceRanges = ["All", "Under $25", "$25 - $50", "$50 - $100", "Over $100"];
  const sizes = ["All", "S", "M", "L", "XL"];
  const colors = ["All", "Black", "White", "Red", "Blue", "Green", "Yellow"];
  const sortOptions = [
    { value: "Newest", label: "Newest" },
    { value: "PriceLowHigh", label: "Price: Low to High" },
    { value: "PriceHighLow", label: "Price: High to Low" },
    { value: "NameAZ", label: "Name: A-Z" },
  ];

  const applyFilters = () => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedPrice !== "All") {
      result = result.filter((p) => {
        const price = Number(p.variants?.[0]?.price) || 0; // Convert to number
        switch (selectedPrice) {
          case "Under $25":
            return price < 25;
          case "$25 - $50":
            return price >= 25 && price <= 50;
          case "$50 - $100":
            return price > 50 && price <= 100;
          case "Over $100":
            return price > 100;
          default:
            return true;
        }
      });
    }

    if (selectedSize !== "All") {
      result = result.filter((p) =>
        p.variants?.some((v) => v.size === selectedSize)
      );
    }

    if (selectedColor !== "All") {
      result = result.filter((p) =>
        p.variants?.some(
          (v) => v.color?.toLowerCase() === selectedColor.toLowerCase()
        )
      );
    }

    switch (sortOption) {
      case "PriceLowHigh":
        result.sort((a, b) => (Number(a.variants?.[0]?.price) || 0) - (Number(b.variants?.[0]?.price) || 0));
        break;
      case "PriceHighLow":
        result.sort((a, b) => (Number(b.variants?.[0]?.price) || 0) - (Number(a.variants?.[0]?.price) || 0));
        break;
      case "NameAZ":
        result.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case "Newest":
      default:
        result.sort((a, b) => b.product_id - a.product_id);
        break;
    }

    setFiltered(result);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedPrice, selectedSize, selectedColor, sortOption]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-['Noto_Sans_JP',sans-serif]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-light text-gray-800 mb-8 tracking-wide">Shop All Products</h1>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 sticky top-4">
            <div className="space-y-8">
              {/* Category */}
              <div>
                <h2 className="text-lg font-light text-gray-800 mb-4">Category</h2>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-light transition-colors ${
                        selectedCategory === cat
                          ? "bg-teal-600 text-white"
                          : "text-gray-600 hover:bg-teal-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h2 className="text-lg font-light text-gray-800 mb-4">Price</h2>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedPrice(range)}
                      className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-light transition-colors ${
                        selectedPrice === range
                          ? "bg-teal-600 text-white"
                          : "text-gray-600 hover:bg-teal-50"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h2 className="text-lg font-light text-gray-800 mb-4">Size</h2>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded-full text-sm font-light transition-colors ${
                        selectedSize === size
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-teal-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h2 className="text-lg font-light text-gray-800 mb-4">Color</h2>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 rounded-full text-sm font-light transition-colors ${
                        selectedColor === color
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-teal-50"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product List */}
          <section className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-light text-gray-800">{filtered.length} Products</h2>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-light focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="font-light">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <p className="text-gray-500 text-center py-12 font-light">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.length > 0 ? (
                  filtered.map((product) => (
                    <div
                      key={product.product_id}
                      className="relative bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105"
                    >
                      <Link
                        to={`/product/${product.product_id}`}
                        onClick={() => handleProductView(product.product_id)}
                        className="block"
                      >
                        <div className="w-full h-64 bg-gray-100">
                          <img
                            src={product.image_url || "https://via.placeholder.com/150"}
                            alt={product.product_name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-light text-gray-800 truncate">
                            {product.product_name}
                          </h3>
                          <p className="text-gray-500 text-sm font-light mb-2">{product.category}</p>
                          <p className="text-teal-600 font-light">
                            {product.variants && product.variants[0]?.price != null
                              ? `$${Number(product.variants[0].price).toFixed(2)}`
                              : "Price N/A"}
                          </p>
                        </div>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(product);
                        }}
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={
                            isFavorite(product.product_id)
                              ? "/full_heart.png"
                              : "/heart.png"
                          }
                          alt="heart"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center col-span-full py-12 font-light">
                    No products found matching your criteria.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}