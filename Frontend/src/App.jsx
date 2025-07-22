import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AllProducts from "./pages/AllProducts";
import Favorites from "./pages/Favorites";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProductDashboard from "./pages/admin/AdminProductDashboard";
import AdminCreateProduct from "./pages/admin/AdminCreateProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct.jsx";

function AdminRoute() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
  } catch (err) {
    console.error("Error parsing user data:", err);
    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/AllProducts" element={<AllProducts />} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Favorites" element={<Favorites />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProductDashboard />} />
            <Route path="/admin/products/create" element={<AdminCreateProduct />} />
            <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
            <Route path="/admin/users" element={<div>Manage Users (Placeholder)</div>} />
            <Route path="/admin/orders" element={<div>View Orders (Placeholder)</div>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;