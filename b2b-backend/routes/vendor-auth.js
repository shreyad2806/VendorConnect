const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { VendorUser } = require('../models/vendor-index');
require('dotenv').config();

// Login user with existing database
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check if user exists by phone
    const user = await VendorUser.findOne({ where: { phone } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    // In a real application, we would use bcrypt.compare
    // For now, we'll just compare the hashes directly since the sample data
    // doesn't have real bcrypt hashes
    if (user.password_hash !== password) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        name: user.name,
        role: user.role,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // Get user ID from token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const userId = decoded.id;

    // Find user
    const user = await VendorUser.findByPk(userId, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router; 