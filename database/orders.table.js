const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: { type: String,enum:["pending","sold","canceled","accepted","rejected"], default: "pending" },
  contactInfo: {
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    address2: { type: String, required: false },
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);