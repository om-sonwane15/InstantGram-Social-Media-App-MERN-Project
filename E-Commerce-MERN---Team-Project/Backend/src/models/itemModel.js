const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
    default: "",
  },
  category: {
    type: String,
    enum: ['Smartphones', 'Laptops & Tablets', 'Audio & Entertainment', 'Home Appliances','Accessories & Other Tech'],
    required: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
