const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'b2b_vendor_platform',
  port: process.env.DB_PORT || 3306
};

// CSV file paths
const CSV_DIR = path.join(__dirname, '../../Vendor');
const CSV_FILES = {
  users: path.join(CSV_DIR, 'users.csv'),
  products: path.join(CSV_DIR, 'products.csv'),
  group_orders: path.join(CSV_DIR, 'group_orders.csv'),
  vendor_orders: path.join(CSV_DIR, 'vendor_orders.csv'),
  supplier_bids: path.join(CSV_DIR, 'supplier_bids.csv'),
  vehicles: path.join(CSV_DIR, 'vehicles.csv'),
  deliveries: path.join(CSV_DIR, 'deliveries.csv'),
  feedback: path.join(CSV_DIR, 'feedback.csv')
};

// Function to read CSV file and return data as array
function readCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Function to create database and tables
async function setupDatabase(connection) {
  try {
    // Read SQL file
    const sql = fs.readFileSync(path.join(CSV_DIR, 'b2b.sql'), 'utf8');
    
    // Split SQL statements
    const statements = sql.split(';').filter(statement => statement.trim() !== '');
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim().toLowerCase().startsWith('use') || 
          statement.trim().toLowerCase().startsWith('select')) {
        continue; // Skip USE and SELECT statements
      }
      await connection.query(statement);
      console.log('Executed SQL statement successfully');
    }
    
    console.log('Database and tables created successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

// Function to import data from CSV to database
async function importData() {
  let connection;
  
  try {
    console.log('Starting data import process...');
    console.log('Database config:', { 
      host: dbConfig.host, 
      user: dbConfig.user, 
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    // Create database connection
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port,
      multipleStatements: true
    });
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);
    
    // Setup database tables
    await setupDatabase(connection);
    
    // Import users data
    console.log('Importing users data...');
    const usersData = await readCsvFile(CSV_FILES.users);
    for (const user of usersData) {
      await connection.query(
        'INSERT INTO users (user_id, name, phone, role, location, password_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user.user_id, user.name, user.phone, user.role, user.location, user.password_hash, user.created_at]
      );
    }
    console.log(`Imported ${usersData.length} users`);
    
    // Import products data
    console.log('Importing products data...');
    const productsData = await readCsvFile(CSV_FILES.products);
    for (const product of productsData) {
      await connection.query(
        'INSERT INTO products (product_id, name, unit, category) VALUES (?, ?, ?, ?)',
        [product.product_id, product.name, product.unit, product.category]
      );
    }
    console.log(`Imported ${productsData.length} products`);
    
    // Import group_orders data
    console.log('Importing group orders data...');
    const groupOrdersData = await readCsvFile(CSV_FILES.group_orders);
    for (const order of groupOrdersData) {
      await connection.query(
        'INSERT INTO group_orders (group_order_id, product_id, total_quantity, order_status, delivery_area, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [order.group_order_id, order.product_id, order.total_quantity, order.order_status, order.delivery_area, order.created_at]
      );
    }
    console.log(`Imported ${groupOrdersData.length} group orders`);
    
    // Import vendor_orders data
    console.log('Importing vendor orders data...');
    const vendorOrdersData = await readCsvFile(CSV_FILES.vendor_orders);
    for (const order of vendorOrdersData) {
      await connection.query(
        'INSERT INTO vendor_orders (vendor_order_id, user_id, group_order_id, quantity, price_per_unit, delivery_address) VALUES (?, ?, ?, ?, ?, ?)',
        [order.vendor_order_id, order.user_id, order.group_order_id, order.quantity, order.price_per_unit, order.delivery_address]
      );
    }
    console.log(`Imported ${vendorOrdersData.length} vendor orders`);
    
    // Import supplier_bids data
    console.log('Importing supplier bids data...');
    const supplierBidsData = await readCsvFile(CSV_FILES.supplier_bids);
    for (const bid of supplierBidsData) {
      await connection.query(
        'INSERT INTO supplier_bids (bid_id, user_id, group_order_id, price_per_unit, available_quantity, delivery_time, is_accepted) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [bid.bid_id, bid.user_id, bid.group_order_id, bid.price_per_unit, bid.available_quantity, bid.delivery_time, bid.is_accepted === 'True' ? 1 : 0]
      );
    }
    console.log(`Imported ${supplierBidsData.length} supplier bids`);
    
    // Import vehicles data
    console.log('Importing vehicles data...');
    const vehiclesData = await readCsvFile(CSV_FILES.vehicles);
    for (const vehicle of vehiclesData) {
      await connection.query(
        'INSERT INTO vehicles (vehicle_id, type, capacity, driver_name, contact) VALUES (?, ?, ?, ?, ?)',
        [vehicle.vehicle_id, vehicle.type, vehicle.capacity, vehicle.driver_name, vehicle.contact]
      );
    }
    console.log(`Imported ${vehiclesData.length} vehicles`);
    
    // Import deliveries data
    console.log('Importing deliveries data...');
    const deliveriesData = await readCsvFile(CSV_FILES.deliveries);
    for (const delivery of deliveriesData) {
      await connection.query(
        'INSERT INTO deliveries (delivery_id, group_order_id, vehicle_id, delivery_date, status, tracking_link) VALUES (?, ?, ?, ?, ?, ?)',
        [delivery.delivery_id, delivery.group_order_id, delivery.vehicle_id, delivery.delivery_date, delivery.status, delivery.tracking_link]
      );
    }
    console.log(`Imported ${deliveriesData.length} deliveries`);
    
    // Import feedback data
    console.log('Importing feedback data...');
    const feedbackData = await readCsvFile(CSV_FILES.feedback);
    for (const feedback of feedbackData) {
      await connection.query(
        'INSERT INTO feedback (feedback_id, from_user_id, to_user_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
        [feedback.feedback_id, feedback.from_user_id, feedback.to_user_id, feedback.rating, feedback.comment]
      );
    }
    console.log(`Imported ${feedbackData.length} feedback records`);
    
    console.log('All data imported successfully!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the import process
importData(); 