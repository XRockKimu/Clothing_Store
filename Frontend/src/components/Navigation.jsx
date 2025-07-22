import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="bg-gray-50 border-t border-b">
      <ul className="flex justify-center gap-10 py-3 text-gray-600 text-sm font-medium">
        <li className="hover:text-black cursor-pointer">
          <Link to="/">Mans</Link>
        </li>
        <li className="hover:text-black cursor-pointer">
          <Link to="/home">Home</Link>
        </li>
        <li className="hover:text-black cursor-pointer">
          <Link to="/AllProducts">All Products</Link>
        </li>
        <li className="hover:text-black cursor-pointer">
          <Link to="/brand">Brand</Link>
        </li>
      </ul>
    </nav>
  );
}
