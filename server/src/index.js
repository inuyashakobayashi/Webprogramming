// src/index.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Express app initialisieren
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes importieren
const pollRoutes = require('./routes/poll.routes');
// Test-Route
app.get('/test', (req, res) => {
    res.json({ message: 'Test erfolgreich!' });
});
// Routes verwenden
app.use('/poll', pollRoutes);

// Port aus .env oder default 3000
const port = process.env.PORT || 3000;
// 404 Handler - NACH allen anderen Routes
app.use((req, res) => {
    res.status(404).json({
        code: 404,
        message: "Route not found"
    });
});

// Error Handler - Ganz am Ende
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        code: 500,
        message: "Internal server error"
    });
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});