// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-12 px-6 py-10 text-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
        <div>
          <h3 className="font-bold mb-2">TATA COLLECTION</h3>
          <div className="flex gap-2">
            <Link to="#" className="hover:opacity-80">
              <img
                src="/telegram.png"
                alt="Telegram Icon"
                className="w-5 h-5"
              />
            </Link>
            <Link to="#" className="hover:opacity-80">
              <img
                src="/facebook.png"
                alt="User Icon"
                className="w-5 h-5"
              />
            </Link>
          </div>
        </div>
        
        <div>
          <h3 className="font-bold mb-2">Information</h3>
          <ul className="space-y-1">
            <li>User Guide</li>
            <li>Company Profile</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-2">Other</h3>
          <ul className="space-y-1">
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <select className="bg-black border text-white px-2 py-1">
            <option>English</option>
            <option>Khmer</option>
          </select>
        </div>
      </div>
    </footer>
  );
}
