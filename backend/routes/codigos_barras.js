// Routes for barcode search and management

const express = require('express');
const router = express.Router();

// Sample data for barcode management
let barcodes = [];

// Endpoint to search for a barcode
router.get('/search/:barcode', (req, res) => {
    const barcode = req.params.barcode;
    const found = barcodes.includes(barcode);
    res.json({ found });
});

// Endpoint to add a new barcode
router.post('/add', (req, res) => {
    const { barcode } = req.body;
    if(barcodes.includes(barcode)) {
        return res.status(400).json({ message: 'Barcode already exists' });
    }
    barcodes.push(barcode);
    res.status(201).json({ message: 'Barcode added successfully' });
});

// Endpoint to delete a barcode
router.delete('/delete/:barcode', (req, res) => {
    const barcode = req.params.barcode;
    barcodes = barcodes.filter(b => b !== barcode);
    res.json({ message: 'Barcode deleted successfully' });
});

module.exports = router;
