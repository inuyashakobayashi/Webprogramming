const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    isWorst: {
        type: Boolean,
        default: false
    },
    editToken: {
        type: String,
        unique: true
    },
    votedAt: {
        type: Date,
        default: Date.now  // DataTypes.NOW wird zu Date.now
    },
    // Referenzen zu anderen Models
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    pollOptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PollOption',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vote', VoteSchema);