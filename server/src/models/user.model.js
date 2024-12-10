// src/models/user.model.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true     // allowNull: false
    },
    password: {
        type: String,
        required: true
    },
    isLocked: {
        type: Boolean,
        default: false    // defaultValue wird zu default
    },
    polls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll'       // 1:n zu Polls
    }],
    votes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote'       // 1:n zu Votes
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);