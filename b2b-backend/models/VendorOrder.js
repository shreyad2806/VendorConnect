const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VendorOrder = sequelize.define('vendor_orders', {
  vendor_order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'vendor_order_id'
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
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'quantity'
  },
  price_per_unit: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'price_per_unit'
  },
  delivery_address: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'delivery_address'
  }
}, {
  tableName: 'vendor_orders',
  timestamps: false
});

module.exports = VendorOrder; 