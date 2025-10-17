const express = require('express');
const router = express.Router();
const SaleTransaction = require('../models/SaleTransaction'); // Adjust path to your model

// --------------------
// JSON API for dynamic loading
// --------------------
router.get('/history/data', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = {};

    // ----- Date filter -----
    if (req.query.date) {
      // Use UTC-safe date parsing
      const searchDate = req.query.date; // e.g., "2025-10-12"
      const startOfDay = new Date(`${searchDate}T00:00:00.000Z`);
      const endOfDay = new Date(`${searchDate}T23:59:59.999Z`);

      query.createdAt = {
        $gte: startOfDay,
        $lte: endOfDay
      };
    }

    // ----- Get total count -----
    const totalTransactions = await SaleTransaction.countDocuments(query);
    const totalPages = Math.ceil(totalTransactions / limit);

    // ----- Fetch paginated transactions -----
    const transactions = await SaleTransaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('salesperson.id', 'name')
      .populate('items')
      .lean();

    // Flatten salesperson name for easy rendering
    transactions.forEach(tx => {
      tx.salespersonName = tx.salesperson?.id?.name || 'N/A';
    });

    res.json({
      success: true,
      transactions,
      currentPage: page,
      totalPages,
      totalTransactions
    });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction history',
      error: error.message
    });
  }
});

// --------------------
// Initial page render for EJS
// --------------------
router.get('/history', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalTransactions = await SaleTransaction.countDocuments();
    const totalPages = Math.ceil(totalTransactions / limit);

    const transactions = await SaleTransaction.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('salesperson.id', 'name')
      .populate('items')
      .lean();

    transactions.forEach(tx => {
      tx.salespersonName = tx.salesperson?.id?.name || 'N/A';
    });

    res.render('history', {
      transactions,
      currentPage: page,
      totalPages
    });

  } catch (error) {
    console.error('Error loading history page:', error);
    res.status(500).send('Error loading history');
  }
});

module.exports = router;
