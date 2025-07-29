const express = require('express');
const router = express.Router();
const { VendorProduct } = require('../models/vendor-index');
const { authenticateToken } = require('../config/middlewares/authenticateToken');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, unit } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (unit) filter.unit = unit;
    
    const products = await VendorProduct.findAll({
      where: filter,
      order: [['name', 'ASC']]
    });
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await VendorProduct.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await VendorProduct.findAll({
      attributes: ['category'],
      group: ['category'],
      order: [['category', 'ASC']]
    });
    
    const categoryList = categories.map(item => item.category);
    
    res.status(200).json(categoryList);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get product units
router.get('/units/list', async (req, res) => {
  try {
    const units = await VendorProduct.findAll({
      attributes: ['unit'],
      group: ['unit'],
      order: [['unit', 'ASC']]
    });
    
    const unitList = units.map(item => item.unit);
    
    res.status(200).json(unitList);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router; 