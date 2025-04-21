const express = require('express')
const productModel = require('../models/productModel');

const route = express.Router()

route.get('/edit', (req, res) => {
    res.render('edit_medicine');
});

module.exports =route