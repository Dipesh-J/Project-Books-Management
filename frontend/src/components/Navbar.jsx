import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import Button from './Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/books', label: 'Books', protected: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-surface shadow-navbar sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-primary-variant"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="text-xl font-semibold text-white">BookShelf</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
              !link.protected || (link.protected && isAuthenticated) ? (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`
                    text-sm font-medium transition-colors
                    ${isActive(link.path) 
                      ? 'text-primary-variant' 
                      : 'text-text-secondary hover:text-white'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ) : null
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/books/create">
                  <Button size="sm" variant="primary">
                    Add Book
                  </Button>
                </Link>
                <Button size="sm" variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button size="sm" variant="ghost">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="primary">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-text-secondary hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-background">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) =>
                !link.protected || (link.protected && isAuthenticated) ? (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      px-4 py-2 text-sm font-medium rounded transition-colors
                      ${isActive(link.path)
                        ? 'text-primary-variant bg-background'
                        : 'text-text-secondary hover:text-white hover:bg-background'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ) : null
              )}
              <div className="pt-3 border-t border-background flex flex-col gap-2 px-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/books/create" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" variant="primary" className="w-full">
                        Add Book
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" onClick={handleLogout} className="w-full">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" variant="ghost" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" variant="primary" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
