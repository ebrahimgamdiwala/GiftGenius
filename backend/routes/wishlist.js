const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');

// Middleware to verify token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user's wishlist
router.get('/', verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.userId }).populate('items.product');
    if (!wishlist) {
      return res.json({ items: [] });
    }
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add item to wishlist
router.post('/add', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ user: req.userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.userId, items: [] });
    }

    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove item from wishlist
router.delete('/remove/:productId', verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.userId });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(item => item.product.toString() !== req.params.productId);
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Move item from wishlist to cart
router.post('/move-to-cart/:productId', verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    const item = wishlist.items.find(item => item.product.toString() === req.params.productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    // Remove from wishlist
    wishlist.items = wishlist.items.filter(item => item.product.toString() !== req.params.productId);
    await wishlist.save();

    // Add to cart
    const cart = await Cart.findOne({ user: req.userId }) || new Cart({ user: req.userId, items: [] });
    cart.items.push({ product: req.params.productId, quantity: 1 });
    await cart.save();

    res.json({ wishlist, cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 