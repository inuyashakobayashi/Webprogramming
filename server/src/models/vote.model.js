const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    owner: {
        name: { 
            type: String, 
            required: true 
        }
    },
    choice: [{
        id: { 
            type: Number, 
            required: true 
        },
        worst: { 
            type: Boolean, 
            default: false 
        }
    }],
    editToken: {
        type: String,
        unique: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Vote', VoteSchema);