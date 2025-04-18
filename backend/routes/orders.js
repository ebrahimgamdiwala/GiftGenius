const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { 
  createOrder, 
  getOrderById, 
  getUserOrders, 
  updateOrderToPaid, 
  updateOrderToDelivered 
} = require('../controllers/orderController');

// Create new order
router.post('/', verifyToken, createOrder);

// Get order by ID
router.get('/:id', verifyToken, getOrderById);

// Get user's orders
router.get('/', verifyToken, getUserOrders);

// Update order to paid
router.put('/:id/pay', verifyToken, updateOrderToPaid);

// Update order to delivered
router.put('/:id/deliver', verifyToken, updateOrderToDelivered);

module.exports = router;