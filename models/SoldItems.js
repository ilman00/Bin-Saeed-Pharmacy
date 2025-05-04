const mongoose = require('mongoose');
const SoldItemSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  formula: { type: String },
  price: { type: Number, required: true }, // original price
  discount: { type: String, default: "" }, // e.g. "10%" or "15"
  quantity: { type: Number, default: 1 },
  total: { type: Number, required: true }, // price after discount * quantity
  stockAtTimeOfSale: { type: Number }, // optional
  // SoldItem schema (add these)
  purchasePrice: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    enum: [
      "per strip", 
      "per tablet", 
      "per unit", 
      "per pack",
      "per bottle", 
      "per jar", 
      "per tube", 
      "per box", 
      "per piece"
    ],
    required: true
  },
  profit: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['purchased', 'lended'],
    default: 'purchased'
  },
  salesperson: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
    name: { type: String }
  },

  saleDate: { type: Date, default: Date.now }
});

const SoldItem = mongoose.model('SoldItem', SoldItemSchema);

module.exports = SoldItem;