const { default: mongoose } = require("mongoose");
const Categories = require("../database/category.table");
const Product = require("../database/product.table");
const Users = require("../database/user.table");
const { uploadProductImages } = require("../middleware/multerConfig");

const addProduct = async (req, res) => {
  uploadProductImages(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: `Image upload error: ${err.message}` });
    }

    try {
      const {
        sellerId,
        name,
        desc,
        quan,
        price,
        type,
        categ,
        condition = "new",
      } = req.body;

      if (!sellerId || !name || !desc || !quan || !price || !type || !categ) {
        return res
          .status(400)
          .json({ message: "All required fields must be provided." });
      }

      const quantity = parseInt(quan, 10);
      const parsedPrice = parseFloat(price);

      if (isNaN(quantity) || quantity < 1) {
        return res.status(400).json({
          message: "Quantity must be a number greater than or equal to 1.",
        });
      }

      if (isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          message: "Price must be a number greater than or equal to 0.",
        });
      }

      // Handle image files
      const img =
        req.files.mainImage && req.files.mainImage[0]
          ? req.files.mainImage[0].filename
          : null;
      const moreImgs = req.files.additionalImages
        ? req.files.additionalImages.map((file) => file.filename)
        : [];

      if (!img) {
        return res.status(400).json({ message: "Main image is required." });
      }

      // Check for valid category ID
      const categoryExists = await Categories.findById(categ);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category ID." });
      }

      // Check for valid seller ID
      const sellerExists = await Users.findById(sellerId);
      if (!sellerExists) {
        return res.status(400).json({ message: "Invalid seller ID." });
      }

      // Create new product object
      const newProduct = new Product({
        sellerId,
        name,
        img,
        moreImgs,
        status: "available",
        desc,
        categ,
        type,
        quan: quantity,
        price: parsedPrice,
        condition,
        accepted: "pending",
      });

      // Save new product to the database
      await newProduct.save();

      // Respond with success message
      res
        .status(201)
        .json({ message: "Product added successfully.", product: newProduct });
    } catch (error) {
      res.status(500).json({ message: `Server error: ${error.message}` });
    }
  });
};

const updateProduct = async (req, res) => {
  uploadProductImages(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: `Image upload error: ${err.message}` });
    }

    try {
      const { productId } = req.params;
      const { name, desc, quan, price, type, categ, condition, status } =
        req.body;

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID." });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }

      if (name) product.name = name;
      if (desc) product.desc = desc;
      if (quan) product.quan = parseInt(quan, 10);
      if (price) product.price = parseFloat(price);
      if (type) product.type = type;
      if (categ) {
        const categoryExists = await Categories.findById(categ);
        if (!categoryExists) {
          return res.status(400).json({ message: "Invalid category ID." });
        }
        product.categ = categ;
      }
      if (condition) product.condition = condition;
      if (status) product.status = status;

      const newMainImage =
        req.files.mainImage && req.files.mainImage[0]
          ? req.files.mainImage[0].filename
          : null;
      const newAdditionalImages = req.files.additionalImages
        ? req.files.additionalImages.map((file) => file.filename)
        : [];

      if (newMainImage) {
        product.img = newMainImage;
      }

      if (newAdditionalImages.length > 0) {
        product.moreImgs = newAdditionalImages;
      }

      if (product.quan < 1) {
        return res
          .status(400)
          .json({ message: "Quantity must be greater than or equal to 1." });
      }
      if (product.price < 0) {
        return res
          .status(400)
          .json({ message: "Price must be greater than or equal to 0." });
      }

      await product.save();

      res
        .status(200)
        .json({ message: "Product updated successfully.", product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Server error: ${error.message}` });
    }
  });
};

const getProducts = async (req, res) => {
  try {
    const { status, accepted, condition, quan, type, sort, categ, sellerId } =
      req.query;

    const filter = {};

    if (status) filter.status = { $in: status.split(",") };
    if (sellerId) {
      filter.sellerId = { $in: sellerId.split(",") };
    }
    if (categ) filter.categ = { $in: categ.split(",") };
    if (accepted) filter.accepted = { $in: accepted.split(",") };
    if (condition) filter.condition = { $in: condition.split(",") };
    if (quan !== undefined) filter.quan = { $gte: parseInt(quan, 10) };
    if (type) filter.type = { $in: type.split(",") };

    let sortOptions = {};
    if (sort) {
      switch (sort) {
        case "PLH":
          sortOptions = { price: 1 };
          break;
        case "PHL":
          sortOptions = { price: -1 };
          break;
        case "NAZ":
          sortOptions = { name: 1 };
          break;
        case "NZA":
          sortOptions = { name: -1 };
          break;
        default:
          break;
      }
    }

    const products = await Product.find(filter)
      .populate("sellerId", "firstName lastName")
      .populate("categ", "name")
      .sort(sortOptions);

    const formattedProducts = products.map((product) => {
      const sellerName = product.sellerId
        ? `${product.sellerId.firstName} ${product.sellerId.lastName}`
        : "Unknown Seller";
      return {
        ...product.toObject(),
        sellerName,
        categoryName: product.categ?.name || "Unknown Category",
      };
    });

    res.status(200).json({
      success: true,
      data: formattedProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching data.",
    });
  }
};

const acceptProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndUpdate(
      { _id: id },
      { accepted: "accepted" },
      { new: true }
    )
      .populate("sellerId", "firstName lastName email")
      .populate("categ", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "The product was not found or is already accepted.",
      });
    }

    res.status(200).json({
      success: true,
      message: "The product has been updated successfully.",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the product.",
    });
  }
};

const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndUpdate(
      { _id: id },
      { accepted: "rejected" },
      { new: true }
    )
      .populate("sellerId", "firstName lastName email")
      .populate("categ", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "The product was not found or is already accepted.",
      });
    }

    res.status(200).json({
      success: true,
      message: "The product has been updated successfully.",
      data: product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the product.",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
const updateProductStatusToSold = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.status === "sold") {
      return res
        .status(400)
        .json({ message: "Product is already marked as sold." });
    }

    product.status = "sold";
    await product.save();

    res
      .status(200)
      .json({ message: "Product status updated to sold.", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to update product status: ${error.message}` });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required.",
      });
    }

    const product = await Product.findById(id)
      .populate("sellerId", "firstName lastName")
      .populate("categ", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const sellerName = product.sellerId
      ? `${product.sellerId.firstName} ${product.sellerId.lastName}`
      : "Unknown Seller";

    const formattedProduct = {
      ...product.toObject(),
      sellerName,
      categoryName: product.categ?.name || "Unknown Category",
    };

    res.status(200).json({
      success: true,
      data: formattedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the product.",
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  acceptProduct,
  rejectProduct,
  updateProduct,
  deleteProduct,
  updateProductStatusToSold,
  getProductById,
};
