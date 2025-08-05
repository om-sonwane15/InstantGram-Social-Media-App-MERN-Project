//cartRoutes.js
const express = require("express");
const Cart = require("../models/cartModel.js");
const Product = require("../models/itemModel.js")
const verifyToken = require("../middlewares/authMiddleware.js");
const router = express.Router();
const Order = require("../models/orderModel.js");

// Most popular products (all or by category)
router.post("/most-popular", verifyToken, async (req, res) => {
  const { category } = req.body;

  try {
    const orders = await Order.find({ status: "confirmed" }).populate("items.productId");

    if (!orders.length) return res.json({ message: "No orders found" });

    let productStats = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        const product = item.productId;
        if (!product) return;

        // Filter by category if provided
        if (category && product.category !== category) return;

        const id = product._id.toString();

        if (productStats[id]) {
          productStats[id].quantity += item.quantity;
        } else {
          productStats[id] = {
            productId: product._id,
            title: product.title,
            image: product.image,
            quantity: item.quantity,
            category: product.category
          };
        }
      });
    });

    let sortedProducts = Object.values(productStats).sort((a, b) => b.quantity - a.quantity);

    if (category) {
      sortedProducts = sortedProducts.slice(0, 1)
    } else {
      sortedProducts = sortedProducts.slice(0, 10) //.slice(0, 10); or any other number for global top
    }

    res.json({ topProducts: sortedProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch popular products" });
  }
});



// Add product
router.post("/", verifyToken, async (req, res) => {

  const userId = req.user.id;
  const { productId } = req.body;

  if (!userId || !productId) return res.status(400).json({ msg: "Field missing" })

  let product = await Product.findById(productId);

  if (!product) return res.status(400).json({ msg: "Invalid product" });

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [{
        productId,
        quantity: 1
      }]
    });
  }
  else {

    let item = cart.items.find((item) => item.productId.toString() === productId);
    if (item) {
      item.quantity++;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }
  }

  await cart.save();
  res.json({ message: "Product added", cart });
});

// Remove product
router.delete("/", verifyToken, async (req, res) => {

  const userId = req.user.id

  const { productId } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) return res.json({ error: "Cart not found" });

  let itemIndex = cart.items.findIndex(

    (item) => item.productId.toString() === productId

  );

  if (itemIndex > -1) {

    if (cart.items[itemIndex].quantity > 1) {

      cart.items[itemIndex].quantity--;

    }
    else {
      cart.items.splice(itemIndex, 1);
    }
    await cart.save();

    return res.json({ message: "Product updated", cart });

  }

  res.json({ error: "Product not found in cart" });
});

router.post("/remove-all", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(item => item.productId.toString() !== productId);
  await cart.save();

  res.json({ message: "Product removed completely", cart });
});

// display users cart
router.get("/view", verifyToken, async (req, res) => {

  const userId = req.user.id;

  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart) return res.json({ message: "Cart is empty" });

  res.json(cart);

});

module.exports = router;
