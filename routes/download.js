const express = require('express');
const { Parser } = require('json2csv');
const Product = require('../models/productModel');
const SoldItem = require('../models/SoldItems');
const router = express.Router();
const isAuthenticated = require('../middlewares/auth')

// Render download page
router.get('/download', isAuthenticated, (req, res) => {
  res.render('downloads'); // download.ejs file in views folder
});

// Download Products CSV
router.get('/download/products', isAuthenticated, async (req, res) => {
  try {
    const products = await Product.find().lean();

    const fields = [
      'brand',
      'formula',
      'category',
      'manufacturer',
      {
        label: 'Expiry Date',
        value: row => {
          const date = new Date(row.expiryDate);
          return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
        }
      },
      'stock',
      'unit',
      'price',
      'purchasePrice',
      'type',
      'description',
      {
        label: 'Created At',
        value: row => {
          const date = new Date(row.createdAt);
          return isNaN(date.getTime()) ? '' : date.toISOString();
        }
      }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(products);

    res.header('Content-Type', 'text/csv');
    res.attachment('products.csv');
    res.send(csv);
  } catch (err) {
    console.error('Error in /download/products:', err);
    res.status(500).send('Failed to generate products CSV');
  }
});

// Download Sales CSV (SoldItems)
router.get('/download/sales', isAuthenticated, async (req, res) => {
  try {
    const { range } = req.query;
    let filter = {};

    if (range === 'last-month') {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      filter.saleDate = { $gte: firstDay, $lte: lastDay };
    }

    const sales = await SoldItem.find(filter).lean();

    const fields = [
      'brand',
      'formula',
      'price',
      'purchasePrice',
      'discount',
      'quantity',
      'unit',
      'total',
      'profit',
      'type',
      { label: 'Sale Date', value: row => row.saleDate?.toISOString().split('T')[0] },
      { label: 'Salesperson', value: row => row.salesperson?.name || '' }
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(sales);

    res.header('Content-Type', 'text/csv');
    res.attachment(`sales-${range || 'all'}.csv`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate sales CSV');
  }
});

module.exports = router;

