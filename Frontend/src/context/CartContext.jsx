import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  // Load from localStorage on init
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  // Sync cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, variant, quantity = 1) => {
    const existing = cartItems.find(
      (item) =>
        item.product.product_id === product.product_id &&
        item.variant.variant_id === variant.variant_id
    );

    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { product, variant, quantity }]);
    }
  };

  const updateQuantity = (variant_id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.variant.variant_id === variant_id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeFromCart = (variant_id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.variant.variant_id !== variant_id)
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
