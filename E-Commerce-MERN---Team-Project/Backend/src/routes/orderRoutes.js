//orderRoutes.js

const express = require("express");
const Order = require("../models/orderModel.js");
const Cart = require("../models/cartModel.js");
const verifyToken = require("../middlewares/authMiddleware.js");

const router = express.Router();

const SHIPPING_DELAY = 2 * 60 * 1000;
let orderTimers = {};

// Get all Orders for a user
router.get("/status", verifyToken, async (req, res) => {
    const userId = req.user.id;
  
    const orders = await Order.find({ userId }).sort({ orderTime: -1 }).populate("items.productId");
  
    const detailedOrders = orders.map(order => ({
      _id: order._id,
      status: order.status,
      orderTime: order.orderTime,
      items: order.items.map(item => ({
        productId: item.productId._id,
        title: item.productId.title,
        image: item.productId.image,
        quantity: item.quantity
      }))
    }));
  
    res.json({ orders: detailedOrders });
  });
  

// Order the product
router.post("/order", verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { products } = req.body;

    if (!userId || !Array.isArray(products) || !products.length) {
        return res.status(400).json({ message: "Invalid order" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: "Cart is empty" });

    let orderItems = [];
    for (const { productId, quantity } of products) {
        let cartItem = cart.items.find(item => item.productId.toString() === productId);
        if (!cartItem || cartItem.quantity < quantity) {
            return res.status(400).json({ message: `Invalid product or quantity: ${productId}` });
        }

        orderItems.push({ productId, quantity });

        // Remove or reduce item in cart
        if (cartItem.quantity === quantity) {
            cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        } else {
            cartItem.quantity -= quantity;
        }
    }

    await cart.save();

    const order = await Order.create({
        userId,
        items: orderItems,
        status: "processing",
        orderTime: new Date()
    });

    // Set up timer to auto-confirm the order
    orderTimers[order._id] = setTimeout(async () => {
        const confirmedOrder = await Order.findById(order._id);
        if (confirmedOrder && confirmedOrder.status === "processing") {
            confirmedOrder.status = "confirmed";
            await confirmedOrder.save();
        }
        delete orderTimers[order._id];
    }, SHIPPING_DELAY);

    res.json({ message: "Order placed", order });
});



// Cancel Order (only valid before shipping starts)
router.post("/cancel", verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { orderId } = req.body;

    if (!userId || !orderId) {
        return res.status(400).json({ message: "User or orderId not provided" });
    }

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "processing") {
        return res.status(400).json({ message: "Cannot cancel order. It has already been confirmed or cancelled." });
    }

    clearTimeout(orderTimers[order._id]);
    delete orderTimers[order._id];

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
});



module.exports = router;
