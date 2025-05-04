const mongoose = require('mongoose');

const lendingTransactionSchema = new mongoose.Schema({
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SoldItem' }],
  customer: {
    name: { type: String, required: true },
    phone: { type: String }
  },
  totalPrice: Number,
  salesperson: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lending', lendingTransactionSchema);
