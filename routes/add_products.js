const express = require('express');

const ProductModel = require('../models/productModel');

const route = express.Router()

route.get('/add-product', (req, res) => {
    res.render('add_products')
})


// POST route to add new medicine
route.post('/add-product', async (req, res) => {
    try {
        const {
            name,
            category,
            Batch,
            manufacturer,
            expiry,
            stock,
            price,
            dosage,
            discription
        } = req.body;

        const newMedicine = new ProductModel({
            name,
            category,
            Batch,
            manufacturer,
            expiry,
            stock,
            price,
            dosage,
            discription
        });

        await newMedicine.save();

        res.redirect('/dashboard'); // redirect to home or inventory list
    } catch (err) {
        console.error('Error adding medicine:', err);
        res.status(500).send('Server Error');
    }
});

module.exports = route