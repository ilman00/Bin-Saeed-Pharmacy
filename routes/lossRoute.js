const express = require('express');
const SoldItems = require('../models/SoldItems');

const route = express.Router()

route.get('/loss', async (req, res) => {
  try {
    const lossItems = await SoldItems.find({
      $expr: {
        $gt: [
          { $multiply: ["$purchasePrice", "$quantity"] },
          "$total" // here, directly the field total
        ]
      }
    });
    
    console.log(lossItems);
    let totalLoss = 0;
    const formattedLossItems = lossItems.map(item => {
      const lossPerItem = item.purchasePrice - item.price;
      const totalItemLoss = lossPerItem * item.quantity;
      totalLoss += totalItemLoss;
      return {
        brand: item.brand,
        formula: item.formula,
        purchasePrice: item.purchasePrice,
        price: item.price,
        quantity: item.quantity,
        saleDate: item.saleDate,
        loss: totalItemLoss
      };
    });
    console.log(formattedLossItems[0], totalLoss);
    res.render('loss', { lossItems: formattedLossItems, totalLoss });

  } catch (error) {
    console.error('Error fetching loss data:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = route; 
