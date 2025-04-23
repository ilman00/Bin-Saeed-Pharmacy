const mongoose = require('mongoose');
const SoldItemSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  formula: { type: String },
  price: { type: Number, required: true }, // original price
  discount: { type: String, default: "" }, // e.g. "10%" or "15"
  quantity: { type: Number, default: 1 },
  total: { type: Number, required: true }, // price after discount * quantity
  stockAtTimeOfSale: { type: Number }, // optional
  saleDate: { type: Date, default: Date.now }
});

const SoldItem = mongoose.model('SoldItem', SoldItemSchema);

module.exports = SoldItem;