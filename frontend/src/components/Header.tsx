import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition">
            Home
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900 transition">
            About
          </Link>

          {/* Services Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button className="text-gray-600 hover:text-gray-900 transition flex items-center gap-1">
              Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/ngo"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  NGO Partners
                </Link>
                <Link
                  to="/volunteer"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Volunteer
                </Link>
                <Link
                  to="/public-services"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  Public Services
                </Link>
              </div>
            )}
          </div>

          <Link to="/request-help" className="text-gray-600 hover:text-gray-900 transition">
            Request Help
          </Link>
          <Link to="/track-request" className="text-gray-600 hover:text-gray-900 transition">
            Track Request
          </Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-900 transition">
            Contact
          </Link>

          {isLoggedIn ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-saffron-600 hover:text-saffron-800 font-medium transition">
                  Dashboard
                </Link>
              )}
              <Link to="/profile" className="btn btn-outline text-sm">
                Profile
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/user/login" className="text-gray-600 hover:text-gray-900 transition text-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-outline text-sm">
                Sign Up
              </Link>
              <Link to="/login" className="btn btn-primary text-sm">
                Admin
              </Link>
            </div>
          )}
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
          <div className="absolute top-20 left-0 right-0 bg-white border-t flex flex-col gap-3 p-4 md:hidden shadow-lg z-50">
            <Link to="/" className="text-gray-600 hover:text-gray-900 py-1" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 py-1" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>

            <div className="border-t border-gray-100 pt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Services</p>
              <Link to="/ngo" className="text-gray-600 hover:text-gray-900 py-1 pl-3 block" onClick={() => setMobileMenuOpen(false)}>
                NGO Partners
              </Link>
              <Link to="/volunteer" className="text-gray-600 hover:text-gray-900 py-1 pl-3 block" onClick={() => setMobileMenuOpen(false)}>
                Volunteer
              </Link>
              <Link to="/public-services" className="text-gray-600 hover:text-gray-900 py-1 pl-3 block" onClick={() => setMobileMenuOpen(false)}>
                Public Services
              </Link>
            </div>

            <div className="border-t border-gray-100 pt-2">
              <Link to="/request-help" className="text-gray-600 hover:text-gray-900 py-1 block" onClick={() => setMobileMenuOpen(false)}>
                Request Help
              </Link>
              <Link to="/track-request" className="text-gray-600 hover:text-gray-900 py-1 block" onClick={() => setMobileMenuOpen(false)}>
                Track Request
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-gray-900 py-1 block" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </div>

            <div className="border-t border-gray-100 pt-2 flex flex-col gap-2">
              {isLoggedIn ? (
                <>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-saffron-600 font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="btn btn-outline text-center" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/user/login" className="text-gray-600 hover:text-gray-900 py-1" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-outline text-center" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                  <Link to="/login" className="btn btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                    Admin Login
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
