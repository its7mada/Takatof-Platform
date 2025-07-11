const Cart = require('../database/cart.table');
const Products = require('../database/product.table');
const Users = require('../database/user.table');

const gitCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        model: "Products",
        select: "name img moreImgs status desc categ type price condition",
        populate: {
          path: "sellerId",
          model: "Users",
          select: "firstName middleName lastName", // اختيار حقل اسم البائع فقط
        },
      })
      .exec();

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    let cart = await Cart.findOne({ userId });

    if (cart) {
      const existingItem = cart.items.find((item) => item.productId.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    } else {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }],
      });

      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the cart." });
  }
}

const deleteItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found for the user." });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in the cart." });
    }

    cart.items.splice(productIndex, 1);

    cart = await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while removing the item from the cart." });
  }
}

const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity === undefined || quantity < 1) {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found for the user." });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ error: "Product not found in the cart." });
    }

    cart.items[productIndex].quantity = quantity;

    cart = await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the quantity." });
  }
}

const gitUserCartCaount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found for the user." });
    }

    const productCount = cart.items.length;

    res.status(200).json({ productCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the product count." });
  }
}

module.exports = {
  gitCartByUserId,
  addToCart,
  deleteItem,
  updateQuantity,
  gitUserCartCaount
}