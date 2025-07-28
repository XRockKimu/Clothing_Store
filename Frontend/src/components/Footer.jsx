import { Link } from "react-router-dom";

export default function Footer() {
  const socialLinks = [
    {
      name: "Telegram",
      url: "https://t.me/tatacollection", // Replace with actual URL
      icon: "/telegram.png",
      fallback: "https://via.placeholder.com/24",
    },
    {
      name: "Facebook",
      url: "https://facebook.com/tatacollection", // Replace with actual URL
      icon: "/facebook.png",
      fallback: "https://via.placeholder.com/24",
    },
  ];

  const infoLinks = [
    { name: "User Guide", path: "/guide" },
    { name: "Company Profile", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const otherLinks = [
    { name: "Terms of Service", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
  ];

  return (
    <footer className="bg-gray-900 text-white px-4 sm:px-8 md:px-16 py-12 font-['Noto_Sans_JP',sans-serif] animate-fade-in">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 tracking-wide">
            TATA COLLECTION
          </h3>
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition-all duration-200"
                aria-label={`Follow us on ${link.name}`}
              >
                <img
                  src={link.icon}
                  alt={`${link.name} Icon`}
                  className="w-6 h-6"
                  onError={(e) => (e.target.src = link.fallback)}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Information Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 tracking-wide">Information</h3>
          <ul className="space-y-2">
            {infoLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-gray-300 text-sm font-medium hover:text-teal-400 transition-all duration-200"
                  aria-label={link.name}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Other Section */}
        <div>
          <h3 className="text-lg font-medium mb-4 tracking-wide">Other</h3>
          <ul className="space-y-2">
            {otherLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-gray-300 text-sm font-medium hover:text-teal-400 transition-all duration-200"
                  aria-label={link.name}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Language Selector */}
        <div>
          <h3 className="text-lg font-medium mb-4 tracking-wide">Language</h3>
          <select
            className="bg-gray-800 border border-gray-600 text-white text-sm font-medium rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
            aria-label="Select language"
            onChange={(e) => console.log("Language changed to:", e.target.value)} // Placeholder for language switching
          >
            <option value="en">English</option>
            <option value="km">Khmer</option>
          </select>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-12 text-center text-gray-400 text-sm font-medium border-t border-gray-700 pt-6">
        <p>&copy; {new Date().getFullYear()} TATA COLLECTION. All rights reserved.</p>
      </div>
    </footer>
  );
}