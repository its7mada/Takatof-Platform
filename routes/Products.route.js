const express = require("express");
const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  acceptProduct,
  rejectProduct,
  updateProductStatusToSold,
  getProductById,
} = require("../controllers/products.controller");
const router = express.Router();

router.post("/add", addProduct);
router.put("/:productId", updateProduct);
router.get("/get", getProducts);
router.patch("/accept/:id", acceptProduct);
router.patch("/reject/:id", rejectProduct);
router.patch("/toSold/:id", updateProductStatusToSold);
router.delete("/:productId", deleteProduct);
router.get("/get/:id", getProductById);
module.exports = router;
