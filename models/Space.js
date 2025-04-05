// backend/models/Space.js

const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
  productType: {
    type: String,
    required: true,
    trim: true
  },
  totalSpace: {
    type: Number,
    required: true,
    min: 0.01
  },
  allocatedSpace: {
    type: Number,
    required: true,
    min: 0.01
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const spaceSchema = new mongoose.Schema({
  // Você pode:
  // 1. Remover completamente o campo name
  // OU
  // 2. Torná-lo opcional como mostrado abaixo:
  name: {
    type: String,
    required: true, // Alterado de true para false
    trim: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeType: {
    type: String,
    required: true,
    enum: ['atacarejo', 'varejo', 'contasGlobais']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  measurements: [measurementSchema]
}, {
  timestamps: true
});

const Space = mongoose.model('Space', spaceSchema);

module.exports = Space;