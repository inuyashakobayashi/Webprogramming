const express = require('express');
const connectDB = require('./config/db');
const pollRoutes = require('./routes/poll.routes');

const app = express();

// Middleware
app.use(express.json());

// Debug-Log
console.log('Index - Routes Import:', pollRoutes);

// Routes einbinden
app.use('/api/polls', pollRoutes);

// Server starten
app.listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000');
});