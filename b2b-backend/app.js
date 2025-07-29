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

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Original routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/group-orders', groupOrderRoutes);
app.use('/api/transports', transportRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to VendorConnect API' });
});

// Initialize database and start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await testConnection();
    
    // Start server without syncing models (we already initialized the database)
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
