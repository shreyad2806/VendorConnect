CREATE DATABASE b2b_vendor_platform;
USE b2b_vendor_platform;
-- USERS TABLE
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(15),
    role ENUM('vendor', 'supplier', 'admin'),
    location VARCHAR(100),
    password_hash VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);



-- PRODUCTS TABLE
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    unit VARCHAR(20),
    category VARCHAR(50)
);

-- GROUP ORDERS
CREATE TABLE group_orders (
    group_order_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    total_quantity FLOAT,
    order_status ENUM('pending', 'matched', 'dispatched', 'complete'),
    delivery_area VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- VENDOR ORDERS
CREATE TABLE vendor_orders (
    vendor_order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    group_order_id INT,
    quantity FLOAT,
    price_per_unit FLOAT,
    delivery_address VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (group_order_id) REFERENCES group_orders(group_order_id)
);

-- SUPPLIER BIDS
CREATE TABLE supplier_bids (
    bid_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    group_order_id INT,
    price_per_unit FLOAT,
    available_quantity FLOAT,
    delivery_time TIME,
    is_accepted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (group_order_id) REFERENCES group_orders(group_order_id)
);

-- VEHICLES
CREATE TABLE vehicles (
    vehicle_id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50),
    capacity FLOAT,
    driver_name VARCHAR(100),
    contact VARCHAR(15)
);

-- DELIVERIES
CREATE TABLE deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    group_order_id INT,
    vehicle_id INT,
    delivery_date DATE,
    status ENUM('scheduled', 'in_transit', 'delivered'),
    tracking_link VARCHAR(255),
    FOREIGN KEY (group_order_id) REFERENCES group_orders(group_order_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id)
);

-- FEEDBACK
CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    from_user_id INT,
    to_user_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    FOREIGN KEY (from_user_id) REFERENCES users(user_id),
    FOREIGN KEY (to_user_id) REFERENCES users(user_id)
);
-- Check users
SELECT COUNT(*) FROM users;

-- Check products
SELECT * FROM products LIMIT 5;

-- See all group orders
SELECT * FROM group_orders ORDER BY created_at DESC LIMIT 10;

-- Check a vendor order
SELECT * FROM vendor_orders LIMIT 10;

