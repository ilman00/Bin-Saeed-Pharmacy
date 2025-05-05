const express = require('express');

const route = express.Router();

const Product = require('../models/productModel');
const e = require('cors');

route.get('/low-stock', async (req, res) => {
    const lowStockMedicines = await Product.find({ stock: { $lt: 5 } });
    res.render('low_stock', { lowStockMedicines });
  });
  module.exports = route;