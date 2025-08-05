// src/routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const Review = require("../models/reviewModel");
const Product = require("../models/itemModel");
const User = require("../models/userModel");

// Create a review (once per product per user)
router.post("/", verifyToken, async (req, res) => {
  const { productId, rating, review } = req.body;

  try {
    const newReview = new Review({
      productId,
      userId: req.user.id,
      rating,
      review
    });

    await newReview.save();
    res.status(201).json({ message: "Review submitted successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "You have already reviewed this product" });
    } else {
      res.status(500).json({ message: "Failed to submit review" });
    }
  }
});

// Get all reviews by the logged-in user
router.get("/my-reviews", verifyToken, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).populate("productId");
    const formatted = reviews.map((r) => ({
      reviewId: r._id,
      productTitle: r.productId.title,
      productImage: r.productId.image,
      productPrice: r.productId.price,
      rating: r.rating,
      review: r.review,
      createdAt: r.createdAt
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// Get summary + 3 reviews for a product
router.get("/summary/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?.id;

  try {
    const allReviews = await Review.find({ productId }).populate("userId");

    if (allReviews.length === 0) {
      return res.status(404).json({ message: "No reviews yet" });
    }

    const avgRating =
      allReviews.reduce((acc, cur) => acc + cur.rating, 0) / allReviews.length;

    const filteredReviews = allReviews.filter(
      (r) => r.userId._id.toString() !== userId
    );

    const mapped = filteredReviews.map((r) => ({
      username: r.userId.username,
      userImage: r.userId.image || null,
      rating: r.rating,
      review: r.review
    }));

    res.status(200).json({
      averageRating: avgRating.toFixed(1),
      reviewers: mapped
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product reviews" });
  }
});



// Edit a review
router.put("/update-review", verifyToken, async (req, res) => {
  const { reviewId, rating, review } = req.body;

  try {
    const existingReview = await Review.findById(reviewId);
    if (!existingReview || existingReview.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this review" });
    }

    existingReview.rating = rating;
    existingReview.review = review;

    await existingReview.save();

    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update review" });
  }
});


// Delete a user's review
router.delete("/delete-review", verifyToken, async (req, res) => {
  const { reviewId } = req.body;

  try {
    const existingReview = await Review.findById(reviewId);
    if (!existingReview || existingReview.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this review" });
    }

    await existingReview.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review" });
  }
});


module.exports = router;
