const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product, User, GroupOrder, Transport } = require('../models');
const { authenticateToken, authorizeRole } = require('../config/middlewares/authenticateToken');
const { sequelize } = require('../config/database');

// Get all orders for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const { status, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    // For vendors, show their orders
    // For suppliers, show orders containing their products
    let orders;
    
    if (role === 'vendor') {
      filter.vendorId = userId;
      
      orders = await Order.findAndCountAll({
        where: filter,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              },
              {
                model: User,
                as: 'supplier',
                attributes: ['id', 'name', 'businessName', 'phone']
              }
            ]
          },
          {
            model: GroupOrder,
            as: 'groupOrder'
          },
          {
            model: Transport,
            as: 'transport'
          }
        ]
      });
    } else if (role === 'supplier') {
      // For suppliers, find orders that contain their products
      orders = await Order.findAndCountAll({
        where: filter,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: OrderItem,
            as: 'items',
            required: true,
            where: { supplierId: userId },
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          },
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'name', 'businessName', 'phone', 'address', 'city', 'state', 'pincode']
          },
          {
            model: GroupOrder,
            as: 'groupOrder'
          },
          {
            model: Transport,
            as: 'transport'
          }
        ]
      });
    }

    res.status(200).json({
      totalItems: orders.count,
      totalPages: Math.ceil(orders.count / limit),
      currentPage: parseInt(page),
      orders: orders.rows
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;
    const role = req.user.role;
    
    let order;
    
    if (role === 'vendor') {
      order = await Order.findOne({
        where: {
          id: orderId,
          vendorId: userId
        },
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Product,
                as: 'product'
              },
              {
                model: User,
                as: 'supplier',
                attributes: ['id', 'name', 'businessName', 'phone']
              }
            ]
          },
          {
            model: GroupOrder,
            as: 'groupOrder'
          },
          {
            model: Transport,
            as: 'transport'
          }
        ]
      });
    } else if (role === 'supplier') {
      order = await Order.findOne({
        where: {
          id: orderId
        },
        include: [
          {
            model: OrderItem,
            as: 'items',
            required: true,
            where: { supplierId: userId },
            include: [
              {
                model: Product,
                as: 'product'
              }
            ]
          },
          {
            model: User,
            as: 'vendor',
            attributes: ['id', 'name', 'businessName', 'phone', 'address', 'city', 'state', 'pincode']
          },
          {
            model: GroupOrder,
            as: 'groupOrder'
          },
          {
            model: Transport,
            as: 'transport'
          }
        ]
      });
    }
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to view it' });
    }
    
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Create a new order (vendors only)
router.post('/', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      items,
      groupOrderId,
      deliveryAddress,
      deliveryDate,
      deliverySlot,
      transportId,
      notes
    } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }
    
    // Calculate total amount and validate items
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
      }
      
      if (!product.isAvailable) {
        await transaction.rollback();
        return res.status(400).json({ message: `Product ${product.name} is not available` });
      }
      
      if (item.quantity < product.minOrderQuantity) {
        await transaction.rollback();
        return res.status(400).json({ 
          message: `Minimum order quantity for ${product.name} is ${product.minOrderQuantity} ${product.unit}` 
        });
      }
      
      const unitPrice = product.discountedPrice || product.price;
      const itemTotal = unitPrice * item.quantity;
      
      totalAmount += itemTotal;
      
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
        supplierId: product.supplierId
      });
    }
    
    // Create order
    const order = await Order.create({
      vendorId: req.user.id,
      groupOrderId,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      deliveryAddress,
      deliveryDate,
      deliverySlot,
      transportId,
      notes
    }, { transaction });
    
    // Create order items
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        ...item
      }, { transaction });
    }
    
    // If part of a group order, update the group order's current amount
    if (groupOrderId) {
      const groupOrder = await GroupOrder.findByPk(groupOrderId);
      if (groupOrder) {
        await groupOrder.update({
          currentAmount: groupOrder.currentAmount + totalAmount,
          currentParticipants: groupOrder.currentParticipants + 1
        }, { transaction });
      }
    }
    
    // If using transport, update transport's current capacity and participants
    if (transportId) {
      const transport = await Transport.findByPk(transportId);
      if (transport) {
        // Assuming each order adds 1 to participant count
        // You might want to calculate actual cargo weight from items
        await transport.update({
          currentParticipants: transport.currentParticipants + 1
        }, { transaction });
      }
    }
    
    await transaction.commit();
    
    res.status(201).json({
      message: 'Order created successfully',
      orderId: order.id,
      totalAmount
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update order status (both vendors and suppliers can update)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;
    const role = req.user.role;
    
    if (!['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    let order;
    
    if (role === 'vendor') {
      // Vendors can only update their own orders
      order = await Order.findOne({
        where: {
          id: orderId,
          vendorId: userId
        }
      });
      
      // Vendors can only cancel orders or mark as delivered
      if (status !== 'cancelled' && status !== 'delivered') {
        return res.status(403).json({ message: 'Vendors can only cancel orders or mark as delivered' });
      }
    } else if (role === 'supplier') {
      // Suppliers can update orders that contain their products
      const orderItem = await OrderItem.findOne({
        where: { supplierId: userId },
        include: [
          {
            model: Order,
            as: 'order',
            where: { id: orderId }
          }
        ]
      });
      
      if (!orderItem) {
        return res.status(404).json({ message: 'Order not found or you do not have permission to update it' });
      }
      
      order = orderItem.order;
      
      // Suppliers can update order status except for cancellation (which is vendor's right)
      if (status === 'cancelled') {
        return res.status(403).json({ message: 'Suppliers cannot cancel orders' });
      }
    }
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to update it' });
    }
    
    await order.update({ status });
    
    res.status(200).json({
      message: 'Order status updated successfully',
      orderId,
      newStatus: status
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update payment status (vendors only)
router.patch('/:id/payment', authenticateToken, authorizeRole(['vendor']), async (req, res) => {
  try {
    const orderId = req.params.id;
    const { paymentStatus, paymentMethod } = req.body;
    
    if (!['pending', 'paid', 'failed', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }
    
    const order = await Order.findOne({
      where: {
        id: orderId,
        vendorId: req.user.id
      }
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found or you do not have permission to update it' });
    }
    
    await order.update({ 
      paymentStatus,
      paymentMethod: paymentMethod || order.paymentMethod
    });
    
    res.status(200).json({
      message: 'Payment status updated successfully',
      orderId,
      newPaymentStatus: paymentStatus
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
