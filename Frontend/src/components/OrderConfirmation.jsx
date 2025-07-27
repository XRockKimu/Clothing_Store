import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      const url = `${import.meta.env.VITE_API_URL}/orders/${orderId}/public`; // Use /public
      console.log("Fetching URL:", url); // Debug
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        } else {
          throw new Error("Order not found");
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) fetchOrder();
    else setError("Invalid order ID");
  }, [orderId]);

  if (error) {
    return (
      <div className="min-h-screen bg-white px-6 py-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-red-600">Order Confirmation Error</h2>
          <p className="text-lg">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-6 py-10">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white px-6 py-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Order Not Found</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">Order Confirmation</h2>
        <p className="text-lg">Thank you for your purchase! Your order number is <strong>#{orderId}</strong>.</p>
        <p className="mt-4">Total: ${order.total_amount?.toFixed(2) || "N/A"}</p>
        <h3 className="text-lg font-semibold mt-6">Items</h3>
        <ul className="text-left mx-auto max-w-md mt-2">
          {order.items?.map((item) => (
            <li key={item.order_item_id} className="text-md">
              {item.product_name} (x{item.quantity}) - ${item.price?.toFixed(2)}
            </li>
          )) || <li>No items</li>}
        </ul>
        <p className="mt-4">You will receive a confirmation email shortly.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}