import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

export default function RankingSection() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        setProducts(data);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Handle filter change
  const handleFilter = useCallback((category) => {
    setActive(category);
  }, []);

  // Compute filtered products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let result = active === "All" ? products : products.filter((p) => p.category === active);
    // Sort by product_id (newest) for ranking
    result = result.sort((a, b) => (b.product_id || 0) - (a.product_id || 0));
    return result.slice(0, 5);
  }, [products, active]);

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-24 py-12 bg-gray-100 font-['Noto_Sans_JP',sans-serif]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 tracking-wide animate-fade-in">
          Top Ranked Products
        </h2>

        {/* Category Filters */}
        <div className="flex gap-6 mb-10 text-sm font-medium text-gray-600 flex-wrap">
          {["All", "Men", "Women", "Girls", "Boys", "Accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`relative pb-2 transition-all duration-200 ${
                active === cat
                  ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-teal-600"
                  : "text-gray-600 hover:text-teal-700 hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-teal-200"
              }`}
              aria-pressed={active === cat}
              aria-label={`Filter by ${cat} category`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 animate-slide-in">
          {error ? (
            <p className="col-span-full text-center text-red-600 text-lg font-medium animate-fade-in">
              {error}
            </p>
          ) : isLoading ? (
            <div className="col-span-full flex justify-center items-center py-8">
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
          ) : filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 text-lg font-medium animate-fade-in">
              No products found.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <Link
                to={`/product/${product.product_id}`}
                key={product.product_id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative w-full h-48 md:h-56 bg-gray-200">
                  <img
                    src={product.image_url || "https://via.placeholder.com/150"}
                    alt={product.product_name || "Product image"}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-medium text-gray-900 group-hover:text-teal-700 tracking-tight truncate">
                    {product.product_name || "Unnamed Product"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 font-light">
                    {product.category || "Uncategorized"}
                  </p>
                  <p className="text-base font-medium text-teal-600 mt-2">
                    {product.variants?.[0]?.price != null
                      ? `$${Number(product.variants[0].price).toFixed(2)}`
                      : "Price N/A"}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}