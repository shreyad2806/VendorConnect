import React, { useState } from 'react';
import { Search, Filter, CheckCircle, Clock, Truck, XCircle, Eye } from 'lucide-react';

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  
  // Mock data for orders
  const orders = [
    {
      id: '#SC-2001',
      product: 'Fresh Tomatoes',
      customer: 'Rajesh Kumar',
      quantity: '20kg',
      price: '₹500',
      status: 'processing',
      orderDate: '2023-06-18',
      deliveryDate: '2023-06-20',
      customerContact: '+91 98765 43210',
      deliveryAddress: 'Shop 12, Main Market, Sector 15, Noida'
    },
    {
      id: '#SC-2002',
      product: 'Organic Apples',
      customer: 'Priya Sharma',
      quantity: '15kg',
      price: '₹1200',
      status: 'shipped',
      orderDate: '2023-06-17',
      deliveryDate: '2023-06-19',
      customerContact: '+91 98765 43211',
      deliveryAddress: 'Stall 5, Fruit Market, Sector 22, Noida'
    },
    {
      id: '#SC-2003',
      product: 'Premium Rice',
      customer: 'Vikram Singh',
      quantity: '25kg',
      price: '₹1125',
      status: 'delivered',
      orderDate: '2023-06-16',
      deliveryDate: '2023-06-18',
      customerContact: '+91 98765 43212',
      deliveryAddress: 'Grocery Store, Near Metro Station, Sector 18, Noida'
    },
    {
      id: '#SC-2004',
      product: 'Fresh Spinach',
      customer: 'Anita Desai',
      quantity: '10kg',
      price: '₹300',
      status: 'pending',
      orderDate: '2023-06-18',
      deliveryDate: '2023-06-21',
      customerContact: '+91 98765 43213',
      deliveryAddress: 'Vegetable Stall, Local Market, Sector 12, Noida'
    }
  ];

  const statusOptions = [
    { id: 'all', name: 'All Statuses' },
    { id: 'pending', name: 'Pending' },
    { id: 'processing', name: 'Processing' },
    { id: 'shipped', name: 'Shipped' },
    { id: 'delivered', name: 'Delivered' }
  ];

  const timeframeOptions = [
    { id: 'all', name: 'All Time' },
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    // In a real app, you would filter by timeframe as well
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-success-100 text-success-800';
      case 'shipped': return 'bg-primary-100 text-primary-800';
      case 'processing': return 'bg-warning-100 text-warning-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    // In a real app, this would make an API call
    console.log(`Updating order ${orderId} to status ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="mt-1 text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-soft rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="input pl-10 w-full"
                  placeholder="Search by order ID, product, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="input w-full"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <select
                className="input w-full"
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              >
                {timeframeOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow-soft rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.product}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.customer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.quantity}
                        </td>
                        <td className="px-3 py-2 fw-medium text-dark">
                          {order.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.orderDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                      No orders found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Order Details Modal would go here in a real implementation */}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white shadow-soft rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-soft rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-warning-100 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Processing</h3>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-soft rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Shipped</h3>
                <p className="text-2xl font-semibold text-gray-900">5</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-soft rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-success-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
                <p className="text-2xl font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
