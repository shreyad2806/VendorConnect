const express = require('express');
const router = express.Router();
const { GroupOrder, GroupOrderItem, Product, User } = require('../models');
const { authenticateToken, authorizeRole } = require('../config/middlewares/authenticateToken');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Get nearby group orders
router.get('/nearby', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  try {
    const { latitude, longitude, radius = 5, page = 1, limit = 10 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    // Find open group orders within the specified radius
    // This is a simplified approach - for production, use a spatial database or more accurate calculation
    const maxLatDiff = parseFloat(radius) / 111.32; // 1 degree lat = 111.32 km
    const maxLonDiff = parseFloat(radius) / (111.32 * Math.cos(parseFloat(latitude) * Math.PI / 180));
    
    const groupOrders = await GroupOrder.findAndCountAll({
      where: {
        status: 'open',
        deadline: { [Op.gt]: new Date() },
        latitude: { [Op.between]: [parseFloat(latitude) - maxLatDiff, parseFloat(latitude) + maxLatDiff] },
        longitude: { [Op.between]: [parseFloat(longitude) - maxLonDiff, parseFloat(longitude) + maxLonDiff] }
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['deadline', 'ASC']],
      include: [
        {
          model: User,
          as: 'initiator',
          attributes: ['id', 'name', 'businessName']
        },
        {
          model: GroupOrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            },
            {
              model: User,
              as: 'supplier',
              attributes: ['id', 'name', 'businessName']
            }
          ]
        }
      ]
    });
    
    // Filter out group orders that are actually too far
    // This is a more accurate distance calculation
    const filteredOrders = groupOrders.rows.filter(order => {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        order.latitude,
        order.longitude
      );
      
      return distance <= parseFloat(radius);
    });
    
    res.status(200).json({
      totalItems: filteredOrders.length,
      totalPages: Math.ceil(filteredOrders.length / limit),
      currentPage: parseInt(page),
      groupOrders: filteredOrders
    });
  } catch (error) {
    console.error('Error fetching nearby group orders:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get all group orders initiated by the user
router.get('/my-initiated', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {
      initiatorId: req.user.id
    };
    
    if (status) {
      filter.status = status;
    }
    
    const groupOrders = await GroupOrder.findAndCountAll({
      where: filter,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: GroupOrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            },
            {
              model: User,
              as: 'supplier',
              attributes: ['id', 'name', 'businessName']
            }
          ]
        }
      ]
    });
    
    res.status(200).json({
      totalItems: groupOrders.count,
      totalPages: Math.ceil(groupOrders.count / limit),
      currentPage: parseInt(page),
      groupOrders: groupOrders.rows
    });
  } catch (error) {
    console.error('Error fetching initiated group orders:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get group order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const groupOrderId = req.params.id;
    
    const groupOrder = await GroupOrder.findByPk(groupOrderId, {
      include: [
        {
          model: User,
          as: 'initiator',
          attributes: ['id', 'name', 'businessName', 'phone']
        },
        {
          model: GroupOrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            },
            {
              model: User,
              as: 'supplier',
              attributes: ['id', 'name', 'businessName']
            }
          ]
        }
      ]
    });
    
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }
    
    res.status(200).json(groupOrder);
  } catch (error) {
    console.error('Error fetching group order:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Create a new group order (vendors only)
router.post('/', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      name,
      description,
      items,
      minParticipants,
      maxParticipants,
      targetAmount,
      discountRate,
      deadline,
      deliveryDate,
      locationRadius,
      latitude,
      longitude
    } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Group order must contain at least one item' });
    }
    
    // Create group order
    const groupOrder = await GroupOrder.create({
      name,
      description,
      initiatorId: req.user.id,
      status: 'open',
      minParticipants,
      maxParticipants,
      currentParticipants: 1, // Initiator is the first participant
      targetAmount,
      currentAmount: 0,
      discountRate,
      deadline: new Date(deadline),
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      locationRadius,
      latitude,
      longitude
    }, { transaction });
    
    // Create group order items
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      
      await GroupOrderItem.create({
        groupOrderId: groupOrder.id,
        productId: product.id,
        supplierId: product.supplierId,
        totalQuantity: item.quantity || 0,
        unitPrice: product.price,
        bulkDiscountPrice: item.bulkDiscountPrice,
        minQuantityForDiscount: item.minQuantityForDiscount
      }, { transaction });
    }
    
    await transaction.commit();
    
    res.status(201).json({
      message: 'Group order created successfully',
      groupOrderId: groupOrder.id
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating group order:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update group order status (initiator only)
router.patch('/:id/status', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  try {
    const groupOrderId = req.params.id;
    const { status } = req.body;
    
    if (!['open', 'closed', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const groupOrder = await GroupOrder.findOne({
      where: {
        id: groupOrderId,
        initiatorId: req.user.id
      }
    });
    
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found or you are not the initiator' });
    }
    
    await groupOrder.update({ status });
    
    res.status(200).json({
      message: 'Group order status updated successfully',
      groupOrderId,
      newStatus: status
    });
  } catch (error) {
    console.error('Error updating group order status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = router; 