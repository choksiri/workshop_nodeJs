const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    inStock: { type: Number, required: true }
  }, {
    timestamps: true
  });

module.exports = mongoose.model('products',productSchema);