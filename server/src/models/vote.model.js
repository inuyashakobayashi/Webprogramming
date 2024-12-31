const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },
  owner: {
    name: {
      type: String,
      required: true
    },
    lock: {
      type: Boolean,
      default: false
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
    required: true,
    unique: true
  },
  votedAt: {
    type: Date,
    default: Date.now
  }
});