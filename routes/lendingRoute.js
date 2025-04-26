// routes/lending.js (or inside your existing sale route file)
const express = require('express');
const router = express.Router();
const Lending = require('../models/LendingProduct');

router.post('/api/lend', async (req, res) => {
  try {
    const { customerName, phone, items, totalAmount } = req.body;

    const lend = new Lending({
      customerName,
      phone,
      items,
      totalAmount,
      salesman: req.user._id // if using session/user auth
    });

    const savedLend = await lend.save();
    res.json({ success: true, lendId: savedLend._id });

  } catch (err) {
    console.error("Lend Save Error:", err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
