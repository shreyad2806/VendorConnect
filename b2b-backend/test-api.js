const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:3000/api';

// Store the auth token
let authToken = '';

// Helper function to make API requests
async function makeRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {}
    };
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (data && (method === 'post' || method === 'put' || method === 'patch')) {
      config.data = data;
    }
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method.toUpperCase()} ${endpoint}:`, error.response ? error.response.data : error.message);
    return null;
  }
}

// Test vendor authentication
async function testVendorAuth() {
  console.log('\n--- Testing Vendor Authentication ---');
  
  // Test login with a vendor user from the CSV data
  const loginData = {
    phone: '1552404108', // Janet Jimenez from users.csv
    password: '4b4448b68101dc3e5e5e2a9248f6e59f76000a4257c93fdeb988478ff0e7d639'
  };
  
  const loginResult = await makeRequest('post', '/vendor/auth/login', loginData);
  
  if (loginResult && loginResult.token) {
    console.log('✅ Vendor login successful');
    authToken = loginResult.token;
    console.log('User:', loginResult.user);
    
    // Test profile endpoint
    const profileResult = await makeRequest('get', '/vendor/auth/profile', null, authToken);
    if (profileResult) {
      console.log('✅ Vendor profile fetch successful');
      console.log('Profile:', profileResult);
    }
  }
}

// Test vendor products
async function testVendorProducts() {
  console.log('\n--- Testing Vendor Products ---');
  
  // Test get all products
  const products = await makeRequest('get', '/vendor/products');
  if (products && products.length > 0) {
    console.log(`✅ Retrieved ${products.length} products`);
    console.log('First product:', products[0]);
    
    // Test get product by ID
    const productId = products[0].product_id;
    const product = await makeRequest('get', `/vendor/products/${productId}`);
    if (product) {
      console.log(`✅ Retrieved product with ID ${productId}`);
      console.log('Product details:', product);
    }
    
    // Test get product categories
    const categories = await makeRequest('get', '/vendor/products/categories/list');
    if (categories && categories.length > 0) {
      console.log(`✅ Retrieved ${categories.length} product categories`);
      console.log('Categories:', categories);
    }
    
    // Test get product units
    const units = await makeRequest('get', '/vendor/products/units/list');
    if (units && units.length > 0) {
      console.log(`✅ Retrieved ${units.length} product units`);
      console.log('Units:', units);
    }
  }
}

// Test vendor group orders
async function testVendorGroupOrders() {
  console.log('\n--- Testing Vendor Group Orders ---');
  
  // Test get all group orders
  const groupOrders = await makeRequest('get', '/vendor/group-orders');
  if (groupOrders && groupOrders.groupOrders && groupOrders.groupOrders.length > 0) {
    console.log(`✅ Retrieved ${groupOrders.groupOrders.length} group orders`);
    console.log('First group order:', groupOrders.groupOrders[0]);
    
    // Test get group order by ID
    const groupOrderId = groupOrders.groupOrders[0].group_order_id;
    const groupOrder = await makeRequest('get', `/vendor/group-orders/${groupOrderId}`);
    if (groupOrder) {
      console.log(`✅ Retrieved group order with ID ${groupOrderId}`);
      console.log('Group order details:', groupOrder);
    }
    
    // Test get vendor orders (requires auth)
    if (authToken) {
      const vendorOrders = await makeRequest('get', '/vendor/group-orders/vendor/orders', null, authToken);
      if (vendorOrders) {
        console.log('✅ Retrieved vendor orders');
        console.log('Vendor orders:', vendorOrders);
      }
    }
  }
}

// Test vendor deliveries
async function testVendorDeliveries() {
  console.log('\n--- Testing Vendor Deliveries ---');
  
  // Test get all deliveries
  const deliveries = await makeRequest('get', '/vendor/deliveries');
  if (deliveries && deliveries.deliveries && deliveries.deliveries.length > 0) {
    console.log(`✅ Retrieved ${deliveries.deliveries.length} deliveries`);
    console.log('First delivery:', deliveries.deliveries[0]);
    
    // Test get delivery by ID
    const deliveryId = deliveries.deliveries[0].delivery_id;
    const delivery = await makeRequest('get', `/vendor/deliveries/${deliveryId}`);
    if (delivery) {
      console.log(`✅ Retrieved delivery with ID ${deliveryId}`);
      console.log('Delivery details:', delivery);
    }
  }
  
  // Test get all vehicles
  const vehicles = await makeRequest('get', '/vendor/deliveries/vehicles/all');
  if (vehicles && vehicles.length > 0) {
    console.log(`✅ Retrieved ${vehicles.length} vehicles`);
    console.log('First vehicle:', vehicles[0]);
  }
}

// Run all tests
async function runTests() {
  try {
    console.log('🔍 Starting API tests...');
    
    await testVendorAuth();
    await testVendorProducts();
    await testVendorGroupOrders();
    await testVendorDeliveries();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
runTests(); 