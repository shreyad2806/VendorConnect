import React, { useState } from 'react';
import { Search, MapPin, Star, Phone, ShoppingCart, Filter } from 'lucide-react';

const SuppliersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock data for suppliers
  const suppliers = [
    {
      id: 1,
      name: 'Fresh Farms Organic',
      category: 'vegetables',
      rating: 4.8,
      distance: '1.2 km',
      location: 'Sector 15, Noida',
      products: ['Tomatoes', 'Onions', 'Potatoes'],
      minOrder: '₹500',
      deliveryTime: '2-3 days',
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150'
    },
    {
      id: 2,
      name: 'Green Leaf Vegetables',
      category: 'vegetables',
      rating: 4.6,
      distance: '2.5 km',
      location: 'Sector 22, Noida',
      products: ['Spinach', 'Lettuce', 'Cabbage'],
      minOrder: '₹300',
      deliveryTime: '1-2 days',
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150'
    },
    {
      id: 3,
      name: 'Organic Fruits Co.',
      category: 'fruits',
      rating: 4.9,
      distance: '3.1 km',
      location: 'Sector 18, Noida',
      products: ['Apples', 'Bananas', 'Oranges'],
      minOrder: '₹1000',
      deliveryTime: '3-4 days',
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150'
    },
    {
      id: 4,
      name: 'Daily Dairy Products',
      category: 'dairy',
      rating: 4.7,
      distance: '1.8 km',
      location: 'Sector 12, Noida',
      products: ['Milk', 'Butter', 'Cheese'],
      minOrder: '₹200',
      deliveryTime: 'Same day',
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150'
    },
    {
      id: 5,
      name: 'Grain Masters',
      category: 'grains',
      rating: 4.5,
      distance: '4.2 km',
      location: 'Sector 27, Noida',
      products: ['Rice', 'Wheat', 'Lentils'],
      minOrder: '₹800',
      deliveryTime: '4-5 days',
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150'
    },
    {
      id: 6,
      name: 'Spice Bazaar',
      category: 'spices',
      rating: 4.9,
      distance: '0.9 km',
      location: 'Old Market, Noida',
      products: ['Turmeric', 'Cumin', 'Coriander'],
      minOrder: '₹150',
      deliveryTime: 'Same day',
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'grains', name: 'Grains' },
    { id: 'spices', name: 'Spices' }
  ];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         supplier.products.some(product => product.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Search and Filter Section */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <Search className="badge bg-warning text-dark" />
                    </InputGroup.Text>
                    <FormControl
                      type="text"
                      placeholder="Search suppliers or products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </Form.Select>
                  <Button variant="primary" className="ms-2">
                    <MapPin className="me-2" />
                    Near Me
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Suppliers Grid */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {filteredSuppliers.map(supplier => (
          <Col key={supplier.id}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={4}>
                    <img 
                      src={supplier.image} 
                      alt={supplier.name}
                      className="img-fluid rounded"
                    />
                  </Col>
                  <Col xs={8}>
                    <Row>
                      <Col>
                        <h3 className="fs-5 fw-bold">{supplier.name}</h3>
                        <Badge bg="success" className="me-2">{supplier.rating}</Badge>
                        <Star className="me-1" />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="text-muted">
                          <MapPin className="me-1" />
                          {supplier.distance} • {supplier.location}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <h4 className="fs-6 fw-bold">Popular Products</h4>
                    <div className="d-flex flex-wrap gap-2">
                      {supplier.products.slice(0, 3).map((product, index) => (
                        <Badge key={index} bg="primary" className="text-light">{product}</Badge>
                      ))}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <div className="d-flex justify-content-between">
                      <div>
                        <span className="text-muted">Min. Order: </span>
                        <span className="fw-bold">{supplier.minOrder}</span>
                      </div>
                      <div>
                        <span className="text-muted">Delivery: </span>
                        <span className="fw-bold">{supplier.deliveryTime}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <Button variant="primary" className="me-2">
                      <ShoppingCart className="me-2" />
                      Order Now
                    </Button>
                    <Button variant="outline-secondary">
                      <Phone className="me-2" />
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
      {filteredSuppliers.length === 0 && (
        <Row>
          <Col className="text-center py-12">
            <Search className="badge bg-danger text-light" />
            <h3 className="mt-2 fs-6 fw-bold text-muted">No suppliers found</h3>
            <p className="mt-1 text-muted">Try adjusting your search or filter criteria</p>
          </Col>
        </Row>
      )}
      </div>
    </div>
  );
};

export default SuppliersList;
