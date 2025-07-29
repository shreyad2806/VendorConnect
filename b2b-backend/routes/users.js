const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { authenticateToken, authorizeRole } = require('../config/middlewares/authenticateToken');

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const {
      name,
      phone,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      businessName,
      businessType
    } = req.body;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update({
      name,
      phone,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      businessName,
      businessType
    });
    
    // Return updated user without password
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isPasswordValid = await user.isValidPassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get nearby suppliers (for vendors)
router.get('/nearby-suppliers', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  try {
    const { latitude, longitude, radius = 50, page = 1, limit = 10 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Find suppliers within the specified radius
    // This is a simplified approach - for production, use a spatial database or more accurate calculation
    const maxLatDiff = parseFloat(radius) / 111.32; // 1 degree lat = 111.32 km
    const maxLonDiff = parseFloat(radius) / (111.32 * Math.cos(parseFloat(latitude) * Math.PI / 180));
    
    const suppliers = await User.findAndCountAll({
      where: {
        role: 'supplier',
        isVerified: true,
        latitude: { 
          [User.sequelize.Op.between]: [
            parseFloat(latitude) - maxLatDiff, 
            parseFloat(latitude) + maxLatDiff
          ] 
        },
        longitude: { 
          [User.sequelize.Op.between]: [
            parseFloat(longitude) - maxLonDiff, 
            parseFloat(longitude) + maxLonDiff
          ] 
        }
      },
      attributes: { 
        exclude: ['password'],
        include: [
          [
            User.sequelize.literal(`
              6371 * acos(
                cos(radians(${parseFloat(latitude)})) * 
                cos(radians(latitude)) * 
                cos(radians(longitude) - radians(${parseFloat(longitude)})) + 
                sin(radians(${parseFloat(latitude)})) * 
                sin(radians(latitude))
              )
            `),
            'distance'
          ]
        ]
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[User.sequelize.literal('distance'), 'ASC']]
    });
    
    // Filter suppliers that are actually within the radius
    const filteredSuppliers = suppliers.rows.filter(supplier => {
      return supplier.getDataValue('distance') <= parseFloat(radius);
    });
    
    res.status(200).json({
      totalItems: filteredSuppliers.length,
      totalPages: Math.ceil(filteredSuppliers.length / limit),
      currentPage: parseInt(page),
      suppliers: filteredSuppliers
    });
  } catch (error) {
    console.error('Error fetching nearby suppliers:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get nearby vendors (for suppliers)
router.get('/nearby-vendors', authenticateToken, authorizeRole(['supplier']), async (req, res) => {
  try {
    const { latitude, longitude, radius = 50, page = 1, limit = 10 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Find vendors within the specified radius
    // This is a simplified approach - for production, use a spatial database or more accurate calculation
    const maxLatDiff = parseFloat(radius) / 111.32; // 1 degree lat = 111.32 km
    const maxLonDiff = parseFloat(radius) / (111.32 * Math.cos(parseFloat(latitude) * Math.PI / 180));
    
    const vendors = await User.findAndCountAll({
      where: {
        role: 'vendor',
        latitude: { 
          [User.sequelize.Op.between]: [
            parseFloat(latitude) - maxLatDiff, 
            parseFloat(latitude) + maxLatDiff
          ] 
        },
        longitude: { 
          [User.sequelize.Op.between]: [
            parseFloat(longitude) - maxLonDiff, 
            parseFloat(longitude) + maxLonDiff
          ] 
        }
      },
      attributes: { 
        exclude: ['password'],
        include: [
          [
            User.sequelize.literal(`
              6371 * acos(
                cos(radians(${parseFloat(latitude)})) * 
                cos(radians(latitude)) * 
                cos(radians(longitude) - radians(${parseFloat(longitude)})) + 
                sin(radians(${parseFloat(latitude)})) * 
                sin(radians(latitude))
              )
            `),
            'distance'
          ]
        ]
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [[User.sequelize.literal('distance'), 'ASC']]
    });
    
    // Filter vendors that are actually within the radius
    const filteredVendors = vendors.rows.filter(vendor => {
      return vendor.getDataValue('distance') <= parseFloat(radius);
    });
    
    res.status(200).json({
      totalItems: filteredVendors.length,
      totalPages: Math.ceil(filteredVendors.length / limit),
      currentPage: parseInt(page),
      vendors: filteredVendors
    });
  } catch (error) {
    console.error('Error fetching nearby vendors:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router; 