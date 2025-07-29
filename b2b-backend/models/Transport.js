const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transport = sequelize.define('Transport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  vehicleType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Capacity in kg or cubic meters'
  },
  capacityUnit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'kg'
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'booked', 'in_transit', 'completed', 'cancelled'),
    defaultValue: 'available'
  },
  sourceLocation: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sourceLatitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  sourceLongitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  destinationLocation: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  destinationLatitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  destinationLongitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  departureTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estimatedArrivalTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  currentCapacityUsed: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currentParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  initiatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'User who initiated the transport sharing'
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Driver details if applicable'
  },
  driverName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  driverContact: {
    type: DataTypes.STRING,
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

module.exports = Transport; 