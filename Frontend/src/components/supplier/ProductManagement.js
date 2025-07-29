import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Mock data for products
  const products = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      category: 'vegetables',
      price: 25,
      unit: 'kg',
      stock: 150,
      minOrder: 10,
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150',
      description: 'Fresh, organic tomatoes sourced directly from local farms.'
    },
    {
      id: 2,
      name: 'Organic Apples',
      category: 'fruits',
      price: 80,
      unit: 'kg',
      stock: 80,
      minOrder: 5,
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150',
      description: 'Crisp and sweet organic apples, perfect for daily consumption.'
    },
    {
      id: 3,
      name: 'Premium Rice',
      category: 'grains',
      price: 45,
      unit: 'kg',
      stock: 200,
      minOrder: 20,
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150',
      description: 'High-quality basmati rice with long grains and aromatic flavor.'
    },
    {
      id: 4,
      name: 'Fresh Spinach',
      category: 'vegetables',
      price: 30,
      unit: 'kg',
      stock: 60,
      minOrder: 5,
      image: 'https://images.unsplash.com/photo-1577931387807-f6692b6e56b9?w=150',
      description: 'Organic spinach leaves, rich in iron and vitamins.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'grains', name: 'Grains' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'spices', name: 'Spices' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = (productData) => {
    // In a real app, this would make an API call
    console.log('Adding product:', productData);
    setShowAddModal(false);
  };

  const handleDeleteProduct = (productId) => {
    // In a real app, this would make an API call
    console.log('Deleting product:', productId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
            <p className="mt-1 text-gray-600">Manage your product catalog and inventory</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="mt-4 md:mt-0 btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-soft rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="input pl-10 w-full"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <select
                  className="input"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-soft overflow-hidden hover:shadow-medium transition-shadow">
                <div className="p-6">
                  <div className="flex items-start">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{product.category}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-sm font-medium text-gray-900">₹{product.price}/{product.unit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">In Stock</p>
                      <p className="text-sm font-medium text-gray-900">{product.stock} {product.unit}</p>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  
                  <div className="mt-4 flex space-x-3">
                    <button className="flex-1 btn-outline flex items-center justify-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="btn-danger flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-soft p-12 text-center">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary inline-flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal 
          onClose={() => setShowAddModal(false)} 
          onAdd={handleAddProduct} 
        />
      )}
    </div>
  );
};

// Add Product Modal Component
const AddProductModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'vegetables',
    price: '',
    unit: 'kg',
    stock: '',
    minOrder: '',
    description: ''
  });

  const categories = [
    { id: 'vegetables', name: 'Vegetables' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'grains', name: 'Grains' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'spices', name: 'Spices' }
  ];

  const units = [
    { id: 'kg', name: 'Kilograms (kg)' },
    { id: 'g', name: 'Grams (g)' },
    { id: 'L', name: 'Liters (L)' },
    { id: 'pcs', name: 'Pieces (pcs)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">Add New Product</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="input mt-1"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input mt-1"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="input mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
                  <select
                    id="unit"
                    name="unit"
                    required
                    value={formData.unit}
                    onChange={handleChange}
                    className="input mt-1"
                  >
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="input mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="minOrder" className="block text-sm font-medium text-gray-700">Min. Order</label>
                  <input
                    type="number"
                    id="minOrder"
                    name="minOrder"
                    required
                    min="1"
                    value={formData.minOrder}
                    onChange={handleChange}
                    className="input mt-1"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="input mt-1"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
