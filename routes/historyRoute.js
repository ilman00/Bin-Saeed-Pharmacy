const express = require('express'); 

const route = express.Router();

const SaleTransaction = require('../models/SaleTransaction'); // adjust path

route.get('/history', async (req, res) => {
  try {
    const transactions = await SaleTransaction.find()
      .populate('items') // populate item details
      .sort({ createdAt: -1 }); // latest first

    res.render('history', { transactions });
  } catch (err) {
    console.error(err);
    res.send('Error loading transactions');
  }
});

module.exports = route;