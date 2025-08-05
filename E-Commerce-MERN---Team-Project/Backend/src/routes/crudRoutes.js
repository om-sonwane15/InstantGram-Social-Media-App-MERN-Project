//crudRoutes.js
const express = require("express");
const Product = require("../models/itemModel.js");
const verifyToken = require("../middlewares/authMiddleware.js");

const router = express.Router();


// Search Products
router.get("/search", verifyToken, async (req, res) => {
    const { q, minPrice, maxPrice, sortBy, category } = req.query;
    const filters = {};

    if (q) {
        filters.$or = [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
        ];
    }

    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = parseFloat(minPrice);
        if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    if (category) {
        filters.category = category;
    }

    let sort = {};
    if (sortBy) {
        if (sortBy === "priceAsc") {
            sort.price = 1;
        } else if (sortBy === "priceDesc") {
            sort.price = -1;
        } else if (sortBy === "titleAsc") {
            sort.title = 1;
        } else if (sortBy === "titleDesc") {
            sort.title = -1;
        }
    }

    try {
        const products = await Product.find(filters).sort(sort);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Error fetching products" });
    }
});


// Read All Products
router.get("/get-products", verifyToken, async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 6;
    let skip = (page - 1) * limit;

    const { minPrice, maxPrice, sortBy, q, category } = req.query;

    const filters = {};

    if (q) {
        filters.$or = [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
        ];
    }

    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = parseFloat(minPrice);
        if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    if (category) {
        filters.category = category;
    }

    let sort = {};
    if (sortBy === "priceAsc") sort.price = 1;
    else if (sortBy === "priceDesc") sort.price = -1;
    else if (sortBy === "titleAsc") sort.title = 1;
    else if (sortBy === "titleDesc") sort.title = -1;

    try {
        const totalProducts = await Product.countDocuments(filters);
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Product.find(filters).skip(skip).limit(limit).sort(sort);

        res.json({
            currentPage: page,
            totalPages,
            products
        });
    } catch (err) {
        res.status(500).json({ error: "Error fetching products" });
    }
});


// Read Product by ID
router.get("/:id", verifyToken, async (req, res) => {
    const product = await Product.findById(req.params.id);
    product
        ? res.json(product)
        : res.status(404).json({ error: "Product not found" });
});

// Create Product
router.post("/create-product", verifyToken, async (req, res) => {
    const { title, price, description, image, category } = req.body;
    const product = await new Product({ title, price, description, image, category }).save();
    res.status(201).json(product);
});


// Update Product
router.put("/:id", verifyToken, async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );
    updatedProduct
        ? res.json(updatedProduct)
        : res.status(404).json({ error: "Product not found" });
});

// Delete Product
router.delete("/:id", verifyToken, async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    deletedProduct
        ? res.json({ message: "Product deleted" })
        : res.status(404).json({ error: "Product not found" });
});

module.exports = router;
