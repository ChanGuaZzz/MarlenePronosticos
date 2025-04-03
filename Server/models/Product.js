
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  matchDate: {
    type: Date,
    required: false,
  },
  forecastImageUrl: {
    type: String,
    required: true,
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isGiftCard: {
    type: Boolean,
    default: false,
  },
  giftCardCode: {
    type: String,
    required: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model("products", productSchema);

export default Product;