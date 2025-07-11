const mongoose = require("mongoose");
const Cart = require("../database/cart.table");
const Orders = require("../database/orders.table");
const Products = require("../database/product.table");
const Users = require("../database/user.table");
const { request } = require("express");

module.exports.checkout = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, contactInfo } = req.body;

    const userCart = await Cart.findOne({ userId })
      .populate("items.productId")
      .session(session);

    if (!userCart || userCart.items.length === 0) {
      return res
        .status(400)
        .json({ message: "Your cart is empty or does not exist." });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of userCart.items) {
      const product = item.productId;
      if (!product) {
        throw new Error(`Product with ID ${item.productId} does not exist.`);
      }
      if (product.quan < item.quantity) {
        throw new Error(`Insufficient quantity for product: ${product.name}`);
      }

      orderItems.push({
        productId: product._id,
        sellerId: product.sellerId,
        quantity: item.quantity,
        price: product.price,
      });

      totalPrice += product.price * item.quantity;

      product.quan -= item.quantity;
      if (product.quan === 0) {
        product.status = "requested";
      }
      await product.save({ session });
    }

    const newOrder = new Orders({
      buyerId: userId,
      items: orderItems,
      totalPrice,
      contactInfo,
      status: "pending",
    });
    await newOrder.save({ session });

    await Cart.deleteOne({ userId }, { session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Checkout completed successfully", order: newOrder });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message:"Internal Server Error" + err.message });
  }
};

module.exports.cancelOrderd = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Orders.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "canceled") {
      return res.status(400).json({ message: "Order is already canceled" });
    }

    const updatePromises = order.items.map(async (item) => {
      const product = await Products.findById(item.productId);
      if (!product)
        throw new Error(`Product with ID ${item.productId} not found`);

      product.stock += item.quantity;
      await product.save();
    });

    await Promise.all(updatePromises);

    order.status = "canceled";
    await order.save();

    res.status(200).json({
      message: "Order canceled and stock updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({ message:"Internal Server Error" + err.message });
  }
};

module.exports.soldOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Orders.findByIdAndUpdate(
      orderId,
      { status: "sold" },
      { new: true }
    ).populate(
      "items.productId",
      "name img moreImgs status desc categ condition"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message:"Internal Server Error" + err.message });
  }
};

module.exports.getOrder = async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate(
        "items.productId",
        "name img moreImgs status desc categ condition"
      )
      .populate(
        "items.sellerId",
        "firstName middleName lastName avatar email phoneNumber"
      );
    res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message:"Internal Server Error" + err.message });
  }
};

module.exports.filterOrders = async (req, res) => {
  try {
    const { status, userId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.buyerId = userId;

    const orders = await Orders.find(filter)
      .populate(
        "items.productId",
        "name img moreImgs status desc categ condition"
      )
      .populate(
        "items.sellerId",
        "firstName middleName lastName avatar email phoneNumber"
      );
    res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message:"Internal Server Error" + err.message });
  }
};
// Edits start from here -> 
module.exports.acceptOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Orders.findById({ _id: orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Order is not in a state that can be accepted" });
    }
    order.status = "accepted";
    await order.save();
    const user = await Users.findByIdAndUpdate(
      order.buyerId,
      { $inc: { ordersAccepted: 1 } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ message: "Order accepted successfully" });
  } catch (err) {
    return res.status(500).json({ message:"Internal Server Error" + err.message });
  }
};

module.exports.rejectOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Orders.findById({ _id: orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Order is not in a state that can be rejected" });
    }
    order.status = "rejected";
    await order.save();
    res.status(200).json({ message: "Order rejected successfully" });
  } catch (error) {
    res.status(500).json({message: "Internal Server Error" + err.message});
  }
};

module.exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Orders.findByIdAndDelete({ _id: orderId });
    if (!order) {
      return res.status(404).json({ message: "Order cannot be found" });
    }
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message:"Internal Server Error" + err.message });
  }
};

module.exports.getOrderForSeller = async (req, res) => {

  try {
    const  userId  = req.params.id;
console.log(userId);
    if (!userId) {
      return res.status(404).json({ message: "User Id not found!" });
    }

    const user = await Users.findById({ _id: userId });

    if (!user) {
      return res.status.json({ message: "User not found!" });
    }

    const orders = await Orders.find({ "items.sellerId": userId });

    if (!orders) {
      return res
        .status(200)
        .json({ message: "There is no Orders for now!", success: false });
    }

    return res
      .status(200)
      .json({ message: "Orders Called Successfully.", orders, success: true });
  } catch (err) {
    return res.status(500).json({ message:"Internal Server Error" + err.message });
  }
};
