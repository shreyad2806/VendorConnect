const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:3000/api';

// Helper function to make API requests
async function makeRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: {}
    };
    
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

// Test authentication
async function testAuth() {
  console.log('\n--- Testing Authentication ---');
  
  // Test login
  const loginData = {
    email: 'vendor@example.com',
    password: 'password123'
  };
  
  const loginResult = await makeRequest('post', '/auth/login', loginData);
  
  if (loginResult && loginResult.token) {
    console.log('✅ Login successful');
    console.log('User:', loginResult.user);
  }
}

// Test products
async function testProducts() {
  console.log('\n--- Testing Products ---');
  
  // Test get all products
  const products = await makeRequest('get', '/products');
  if (products && products.length > 0) {
    console.log(`✅ Retrieved ${products.length} products`);
    console.log('First product:', products[0]);
  }
}

// Run all tests
async function runTests() {
  try {
    console.log('🔍 Starting API tests...');
    
    await testAuth();
    await testProducts();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
runTests(); 