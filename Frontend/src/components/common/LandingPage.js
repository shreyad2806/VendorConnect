import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Truck, 
  ShoppingCart, 
  CheckCircle, 
  ArrowRight,
  Store,
  Package,
  DollarSign,
  Star,
  PlayCircle
} from 'lucide-react';

const LandingPage = () => {
  const problemSteps = [
    {
      icon: '🛒',
      title: 'Browse Suppliers',
      description: 'Discover verified farmers and wholesalers near you'
    },
    {
      icon: '👥',
      title: 'Join Group Orders',
      description: 'Team up with other vendors for bulk purchasing power'
    },
    {
      icon: '📦',
      title: 'Share Transport',
      description: 'Split delivery costs and reduce transportation expenses'
    },
    {
      icon: '📊',
      title: 'Track & Receive',
      description: 'Monitor your orders and receive quality products on time'
    }
  ];

  const solutionFeatures = [
    {
      icon: '🤝',
      title: 'Group Buying Power',
      description: 'Join forces with other vendors to unlock bulk pricing and reduce costs by 20-30%'
    },
    {
      icon: '🌾',
      title: 'Direct Supplier Access',
      description: 'Connect directly with farmers and wholesalers, cutting out expensive middlemen'
    },
    {
      icon: '🚛',
      title: 'Shared Logistics',
      description: 'Pool transportation costs and reduce delivery expenses through smart route optimization'
    },
    {
      icon: '📈',
      title: 'Better Margins',
      description: 'Increase your profit margins with wholesale prices and reduced operational costs'
    }
  ];

  const benefits = [
    'Save 20-30% on procurement costs',
    'Access to verified suppliers',
    'Real-time order tracking',
    'Flexible payment options',
    'Quality assurance guarantee',
    'Mobile-first experience'
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Vegetable Vendor',
      rating: 5,
      text: "VendorConnect helped me reduce my costs by 25%. Now I can compete with bigger shops!",
      avatar: '👨‍💼'
    }
  ];

  return (
    <div className="min-vh-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero Section */}
      <section 
        className="text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: '1.2' }}>
                Revolutionize Your<br/>
                <span style={{ color: '#ffd700' }}>Street Vendor Business</span>
              </h1>
              <p className="fs-5 mb-5 opacity-90" style={{ lineHeight: '1.6' }}>
                Cut middlemen costs by 20-30%. Access bulk buying power. Share transportation costs. Connect directly with farmers and wholesalers.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
                <Link
                  to="/signup"
                  className="btn btn-light text-primary fw-semibold fs-5 px-4 py-3 d-inline-flex align-items-center justify-content-center"
                  style={{ borderRadius: '12px', minWidth: '200px' }}
                >
                  Start Saving Today
                  <ArrowRight className="ms-2" size={20} />
                </Link>
                <button
                  className="btn btn-outline-light fw-semibold fs-5 px-4 py-3 d-inline-flex align-items-center justify-content-center"
                  style={{ borderRadius: '12px', minWidth: '150px' }}
                >
                  <PlayCircle className="me-2" size={20} />
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row g-4">
                <div className="col-6">
                  <div 
                    className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-4 text-center"
                    style={{ backdropFilter: 'blur(10px)' }}
                  >
                    <div className="display-4 fw-bold text-warning mb-2">20-30%</div>
                    <div className="fs-6 opacity-90">Cost Savings</div>
                  </div>
                </div>
                <div className="col-6">
                  <div 
                    className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-4 text-center"
                    style={{ backdropFilter: 'blur(10px)' }}
                  >
                    <div className="display-4 fw-bold text-warning mb-2">500+</div>
                    <div className="fs-6 opacity-90">Active Vendors</div>
                  </div>
                </div>
                <div className="col-6">
                  <div 
                    className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-4 text-center"
                    style={{ backdropFilter: 'blur(10px)' }}
                  >
                    <div className="display-4 fw-bold text-warning mb-2">100+</div>
                    <div className="fs-6 opacity-90">Suppliers</div>
                  </div>
                </div>
                <div className="col-6">
                  <div 
                    className="bg-white bg-opacity-10 backdrop-blur p-4 rounded-4 text-center"
                    style={{ backdropFilter: 'blur(10px)' }}
                  >
                    <div className="display-4 fw-bold text-warning mb-2">₹50L+</div>
                    <div className="fs-6 opacity-90">Saved Monthly</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-4">
              The Problems Street Vendors Face
            </h2>
            <p className="fs-5 text-muted">
              Traditional supply chains are broken for small vendors
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 text-center">
                <div className="mb-3" style={{ fontSize: '3rem' }}>💰</div>
                <h5 className="fw-bold mb-3">High Middleman Costs</h5>
                <p className="text-muted mb-0">
                  Pay 20-30% extra due to multiple intermediaries between you and the source
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 text-center">
                <div className="mb-3" style={{ fontSize: '3rem' }}>📦</div>
                <h5 className="fw-bold mb-3">No Bulk Buying Power</h5>
                <p className="text-muted mb-0">
                  Can't order in bulk due to limited storage space and working capital
                </p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="bg-white p-4 rounded-4 shadow-sm h-100 text-center">
                <div className="mb-3" style={{ fontSize: '3rem' }}>🚛</div>
                <h5 className="fw-bold mb-3">Expensive Transport</h5>
                <p className="text-muted mb-0">
                  Waste time and money arranging transport for small individual orders
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-4">
              How It Works
            </h2>
            <p className="fs-5 text-muted">
              Simple steps to revolutionize your business
            </p>
          </div>
          
          <div className="row g-4">
            {problemSteps.map((step, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="text-center">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '2rem'
                    }}
                  >
                    {step.icon}
                  </div>
                  <h5 className="fw-bold mb-3">{step.title}</h5>
                  <p className="text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-4">
              Our Solution
            </h2>
            <p className="fs-5 text-muted">
              A comprehensive platform that addresses all your procurement challenges
            </p>
          </div>
          
          <div className="row g-4">
            {solutionFeatures.map((feature, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div className="bg-white p-4 rounded-4 shadow-sm h-100 text-center">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>{feature.icon}</div>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        className="py-5 text-white"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-4">
              What Our Users Say
            </h2>
            <p className="fs-5 opacity-90">
              Real stories from vendors who transformed their businesses
            </p>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white bg-opacity-10 backdrop-blur p-5 rounded-4 text-center">
                <div className="mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-warning me-1" size={24} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="fs-4 fw-light mb-4 fst-italic">
                  "VendorConnect helped me reduce my costs by 25%. Now I can compete with bigger shops!"
                </blockquote>
                <div className="d-flex align-items-center justify-content-center">
                  <div className="me-3" style={{ fontSize: '2.5rem' }}>👨‍💼</div>
                  <div>
                    <div className="fw-bold">Rajesh Kumar</div>
                    <div className="opacity-75">Vegetable Vendor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose VendorConnect */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark mb-4">
              Why Choose VendorConnect?
            </h2>
          </div>
          
          <div className="row g-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="col-md-6">
                <div className="d-flex align-items-center">
                  <CheckCircle className="text-success me-3 flex-shrink-0" size={24} />
                  <span className="fs-5">{benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white p-5 rounded-4 shadow-sm text-center">
                <h3 className="display-6 fw-bold text-dark mb-4">
                  Ready to Transform Your Business?
                </h3>
                <p className="fs-5 text-muted mb-4">
                  Join thousands of vendors who are already saving money and growing their businesses.
                </p>
                <form className="row g-3 justify-content-center">
                  <div className="col-md-6">
                    <input 
                      type="email" 
                      className="form-control form-control-lg" 
                      placeholder="Enter your email"
                      style={{ borderRadius: '12px' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <button 
                      type="submit" 
                      className="btn btn-lg w-100 text-white fw-semibold"
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px',
                        border: 'none'
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        className="py-5 text-white text-center"
        style={{
          background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
        }}
      >
        <div className="container">
          <h2 className="display-5 fw-bold mb-4">
            Start Saving Money Today
          </h2>
          <p className="fs-5 opacity-90 mb-4">
            Join the revolution in B2B procurement. Connect, collaborate, and cut costs.
          </p>
          <Link
            to="/signup"
            className="btn btn-lg text-white fw-semibold px-5 py-3 d-inline-flex align-items-center"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              border: 'none',
              textDecoration: 'none'
            }}
          >
            Get Started Free
            <ArrowRight className="ms-2" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
