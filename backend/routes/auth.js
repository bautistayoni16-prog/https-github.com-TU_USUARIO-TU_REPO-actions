'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Mock users database
const users = [];

// Register endpoint
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(user => user.username === username)) {
        return res.status(400).send('User already exists');
    }
    users.push({ username, password });
    res.status(201).send('User registered');
});

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user || user.password !== password) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
});

// Token validation endpoint
router.get('/validate', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }
    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        res.json({ valid: true, username: decoded.username });
    });
});

module.exports = router;