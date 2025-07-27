import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminOrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found");
        const url = `${import.meta.env.VITE_API_URL}/orders/${orderId}`;
        console.log("Fetching URL:", url); // Debug
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        } else {
          throw new Error("Order data not found in response");
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/confirm`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to confirm order");
      navigate("/admin/orders");
    } catch (err) {
      console.error("Confirmation error:", err);
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded max-w-md mx-auto" role="alert">
          {error}
          <button
            onClick={() => navigate("/admin/orders")}
            className="ml-4 text-blue-600 hover:underline"
            aria-label="Back to Orders"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-500 text-sm font-light">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <p className="text-center text-gray-500 text-sm font-light">Order not found.</p>
        <button
          onClick={() => navigate("/admin/orders")}
          className="mt-4 text-blue-600 hover:underline"
          aria-label="Back to Orders"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Order Confirmation #{orderId}</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <p><strong>Customer:</strong> {order.customer_full_name || "N/A"}</p>
          <p><strong>Email:</strong> {order.customer_email || "N/A"}</p>
          <p><strong>Status:</strong> {order.status || "Pending"}</p>
          <p><strong>Total:</strong> ${order.total_amount?.toFixed(2) || "N/A"}</p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Items</h3>
          <ul className="list-disc pl-5">
            {order.items?.length > 0 ? (
              order.items.map((item) => (
                <li key={item.order_item_id}>
                  {item.product_name} (x{item.quantity}) - ${item.price?.toFixed(2)}
                </li>
              ))
            ) : (
              <li>No items</li>
            )}
          </ul>
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleConfirmOrder}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600"
              aria-label="Confirm Order"
              disabled={order.status === "Confirmed"}
            >
              {order.status === "Confirmed" ? "Confirmed" : "Confirm Order"}
            </button>
            <button
              onClick={() => navigate("/admin/orders")}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Back to Orders"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}