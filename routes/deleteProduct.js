const express = require('express');
const route = express.Router()
const isAuthenticated = require('../middlewares/auth')
const ProductModel = require('../models/productModel')

route.post('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id;
        await ProductModel.findByIdAndDelete(id);
        res.redirect('/dashboard?success=true');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard?success=false');
    }
})

module.exports = route
