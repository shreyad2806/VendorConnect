const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SupplierBid = sequelize.define('supplier_bids', {
  bid_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'bid_id'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  group_order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'group_order_id',
    references: {
      model: 'group_orders',
      key: 'group_order_id'
    }
  },
  price_per_unit: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'price_per_unit'
  },
  available_quantity: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'available_quantity'
  },
  delivery_time: {
    type: DataTypes.TIME,
    allowNull: true,
    field: 'delivery_time'
  },
  is_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_accepted'
  }
}, {
  tableName: 'supplier_bids',
  timestamps: false
});

module.exports = SupplierBid; 