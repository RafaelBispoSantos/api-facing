const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  rules: {
    atacarejo: {
      description: String,
      minimumPercentage: Number,
      maximumPercentage: Number
    },
    varejo: {
      description: String,
      minimumPercentage: Number,
      maximumPercentage: Number
    },
    contasGlobais: {
      description: String,
      minimumPercentage: Number,
      maximumPercentage: Number
    }
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;