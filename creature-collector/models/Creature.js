const mongoose = require('mongoose');

const creatureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Creature name is required'],
    trim: true,
  },
  power: {
    type: String,
    trim: true,
    default: 'Unknown',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Creature', creatureSchema);
