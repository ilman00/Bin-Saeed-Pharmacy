const express = require('express')
const productModel = require('../models/productModel');

const route = express.Router()

route.get('/sale', async (req, res) => {
    const ids = req.query.ids.split(',');
    const medicines = await productModel.find({ _id: { $in: ids } });
    res.render('sales', { medicines });
  });
  

module.exports =route