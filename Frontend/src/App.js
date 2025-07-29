import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';

// Auth Components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';

// Vendor Components
import VendorDashboard from './components/vendor/VendorDashboard';
import SuppliersList from './components/vendor/SuppliersList';
import GroupOrders from './components/vendor/GroupOrders';
import OrderTracking from './components/vendor/OrderTracking';

// Supplier Components
import ProductManagement from './components/supplier/ProductManagement';
import OrderManagement from './components/supplier/OrderManagement';

// Landing Page
import LandingPage from './components/common/LandingPage';

// Protected Route Component
const ProtectedRoute = ({ children, requiredUserType }) => {
  const { currentUser, userProfile } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredUserType && userProfile?.userType !== requiredUserType) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main App Routes
const AppRoutes = () => {
  const { currentUser, userProfile } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!currentUser ? <LandingPage /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!currentUser ? <Signup /> : <Navigate to="/dashboard" />} />
        
        {/* Dashboard Route - Only VendorDashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <VendorDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Vendor Routes */}
        <Route 
          path="/suppliers" 
          element={
            <ProtectedRoute requiredUserType="vendor">
              <SuppliersList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/group-orders" 
          element={
            <ProtectedRoute requiredUserType="vendor">
              <GroupOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute requiredUserType="vendor">
              <OrderTracking />
            </ProtectedRoute>
          } 
        />
        
        {/* Supplier Routes */}
        <Route 
          path="/products" 
          element={
            <ProtectedRoute requiredUserType="supplier">
              <ProductManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-orders" 
          element={
            <ProtectedRoute requiredUserType="supplier">
              <OrderManagement />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
