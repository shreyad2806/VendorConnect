const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  groupOrderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'GroupOrders',
      key: 'id'
    },
    comment: 'If part of a group order, reference to the group order'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deliveryAddress: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliverySlot: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transportId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Transports',
      key: 'id'
    },
    comment: 'Reference to the transport arrangement'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Order;
