const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Medicine', 'Cosmetic'],
        required: true,
    },
    brand: {
        type: String,
        default: 'Generic',
    },
    description: {
        type: String,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    expiry: {
        type: Date,
        // Only required if it's a medicine
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Product', productSchema);
