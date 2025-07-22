import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminProductDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch products");
      }
      const data = await res.json();
      console.log('API Response:', JSON.stringify(data, null, 2)); // Log for debugging
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(`Failed to load products: ${err.message}`);
      toast.error(`Failed to load products: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || user.role !== "admin") {
          toast.error("Admin access required");
          navigate("/login", { replace: true });
        } else {
          fetchProducts();
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        toast.error("Invalid user data");
        navigate("/login", { replace: true });
      }
    };
    verifyUser();
  }, [navigate]);

  const handleDelete = async (id, productName) => {
    if (!window.confirm(`Delete "${productName}"? This action cannot be undone.`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((p) => p.product_id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(`Failed to delete product: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const handleRetry = () => {
    fetchProducts();
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 text-red-700 p-4 rounded max-w-md mx-auto" role="alert">
          {error}
          <button
            onClick={handleRetry}
            className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" aria-label="Manage Products">
          Admin - Manage Products
        </h1>
        <div className="space-x-4">
          <Link
            to="/admin/products/create"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
            aria-label="Add New Product"
          >
            + Add Product
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            aria-label="Log Out"
          >
            Log Out
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-4">Loading products...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm" aria-describedby="product-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border" scope="col">ID</th>
                <th className="p-2 border" scope="col">Name</th>
                <th className="p-2 border" scope="col">Category</th>
                <th className="p-2 border" scope="col">Variants</th>
                <th className="p-2 border" scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.product_id}>
                  <td className="p-2 border">{p.product_id}</td>
                  <td className="p-2 border">{p.product_name}</td>
                  <td className="p-2 border">{p.category}</td>
                  <td className="p-2 border">
                    {p.variants?.length > 0
                      ? p.variants.map((v) => {
                          const price = parseFloat(v.price); // Convert to number
                          return (
                            <div key={v.variant_id}>
                              {v.size}, {v.color}: ${!isNaN(price) ? price.toFixed(2) : '0.00'} ({v.stock} in stock)
                            </div>
                          );
                        })
                      : "No variants"}
                  </td>
                  <td className="p-2 border space-x-2">
                    <Link
                      to={`/admin/products/edit/${p.product_id}`}
                      className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-600"
                      aria-label={`Edit ${p.product_name}`}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.product_id, p.product_name)}
                      className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-600"
                      aria-label={`Delete ${p.product_name}`}
                      disabled={deletingId === p.product_id}
                    >
                      {deletingId === p.product_id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No products available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}