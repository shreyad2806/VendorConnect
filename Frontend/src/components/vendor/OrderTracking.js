import React, { useState } from 'react';
import { Search, Truck, MapPin, Clock, CheckCircle, XCircle, Package, User } from 'lucide-react';

const OrderTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Mock data for orders
  const orders = [
    {
      id: '#VC-1001',
      productName: 'Fresh Tomatoes',
      supplier: 'Green Farms Co.',
      quantity: '20kg',
      price: '₹450',
      status: 'delivered',
      orderDate: '2023-06-15',
      deliveryDate: '2023-06-17',
      trackingSteps: [
        { id: 1, status: 'Order Placed', date: '2023-06-15 10:30', completed: true },
        { id: 2, status: 'Confirmed', date: '2023-06-15 14:15', completed: true },
        { id: 3, status: 'Processing', date: '2023-06-16 09:00', completed: true },
        { id: 4, status: 'Shipped', date: '2023-06-16 15:30', completed: true },
        { id: 5, status: 'Out for Delivery', date: '2023-06-17 08:45', completed: true },
        { id: 6, status: 'Delivered', date: '2023-06-17 12:20', completed: true }
      ]
    },
    {
      id: '#VC-1002',
      productName: 'Organic Apples',
      supplier: 'Fruit Valley',
      quantity: '15kg',
      price: '₹600',
      status: 'in-transit',
      orderDate: '2023-06-16',
      deliveryDate: '2023-06-19',
      trackingSteps: [
        { id: 1, status: 'Order Placed', date: '2023-06-16 11:20', completed: true },
        { id: 2, status: 'Confirmed', date: '2023-06-16 15:45', completed: true },
        { id: 3, status: 'Processing', date: '2023-06-17 10:30', completed: true },
        { id: 4, status: 'Shipped', date: '2023-06-18 14:15', completed: true },
        { id: 5, status: 'Out for Delivery', date: '2023-06-19 09:00', completed: false },
        { id: 6, status: 'Delivered', date: '', completed: false }
      ]
    },
    {
      id: '#VC-1003',
      productName: 'Premium Rice',
      supplier: 'Grain Masters',
      quantity: '25kg',
      price: '₹800',
      status: 'processing',
      orderDate: '2023-06-17',
      deliveryDate: '2023-06-21',
      trackingSteps: [
        { id: 1, status: 'Order Placed', date: '2023-06-17 14:30', completed: true },
        { id: 2, status: 'Confirmed', date: '2023-06-17 16:45', completed: true },
        { id: 3, status: 'Processing', date: '2023-06-18 11:00', completed: false },
        { id: 4, status: 'Shipped', date: '', completed: false },
        { id: 5, status: 'Out for Delivery', date: '', completed: false },
        { id: 6, status: 'Delivered', date: '', completed: false }
      ]
    }
  ];

  const statusOptions = [
    { id: 'all', name: 'All Orders' },
    { id: 'processing', name: 'Processing' },
    { id: 'in-transit', name: 'In Transit' },
    { id: 'delivered', name: 'Delivered' }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-success-100 text-success-800';
      case 'in-transit': return 'bg-primary-100 text-primary-800';
      case 'processing': return 'bg-warning-100 text-warning-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'in-transit': return Truck;
      case 'processing': return Clock;
      default: return Package;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
          <p className="mt-1 text-gray-600">Track your orders from placement to delivery</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-soft rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="input pl-10 w-full"
                  placeholder="Search by order ID, product, or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <select
                className="input"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-soft overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-900">{order.productName}</h3>
                          <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {order.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 mr-1" />
                            <span>{order.supplier}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                            <Package className="h-4 w-4 mr-1" />
                            <span>{order.quantity}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900 mt-1 sm:mt-0">
                            {order.price}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-sm text-gray-500">
                        <div>Order ID: {order.id}</div>
                        <div>Ordered: {order.orderDate}</div>
                      </div>
                    </div>
                    
                    {/* Tracking Progress */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Tracking Progress</h4>
                      <div className="relative">
                        {/* Progress line */}
                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200"></div>
                        
                        {/* Steps */}
                        <div className="space-y-4 pl-10">
                          {order.trackingSteps.map((step, index) => {
                            const isCompleted = step.completed;
                            const isLast = index === order.trackingSteps.length - 1;
                            
                            return (
                              <div key={step.id} className="relative">
                                {/* Icon */}
                                <div className={`absolute -left-10 flex items-center justify-center h-8 w-8 rounded-full 
                                  ${isCompleted ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                  {isCompleted ? (
                                    <CheckCircle className="h-5 w-5" />
                                  ) : (
                                    <div className="h-2 w-2 rounded-full bg-current"></div>
                                  )}
                                </div>
                                
                                {/* Step info */}
                                <div>
                                  <p className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {step.status}
                                  </p>
                                  {step.date && (
                                    <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Delivery Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Delivery expected by {order.deliveryDate}</span>
                      </div>
                      <button className="mt-3 sm:mt-0 btn-outline text-sm">
                        Contact Supplier
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-soft p-12 text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
