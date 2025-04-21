const express = require('express');
const router = express.Router();
const ProductModel = require('../models/productModel');

router.get('/api/medicines/search', async (req, res) => {
    try {
        const query = req.query.query || '';
        const regex = new RegExp(query, 'i');

        const results = await ProductModel.find({
            $or: [{ name: regex }, { category: regex }],
        }).limit(10);
        console.log(results);
        res.json(results);
    } catch (err) {
        console.error('Search error:', err.message);
        res.status(500).json({ error: 'Something went wrong during search.' });
    }
});


module.exports = router;
