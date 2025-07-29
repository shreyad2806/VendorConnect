const express = require('express');
const router = express.Router();
const { Product, User } = require('../models');
const { authenticateToken, authorizeRole } = require('../config/middlewares/authenticateToken');
const { Op } = require('sequelize');

// Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const {
      category,
      subCategory,
      minPrice,
      maxPrice,
      supplierId,
      search,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (supplierId) filter.supplierId = supplierId;
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) filter.price[Op.lte] = parseFloat(maxPrice);
    }
    
    // Search by name or description
    if (search) {
      filter[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Only show available products
    filter.isAvailable = true;

    // Sorting options
    const order = [];
    if (sortBy) {
      order.push([sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']);
    } else {
      order.push(['createdAt', 'DESC']);
    }

    // Pagination
    const offset = (page - 1) * limit;
    
    const products = await Product.findAndCountAll({
      where: filter,
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        {
          model: User,
          as: 'supplier',
          attributes: ['id', 'name', 'businessName', 'city', 'state', 'isVerified']
        }
      ]
    });

    res.status(200).json({
      totalItems: products.count,
      totalPages: Math.ceil(products.count / limit),
      currentPage: parseInt(page),
      products: products.rows
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'supplier',
          attributes: ['id', 'name', 'businessName', 'city', 'state', 'isVerified']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Create a new product (suppliers only)
router.post('/', authenticateToken, authorizeRole(['supplier']), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      unit,
      minOrderQuantity,
      price,
      discountedPrice,
      stock,
      images
    } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      category,
      subCategory,
      unit,
      minOrderQuantity,
      price,
      discountedPrice,
      stock,
      images,
      supplierId: req.user.id,
      isAvailable: true
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Update a product (suppliers only)
router.put('/:id', authenticateToken, authorizeRole(['supplier']), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product belongs to the supplier
    if (product.supplierId !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own products' });
    }

    const {
      name,
      description,
      category,
      subCategory,
      unit,
      minOrderQuantity,
      price,
      discountedPrice,
      stock,
      images,
      isAvailable
    } = req.body;

    await product.update({
      name,
      description,
      category,
      subCategory,
      unit,
      minOrderQuantity,
      price,
      discountedPrice,
      stock,
      images,
      isAvailable
    });

    res.status(200).json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Delete a product (suppliers only)
router.delete('/:id', authenticateToken, authorizeRole(['supplier']), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the product belongs to the supplier
    if (product.supplierId !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }

    await product.destroy();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router; 