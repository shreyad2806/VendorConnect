const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Delivery = sequelize.define('deliveries', {
  delivery_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'delivery_id'
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
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'vehicle_id',
    references: {
      model: 'vehicles',
      key: 'vehicle_id'
    }
  },
  delivery_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'delivery_date'
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_transit', 'delivered'),
    allowNull: true,
    field: 'status'
  },
  tracking_link: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'tracking_link'
  }
}, {
  tableName: 'deliveries',
  timestamps: false
});

module.exports = Delivery; 