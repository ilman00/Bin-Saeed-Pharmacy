const express = require('express')
const ProductModel = require('../models/productModel');
const isAuthenticated = require('../middlewares/auth');
const route = express.Router()

// Controller for medicine dashboard
route.get('/dashboard', isAuthenticated, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const search = req.query.search || '';
  
    const query = {
      $or: [
        { brand: { $regex: search, $options: 'i' } },
        { formula: { $regex: search, $options: 'i' } }
      ]
    };
  
    try {
      const total = await ProductModel.countDocuments(query);
      const data = await ProductModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
  
      const totalPages = Math.ceil(total / limit);
  
      res.render('dashboard', {
        data,
        currentPage: page,
        totalPages,
        search,
        user: req.user
      });
    } catch (err) {
      console.error('Search + Pagination error:', err);
      res.status(500).send('Server error');
    }
  });
  
  route.get('/api/products', isAuthenticated, async (req, res) => {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
  
    const query = {
      $or: [
        { brand: { $regex: search, $options: 'i' } },
        { formula: { $regex: search, $options: 'i' } }
      ]
    };
  
    try {
      const total = await ProductModel.countDocuments(query);
      const products = await ProductModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.json({
        products,
        currentPage: page,
        totalPages: Math.ceil(total / limit)
      });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  


module.exports = route