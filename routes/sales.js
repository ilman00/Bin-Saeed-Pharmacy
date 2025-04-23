const express = require('express')
const ProductModel = require('../models/productModel');
const SoldItem = require('../models/SoldItems');
const SaleTransaction = require('../models/SaleTransaction');
const route = express.Router()

route.get('/sale-page', (req, res)=>{
    res.render('sale')
})

route.get('/api/sale', async (req, res)=>{
  try{
    const query = req.query.query;
    const data = await ProductModel.find({brand: {$regex: query, $options: 'i'}})
    console.log("log from sale : ", data[0]);
    res.status(200).json(data)
  }catch(err){
    res.status(500).json({error: err.message})
  }
})



route.post('/api/sale/update', async (req, res) => {
  try {
    const { items } = req.body;
    const user = req.user; // Assuming user is attached by auth middleware
    if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const soldItemIds = [];
    let totalAmount = 0;

    for (const item of items) {
      const med = await ProductModel.findOne({ brand: item.brand });
      if (!med) continue;

      if (med.stock >= item.quantity) {
        med.stock -= item.quantity;
        await med.save();

        const soldItem = await SoldItem.create({
          brand: med.brand,
          formula: med.formula,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          total: item.total,
          date: new Date()
        });


        soldItemIds.push(soldItem._id);
        totalAmount += item.total;
      }
    }

    const sale = await SaleTransaction.create({
      items: soldItemIds,
      totalPrice:totalAmount,
      salespersonId: user._id,
      salespersonName: user.name,
      date: new Date()
    });

    console.log("Sale created successfully:", sale);
    res.status(200).json({ success: true, saleId: sale._id });
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