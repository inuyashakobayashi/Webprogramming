// src/models/poll.model.js
const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    options: [{
        id: Number,
        text: String,
        votes: [{
            userId: String,
            isWorst: {
                type: Boolean,
                default: false
            },
            votedAt: {
                type: Date,
                default: Date.now
            },
            editToken: String
        }]
    }],
    setting: {
        voices: {
            type: Number,
            min: 1
        },
        worst: {
            type: Boolean,
            default: false
        },
        deadline: Date
    },
    shareToken: {
        type: String,
        unique: true,
        required: true
    },
    adminToken: {
        type: String,
        unique: true,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
});

module.exports = mongoose.model('Poll', PollSchema);