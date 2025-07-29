const VendorUser = require('./VendorUser');
const VendorProduct = require('./VendorProduct');
const VendorGroupOrder = require('./VendorGroupOrder');
const VendorOrder = require('./VendorOrder');
const SupplierBid = require('./SupplierBid');
const Vehicle = require('./Vehicle');
const Delivery = require('./Delivery');
const Feedback = require('./Feedback');
const { sequelize } = require('../config/database');

// Product associations
VendorGroupOrder.belongsTo(VendorProduct, { foreignKey: 'product_id', as: 'product' });
VendorProduct.hasMany(VendorGroupOrder, { foreignKey: 'product_id', as: 'groupOrders' });

// User associations
VendorOrder.belongsTo(VendorUser, { foreignKey: 'user_id', as: 'vendor' });
VendorUser.hasMany(VendorOrder, { foreignKey: 'user_id', as: 'orders' });

SupplierBid.belongsTo(VendorUser, { foreignKey: 'user_id', as: 'supplier' });
VendorUser.hasMany(SupplierBid, { foreignKey: 'user_id', as: 'bids' });

// Feedback associations
Feedback.belongsTo(VendorUser, { foreignKey: 'from_user_id', as: 'fromUser' });
Feedback.belongsTo(VendorUser, { foreignKey: 'to_user_id', as: 'toUser' });
VendorUser.hasMany(Feedback, { foreignKey: 'from_user_id', as: 'givenFeedback' });
VendorUser.hasMany(Feedback, { foreignKey: 'to_user_id', as: 'receivedFeedback' });

// Group order associations
VendorOrder.belongsTo(VendorGroupOrder, { foreignKey: 'group_order_id', as: 'groupOrder' });
VendorGroupOrder.hasMany(VendorOrder, { foreignKey: 'group_order_id', as: 'vendorOrders' });

SupplierBid.belongsTo(VendorGroupOrder, { foreignKey: 'group_order_id', as: 'groupOrder' });
VendorGroupOrder.hasMany(SupplierBid, { foreignKey: 'group_order_id', as: 'supplierBids' });

Delivery.belongsTo(VendorGroupOrder, { foreignKey: 'group_order_id', as: 'groupOrder' });
VendorGroupOrder.hasOne(Delivery, { foreignKey: 'group_order_id', as: 'delivery' });

// Vehicle associations
Delivery.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });
Vehicle.hasMany(Delivery, { foreignKey: 'vehicle_id', as: 'deliveries' });

module.exports = {
  VendorUser,
  VendorProduct,
  VendorGroupOrder,
  VendorOrder,
  SupplierBid,
  Vehicle,
  Delivery,
  Feedback,
  sequelize
}; 