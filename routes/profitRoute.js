const express = require('express');
const router = express.Router();
const SoldItems = require('../models/SoldItems');

router.get('/profit/medicine', async (req, res) => {
    try {
        const allItems = await SoldItems.find();

        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        let totalProfit = 0;
        let todayProfit = 0;
        let thisMonthProfit = 0;

        const itemMap = new Map();

        for (const item of allItems) {
            const { brand, formula, price, purchasePrice, quantity, saleDate } = item;
            const profit = (price - purchasePrice) * quantity;

            totalProfit += profit;
            if (new Date(saleDate) >= startOfToday) todayProfit += profit;
            if (new Date(saleDate) >= startOfMonth) thisMonthProfit += profit;

            if (!itemMap.has(brand)) {
                itemMap.set(brand, {
                    brand,
                    formula,
                    purchasePrice,
                    salePrice: price,
                    quantitySold: 0,
                    profit: 0,
                });
            }

            const entry = itemMap.get(brand);
            entry.quantitySold += quantity;
            entry.profit += profit;
        }

        const items = Array.from(itemMap.values());

        res.render('profit', {
            totalProfit,
            todayProfit,
            thisMonthProfit,
            items
        });
    } catch (err) {
        console.error('Error generating profit summary:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
