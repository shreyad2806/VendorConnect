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

  const NavLink = ({ to, children, icon: Icon, mobile = false }) => {
    const isActive = location.pathname === to;
    const baseClasses = mobile
      ? 'flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors'
      : 'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors';
    
    const activeClasses = isActive
      ? 'bg-primary-100 text-primary-700'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';

    return (
      <Link
        to={to}
        className={`${baseClasses} ${activeClasses}`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {children}
      </Link>
    );
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm border-bottom sticky-top">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-2">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">VC</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">VendorConnect</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {currentUser && (
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path} icon={item.icon}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {/* User Info */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{userProfile?.name}</p>
                      <p className="text-gray-500 capitalize">{userProfile?.userType}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  >
                    {isMobileMenuOpen ? (
                      <X className="block h-6 w-6" />
                    ) : (
                      <Menu className="block h-6 w-6" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {currentUser && isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} icon={item.icon} mobile>
                {item.label}
              </NavLink>
            ))}
            
            {/* Mobile User Info */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-900">{userProfile?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{userProfile?.userType}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
