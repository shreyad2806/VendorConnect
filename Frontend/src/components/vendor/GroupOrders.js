import React, { useState } from 'react';
import { Plus, Users, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';

const GroupOrders = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for group orders
  const availableOrders = [
    {
      id: 1,
      productName: 'Fresh Tomatoes',
      supplier: 'Green Farms Co.',
      category: 'Vegetables',
      minOrder: '₹500',
      currentOrders: 8,
      maxOrders: 15,
      deadline: '2023-06-20 18:00',
      discount: '15%',
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150'
    },
    {
      id: 2,
      productName: 'Organic Apples',
      supplier: 'Fruit Valley',
      category: 'Fruits',
      minOrder: '₹800',
      currentOrders: 12,
      maxOrders: 20,
      deadline: '2023-06-21 15:00',
      discount: '20%',
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150'
    },
    {
      id: 3,
      productName: 'Premium Rice',
      supplier: 'Grain Masters',
      category: 'Grains',
      minOrder: '₹1200',
      currentOrders: 5,
      maxOrders: 10,
      deadline: '2023-06-22 12:00',
      discount: '18%',
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150'
    }
  ];

  const myOrders = [
    {
      id: 101,
      productName: 'Fresh Tomatoes',
      supplier: 'Green Farms Co.',
      quantity: '10kg',
      price: '₹450',
      status: 'confirmed',
      groupSize: 15,
      joined: 12,
      deliveryDate: '2023-06-25'
    },
    {
      id: 102,
      productName: 'Organic Milk',
      supplier: 'Daily Dairy',
      quantity: '20L',
      price: '₹300',
      status: 'pending',
      groupSize: 10,
      joined: 7,
      deliveryDate: '2023-06-23'
    }
  ];

  const pastOrders = [
    {
      id: 201,
      productName: 'Potatoes',
      supplier: 'Farm Fresh',
      quantity: '15kg',
      price: '₹250',
      discount: '12%',
      deliveryDate: '2023-06-10',
      savings: '₹35'
    },
    {
      id: 202,
      productName: 'Bananas',
      supplier: 'Tropical Fruits',
      quantity: '12kg',
      price: '₹400',
      discount: '18%',
      deliveryDate: '2023-06-05',
      savings: '₹90'
    }
  ];

  const filteredAvailableOrders = availableOrders.filter(order => 
    order.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Group Orders</h1>
            <p className="mt-1 text-gray-600">Join or create bulk orders to save money</p>
          </div>
          <button className="mt-4 md:mt-0 btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Group Order
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('available')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'available' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Available Groups
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'my' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              My Orders
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'past' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Past Orders
            </button>
          </nav>
        </div>

        {/* Search Bar */}
        {activeTab === 'available' && (
  <div className="mb-6">
    <Form className="d-flex" onSubmit={e => e.preventDefault()}>
      <FormControl
        type="search"
        placeholder="Search group orders..."
        className="me-2"
        aria-label="Search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Button variant="outline-success">Search</Button>
    </Form>
  </div>
) }


      {activeTab === 'available' && (
        <Row className="mt-4">
          {filteredAvailableOrders.length > 0 ? (
            filteredAvailableOrders.map(order => (
              <div key={order.id} className="col-md-4 mb-4">
                <Card>
                  <Card.Img variant="top" src={order.image} />
                  <Card.Body>
                    <Card.Title>{order.productName}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{order.supplier}</Card.Subtitle>
                    <Card.Text>
                      <Badge bg="success" className="me-2">{order.discount} OFF</Badge>
                      <Badge bg="primary" className="me-2">{order.category}</Badge>
                    </Card.Text>
                    <Card.Text>
                      <Row>
                        <Col xs={6}>
                          <p className="text-muted">Min. Order</p>
                          <p>{order.minOrder}</p>
                        </Col>
                        <Col xs={6}>
                          <p className="text-muted">Deadline</p>
                          <p>{order.deadline}</p>
                        </Col>
                      </Row>
                    </Card.Text>
                    <Card.Text>
                      <Row>
                        <Col xs={6}>
                          <p className="text-muted">Group Progress</p>
                          <p>{order.currentOrders}/{order.maxOrders}</p>
                        </Col>
                        <Col xs={6}>
                          <div className="progress">
                            <div className="progress-bar bg-success" role="progressbar" style={{ width: `${(order.currentOrders / order.maxOrders) * 100}%` }} aria-valuenow={(order.currentOrders / order.maxOrders) * 100} aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Text>
                    <Button variant="primary">Join Group</Button>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <div className="col-md-12 text-center">
              <h2>No group orders found</h2>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </Row>
      )}

      {activeTab === 'my' && (
        <Table responsive>
          <thead>
            <tr>
              <th>Order</th>
              <th>Supplier</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Group</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map(order => (
              <tr key={order.id}>
                <td>{order.productName}</td>
                <td>{order.supplier}</td>
                <td>{order.quantity}</td>
                <td>{order.price}</td>
                <td>
                  <Badge bg={order.status === 'confirmed' ? 'success' : 'warning'} className="me-2">
                    {order.status === 'confirmed' ? (
                      <>
                        <CheckCircle className="me-1" />
                        Confirmed
                      </>
                    ) : (
                      <>
                        <Clock className="me-1" />
                        Pending
                      </>
                    )}
                  </Badge>
                </td>
                <td>
                  <Badge bg="primary" className="me-2">{order.joined}/{order.groupSize}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {activeTab === 'past' && (
        <Table responsive>
          <thead>
            <tr>
              <th>Order</th>
              <th>Supplier</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Savings</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {pastOrders.map(order => (
              <tr key={order.id}>
                <td>{order.productName}</td>
                <td>{order.supplier}</td>
                <td>{order.quantity}</td>
                <td>{order.price}</td>
                <td>
                  <Badge bg="success" className="me-2">{order.discount}</Badge>
                </td>
                <td>
                  <Badge bg="success" className="me-2">{order.savings}</Badge>
                </td>
                <td>{order.deliveryDate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      </div>
    </div>
  );
};

export default GroupOrders;
