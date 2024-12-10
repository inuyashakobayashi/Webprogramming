const mongoose = require('mongoose');

// Deine MongoDB-Verbindungs-URL
const dbURI = 'mongodb://localhost:27017/deineDatenbank'; // Lokal (alternativ Atlas URL verwenden)

// Optionen für die Mongoose-Verbindung
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Timeout für die Verbindung
    useFindAndModify: false, // Deprecated Methoden vermeiden
    useCreateIndex: true, // Verhindert Fehler bei Indizes
};

// Funktion zur Herstellung der MongoDB-Verbindung
const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, options);
        console.log('Datenbank verbunden');
    } catch (err) {
        console.error('Fehler bei der Verbindung zur Datenbank', err);
        process.exit(1); // Bei einem Fehler beende die Anwendung
    }
};

module.exports = connectDB;
