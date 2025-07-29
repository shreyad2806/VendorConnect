import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  Truck,
  MapPin,
  Calendar
} from 'lucide-react';

const VendorDashboard = () => {
  // Mock data for dashboard
  const stats = [
    { name: 'Total Orders', value: '24', icon: ShoppingCart, change: '+12%' },
    { name: 'Active Group Orders', value: '3', icon: Users, change: '+2' },
    { name: 'Savings This Month', value: '₹2,450', icon: TrendingUp, change: '+18%' },
    { name: 'Suppliers Connected', value: '12', icon: Store, change: '+3' }
  ];

  const recentOrders = [
    { id: '#VC-1001', supplier: 'Fresh Farms', product: 'Tomatoes', quantity: '20kg', status: 'Delivered', date: '2023-06-15' },
    { id: '#VC-1002', supplier: 'Organic Veggies', product: 'Onions', quantity: '15kg', status: 'In Transit', date: '2023-06-16' },
    { id: '#VC-1003', supplier: 'Green Leaf', product: 'Spinach', quantity: '10kg', status: 'Processing', date: '2023-06-17' }
  ];

  const quickActions = [
    { name: 'Find Suppliers', icon: MapPin, path: '/suppliers' },
    { name: 'Create Group Order', icon: Users, path: '/group-orders' },
    { name: 'Track Orders', icon: Truck, path: '/orders' },
    { name: 'View Products', icon: Package, path: '/suppliers' }
  ];

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container-fluid">
        <div className="mb-4">
          <h1 className="fs-2 fw-bold text-dark">Dashboard</h1>
          <p className="text-muted mt-1">Welcome back! Here's what's happening with your business today.</p>
        </div>

        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-12 col-sm-6 col-lg-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="text-muted" size={24} />
                    </div>
                    <div className="ms-3 flex-fill">
                      <dl className="mb-0">
                        <dt className="small fw-medium text-muted text-truncate">{stat.name}</dt>
                        <dd className="d-flex align-items-baseline mb-0">
                          <div className="fs-4 fw-semibold text-dark">{stat.value}</div>
                          <div className="ms-2 small fw-semibold text-success">
                            {stat.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

        <div className="row g-4">
          {/* Quick Actions */}
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h2 className="fs-5 fw-medium text-dark mb-3">Quick Actions</h2>
                <div className="row g-3">
                  {quickActions.map((action, index) => (
                    <div key={index} className="col-6">
                      <Link
                        to={action.path}
                        className="d-flex flex-column align-items-center justify-content-center p-3 bg-light rounded text-decoration-none border border-secondary-subtle"
                        style={{
                          transition: 'all 0.15s ease-in-out',
                          ':hover': { backgroundColor: '#e3f2fd', borderColor: '#1976d2' }
                        }}
                      >
                        <action.icon className="text-primary mb-2" size={24} />
                        <span className="small fw-medium text-muted">{action.name}</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Group Orders */}
            <div className="card shadow-sm mt-4">
              <div className="card-body p-4">
                <h2 className="fs-5 fw-medium text-dark mb-3">Upcoming Group Orders</h2>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-between p-3 bg-primary-subtle rounded border border-primary-subtle">
                    <div>
                      <p className="small fw-medium text-dark mb-1">Vegetable Bulk Order</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>Today, 5:00 PM</p>
                    </div>
                    <span className="badge bg-success rounded-pill">
                      8/10 joined
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between p-3 bg-warning-subtle rounded border border-warning-subtle">
                    <div>
                      <p className="small fw-medium text-dark mb-1">Fruit Supplier Deal</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>Tomorrow, 10:00 AM</p>
                    </div>
                    <span className="badge bg-warning rounded-pill">
                      5/15 joined
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h2 className="fs-5 fw-medium text-dark">Recent Orders</h2>
                  <Link to="/orders" className="small fw-medium text-primary text-decoration-none">
                    View all
                  </Link>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="small fw-medium text-muted text-uppercase">
                          Order
                        </th>
                        <th scope="col" className="small fw-medium text-muted text-uppercase">
                          Supplier
                        </th>
                        <th scope="col" className="small fw-medium text-muted text-uppercase">
                          Product
                        </th>
                        <th scope="col" className="small fw-medium text-muted text-uppercase">
                          Status
                        </th>
                        <th scope="col" className="small fw-medium text-muted text-uppercase">
                          Date
                        </th>
                      </tr>
                    </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="fw-semibold text-dark">{order.id}</td>
                        <td className="text-muted">{order.supplier}</td>
                        <td className="text-muted">{order.product} ({order.quantity})</td>
                        <td>
                          <span className={`badge rounded-pill ${order.status === 'Delivered' ? 'bg-success' : order.status === 'In Transit' ? 'bg-primary' : 'bg-warning'}`}>{order.status}</span>
                        </td>
                        <td className="text-muted">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Savings Insight */}
            <div className="bg-primary bg-gradient rounded p-4 mt-4 text-white">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <TrendingUp size={32} className="text-info" />
                </div>
                <div className="ms-3">
                  <h3 className="fs-6 fw-medium mb-1">You've saved ₹2,450 this month!</h3>
                  <p className="mb-0 text-white-50" style={{ fontSize: '0.9rem' }}>That's 24% more than last month. Keep grouping orders to maximize savings.</p>
                </div>
              </div>
              <div className="mt-3">
                <Link to="/group-orders" className="btn btn-light btn-sm d-inline-flex align-items-center">
                  Create Group Order
                  <Users size={16} className="ms-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
