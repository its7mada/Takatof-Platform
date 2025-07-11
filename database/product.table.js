const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    ref: "Users",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  moreImgs: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    required: true,
    enum: ["available", "requested", "sold"],
    default: "available",
  },
  desc: {
    type: String,
    required: true,
  },
  categ: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categories",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["single", "group"],
  },
  quan: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  accepted: {
    type: String,
    enum: ["accepted", "rejected", "pending"],
    default: "pending",
  },
  condition: {
    type: String,
    required: true,
    enum: ["new", "used"],
    default: "new"
  }
}, {
  timestamps: true,
});

const Products = mongoose.model("Products", productsSchema);

module.exports = Products;
