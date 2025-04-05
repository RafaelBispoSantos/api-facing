const mongoose = require('mongoose');

const storeTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    enum: ['atacarejo', 'varejo', 'contasGlobais']
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const StoreType = mongoose.model('StoreType', storeTypeSchema);

module.exports = StoreType;