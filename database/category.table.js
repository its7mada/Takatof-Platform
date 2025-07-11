const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Categories = mongoose.model("Categories", categoriesSchema);

module.exports = Categories;
