const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware.js");
const Wishlist = require("../models/wishlistModel.js");
const Product = require("../models/itemModel.js");

// 📌 Add to Wishlist
router.post("/add", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Remove from Wishlist
router.post("/remove", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId
      );
      await wishlist.save();
      res.status(200).json({ message: "Product removed from wishlist", wishlist });
    } else {
      res.status(404).json({ message: "Wishlist not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📄 Get Wishlist (Paginated only)
router.get("/user-wishlist", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist || wishlist.products.length === 0) {
      return res.status(200).json({ currentPage: page, totalPages: 0, products: [] });
    }

    const totalProducts = wishlist.products.length;
    const totalPages = Math.ceil(totalProducts / limit);

    // Paginate manually
    const paginatedIds = wishlist.products.slice(skip, skip + limit);

    const products = await Product.find({ _id: { $in: paginatedIds } });

    res.status(200).json({
      currentPage: page,
      totalPages,
      products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
