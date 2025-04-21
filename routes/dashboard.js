const express = require('express')
const ProductModel = require('../models/productModel');

const route = express.Router()

route.get('/dashboard', async (req, res) => {
    try {
        const data = await ProductModel.find();
        console.log(data[0]);
        res.render('dashboard', { data: data });
    } catch (err) {
        console.log(err);
        res.send("Somthing went wrong")
    }

});

module.exports = route