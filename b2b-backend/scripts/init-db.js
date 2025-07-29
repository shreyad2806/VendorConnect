const { sequelize } = require('../config/database');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const GroupOrder = require('../models/GroupOrder');
const GroupOrderItem = require('../models/GroupOrderItem');
const Transport = require('../models/Transport');
const TransportParticipant = require('../models/TransportParticipant');

// Sample data
const users = [
  {
    name: 'Vendor User',
    email: 'vendor@example.com',
    password: 'password123',
    phone: '1234567890',
    address: '123 Vendor St',
    city: 'Vendor City',
    state: 'VS',
    pincode: '12345',
    role: 'vendor',
    businessName: 'Vendor Business',
    businessType: 'Retail',
    isVerified: true,
    latitude: 28.6139,
    longitude: 77.2090
  },
  {
    name: 'Supplier User',
    email: 'supplier@example.com',
    password: 'password123',
    phone: '0987654321',
    address: '456 Supplier St',
    city: 'Supplier City',
    state: 'SS',
    pincode: '54321',
    role: 'supplier',
    businessName: 'Supplier Business',
    businessType: 'Wholesale',
    isVerified: true,
    latitude: 28.7041,
    longitude: 77.1025
  }
];

const products = [
  {
    name: 'Tomatoes',
    description: 'Fresh tomatoes',
    category: 'Vegetable',
    subCategory: 'Fresh Produce',
    unit: 'kg',
    minOrderQuantity: 5,
    price: 40.00,
    discountedPrice: 35.00,
    stock: 100,
    images: JSON.stringify(['tomato.jpg']),
    isAvailable: true,
    supplierId: 2,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 10
  },
  {
    name: 'Potatoes',
    description: 'Fresh potatoes',
    category: 'Vegetable',
    subCategory: 'Root Vegetables',
    unit: 'kg',
    minOrderQuantity: 10,
    price: 25.00,
    discountedPrice: 20.00,
    stock: 200,
    images: JSON.stringify(['potato.jpg']),
    isAvailable: true,
    supplierId: 2,
    isFeatured: false,
    rating: 4.2,
    reviewCount: 8
  }
];

// Initialize database
async function initDb() {
  try {
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    
    // Create users
    const createdUsers = await User.bulkCreate(users);
    console.log(`Created ${createdUsers.length} users`);
    
    // Create products
    const createdProducts = await Product.bulkCreate(products);
    console.log(`Created ${createdProducts.length} products`);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the initialization
initDb(); 