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
      total: Number,
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
        default: "per piece"
      },    
    }
  ],
  totalAmount: Number,
  
  date: { type: Date, default: Date.now },
  salesman: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // assuming auth
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lending', lendingSchema);
