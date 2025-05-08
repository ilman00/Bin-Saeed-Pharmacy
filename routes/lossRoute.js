const express = require('express');
const SoldItems = require('../models/SoldItems');
const isAuthenticated = require('../middlewares/auth');
const route = express.Router()

route.get('/loss', isAuthenticated ,async (req, res) => {
  try {
    const lossItems = await SoldItems.find({
      $expr: {
        $gt: [
          { $multiply: ["$purchasePrice", "$quantity"] },
          "$total"
        ]
      }
    }).sort({ saleDate: -1 });

    let totalLoss = 0;
    const formattedLossItems = lossItems.map(item => {
      const totalCost = item.purchasePrice * item.quantity;
      const totalItemLoss = totalCost - item.total;

      totalLoss += totalItemLoss;

      return {
        brand: item.brand,
        formula: item.formula,
        purchasePrice: item.purchasePrice,
        price: item.price,
        discount: item.discount,
        quantity: item.quantity,
        total: item.total,
        saleDate: item.saleDate,
        loss: totalItemLoss
      };
    });

    res.render('loss', { lossItems: formattedLossItems, totalLoss });

  } catch (error) {
    console.error('Error fetching loss data:', error);
    res.status(500).send('Server Error');
  }
});


module.exports = route; 
