// src/pages/Like.jsx
import { Link } from "react-router-dom";
import { useFavorite } from "../context/FavoriteContext";

export default function Like() {
  const { favorites, toggleFavorite } = useFavorite();

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No favorite products yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Your Favorites</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div key={product.product_id} className="relative">
              <Link to={`/product/${product.product_id}`} className="block border rounded shadow hover:shadow-lg overflow-hidden">
                <img
                  src={product.image_url || "/placeholder.jpg"}
                  alt={product.product_name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.product_name}</h3>
                  <p className="text-gray-500 text-sm">{product.category}</p>
                </div>
              </Link>
              <button
                onClick={() => toggleFavorite(product)}
                className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow"
              >
                <img src="/full_heart.png" alt="Remove" className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
