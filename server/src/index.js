const express = require('express');
const connectDB = require('./config/db');
const pollRoutes = require('./routes/poll.routes');
const voteRoutes = require('./routes/vote.routes');
const userRoutes = require('./routes/user.routes')
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
        app.use('/vote',voteRoutes);
        app.use('/user',userRoutes)

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