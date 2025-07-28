import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]").slice(0, 5);
    console.log("Viewed Items:", viewed); // Debug

    if (viewed.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    // Extract IDs, handling both string and object formats
    const viewedIds = viewed.map((item) => (typeof item === "object" ? item.id : item)).map(String);
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        console.log("API Data:", data); // Debug
        const viewedProducts = data.filter((p) => viewedIds.includes(String(p.product_id)));
        // Preserve order from recentlyViewed
        const orderedProducts = viewedIds
          .map((id) => viewedProducts.find((p) => String(p.product_id) === id))
          .filter(Boolean);
        setProducts(orderedProducts);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load recently viewed products. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Memoized products to prevent unnecessary re-renders
  const displayedProducts = useMemo(() => products, [products]);

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-24 py-12 bg-gray-100 font-['Noto_Sans_JP',sans-serif]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 tracking-wide animate-fade-in">
          Recently Viewed
        </h2>
        {error ? (
          <p className="text-center text-red-600 text-lg font-medium animate-fade-in">
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
        ) : displayedProducts.length === 0 ? (
          <p className="text-center text-gray-500 text-lg font-medium animate-fade-in">
            No recently viewed products.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 animate-slide-in">
            {displayedProducts.map((product) => (
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}