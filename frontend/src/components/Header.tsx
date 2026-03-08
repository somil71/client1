import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <nav className="container-max flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="hidden sm:inline font-bold text-gray-900">Moksh Sanskar</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition">
            Home
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900 transition">
            About
          </Link>
          <Link
            to="/request-help"
            className="text-gray-600 hover:text-gray-900 transition"
          >
            Request Help
          </Link>
          <a href="#contact" className="text-gray-600 hover:text-gray-900 transition">
            Contact
          </a>
          <Link to="/login" className="btn btn-primary">
            Admin Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-white border-t flex flex-col gap-4 p-4 md:hidden">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link to="/request-help" className="text-gray-600 hover:text-gray-900">
              Request Help
            </Link>
            <a href="#contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </a>
            <Link to="/login" className="btn btn-primary">
              Admin Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
