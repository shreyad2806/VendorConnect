const express = require('express');
const router = express.Router();
const { VendorGroupOrder, VendorProduct, VendorOrder, VendorUser, SupplierBid, Delivery, Vehicle } = require('../models/vendor-index');
const { authenticateToken } = require('../config/middlewares/authenticateToken');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

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

// Get all group orders
router.get('/', async (req, res) => {
  try {
    const { status, area, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.order_status = status;
    if (area) filter.delivery_area = { [Op.like]: `%${area}%` };
    
    const offset = (page - 1) * limit;
    
    const groupOrders = await VendorGroupOrder.findAndCountAll({
      where: filter,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: VendorProduct,
          as: 'product'
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
    console.error('Error fetching group orders:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get group order by ID
router.get('/:id', async (req, res) => {
  try {
    const groupOrder = await VendorGroupOrder.findByPk(req.params.id, {
      include: [
        {
          model: VendorProduct,
          as: 'product'
        },
        {
          model: VendorOrder,
          as: 'vendorOrders',
          include: [
            {
              model: VendorUser,
              as: 'vendor',
              attributes: ['user_id', 'name', 'phone', 'location']
            }
          ]
        },
        {
          model: SupplierBid,
          as: 'supplierBids',
          include: [
            {
              model: VendorUser,
              as: 'supplier',
              attributes: ['user_id', 'name', 'phone', 'location']
            }
          ]
        },
        {
          model: Delivery,
          as: 'delivery',
          include: [
            {
              model: Vehicle,
              as: 'vehicle'
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

// Get group orders by vendor
router.get('/vendor/orders', authenticateToken, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const vendorOrders = await VendorOrder.findAndCountAll({
      where: { user_id: userId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: VendorGroupOrder,
          as: 'groupOrder',
          include: [
            {
              model: VendorProduct,
              as: 'product'
            },
            {
              model: Delivery,
              as: 'delivery'
            }
          ]
        }
      ],
      order: [[{ model: VendorGroupOrder, as: 'groupOrder' }, 'created_at', 'DESC']]
    });
    
    res.status(200).json({
      totalItems: vendorOrders.count,
      totalPages: Math.ceil(vendorOrders.count / limit),
      currentPage: parseInt(page),
      orders: vendorOrders.rows
    });
  } catch (error) {
    console.error('Error fetching vendor group orders:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get group orders with supplier bids
router.get('/supplier/bids', authenticateToken, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const supplierBids = await SupplierBid.findAndCountAll({
      where: { user_id: userId },
      limit: parseInt(limit),
      offset: parseInt(offset),
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
        }
      ],
      order: [[{ model: VendorGroupOrder, as: 'groupOrder' }, 'created_at', 'DESC']]
    });
    
    res.status(200).json({
      totalItems: supplierBids.count,
      totalPages: Math.ceil(supplierBids.count / limit),
      currentPage: parseInt(page),
      bids: supplierBids.rows
    });
  } catch (error) {
    console.error('Error fetching supplier bids:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Join a group order (for vendors)
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const groupOrderId = req.params.id;
    const { quantity, delivery_address } = req.body;
    
    // Check if group order exists
    const groupOrder = await VendorGroupOrder.findByPk(groupOrderId);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }
    
    // Check if user has already joined this group order
    const existingOrder = await VendorOrder.findOne({
      where: {
        user_id: userId,
        group_order_id: groupOrderId
      }
    });
    
    if (existingOrder) {
      return res.status(400).json({ message: 'You have already joined this group order' });
    }
    
    // Create vendor order
    const vendorOrder = await VendorOrder.create({
      user_id: userId,
      group_order_id: groupOrderId,
      quantity,
      price_per_unit: 0, // Will be updated when supplier bid is accepted
      delivery_address
    });
    
    res.status(201).json({
      message: 'Successfully joined group order',
      vendorOrder
    });
  } catch (error) {
    console.error('Error joining group order:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Place a bid on a group order (for suppliers)
router.post('/:id/bid', authenticateToken, async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const groupOrderId = req.params.id;
    const { price_per_unit, available_quantity, delivery_time } = req.body;
    
    // Check if group order exists
    const groupOrder = await VendorGroupOrder.findByPk(groupOrderId);
    if (!groupOrder) {
      return res.status(404).json({ message: 'Group order not found' });
    }
    
    // Check if user has already placed a bid on this group order
    const existingBid = await SupplierBid.findOne({
      where: {
        user_id: userId,
        group_order_id: groupOrderId
      }
    });
    
    if (existingBid) {
      // Update existing bid
      await existingBid.update({
        price_per_unit,
        available_quantity,
        delivery_time
      });
      
      res.status(200).json({
        message: 'Bid updated successfully',
        bid: existingBid
      });
    } else {
      // Create new bid
      const bid = await SupplierBid.create({
        user_id: userId,
        group_order_id: groupOrderId,
        price_per_unit,
        available_quantity,
        delivery_time,
        is_accepted: false
      });
      
      res.status(201).json({
        message: 'Bid placed successfully',
        bid
      });
    }
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router; 