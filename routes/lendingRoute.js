// routes/lending.js (or inside your existing sale route file)
const express = require('express');
const router = express.Router();
const Lending = require('../models/LendingProduct');
const isAuthenticated = require('../middlewares/auth');
const ProductModel = require('../models/productModel')
const SoldItem = require('../models/SoldItems');
const SaleTransaction = require('../models/SaleTransaction')
// routes/lending.js

router.get('/lending', isAuthenticated, async (req, res) => {
  try {
    const lendingData = await Lending.find()
      .populate('items') // Populates the SoldItem documents
      .sort({ createdAt: -1 });

    console.log(lendingData);
    res.render('lendingHistory', { lendingData });
  } catch (err) {
    console.error('Error fetching lending data:', err);
    res.status(500).send('Server Error');
  }
});


router.post('/delete-lending/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Lending.findByIdAndDelete(id);
    res.redirect('/lending?success=true');
  } catch (error) {
    // console.error('Error deleting lending:', error);
    // res.status(500).send('Server Error');
    res.redirect('/lending?success=false');

  }
})


router.post('/api/lend', isAuthenticated, async (req, res) => {
  try {
    const { customerName, phone, items, totalAmount } = req.body;
    const user = req.user;

    // Check authentication
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized user.' });
    }

    // Validate input
    if (!customerName || typeof customerName !== 'string') {
      return res.status(400).json({ success: false, message: 'Customer name is required and must be a string.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item is required.' });
    }

    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid total amount.' });
    }

    const soldItemIds = [];
    let failedItems = [];

    for (const item of items) {
      try {
        const med = await ProductModel.findOne({ brand: item.brand });
        if (!med) {
          failedItems.push({ brand: item.brand, reason: 'Medicine not found' });
          continue;
        }

        if (med.stock < item.quantity) {
          failedItems.push({ brand: item.brand, reason: 'Insufficient stock' });
          continue;
        }

        // Calculate discount
        let discountAmount = 0;
        if (typeof item.discount === 'string' && item.discount.includes('%')) {
          const discountPercent = parseFloat(item.discount) || 0;
          discountAmount = (item.price * discountPercent) / 100;
        } else {
          discountAmount = parseFloat(item.discount) || 0;
        }

        const discountedPrice = Math.round(item.price - discountAmount);
        const totalSellingPrice = discountedPrice * item.quantity;
        const profit = totalSellingPrice - (med.purchasePrice * item.quantity);

        med.stock -= item.quantity;
        await med.save();

        const soldItem = await SoldItem.create({
          brand: med.brand,
          formula: med.formula,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          unit: med.unit,
          total: totalSellingPrice,
          purchasePrice: med.purchasePrice,
          profit,
          type: 'lended', // clearly mark this item
          salesperson: {
            id: user._id,
            name: user.username
          },
          date: new Date()
        });
        

        soldItemIds.push(soldItem._id);
      } catch (itemErr) {
        failedItems.push({ brand: item.brand, reason: 'Internal error processing item' });
        console.error(`Error processing item ${item.brand}:`, itemErr);
      }
    }

    if (soldItemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items could be processed for lending.',
        failedItems
      });
    }

    const lendingRecord = await Lending.create({
      items: soldItemIds,
      customer: {
        name: customerName,
        phone: phone || ''
      },
      totalPrice: totalAmount,
      salesperson: {
        id: user._id,
        name: user.username
      },
      date: new Date()
    });

    res.status(200).json({
      success: true,
      lendingId: lendingRecord._id,
      message: 'Lending recorded successfully.',
      failedItems // optional: include what failed if partial success
    });

  } catch (err) {
    console.error("Lending error:", err);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while processing the lending.',
      error: err.message
    });
  }
});


router.post('/lending/settle', isAuthenticated, async (req, res) => {
  try {
    const { lendId } = req.body;

    const lendRecord = await Lending.findById(lendId).populate('items');
    if (!lendRecord) {
      return res.status(400).render('error', {
        message: "Lending record not found.",
        backLink: "/lending"
      });
    }

    // Update SoldItems
    await Promise.all(lendRecord.items.map(item => {
      item.type = "purchased";
      item.lendingId = null;
      return item.save();
    }));

    // Create SaleTransaction
    const sale = await SaleTransaction.create({
      items: lendRecord.items.map(item => item._id),
      totalPrice: lendRecord.totalPrice,
      totalProfit: lendRecord.items.reduce((sum, item) => sum + item.profit, 0),
      salesperson: lendRecord.salesperson,
      date: new Date()
    });

    // Delete the lending record
    await Lending.findByIdAndDelete(lendId);

    // ✅ Redirect to receipt
    res.redirect(`/sale/receipt?saleId=${sale._id}`);

  } catch (err) {
    console.error("Error settling lending:", err);
    res.status(500).render('error', {
      message: "Server error settling lending.",
      backLink: "/lending"
    });
  }
});

router.get('/sale/receipt', isAuthenticated, async (req, res) => {
  try {
    const saleId = req.query.saleId;
    const sale = await SaleTransaction.findById(saleId).populate('items');

    if (!sale) {
      return res.status(404).render('error', {
        message: "Sale not found",
        backLink: "/sale-page"
      });
    }

    res.render('receipt', { sale });

  } catch (err) {
    console.error("Error loading sale receipt:", err);
    res.status(500).render('error', {
      message: "Server error loading receipt.",
      backLink: "/sale-page"
    });
  }
});


router.post('/lending/return', isAuthenticated, async (req, res) => {
  try {
    const { lendId } = req.body;

    const lendRecord = await Lending.findById(lendId).populate('items');
    if (!lendRecord) {
      return res.status(404).json({ success: false, message: "Lending record not found" });
    }

    // Restore stock
    for (const item of lendRecord.items) {
      await ProductModel.updateOne(
        { brand: item.brand },
        { $inc: { stock: item.quantity } }
      );
    }

    // Option 1: Delete sold items and lending
    await SoldItem.deleteMany({ _id: { $in: lendRecord.items } });
    await Lending.findByIdAndDelete(lendId);

    res.redirect('/lending?success=returned');


  } catch (err) {
    console.error("Lending return error:", err);
    return res.status(500).json({ success: false, message: "Server error during return" });
  }
});




module.exports = router;
