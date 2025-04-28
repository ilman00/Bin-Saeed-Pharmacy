// Controller example
const express = require('express');
const route = express.Router();
const SoldItems = require('../models/SoldItems'); // your model

route.get('/today-sales', async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);

    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    const sales = await SoldItems.find({
        saleDate: { $gte: startOfDay, $lte: endOfDay }
    });

    const grandTotal = sales.reduce((sum, sale) => sum + sale.total, 0);

    res.render('todaySale', { sales, grandTotal });
});

module.exports = route;