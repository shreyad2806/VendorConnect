const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vehicle = sequelize.define('vehicles', {
  vehicle_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'vehicle_id'
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'type'
  },
  capacity: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'capacity'
  },
  driver_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'driver_name'
  },
  contact: {
    type: DataTypes.STRING(15),
    allowNull: true,
    field: 'contact'
  }
}, {
  tableName: 'vehicles',
  timestamps: false
});

module.exports = Vehicle; 