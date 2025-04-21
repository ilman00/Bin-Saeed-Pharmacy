const express = require('express');

const productModel = require('../models/productModel');

route = express.Router()

route.get('/add-product', (req, res) => {
    res.render('add_products')
})

module.exports = route