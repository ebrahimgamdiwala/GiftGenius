/**
 * Dummy payment gateway utility for processing payments
 * This will be replaced with a real payment gateway in production
 */
const dummyPaymentGateway = {
  /**
   * Create a payment with the dummy gateway
   * @param {Number} amount - Payment amount
   * @param {String} currency - Payment currency (default: 'usd')
   * @returns {Object} Payment details
   */
  createPayment: (amount, currency = 'usd') => {
    console.log(`Creating dummy payment for ${amount} ${currency}`);
    return {
      id: 'DUMMY_' + Date.now(),
      amount,
      currency,
      status: 'succeeded',
      created: new Date(),
    };
  },
  
  /**
   * Get payment status from the dummy gateway
   * @param {String} paymentId - Payment ID
   * @returns {Object} Payment status details
   */
  getPaymentStatus: (paymentId) => {
    console.log(`Getting status for payment ${paymentId}`);
    return {
      id: paymentId,
      status: 'succeeded',
      updated: new Date(),
    };
  }
};

module.exports = dummyPaymentGateway;
