import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Home, 
  Users, 
  ShoppingCart, 
  Package, 
  Truck,
  Store
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const vendorNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/suppliers', label: 'Suppliers', icon: Store },
    { path: '/group-orders', label: 'Group Orders', icon: Users },
    { path: '/orders', label: 'My Orders', icon: Truck }
  ];

  const supplierNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/manage-orders', label: 'Orders', icon: ShoppingCart }
  ];

  const navItems = userProfile?.userType === 'vendor' ? vendorNavItems : supplierNavItems;

  const NavLink = ({ to, children, icon: Icon }) => {
    const isActive = location.pathname === to;
    const activeClasses = isActive
      ? 'text-white bg-white bg-opacity-10'
      : 'text-white-50 hover:text-white hover:bg-white hover:bg-opacity-10';

    return (
      <Link
        to={to}
        className={`d-flex align-items-center px-3 py-2 rounded-3 text-decoration-none fw-medium transition-all ${activeClasses}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {Icon && <Icon size={18} className="me-2" />}
        {children}
      </Link>
    );
  };

  return (
    <nav 
      className="navbar navbar-expand-lg sticky-top shadow-sm"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: 'none'
      }}
    >
      <div className="container">
        <div className="d-flex justify-content-between align-items-center w-100 py-2">
          {/* Logo and Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center text-decoration-none">
            <div 
              className="d-flex align-items-center justify-content-center me-2 rounded-3"
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <span className="text-white fw-bold">VC</span>
            </div>
            <span className="text-white fw-bold fs-4">VendorConnect</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="navbar-toggler border-0 p-0 d-lg-none"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'none' }}
          >
            {isMobileMenuOpen ? (
              <X className="text-white" size={24} />
            ) : (
              <Menu className="text-white" size={24} />
            )}
          </button>

          {/* Desktop Navigation */}
          {currentUser && (
            <div className="d-none d-lg-flex align-items-center gap-2">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} icon={item.icon}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}

          {/* User Menu */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            {currentUser ? (
              <>
                {/* User Info */}
                <div className="d-flex align-items-center gap-2 text-white">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: '32px',
                      height: '32px',
                      background: 'rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    <User size={16} className="text-white" />
                  </div>
                  <span className="fw-medium">{userProfile?.name || currentUser?.email}</span>
                </div>
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                  style={{ borderRadius: '20px' }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-sm"
                  style={{ borderRadius: '20px' }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-light text-primary btn-sm fw-semibold"
                  style={{ borderRadius: '20px' }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="d-lg-none">
            <div 
              className="mt-3 p-3 rounded-3"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {currentUser ? (
                <>
                  {/* Mobile User Info */}
                  <div className="d-flex align-items-center gap-2 text-white mb-3 pb-3 border-bottom border-white-50">
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <User size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="fw-medium">{userProfile?.name || currentUser?.email}</div>
                      <small className="text-white-50">{userProfile?.userType}</small>
                    </div>
                  </div>
                  
                  {/* Mobile Navigation Links */}
                  <div className="d-flex flex-column gap-2 mb-3">
                    {navItems.map((item) => (
                      <NavLink key={item.path} to={item.path} icon={item.icon}>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                  
                  {/* Mobile Logout */}
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 w-100"
                    style={{ borderRadius: '20px' }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <Link
                    to="/login"
                    className="btn btn-outline-light btn-sm"
                    style={{ borderRadius: '20px' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-light text-primary btn-sm fw-semibold"
                    style={{ borderRadius: '20px' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;