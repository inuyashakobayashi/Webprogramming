const express = require('express');
const connectDB = require('./config/db');
const pollRoutes = require('./routes/poll.routes');

const app = express();

// Middleware
app.use(express.json());

// Verbinde zur Datenbank VOR dem Server-Start
const startServer = async () => {
    try {
        // Warte auf Datenbankverbindung
        await connectDB();

        // Routes
        app.use('/poll', pollRoutes);

        // Starte Server
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server läuft auf http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Server Startfehler:', error);
        process.exit(1);
    }
};

startServer();