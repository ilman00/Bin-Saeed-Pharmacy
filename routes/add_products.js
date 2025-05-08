const express = require('express');

const ProductModel = require('../models/productModel');
const isAuthenticated = require('../middlewares/auth')

const route = express.Router()

route.get('/add-product', isAuthenticated,(req, res) => {
    res.render('add_products')
})


// POST route to add new medicine
route.post('/add-product', isAuthenticated, async (req, res) => {
    try {
        const {
            brand,
            formula,
            category,
            Batch,
            manufacturer,
            expiryDate,
            stock,
            unit,
            price,
            purchasePrice,
            type,
            discription
        } = req.body;

        // Check if a product with the same brand already exists
        const existingProduct = await ProductModel.findOne({ brand: brand.trim() });
        if (existingProduct) {
            // Redirect with a duplicate flag
            return res.redirect('/add-product?duplicate=true');
        }

        const newMedicine = new ProductModel({
            brand,
            formula,
            category,
            Batch,
            manufacturer,
            expiryDate,
            stock,
            unit,
            price,
            purchasePrice,
            type,
            discription
        });

        await newMedicine.save();
        res.redirect('/add-product?success=true');

    } catch (err) {
        console.error('Error adding medicine:', err);
        res.redirect('/add-product?success=false');
    }
});


module.exports = route