import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status
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
      setShowDropdown(false);
    }
  }, [location]);

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  // Handle search
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/AllProducts?search=${encodeURIComponent(searchQuery)}`);
      }
    },
    [searchQuery, navigate]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    if (location.pathname.includes("/AllProducts")) {
      navigate("/AllProducts");
    }
  }, [navigate, location]);

  // Handle image error with local fallback
  const handleImageError = (e, iconName) => {
    console.warn(`Failed to load image: ${e.target.src} for ${iconName}`);
    e.target.src = "/fallback.png"; // Local fallback image in /public
    e.target.onerror = null; // Prevent infinite error loops
  };

  return (
    <header className="bg-gray-100 px-8 md:px-16 py-4 shadow-md font-['Noto_Sans_JP',sans-serif] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-medium text-gray-900 tracking-wide animate-fade-in"
          aria-label="Home"
        >
          TATA COLLECTION
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-1/3 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 pr-10"
              aria-label="Search products"
              aria-describedby="search-results-info"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600"
                aria-label="Clear search"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600"
              aria-label="Submit search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
          </div>
        </form>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/guide"
            className="text-gray-700 hover:text-teal-600 transition-all duration-200"
            aria-label="New Comer's Guide"
          >
            Guide
          </Link>
          <Link
            to="/Favorites"
            className="text-gray-700 hover:text-teal-600 transition-all duration-200"
            aria-label="Wishlist"
          >
            <img
              src="/heart.png"
              alt="Wishlist"
              className="w-6 h-6 hover:opacity-75 transition-opacity duration-200"
              onError={(e) => handleImageError(e, "Wishlist icon")}
            />
          </Link>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 text-gray-700 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-lg transition-all duration-200"
              aria-label={user ? `User menu for ${user.full_name}` : "User menu"}
              aria-expanded={showDropdown}
            >
              <img
                src={user?.profile_url || "/user.png"}
                alt={user?.full_name || "User"}
                className="w-8 h-8 rounded-full border border-gray-300"
                onError={(e) => handleImageError(e, "User profile image")}
              />
              {user?.full_name && (
                <span className="text-gray-700 font-medium truncate max-w-[100px]">
                  {user.full_name.split(" ")[0]}
                </span>
              )}
            </button>
            {showDropdown && (
              <div
                className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm w-48 z-50 animate-slide-in"
                role="menu"
              >
                {isLoggedIn ? (
                  <>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-gray-700 font-medium hover:bg-teal-50 hover:text-teal-600 transition-all duration-200"
                        role="menuitem"
                        onClick={toggleDropdown}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 font-medium hover:bg-teal-50 hover:text-teal-600 transition-all duration-200"
                      role="menuitem"
                      onClick={toggleDropdown}
                    >
                      Profile Info
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 font-medium hover:bg-teal-50 hover:text-teal-600 transition-all duration-200"
                      role="menuitem"
                      onClick={toggleDropdown}
                    >
                      Previous Orders
                    </Link>
                    <Link
                      to="/edit-address"
                      className="block px-4 py-2 text-gray-700 font-medium hover:bg-teal-50 hover:text-teal-600 transition-all duration-200"
                      role="menuitem"
                      onClick={toggleDropdown}
                    >
                      Edit Address
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-teal-50 transition-all duration-200"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-700 font-medium hover:bg-teal-50 hover:text-teal-600 transition-all duration-200"
                      role="menuitem"
                      onClick={toggleDropdown}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-gray-700 font-medium hover:bg-teal-50 hover:text-teal-600 transition-all duration-200"
                      role="menuitem"
                      onClick={toggleDropdown}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
          <Link
            to="/Cart"
            className="text-gray-700 hover:text-teal-600 transition-all duration-200"
            aria-label="Cart"
          >
            <img
              src="/shopping-bag.png"
              alt="Cart"
              className="w-6 h-6 hover:opacity-75 transition-opacity duration-200"
              onError={(e) => handleImageError(e, "Cart icon")}
            />
          </Link>
          <select
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
            aria-label="Select language"
            onChange={(e) => console.log("Language changed to:", e.target.value)}
          >
            <option value="en">English</option>
            <option value="km">Khmer</option>
          </select>
        </nav>
      </div>
    </header>
  );
}