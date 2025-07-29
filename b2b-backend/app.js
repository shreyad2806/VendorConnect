const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import database
const { sequelize, testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/order');
const groupOrderRoutes = require('./routes/groupOrder');
const transportRoutes = require('./routes/transport');
const vendorAuthRoutes = require('./routes/vendor-auth');
const vendorProductRoutes = require('./routes/vendor-products');
const vendorGroupOrderRoutes = require('./routes/vendor-group-orders');
const vendorDeliveryRoutes = require('./routes/vendor-delivery');

// Initialize app
const app = express();

// CORS configuration for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/group-orders', groupOrderRoutes);
app.use('/api/transports', transportRoutes);

// Vendor-specific routes
app.use('/api/vendor/auth', vendorAuthRoutes);
app.use('/api/vendor/products', vendorProductRoutes);
app.use('/api/vendor/group-orders', vendorGroupOrderRoutes);
app.use('/api/vendor/delivery', vendorDeliveryRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to VendorConnect API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      groupOrders: '/api/group-orders',
      transports: '/api/transports',
      vendorAuth: '/api/vendor/auth',
      vendorProducts: '/api/vendor/products',
      vendorGroupOrders: '/api/vendor/group-orders',
      vendorDelivery: '/api/vendor/delivery'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Initialize database and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
