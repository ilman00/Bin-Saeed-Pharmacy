// routes/lending.js (or inside your existing sale route file)
const express = require('express');
const router = express.Router();
const Lending = require('../models/LendingProduct');

// routes/lending.js

router.get('/lending', async (req, res) => {
  try {
    const lendingData = await Lending.find().sort({ createdAt: -1 });
    console.log(lendingData);
    res.render('lendingHistory', { lendingData });
  } catch (err) {
    console.error('Error fetching lending data:', err);
    res.status(500).send('Server Error');
  }
});






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
