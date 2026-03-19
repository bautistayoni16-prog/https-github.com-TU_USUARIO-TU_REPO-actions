// inventario.js

const express = require('express');
const router = express.Router();

// Mock database for inventory
let inventory = [
    { id: 1, name: 'Product A', stock: 50 },
    { id: 2, name: 'Product B', stock: 20 },
    { id: 3, name: 'Product C', stock: 5 },
];

// Endpoint to retrieve inventory
router.get('/', (req, res) => {
    res.json(inventory);
});

// Endpoint to update product stock
router.put('/update-stock/:id', (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;
    const product = inventory.find(item => item.id == id);

    if (product) {
        product.stock = stock;
        return res.json({ message: 'Stock updated', product });
    }
    res.status(404).json({ message: 'Product not found' });
});

// Endpoint to get low stock alerts
router.get('/low-stock', (req, res) => {
    const lowStockItems = inventory.filter(item => item.stock < 10);
    res.json(lowStockItems);
});

// Endpoint to auto-update inventory from sales
router.post('/update-from-sales', (req, res) => {
    const salesData = req.body;
    salesData.forEach(sale => {
        const product = inventory.find(item => item.id == sale.id);
        if (product) {
            product.stock -= sale.quantity;
        }
    });
    res.json({ message: 'Inventory updated from sales', inventory });
});

module.exports = router;