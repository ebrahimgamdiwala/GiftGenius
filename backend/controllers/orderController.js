const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const paymentGateway = require('../utils/paymentGateway');
const { v4: uuidv4 } = require('uuid');

/**
 * Create a new order
 * @route POST /api/orders
 * @access Private
 */
const createOrder = async (req, res) => {
  // Log the entire request body for debugging
  console.log('Order request body:', JSON.stringify(req.body, null, 2));
  
  try {
    console.log('Creating order for user:', req.userId);
    console.log('Request body:', req.body);
    
    const { shippingDetails, paymentMethod, items, subtotal, total } = req.body;
    
    if (!shippingDetails) {
      return res.status(400).json({ message: 'Shipping details are required' });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    // If no items provided, try to get from cart
    let orderItems = items;
    let orderSubtotal = subtotal;
    let orderTotal = total;

    if (!orderItems || orderItems.length === 0) {
      console.log('No items provided in request, fetching from cart');
      // Get user's cart
      const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty and no items provided' });
      }

      // Calculate prices from cart
      orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image
      }));

      orderSubtotal = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      orderTotal = orderSubtotal; // Add tax, shipping, etc. if needed
    }

    // Format shipping address
    let shippingAddress;
    try {
      shippingAddress = {
        street: shippingDetails?.street || '',
        city: shippingDetails?.city || '',
        state: shippingDetails?.state || '',
        zipCode: shippingDetails?.zipCode || '',
        country: shippingDetails?.country || 'United States'
      };
      console.log('Formatted shipping address:', shippingAddress);
    } catch (addressError) {
      console.error('Error formatting shipping address:', addressError);
      shippingAddress = {
        street: 'Error retrieving address',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      };
    }

    // Create order object
    const order = new Order({
      user: req.userId,
      items: orderItems || [],
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      taxPrice: 0, // No tax for now
      shippingPrice: 0, // Free shipping
      totalPrice: orderTotal || 0
    });
    
    console.log('Order object created:', order);

    // Save the order with minimal required fields first
    let createdOrder;
    try {
      console.log('Preparing to save order to database');
      
      // Process payment using dummy payment gateway
      let paymentResult;
      try {
        console.log('Processing payment with dummy payment gateway');
        paymentResult = paymentGateway.createPayment(orderTotal);
        console.log('Payment processed:', paymentResult);
      } catch (paymentError) {
        console.error('Payment processing error:', paymentError);
        return res.status(400).json({ message: 'Payment processing failed' });
      }
      
      // Generate a unique order ID
      const uniqueOrderId = uuidv4();
      console.log('Generated unique order ID:', uniqueOrderId);
      
      // Create a simplified order object with only essential fields
      const minimalOrder = new Order({
        orderId: uniqueOrderId,
        user: req.userId,
        items: orderItems || [],
        shippingAddress,
        paymentMethod: paymentMethod || 'Credit Card',
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: orderTotal || 0,
        paymentResult: {
          id: paymentResult.id,
          status: paymentResult.status,
          update_time: new Date().toISOString(),
          email_address: req.user.email || 'customer@example.com'
        }
      });
      
      console.log('Saving minimal order to database');
      createdOrder = await minimalOrder.save();
      console.log('Order saved successfully with ID:', createdOrder._id);
    } catch (saveError) {
      console.error('Error saving order:', saveError);
      console.error('Error details:', saveError.message);
      if (saveError.name === 'ValidationError') {
        console.error('Validation errors:', saveError.errors);
        return res.status(400).json({ 
          message: 'Order validation failed', 
          errors: saveError.errors 
        });
      }
      return res.status(500).json({ 
        message: 'Failed to save order', 
        error: saveError.message 
      });
    }

    // Skip product stock update for now to simplify the process
    console.log('Skipping product stock update to simplify order process');
    
    // Clear the user's cart after successful order creation
    try {
      console.log('Clearing user cart after order creation');
      const userCart = await Cart.findOne({ user: req.userId });
      if (userCart) {
        await Cart.findByIdAndDelete(userCart._id);
        console.log('Cart cleared successfully');
      } else {
        console.log('No cart found to clear');
      }
    } catch (cartError) {
      console.error('Error clearing cart:', cartError);
      // Continue with the order response even if cart clearing fails
    }
    
    // Return the created order
    return res.status(201).json({
      _id: createdOrder._id,
      user: createdOrder.user,
      items: createdOrder.items,
      shippingAddress: createdOrder.shippingAddress,
      paymentMethod: createdOrder.paymentMethod,
      totalPrice: createdOrder.totalPrice,
      createdAt: createdOrder.createdAt
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      message: 'Server error during order creation', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Get order by ID
 * @route GET /api/orders/:id
 * @access Private
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all orders for a user
 * @route GET /api/orders
 * @access Private
 */
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update order to paid
 * @route PUT /api/orders/:id/pay
 * @access Private
 */
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update order to delivered
 * @route PUT /api/orders/:id/deliver
 * @access Private
 */
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user.toString() !== req.userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered
};
