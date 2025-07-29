const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

// Import all models
const User = require('../models/User');
const Product = require('../models/Product');
const GroupOrder = require('../models/GroupOrder');
const VendorOrder = require('../models/VendorOrder');
const SupplierBid = require('../models/SupplierBid');
const Vehicle = require('../models/Vehicle');
const Delivery = require('../models/Delivery');
const Feedback = require('../models/Feedback');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created successfully.');
    
    // Create sample data
    await createSampleData();
    console.log('✅ Sample data created successfully.');
    
    console.log('🎉 Database initialization completed!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function createSampleData() {
  try {
    // Create sample users
    const users = await User.bulkCreate([
      {
        name: 'John Vendor',
        phone: '+1234567890',
        role: 'vendor',
        location: 'New York, NY',
        password_hash: '$2b$10$example.hash.for.testing'
      },
      {
        name: 'Sarah Supplier',
        phone: '+1987654321',
        role: 'supplier',
        location: 'Los Angeles, CA',
        password_hash: '$2b$10$example.hash.for.testing'
      },
      {
        name: 'Mike Vendor',
        phone: '+1122334455',
        role: 'vendor',
        location: 'Chicago, IL',
        password_hash: '$2b$10$example.hash.for.testing'
      }
    ]);
    
    // Create sample products
    const products = await Product.bulkCreate([
      {
        name: 'Fresh Tomatoes',
        unit: 'kg',
        category: 'Vegetables'
      },
      {
        name: 'Organic Apples',
        unit: 'kg',
        category: 'Fruits'
      },
      {
        name: 'Whole Milk',
        unit: 'liter',
        category: 'Dairy'
      },
      {
        name: 'Fresh Bread',
        unit: 'piece',
        category: 'Bakery'
      }
    ]);
    
    // Create sample group orders
    const groupOrders = await GroupOrder.bulkCreate([
      {
        product_id: 1,
        total_quantity: 100,
        order_status: 'pending',
        delivery_area: 'New York, NY'
      },
      {
        product_id: 2,
        total_quantity: 50,
        order_status: 'matched',
        delivery_area: 'Chicago, IL'
      }
    ]);
    
    // Create sample vendor orders
    const vendorOrders = await VendorOrder.bulkCreate([
      {
        user_id: 1,
        group_order_id: 1,
        quantity: 20,
        price_per_unit: 2.50,
        delivery_address: '123 Main St, New York, NY'
      },
      {
        user_id: 3,
        group_order_id: 1,
        quantity: 15,
        price_per_unit: 2.50,
        delivery_address: '456 Oak Ave, New York, NY'
      }
    ]);
    
    // Create sample vehicles
    const vehicles = await Vehicle.bulkCreate([
      {
        type: 'Refrigerated Truck',
        capacity: 5000,
        driver_name: 'David Driver',
        contact: '+1555666777'
      },
      {
        type: 'Van',
        capacity: 1000,
        driver_name: 'Lisa Driver',
        contact: '+1888999000'
      }
    ]);
    
    console.log(`✅ Created ${users.length} users`);
    console.log(`✅ Created ${products.length} products`);
    console.log(`✅ Created ${groupOrders.length} group orders`);
    console.log(`✅ Created ${vendorOrders.length} vendor orders`);
    console.log(`✅ Created ${vehicles.length} vehicles`);
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    throw error;
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeDatabase }; 