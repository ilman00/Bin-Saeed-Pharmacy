const express = require('express');
const router = express.Router();
const SaleTransaction = require('../models/SaleTransaction');

// --------------------
// JSON API for dynamic loading
// --------------------
router.get('/history/data', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const searchTransaction = req.query.transaction;
    const query = {};

    // Only add search filter if search term exists
    if (searchTransaction && searchTransaction.trim() !== '') {
      query.transactionNumber = { $regex: searchTransaction.trim(), $options: 'i' };
    }

    const totalCount = await SaleTransaction.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const transactions = await SaleTransaction.find(query)
      .populate('salesperson', 'name')
      .populate('items')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      transactions,
      currentPage: page,
      totalPages
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Initial page render for EJS
// --------------------
router.get('/history', async (req, res) => {
  try {
    res.render('history');
  } catch (error) {
    console.error('Error loading history page:', error);
    res.status(500).send('Error loading history');
  }
});

module.exports = router;