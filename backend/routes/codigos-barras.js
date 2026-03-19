'use strict';

const express = require('express');
const router = express.Router();

// Example route for creating a barcode
router.post('/create', (req, res) => {
    // Logic for creating a barcode
    res.send('Barcode created');
});

// Example route for fetching a barcode
router.get('/:id', (req, res) => {
    const id = req.params.id;
    // Logic for fetching a barcode
    res.send(`Barcode with ID: ${id}`);
});

// Example route for deleting a barcode
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    // Logic for deleting a barcode
    res.send(`Barcode with ID: ${id} deleted`);
});

module.exports = router;