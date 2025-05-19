const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  _id: { type: String, default: 'default' },
  session: { type: mongoose.Schema.Types.Mixed, required: true }
});

module.exports = mongoose.model('Session', SessionSchema);
