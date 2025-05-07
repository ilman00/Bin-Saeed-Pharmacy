const express = require('express'); 
const isAuthenticated = require('../middlewares/auth')
const route = express.Router();

const SaleTransaction = require('../models/SaleTransaction'); // adjust path



// routes/history.js (or wherever you defined it)
route.get('/history', isAuthenticated, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const totalCount = await SaleTransaction.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    const transactions = await SaleTransaction.find()
      .populate('items')
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // If it's an AJAX request, return JSON
    if (req.xhr) {
      return res.json({ transactions, currentPage: page, totalPages });
    }

    // Otherwise, render the full page (first load)
    res.render('history', { transactions, totalPages, currentPage: page });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading transactions');
  }
});

route.get('/history/data', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const totalTransactions = await SaleTransaction.countDocuments();
  const transactions = await SaleTransaction.find()
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('items')
    .populate('salesperson');

  res.json({
    transactions,
    currentPage: page,
    totalPages: Math.ceil(totalTransactions / limit)
  });
});



module.exports = route;