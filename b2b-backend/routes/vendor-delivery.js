const express = require('express');
const router = express.Router();
const { Delivery, Vehicle, VendorGroupOrder, VendorProduct } = require('../models/vendor-index');
const { authenticateToken } = require('../config/middlewares/authenticateToken');
const jwt = require('jsonwebtoken');

// Middleware to get user ID from token
const getUserId = (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    return decoded.id;
  } catch (error) {
    return null;
  }
};

// Get all deliveries
router.get('/', async (req, res) => {
  try {
    const { status, date, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (date) filter.delivery_date = date;
    
    const offset = (page - 1) * limit;
    
    const deliveries = await Delivery.findAndCountAll({
      where: filter,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['delivery_date', 'DESC']],
      include: [
        {
          model: VendorGroupOrder,
          as: 'groupOrder',
          include: [
            {
              model: VendorProduct,
              as: 'product'
            }
          ]
        },
        {
          model: Vehicle,
          as: 'vehicle'
        }
      ]
    });
    
    res.status(200).json({
      totalItems: deliveries.count,
      totalPages: Math.ceil(deliveries.count / limit),
      currentPage: parseInt(page),
      deliveries: deliveries.rows
    });
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get delivery by ID
router.get('/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id, {
      include: [
        {
          model: VendorGroupOrder,
          as: 'groupOrder',
          include: [
            {
              model: VendorProduct,
              as: 'product'
            }
          ]
        },
        {
          model: Vehicle,
          as: 'vehicle'
        }
      ]
    });
    
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    
    res.status(200).json(delivery);
  } catch (error) {
    console.error('Error fetching delivery:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get all vehicles
router.get('/vehicles/all', async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      order: [['type', 'ASC']]
    });
    
    res.status(200).json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update delivery status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['scheduled', 'in_transit', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const delivery = await Delivery.findByPk(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }
    
    await delivery.update({ status });
    
    // If status is delivered, update group order status to complete
    if (status === 'delivered') {
      const groupOrder = await VendorGroupOrder.findByPk(delivery.group_order_id);
      if (groupOrder) {
        await groupOrder.update({ order_status: 'complete' });
      }
    }
    
    res.status(200).json({
      message: 'Delivery status updated successfully',
      delivery
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Create a new delivery for a group order
router.post('/group-order/:id', authenticateToken, async (req, res) => {
  try {
    const groupOrderId = req.params.id;
    const { vehicle_id, delivery_date } = req.body;
    
    // Check if group order exists
    const groupOrder = await VendorGroupOrder.findByPk(groupOrderId);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }
    
    // Check if vehicle exists
    const vehicle = await Vehicle.findByPk(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Check if delivery already exists for this group order
    const existingDelivery = await Delivery.findOne({
      where: { group_order_id: groupOrderId }
    });
    
    if (existingDelivery) {
      return res.status(400).json({ message: 'Delivery already exists for this group order' });
    }
    
    // Create delivery
    const delivery = await Delivery.create({
      group_order_id: groupOrderId,
      vehicle_id,
      delivery_date,
      status: 'scheduled',
      tracking_link: `https://vendorconnect.com/track/${groupOrderId}`
    });
    
    // Update group order status to dispatched
    await groupOrder.update({ order_status: 'dispatched' });
    
    res.status(201).json({
      message: 'Delivery created successfully',
      delivery
    });
  } catch (error) {
    console.error('Error creating delivery:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router; 