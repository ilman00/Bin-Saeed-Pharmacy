const express = require('express')
const ProductModel = require('../models/productModel');
const isAuthenticated = require('../middlewares/auth');
const route = express.Router()

route.get('/dashboard', isAuthenticated ,async (req, res) => {
    try {
        const data = await ProductModel.find();
        // console.log(data[0]);    
        const user = req.user;
        console.log(user);
        res.render('dashboard', { data: data, user: user });
    } catch (err) {
        console.log(err);
        res.send("Somthing went wrong")
    }

});


module.exports = route