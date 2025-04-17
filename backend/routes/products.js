const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Middleware to verify token and admin status
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, priceRange, sortBy, search, page = 1, limit = 10 } = req.query;
    let query = {};

    // Apply category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Apply price range filter
    if (priceRange && priceRange !== 'all') {
      switch (priceRange) {
        case 'under25':
          query.price = { $lt: 25 };
          break;
        case '25to50':
          query.price = { $gte: 25, $lte: 50 };
          break;
        case '50to100':
          query.price = { $gte: 50, $lte: 100 };
          break;
        case 'over100':
          query.price = { $gt: 100 };
          break;
      }
    }

    // Apply search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply sorting
    let sortOption = {};
    switch (sortBy) {
      case 'priceAsc':
        sortOption = { price: 1 };
        break;
      case 'priceDesc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'bestSelling':
        sortOption = { bestSeller: -1 };
        break;
      default:
        sortOption = { featured: -1 };
    }

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new product (Admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      name,
      description,
      price,
      image,
      category,
      stock,
      featured,
      bestSeller
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      stock,
      featured: featured || false,
      bestSeller: bestSeller || false
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const {
      name,
      description,
      price,
      image,
      category,
      stock,
      featured,
      bestSeller
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.featured = featured !== undefined ? featured : product.featured;
    product.bestSeller = bestSeller !== undefined ? bestSeller : product.bestSeller;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured products
router.get('/featured/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true }).limit(3);
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get best selling products
router.get('/featured/best-selling', async (req, res) => {
  try {
    const bestSellingProducts = await Product.find({ bestSeller: true }).limit(3);
    res.json(bestSellingProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get related products
router.get('/:id/related', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 