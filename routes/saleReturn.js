const express = require('express');
const router = express.Router()

const ProductModel = require('../models/productModel')
const SoldItem = require('../models/SoldItems')
const SaleTransaction = require('../models/SaleTransaction')
const isAuthenticated = require('../middlewares/auth')

router.post('/sale/return', isAuthenticated, async (req, res) => {
  try {
    const { soldItemId, returnQuantity } = req.body;

    const soldItem = await SoldItem.findById(soldItemId);
    if (!soldItem) return res.status(404).json({ success: false, message: "Sold item not found" });

    const qtyToReturn = parseInt(returnQuantity);
    if (isNaN(qtyToReturn) || qtyToReturn < 1) {
      return res.status(400).json({ success: false, message: "Invalid return quantity" });
    }

    const originalQty = soldItem.quantity;
    if (qtyToReturn > originalQty) {
      return res.status(400).json({ success: false, message: "Return quantity exceeds sold quantity" });
    }

    // Restore stock
    const product = await ProductModel.findOne({ brand: soldItem.brand });
    if (product) {
      product.stock += qtyToReturn;
      await product.save();
    }

    // Calculate proportional total and profit for returned quantity
    const pricePerUnit = soldItem.price;
    const profitPerUnit = soldItem.profit / originalQty;

    const totalReturnAmount = pricePerUnit * qtyToReturn;
    const totalReturnProfit = profitPerUnit * qtyToReturn;

    // Update or delete SoldItem
    let fullReturn = false;
    if (qtyToReturn === originalQty) {
      // Full return
      await SoldItem.findByIdAndDelete(soldItemId);
      fullReturn = true;
    } else {
      // Partial return
      soldItem.quantity -= qtyToReturn;
      soldItem.total -= totalReturnAmount;
      soldItem.profit -= totalReturnProfit;
      await soldItem.save();
    }

    // Update the transaction
    const transaction = await SaleTransaction.findOne({ items: soldItemId });
    if (transaction) {
      if (fullReturn) {
        transaction.items.pull(soldItemId);
      }

      transaction.totalPrice -= totalReturnAmount;
      transaction.totalProfit -= totalReturnProfit;

      if (transaction.items.length === 0) {
        await SaleTransaction.findByIdAndDelete(transaction._id);
      } else {
        await transaction.save();
      }
    }

    return res.json({ success: true });

  } catch (err) {
    console.error('Return Error:', err);
    res.status(500).json({ success: false, message: "Server error while returning item." });
  }
});

  
  
  module.exports = router