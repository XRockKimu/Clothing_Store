import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.role !== "admin") {
        setError("Unauthorized access. Please log in as an admin.");
        navigate("/login", { replace: true });
      } else {
        setAdminName(user.full_name || user.email || "Admin");
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
      setError("Invalid user data. Please log in again.");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-100 text-red-700 p-4 rounded max-w-md mx-auto" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" aria-label={`Welcome ${adminName}`}>
          Welcome, {adminName} 👋
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          aria-label="Log Out"
        >
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate("/admin/products")}
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Manage Products"
        >
          <h2 className="text-xl font-semibold">🛍 Manage Products</h2>
          <p className="text-gray-500 text-sm mt-2">View, edit, and delete products.</p>
        </button>
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Manage Users"
        >
          <h2 className="text-xl font-semibold">👥 Manage Users</h2>
          <p className="text-gray-500 text-sm mt-2">Assign roles and monitor users.</p>
        </button>
        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="View Orders"
        >
          <h2 className="text-xl font-semibold">📦 View Orders</h2>
          <p className="text-gray-500 text-sm mt-2">Track customer orders and delivery.</p>
        </button>
        <button
          onClick={() => navigate("/admin/order-confirmation/1")} // Test with orderId 1
          className="bg-white p-6 rounded-lg shadow cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="View Order Confirmations"
        >
          <h2 className="text-xl font-semibold">✅ Order Confirmations</h2>
          <p className="text-gray-500 text-sm mt-2">Review completed orders.</p>
        </button>
      </div>

      <div className="mt-10">
        <button
          onClick={() => navigate("/admin/products/create")}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Add New Product"
        >
          ➕ Add New Product
        </button>
      </div>
    </div>
  );
}