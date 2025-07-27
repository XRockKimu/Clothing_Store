import { useCart } from "../context/CartContext";
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cartItems, removeFromCart, setCartItems } = useCart();
  const navigate = useNavigate();

  const updateQuantity = (variant_id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.variant?.variant_id === variant_id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.variant?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Your cart is empty</h3>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border rounded p-4 shadow"
                >
                  <img
                    src={item.product?.image_url || "/placeholder.jpg"}
                    alt={item.product?.product_name || "Product"}
                    className="w-24 h-24 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">
                      {item.product?.product_name || "Unnamed Product"}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Size: {item.variant?.size || "N/A"} | Color: {item.variant?.color || "N/A"}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.variant?.variant_id, -1)}
                        className="w-8 h-8 border rounded text-lg font-semibold"
                        disabled={!item.variant?.variant_id}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variant?.variant_id, 1)}
                        className="w-8 h-8 border rounded text-lg font-semibold"
                        disabled={!item.variant?.variant_id}
                      >
                        +
                      </button>
                    </div>

                    <p className="text-black font-semibold mt-1">
                      ${(item.variant?.price || 0) * item.quantity} = $
                      {(item.variant?.price || 0) * item.quantity}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.variant?.variant_id)}
                    className="text-red-600 hover:underline text-sm"
                    disabled={!item.variant?.variant_id}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 text-right">
              <p className="text-xl font-semibold mb-4">
                Total: ${total.toFixed(2)}
              </p>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}