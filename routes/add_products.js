const express = require('express');

const ProductModel = require('../models/productModel');
const isAuthenticated = require('../middlewares/auth')

const route = express.Router()

route.get('/add-product', isAuthenticated,(req, res) => {
    res.render('add_products')
})


// POST route to add new medicine
route.post('/add-product', isAuthenticated,async (req, res) => {
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

        res.redirect('/add-product?success=true'); // redirect to home or inventory list
    } catch (err) {
        console.error('Error adding medicine:', err);
        res.redirect('/add-product?success=false');
    }
});

module.exports = route