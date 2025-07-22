import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const viewedIds = JSON.parse(localStorage.getItem("recentlyViewed") || "[]").slice(0, 5);
    console.log("Viewed IDs:", viewedIds); // Debug
    if (viewedIds.length > 0) {
      fetch(`${import.meta.env.VITE_API_URL}/products`)
        .then((res) => res.json())
        .then((data) => {
          console.log("API Data:", data); // Debug
          const viewedProducts = data.filter((p) => viewedIds.includes(String(p.product_id)));
          setProducts(viewedProducts);
        })
        .catch((err) => {
          console.error("Failed to fetch products:", err);
          setError("Failed to load recently viewed products.");
        })
        .finally(() => setIsLoading(false));
    } else {
      setProducts([]);
      setIsLoading(false);
    }
  }, []);

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-24 py-12 bg-gray-50 font-['Noto_Sans_JP',sans-serif]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-light text-gray-800 mb-8 tracking-wide">
          Recently Viewed
        </h2>
        {error ? (
          <p className="text-center text-gray-500 text-sm font-light">
            {error}
          </p>
        ) : isLoading ? (
          <p className="text-center text-gray-500 text-sm font-light">
            Loading...
          </p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 text-sm font-light">
            No recently viewed products.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {products.map((product) => (
              <Link
                to={`/product/${product.product_id}`}
                key={product.product_id}
                className="group bg-white rounded-sm overflow-hidden border border-black border-opacity-10 transition-colors duration-200 hover:bg-gray-100"
              >
                <div className="relative w-full h-48 md:h-56">
                  <img
                    src={product.image_url || "https://via.placeholder.com/400"}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-light text-gray-800 group-hover:text-gray-900 tracking-tight">
                    {product.product_name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.variants?.[0]?.price
                      ? `$${product.variants[0].price.toFixed(2)}`
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