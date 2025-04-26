const express = require('express')
const ProductModel = require('../models/productModel');
const SoldItem = require('../models/SoldItems');
const SaleTransaction = require('../models/SaleTransaction');
const route = express.Router()
const  isAuthenticated = require('../middlewares/auth')

route.get('/sale-page', isAuthenticated, (req, res) => {
  const user = req.user;
  console.log('From sale.js',user);

  res.render('sale')
})

route.get('/api/sale' ,async (req, res) => {
  try {
    const query = req.query.query;
    const data = await ProductModel.find({ brand: { $regex: query, $options: 'i' } })
    console.log("log from sale : ", data[0]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }

  // TODO: Discount is not adding on the frontend
})








route.post('/api/sale/update', async (req, res) => {
  try {
    const { items } = req.body;
    const user = req.user; // Assuming user is attached by auth middleware
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const soldItemIds = [];
    let totalAmount = 0;
    let totalProfit = 0;

    for (const item of items) {
      const med = await ProductModel.findOne({ brand: item.brand });
      if (!med) continue;

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
      const totalCost = med.purchasePrice * item.quantity;
      const profit = totalSellingPrice - totalCost;
      totalProfit += profit;

      if (med.stock >= item.quantity) {
        med.stock -= item.quantity;
        await med.save();

        const soldItem = await SoldItem.create({
          brand: med.brand,
          formula: med.formula,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          total: totalSellingPrice,
          purchasePrice: med.purchasePrice,
          profit: profit,
          salespersonId: user._id,
          salespersonName: user.name,
          date: new Date()
        });

        soldItemIds.push(soldItem._id);
        totalAmount += totalSellingPrice;
      }
    }

    const saleTransaction = await SaleTransaction.create({
      items: soldItemIds,
      totalPrice: totalAmount,
      totalProfit: totalProfit,
      salespersonId: user._id,
      salespersonName: user.name,
      date: new Date()
    });

    console.log("Sale created successfully:", saleTransaction);
    res.status(200).json({ success: true, saleId: saleTransaction._id });
  } catch (err) {
    console.error("Sale update error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
















const mongoose = require('mongoose');

route.get('/reciept', async (req, res) => {
  try {
    const saleId = String(req.query.saleId); // force conversion to string

    if (!mongoose.Types.ObjectId.isValid(saleId)) {
      return res.status(400).render('error', {
        message: "Invalid receipt ID.",
        backLink: "/sale-page"
      });
    }

    const sale = await SaleTransaction.findById(saleId).populate('items');

    if (!sale) {
      return res.status(404).render('error', {
        message: "Receipt not found.",
        backLink: "/sale-page"
      });
    }

    res.render('receipt', { sale });
  } catch (err) {
    console.error("Error loading receipt:", err.message);
    res.status(500).render('error', {
      message: "Something went wrong while loading the receipt.",
      backLink: "/sale-page"
    });
  }
});



module.exports = route