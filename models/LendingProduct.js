// models/Lending.js
const mongoose = require('mongoose');

const lendingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String },
  items: [
    {
      brand: String,
      formula: String,
      price: Number,
      discount: String,
      quantity: Number,
      total: Number
    }
  ],
  totalAmount: Number,
  date: { type: Date, default: Date.now },
  salesman: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // assuming auth
});

module.exports = mongoose.model('Lending', lendingSchema);
