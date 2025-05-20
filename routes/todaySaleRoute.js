// Controller example
const express = require('express');
const route = express.Router();
const SoldItems = require('../models/SoldItems'); // your model
const isAuthenticated = require('../middlewares/auth')

route.get('/profit/today-sales', isAuthenticated, async (req, res) => {
    try {
      const dateStr = req.query.date || new Date().toISOString().split('T')[0];
  
      const selectedDate = new Date(dateStr);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
  
      const sales = await SoldItems.find({
        saleDate: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });
  
      const grandTotal = sales.reduce((sum, sale) => sum + sale.total, 0);
  
      res.render('todaySale', {
        sales,
        grandTotal,
        selectedDateStr: dateStr
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching sales');
    }
  });
  


module.exports = route;