import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  Building, 
  MapPin, 
  AlertCircle,
  Store,
  Users,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'vendor', // 'vendor' or 'supplier'
    businessName: '',
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        userType: formData.userType,
        businessName: formData.businessName,
        location: formData.location
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}
    >
      {/* Background Pattern */}
      <div 
        className="position-absolute w-100 h-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.1
        }}
      />
      
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div 
              className="bg-white rounded-4 shadow-lg p-4 p-md-5"
              style={{
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {/* Logo and Header */}
              <div className="text-center mb-4">
                <div 
                  className="d-inline-flex align-items-center justify-content-center rounded-4 mb-3"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <span className="text-white fw-bold fs-4">VC</span>
                </div>
                <h1 className="h3 fw-bold text-dark mb-2">Join VendorConnect</h1>
                <p className="text-muted mb-0">
                  Create your account and start saving money today
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {error && (
                  <div 
                    className="alert d-flex align-items-center p-3 rounded-3 mb-4"
                    style={{
                      backgroundColor: '#fee2e2',
                      border: '1px solid #fecaca',
                      color: '#dc2626'
                    }}
                  >
                    <AlertCircle size={20} className="me-2 flex-shrink-0" />
                    <span className="fs-6">{error}</span>
                  </div>
                )}

                {/* User Type Selection */}
                <div className="mb-4">
                  <label className="form-label fw-medium text-dark mb-3">
                    I am a:
                  </label>
                  <div className="row g-3">
                    <div className="col-6">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, userType: 'vendor'})}
                        className={`btn w-100 p-3 d-flex flex-column align-items-center gap-2 ${
                          formData.userType === 'vendor'
                            ? 'btn-primary'
                            : 'btn-outline-secondary'
                        }`}
                        style={{
                          borderRadius: '12px',
                          border: formData.userType === 'vendor' 
                            ? '2px solid #667eea' 
                            : '2px solid #e5e7eb',
                          background: formData.userType === 'vendor'
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'transparent'
                        }}
                      >
                        <Users size={24} />
                        <span className="fw-medium">Street Vendor</span>
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, userType: 'supplier'})}
                        className={`btn w-100 p-3 d-flex flex-column align-items-center gap-2 ${
                          formData.userType === 'supplier'
                            ? 'btn-primary'
                            : 'btn-outline-secondary'
                        }`}
                        style={{
                          borderRadius: '12px',
                          border: formData.userType === 'supplier' 
                            ? '2px solid #667eea' 
                            : '2px solid #e5e7eb',
                          background: formData.userType === 'supplier'
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : 'transparent'
                        }}
                      >
                        <Store size={24} />
                        <span className="fw-medium">Supplier</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="name" className="form-label fw-medium text-dark mb-2">
                      Full Name
                    </label>
                    <div className="position-relative">
                      <div 
                        className="position-absolute top-50 translate-middle-y ms-3"
                        style={{ zIndex: 5 }}
                      >
                        <User size={18} className="text-muted" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control form-control-lg ps-5"
                        placeholder="Enter your full name"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          fontSize: '16px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="phone" className="form-label fw-medium text-dark mb-2">
                      Phone Number
                    </label>
                    <div className="position-relative">
                      <div 
                        className="position-absolute top-50 translate-middle-y ms-3"
                        style={{ zIndex: 5 }}
                      >
                        <Phone size={18} className="text-muted" />
                      </div>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-control form-control-lg ps-5"
                        placeholder="Enter your phone number"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          fontSize: '16px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-medium text-dark mb-2">
                    Email Address
                  </label>
                  <div className="position-relative">
                    <div 
                      className="position-absolute top-50 translate-middle-y ms-3"
                      style={{ zIndex: 5 }}
                    >
                      <Mail size={18} className="text-muted" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control form-control-lg ps-5"
                      placeholder="Enter your email address"
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '16px'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="businessName" className="form-label fw-medium text-dark mb-2">
                      Business Name
                    </label>
                    <div className="position-relative">
                      <div 
                        className="position-absolute top-50 translate-middle-y ms-3"
                        style={{ zIndex: 5 }}
                      >
                        <Building size={18} className="text-muted" />
                      </div>
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        className="form-control form-control-lg ps-5"
                        placeholder="Enter your business name"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          fontSize: '16px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="location" className="form-label fw-medium text-dark mb-2">
                      Location
                    </label>
                    <div className="position-relative">
                      <div 
                        className="position-absolute top-50 translate-middle-y ms-3"
                        style={{ zIndex: 5 }}
                      >
                        <MapPin size={18} className="text-muted" />
                      </div>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        required
                        value={formData.location}
                        onChange={handleChange}
                        className="form-control form-control-lg ps-5"
                        placeholder="Enter your location"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          fontSize: '16px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label htmlFor="password" className="form-label fw-medium text-dark mb-2">
                      Password
                    </label>
                    <div className="position-relative">
                      <div 
                        className="position-absolute top-50 translate-middle-y ms-3"
                        style={{ zIndex: 5 }}
                      >
                        <Lock size={18} className="text-muted" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="form-control form-control-lg ps-5 pe-5"
                        placeholder="Create a password"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          fontSize: '16px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn position-absolute top-50 translate-middle-y end-0 me-2 p-1 border-0 bg-transparent"
                        style={{ zIndex: 5 }}
                      >
                        {showPassword ? (
                          <EyeOff size={18} className="text-muted" />
                        ) : (
                          <Eye size={18} className="text-muted" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label fw-medium text-dark mb-2">
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <div 
                        className="position-absolute top-50 translate-middle-y ms-3"
                        style={{ zIndex: 5 }}
                      >
                        <Lock size={18} className="text-muted" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-control form-control-lg ps-5 pe-5"
                        placeholder="Confirm your password"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          fontSize: '16px'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="btn position-absolute top-50 translate-middle-y end-0 me-2 p-1 border-0 bg-transparent"
                        style={{ zIndex: 5 }}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} className="text-muted" />
                        ) : (
                          <Eye size={18} className="text-muted" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-lg w-100 text-white fw-semibold d-flex align-items-center justify-content-center gap-2 mb-4"
                  style={{
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    border: 'none',
                    padding: '12px 24px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {loading ? (
                    <LoadingSpinner size="sm" text="" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="position-relative mb-4">
                <hr className="my-4" style={{ borderColor: '#e5e7eb' }} />
                <div 
                  className="position-absolute top-50 start-50 translate-middle bg-white px-3"
                  style={{ fontSize: '14px', color: '#6b7280' }}
                >
                  Already have an account?
                </div>
              </div>

              <Link
                to="/login"
                className="btn btn-outline-secondary btn-lg w-100 fw-medium text-decoration-none"
                style={{
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  color: '#374151',
                  padding: '12px 24px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.color = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.color = '#374151';
                }}
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
