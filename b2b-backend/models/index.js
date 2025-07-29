const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const GroupOrder = require('./GroupOrder');
const GroupOrderItem = require('./GroupOrderItem');
const Transport = require('./Transport');
const TransportParticipant = require('./TransportParticipant');
const { sequelize } = require('../config/database');

// User associations
User.hasMany(Product, { foreignKey: 'supplierId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'supplierId', as: 'supplier' });

User.hasMany(Order, { foreignKey: 'vendorId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'vendorId', as: 'vendor' });

User.hasMany(GroupOrder, { foreignKey: 'initiatorId', as: 'initiatedGroupOrders' });
GroupOrder.belongsTo(User, { foreignKey: 'initiatorId', as: 'initiator' });

User.hasMany(Transport, { foreignKey: 'initiatorId', as: 'initiatedTransports' });
Transport.belongsTo(User, { foreignKey: 'initiatorId', as: 'initiator' });

User.hasMany(TransportParticipant, { foreignKey: 'userId', as: 'transportParticipations' });
TransportParticipant.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order associations
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

Order.belongsTo(Transport, { foreignKey: 'transportId', as: 'transport' });
Transport.hasMany(Order, { foreignKey: 'transportId', as: 'orders' });

Order.belongsTo(GroupOrder, { foreignKey: 'groupOrderId', as: 'groupOrder' });
GroupOrder.hasMany(Order, { foreignKey: 'groupOrderId', as: 'orders' });

// OrderItem associations
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

OrderItem.belongsTo(User, { foreignKey: 'supplierId', as: 'supplier' });

// GroupOrder associations
GroupOrder.hasMany(GroupOrderItem, { foreignKey: 'groupOrderId', as: 'items' });
GroupOrderItem.belongsTo(GroupOrder, { foreignKey: 'groupOrderId', as: 'groupOrder' });

// GroupOrderItem associations
GroupOrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(GroupOrderItem, { foreignKey: 'productId', as: 'groupOrderItems' });

GroupOrderItem.belongsTo(User, { foreignKey: 'supplierId', as: 'supplier' });

// Transport associations
Transport.hasMany(TransportParticipant, { foreignKey: 'transportId', as: 'participants' });
TransportParticipant.belongsTo(Transport, { foreignKey: 'transportId', as: 'transport' });

// TransportParticipant associations
TransportParticipant.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasOne(TransportParticipant, { foreignKey: 'orderId', as: 'transportParticipation' });

module.exports = {
  User,
  Product,
  Order,
  OrderItem,
  GroupOrder,
  GroupOrderItem,
  Transport,
  TransportParticipant,
  sequelize
}; 