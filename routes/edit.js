const express = require('express')
const ProductModel = require('../models/productModel');

const route = express.Router()

route.get('/edit/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const product = await ProductModel.findById(id);
        res.render('edit_medicine', {product});

    }catch(err){

    }
});

route.post('/edit', async (req, res) => {
    const { id, name, stock, expiry, price, category, type } = req.body;
  
    try {
      await ProductModel.findByIdAndUpdate(id, {
        name,
        stock,
        expiry,
        price,
        category,
        type
      });
  
      res.redirect('/dashboard'); // or wherever you want to go after editing
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to update medicine");
    }
  });
  
module.exports =route