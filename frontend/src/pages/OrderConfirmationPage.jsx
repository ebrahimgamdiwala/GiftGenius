import { Link } from "react-router-dom"

export default function OrderConfirmation() {
  // Mock order details - in a real app, this would come from the database
  const orderDetails = {
    orderId: "ORD-12345-ABCDE",
    date: new Date().toLocaleDateString(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    items: [
      {
        id: 1,
        name: "Personalized Star Map",
        price: 49.99,
        quantity: 1,
        image: "https://placehold.co/100x100/e2e8f0/1e293b?text=Star+Map",
      },
      {
        id: 2,
        name: "Smart Plant Pot",
        price: 34.99,
        quantity: 2,
        image: "https://placehold.co/100x100/e2e8f0/1e293b?text=Plant+Pot",
      },
      {
        id: 5,
        name: "Artisan Chocolate Box",
        price: 29.99,
        quantity: 1,
        image: "https://placehold.co/100x100/e2e8f0/1e293b?text=Chocolates",
      },
    ],
    subtotal: 149.96,
    shipping: 0,
    total: 149.96,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been received and is being processed. You will receive an email confirmation shortly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <div className="bg-gray-100 rounded-lg px-6 py-4">
              <p className="text-gray-500 text-sm">Order ID</p>
              <p className="font-semibold">{orderDetails.orderId}</p>
            </div>
            <div className="bg-gray-100 rounded-lg px-6 py-4">
              <p className="text-gray-500 text-sm">Order Date</p>
              <p className="font-semibold">{orderDetails.date}</p>
            </div>
            <div className="bg-gray-100 rounded-lg px-6 py-4">
              <p className="text-gray-500 text-sm">Estimated Delivery</p>
              <p className="font-semibold">{orderDetails.estimatedDelivery}</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300"
            >
              Return to Home
            </Link>
            <Link
              to="/account"
              className="border border-purple-600 text-purple-600 py-3 px-6 rounded-lg font-medium hover:bg-purple-50 transition-colors duration-300"
            >
              View Order History
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="divide-y">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center">
                  <div className="relative w-16 h-16 mr-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{orderDetails.shipping === 0 ? "Free" : `$${orderDetails.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
