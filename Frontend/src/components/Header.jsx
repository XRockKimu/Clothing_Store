import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsLoggedIn(true);
        setUser(parsedUser);
      } catch (err) {
        console.error("Error parsing user data:", err);
        handleLogout();
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login", { replace: true });
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/AllProducts?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-gray-50 px-4 sm:px-8 md:px-16 py-6 flex items-center justify-between font-['Noto_Sans_JP',sans-serif]">
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link
          to="/"
          className="text-xl md:text-2xl font-light text-gray-800 tracking-wide"
          aria-label="Home"
        >
          TATA COLLECTION
        </Link>

        <form onSubmit={handleSearch} className="w-1/3 max-w-xs">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-gray-200 rounded-sm px-3 py-1.5 text-sm font-light text-gray-700 w-full focus:outline-none focus:border-gray-900 transition-colors duration-200"
            aria-label="Search products"
          />
        </form>

        <div className="flex items-center gap-6 text-sm">
          <button
            className="text-gray-600 hover:text-gray-900 font-light tracking-tight transition-colors duration-200"
            aria-label="New Comer's Guide"
          >
            Guide
          </button>

          <Link to="/Favorites" aria-label="Wishlist">
            <img
              src="/heart.png"
              alt="Wishlist"
              className="w-5 h-5 hover:opacity-75 transition-opacity duration-200"
            />
          </Link>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 focus:outline-none"
              aria-label={user ? `User menu for ${user.full_name}` : "User menu"}
              aria-expanded={showDropdown}
            >
              <img
                src={user?.profile_url || "/user.png"}
                alt="User"
                className="w-6 h-6 rounded-full border border-gray-200"
              />
              {user?.full_name && (
                <span className="text-gray-700 font-light tracking-tight hidden sm:inline">
                  {user.full_name.split(" ")[0]}
                </span>
              )}
            </button>

            {showDropdown && (
              <div
                className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-sm text-sm w-48 z-10"
                role="menu"
              >
                {isLoggedIn ? (
                  <>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-700 font-light hover:bg-gray-100 transition-colors duration-200"
                        role="menuitem"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 font-light hover:bg-gray-100 transition-colors duration-200"
                      role="menuitem"
                    >
                      Profile Info
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 font-light hover:bg-gray-100 transition-colors duration-200"
                      role="menuitem"
                    >
                      Previous Orders
                    </Link>
                    <Link
                      to="/edit-address"
                      className="block px-4 py-2 text-gray-700 font-light hover:bg-gray-100 transition-colors duration-200"
                      role="menuitem"
                    >
                      Edit Address
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 font-light hover:bg-gray-100 transition-colors duration-200"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-700 font-light hover:bg-gray-100 transition-colors duration-200"
                      role="menuitem"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-gray-700 font-light hover:bg-gray-100 transition-colors duration-200"
                      role="menuitem"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <Link to="/Cart" aria-label="Cart">
            <img
              src="/shopping-bag.png"
              alt="Cart"
              className="w-5 h-5 hover:opacity-75 transition-opacity duration-200"
            />
          </Link>

          <select
            className="text-sm border border-gray-200 rounded-sm px-2 py-1.5 text-gray-700 font-light focus:outline-none focus:border-gray-900 transition-colors duration-200"
            aria-label="Select language"
          >
            <option>English</option>
            <option>Khmer</option>
          </select>
        </div>
      </div>
    </header>
  );
}