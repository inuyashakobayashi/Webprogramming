const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  body: {
    title: {
      type: String,
      required: true
    },
    description: String,
    options: [{
      id: {
        type: Number,
        required: true
      },
      text: {
        type: String,
        required: true
      }
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
    fixed: [{
      type: Number,
      min: 1
    }]
  },
  security: {
    owner: {
      name: String,
      lock: {
        type: Boolean,
        default: false
      }
    },
    users: [{
      name: String,
      lock: {
        type: Boolean,
        default: false
      }
    }],
    visibility: {
      type: String,
      enum: ['lock', 'lack'],
      default: 'lack'
    }
  },
  share: {
    link: String,
    value: {
      type: String,
      required: true,
      unique: true
    }
  },
  adminToken: {
    type: String,
    required: true,
    unique: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
module.exports = mongoose.model('Poll', PollSchema);