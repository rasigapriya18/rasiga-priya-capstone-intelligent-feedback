const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    feedbackText: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['service', 'product', 'delivery', 'support', 'other'],
      default: 'other',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);