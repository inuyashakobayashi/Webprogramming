// src/models/pollOption.model.js
const mongoose = require('mongoose');

const PollOptionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true       // entspricht allowNull: false
    },
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',        // Referenz auf Poll Model (n:1)
        required: true
    },
    votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote'         // 1:n Beziehung zu Votes
    }]
}, {
    timestamps: true        // erstellt automatisch createdAt und updatedAt
});

module.exports = mongoose.model('PollOption', PollOptionSchema);