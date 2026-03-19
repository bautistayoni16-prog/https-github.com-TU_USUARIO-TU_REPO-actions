// GLOBAL-TECH POS System Implementation

const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database(':memory:'); // or your actual database file
app.use(bodyParser.json());

// JWT secret
const JWT_SECRET = 'your_jwt_secret'; // Change this to your actual secret

// Initialize database schema
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT);`);
    db.run(`CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL);`);
    db.run(`CREATE TABLE IF NOT EXISTS ventas (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario_id INTEGER, total REAL, fecha TEXT, FOREIGN KEY (usuario_id) REFERENCES usuarios(id));`);
    db.run(`CREATE TABLE IF NOT EXISTS detalles_venta (id INTEGER PRIMARY KEY AUTOINCREMENT, venta_id INTEGER, producto_id INTEGER, cantidad INTEGER, FOREIGN KEY (venta_id) REFERENCES ventas(id), FOREIGN KEY (producto_id) REFERENCES productos(id));`);
    db.run(`CREATE TABLE IF NOT EXISTS cortes_caja (id INTEGER PRIMARY KEY AUTOINCREMENT, total REAL, fecha TEXT);`);
    db.run(`CREATE TABLE IF NOT EXISTS reportes_diarios (id INTEGER PRIMARY KEY AUTOINCREMENT, fecha TEXT, total REAL);`);
    db.run(`CREATE TABLE IF NOT EXISTS alertas_inventario (id INTEGER PRIMARY KEY AUTOINCREMENT, producto_id INTEGER, cantidad_baja INTEGER, FOREIGN KEY (producto_id) REFERENCES productos(id));`);
});

// Middleware for authenticating JWT tokens
function authenticateJWT(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

// API routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Logic to check credentials, omitted for brevity
    const user = { username }; // This would be fetched from DB
    const token = jwt.sign(user, JWT_SECRET);
    res.json({ token });
});

app.get('/productos', authenticateJWT, (req, res) => {
    db.all(`SELECT * FROM productos`, [], (err, rows) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(rows);
    });
});

// Other routes for ventas, cortes_caja, reportes_diarios, and alertas_inventario can be defined similarly.

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
