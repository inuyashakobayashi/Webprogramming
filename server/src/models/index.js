const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/pollock', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB verbunden'))
    .catch(err => console.log('MongoDB Verbindungsfehler:', err));