const mongoose = require('mongoose');

const productShema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  formula: {
    type: String,
  },
  category: {
    type: String,
    enum: [
      'Antibiotic',
      'Antacid',
      'Painkiller',
      'NSAID',
      'Antihistamine',
      'Antiallergic',
      'Antidiabetic',
      'Cholesterol',
      'Antihypertensive',
      'Blood Thinner',
      'Fever',
      'Analgesic'
    ],
    required: true
  },
  batchNumber: {
    type: String,
    // required: true
  },
  manufacturer: {
    type: String,
  },
  expiryDate: {
    type: Date,
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['per strip', 'per tablet', 'per pack', 'per unit'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  purchasePrice: {
    type: Number,
    required: true,
    min: 0
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productShema);
