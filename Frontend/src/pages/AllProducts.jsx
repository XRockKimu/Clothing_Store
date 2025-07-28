import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom"; // Added useLocation
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
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorite();
  const location = useLocation(); // Added for search query

  // Extract search query
  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  // Fetch products
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        setProducts(data);
        setFiltered(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Update recently viewed
  const handleProductView = useCallback((product) => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    if (!viewed.some((item) => item.id === product.product_id)) {
      viewed.unshift({
        id: product.product_id,
        name: product.product_name,
        image: product.image_url,
      });
      localStorage.setItem("recentlyViewed", JSON.stringify(viewed.slice(0, 5)));
    }
  }, []);

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

  // Apply filters and sorting
  const applyFilters = useCallback(() => {
    let result = [...products];

    // Apply search query filter
    if (searchQuery) {
      result = result.filter((p) =>
        p.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedPrice !== "All") {
      result = result.filter((p) => {
        const price = p.variants?.[0]?.price ? Number(p.variants[0].price) : 0;
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
        p.variants?.some((v) => v.color?.toLowerCase() === selectedColor.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const priceA = a.variants?.[0]?.price ? Number(a.variants[0].price) : 0;
      const priceB = b.variants?.[0]?.price ? Number(b.variants[0].price) : 0;
      switch (sortOption) {
        case "PriceLowHigh":
          return priceA - priceB;
        case "PriceHighLow":
          return priceB - priceA;
        case "NameAZ":
          return (a.product_name || "").localeCompare(b.product_name || "");
        case "Newest":
        default:
          return (b.product_id || 0) - (a.product_id || 0);
      }
    });

    setFiltered(result);
  }, [products, selectedCategory, selectedPrice, selectedSize, selectedColor, sortOption, searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Memoized filtered products
  const filteredProducts = useMemo(() => filtered, [filtered]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedPrice("All");
    setSelectedSize("All");
    setSelectedColor("All");
    setSortOption("Newest");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-['Noto_Sans_JP',sans-serif]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-medium text-gray-900 mb-10 tracking-wide text-center animate-fade-in">
          Shop All Products
        </h1>

        {/* Mobile Sidebar Toggle */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <button
            className="px-4 py-2 text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-all duration-200"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Hide filters" : "Show filters"}
          >
            {isSidebarOpen ? "Hide Filters" : "Show Filters"}
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200"
            onClick={clearFilters}
            aria-label="Clear all filters"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:col-span-1 bg-white rounded-2xl shadow-lg p-6 sticky top-6 transition-all duration-300 ${
              isSidebarOpen ? "block animate-slide-in" : "hidden lg:block"
            }`}
          >
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                className="text-sm font-medium text-gray-700 hover:text-teal-700"
                onClick={clearFilters}
                aria-label="Clear all filters"
              >
                Clear All
              </button>
            </div>
            <div className="space-y-8">
              {/* Category */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Category</h2>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      aria-label={`Filter by ${cat} category`}
                      className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedCategory === cat
                          ? "bg-teal-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-teal-100 hover:text-teal-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Price</h2>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setSelectedPrice(range)}
                      aria-label={`Filter by ${range} price range`}
                      className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedPrice === range
                          ? "bg-teal-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-teal-100 hover:text-teal-700"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Size</h2>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      aria-label={`Filter by ${size} size`}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-teal-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-teal-100 hover:text-teal-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Color</h2>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Filter by ${color} color`}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedColor === color
                          ? "bg-teal-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-teal-100 hover:text-teal-700"
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
              <h2 className="text-2xl font-medium text-gray-900">
                {filteredProducts.length} Products
              </h2>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
                aria-label="Sort products"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="font-medium">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <svg
                  className="animate-spin h-8 w-8 text-teal-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
            ) : error ? (
              <p className="text-red-600 text-center py-12 font-medium text-lg animate-fade-in">
                {error}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <div
                      key={product.product_id}
                      className="relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                      <Link
                        to={`/product/${product.product_id}`}
                        onClick={() => handleProductView(product)}
                        className="block"
                      >
                        <div className="w-full h-64 bg-gray-200 relative overflow-hidden">
                          <img
                            src={product.image_url || "https://via.placeholder.com/150"}
                            alt={product.product_name || "Product image"}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {product.product_name || "Unnamed Product"}
                          </h3>
                          <p className="text-gray-500 text-sm font-light mt-1">
                            {product.category || "Uncategorized"}
                          </p>
                          <p className="text-teal-600 font-medium mt-2">
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
                        aria-label={
                          isFavorite(product.product_id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-teal-50 transition-all duration-200 transform hover:scale-110"
                      >
                        <img
                          src={
                            isFavorite(product.product_id)
                              ? "/full_heart.png"
                              : "/heart.png"
                          }
                          alt={
                            isFavorite(product.product_id) ? "Filled heart" : "Empty heart"
                          }
                          className="w-6 h-6"
                        />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center col-span-full py-12 font-medium text-lg animate-fade-in">
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