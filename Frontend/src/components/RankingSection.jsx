import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function RankingSection() {
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    if (active === "All") return products.slice(0, 5);
    return products.filter((p) => p.category === active).slice(0, 5);
  }, [products, active]);

  const handleFilter = (category) => {
    setActive(category);
  };

  return (
    <section className="px-4 sm:px-8 md:px-16 lg:px-24 py-12 bg-gray-50 font-['Noto_Sans_JP',sans-serif]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl md:text-2xl font-light text-gray-800 mb-8 tracking-wide">
          Ranking
        </h2>

        {/* Category Filters */}
        <div className="flex gap-6 mb-10 text-sm font-light text-gray-600">
          {["All", "Men", "Women", "Girls", "Boys", "Accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`relative pb-1 transition-colors duration-200 ${
                active === cat
                  ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              aria-pressed={active === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {error ? (
            <p className="col-span-full text-center text-gray-500 text-sm font-light">
              {error}
            </p>
          ) : isLoading ? (
            <p className="col-span-full text-center text-gray-500 text-sm font-light">
              Loading...
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 text-sm font-light">
              No products found.
            </p>
          ) : (
            filteredProducts.map((product) => (
              <Link
                to={`/product/${product.product_id}`}
                key={product.product_id}
                className="group bg-white rounded-sm overflow-hidden transition-colors duration-200 hover:bg-gray-100"
              >
                <div className="relative w-full h-48 md:h-56">
                  <img
                    src={product.image_url || "https://via.placeholder.com/150"}
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
                      ? `$${product.variants[0].price.toLocaleString()}`
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