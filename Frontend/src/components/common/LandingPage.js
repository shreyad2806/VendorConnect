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
  DollarSign
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: 'Group Buying Power',
      description: 'Join forces with other vendors to unlock bulk pricing and reduce costs by 20-30%'
    },
    {
      icon: Store,
      title: 'Direct Supplier Access',
      description: 'Connect directly with farmers and wholesalers, cutting out expensive middlemen'
    },
    {
      icon: Truck,
      title: 'Shared Logistics',
      description: 'Pool transportation costs and reduce delivery expenses through smart route optimization'
    },
    {
      icon: TrendingUp,
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

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="bg-primary text-white">
        <div className="container py-5">
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-4 mb-md-5">
              Revolutionize Your
              <span className="block text-primary-200">Street Vendor Business</span>
            </h1>
            <p className="lead mb-4 mb-md-5 mx-auto">
              Cut middlemen costs by 20-30%. Access bulk buying power. Share transportation costs. 
              Connect directly with farmers and wholesalers.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link
                to="/signup"
                className="btn btn-light text-primary fw-semibold fs-5 d-inline-flex align-items-center justify-content-center px-4 py-2"
              >
                Start Saving Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="btn btn-outline-light fw-semibold fs-5 px-4 py-2"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Problems Street Vendors Face
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional supply chains are broken for small vendors
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">High Middleman Costs</h3>
              <p className="text-gray-600">
                Pay 20-30% extra due to multiple intermediaries between you and the source
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">No Bulk Buying Power</h3>
              <p className="text-gray-600">
                Can't order in bulk due to limited storage space and working capital
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-soft">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expensive Transport</h3>
              <p className="text-gray-600">
                Waste time and money arranging transport for small individual orders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform that addresses all your procurement challenges
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose VendorConnect?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-success-600 mr-3 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-large">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Ready to Transform Your Business?</h3>
              <p className="text-gray-600 mb-6">
                Join thousands of vendors who are already saving money and growing their businesses with VendorConnect.
              </p>
              <div className="space-y-4">
                <Link
                  to="/signup"
                  className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Join as Vendor
                </Link>
                <Link
                  to="/signup"
                  className="w-full border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <Store className="w-5 h-5 mr-2" />
                  Join as Supplier
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Saving Money Today
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the revolution in B2B procurement. Connect, collaborate, and cut costs.
          </p>
          <Link
            to="/signup"
            className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors inline-flex items-center"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
