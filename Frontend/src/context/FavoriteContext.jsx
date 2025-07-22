// src/context/FavoriteContext.jsx
import { createContext, useContext, useState } from "react";

const FavoriteContext = createContext();

export const useFavorite = () => useContext(FavoriteContext);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.find((p) => p.product_id === product.product_id);
      return exists
        ? prev.filter((p) => p.product_id !== product.product_id)
        : [...prev, product];
    });
  };

  const isFavorite = (id) => {
    return favorites.some((p) => p.product_id === id);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}
