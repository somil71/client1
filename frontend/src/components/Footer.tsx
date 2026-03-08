import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-saffron-500 to-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-bold">Moksh Sanskar Foundation</span>
            </div>
            <p className="text-gray-400 text-sm">
              Providing compassionate support and assistance for families during their time of need.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/request-help" className="hover:text-white transition">
                  Request Help
                </Link>
              </li>
              <li>
                <Link to="/track-request" className="hover:text-white transition">
                  Track Request
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="font-semibold mb-4">Get Involved</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/volunteer" className="hover:text-white transition">
                  Volunteer With Us
                </Link>
              </li>
              <li>
                <Link to="/ngo" className="hover:text-white transition">
                  NGO Partners
                </Link>
              </li>
              <li>
                <Link to="/public-services" className="hover:text-white transition">
                  Public Services
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-white transition">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/user/login" className="hover:text-white transition">
                  User Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © {currentYear} Moksh Sanskar Foundation. All rights reserved. | Dedicated to serving
            families with compassion and dignity.
          </p>
        </div>
      </div>
    </footer>
  );
}
