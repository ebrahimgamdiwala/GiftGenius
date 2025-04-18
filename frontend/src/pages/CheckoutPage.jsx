"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import OrderSummaryCard from "../components/OrderSummaryCard"
import { useAuth } from "../context/AuthContext"

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return

      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/api/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Failed to fetch cart")
        }

        const data = await response.json()
        setCartItems(data.items || [])
      } catch (err) {
        console.error("Cart fetch error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [user])

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    cardName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/login")
      return
    }
    
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }
      
      // Prepare order data
      const orderData = {
        shippingDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: "Credit Card",
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        })),
        subtotal: calculateSubtotal(),
        total: calculateSubtotal() // Add tax and shipping if applicable
      }
      
      console.log("Submitting order:", orderData)
      console.log("Using token:", token)
      
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        let errorMessage = "Failed to create order";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error("Server error details:", errorData);
        } catch (jsonError) {
          console.error("Error parsing error response:", jsonError);
        }
        throw new Error(errorMessage);
      }

      let orderResult;
      try {
        orderResult = await response.json();
        console.log("Order created:", orderResult);
      } catch (jsonError) {
        console.error("Error parsing success response:", jsonError);
        throw new Error("Error processing server response. Order may have been created but details couldn't be retrieved.");
      }
      
      if (!orderResult || !orderResult._id) {
        throw new Error("Order was created but no order ID was returned");
      }
      
      // Store order ID in localStorage for the confirmation page
      localStorage.setItem("lastOrderId", orderResult._id);
      
      // Clear the cart in the frontend state
      setCartItems([]);
      
      // Also clear the cart in localStorage if you're storing it there
      try {
        localStorage.removeItem("cart");
      } catch (localStorageError) {
        console.error("Error clearing cart from localStorage:", localStorageError);
      }
      
      // Make an additional request to ensure the cart is cleared on the backend
      try {
        await fetch("http://localhost:5000/api/cart/clear", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Cart cleared successfully");
      } catch (clearCartError) {
        console.error("Error clearing cart from API:", clearCartError);
        // Continue with checkout even if this fails
      }
      
      // Clear form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        phone: "",
        cardName: "",
        cardNumber: "",
        expMonth: "",
        expYear: "",
        cvv: "",
      });
      
      // Navigate to order confirmation page
      navigate("/order-confirmation");
    } catch (err) {
      console.error("Order submission error:", err);
      setError(err.message || "Failed to create order. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border-2 border-dark shadow-button p-8 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-dark">Please Login</h1>
          <p className="mb-8 text-dark/70">You need to be logged in to checkout.</p>
          <Link
            to="/login"
            className="bg-lime text-dark px-6 py-3 rounded-xl font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 inline-block"
          >
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime mx-auto"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border-2 border-dark shadow-button p-8 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-dark">Error</h1>
          <p className="mb-8 text-dark/70">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-lime text-dark px-6 py-3 rounded-xl font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 inline-block"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border-2 border-dark shadow-button p-8 max-w-md mx-auto">
          <div className="w-20 h-20 bg-lime/20 border-2 border-dark rounded-full flex items-center justify-center mx-auto mb-6">
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
              className="text-gray-400"
            >
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-dark">Your Cart is Empty</h1>
          <p className="mb-8 text-dark/70">You need to add items to your cart before checking out.</p>
          <Link
            to="/products"
            className="bg-lime text-dark px-6 py-3 rounded-xl font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-cream min-h-screen mt-20">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-dark text-center">
        Checkout <span className="inline-block ml-2 transform rotate-8">💳</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="bg-white rounded-2xl border-2 border-dark shadow-button overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <div className="w-8 h-8 bg-lime/20 rounded-full flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-lime"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="block text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="block text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-gray-700 mb-1">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="country" className="block text-gray-700 mb-1">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl border-2 border-dark shadow-button overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <div className="w-8 h-8 bg-lime/20 rounded-full flex items-center justify-center mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-lime"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                      <line x1="2" x2="22" y1="10" y2="10"></line>
                    </svg>
                  </div>
                  Payment Information
                </h2>

                <div className="mb-4">
                  <label htmlFor="cardName" className="block text-gray-700 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="cardNumber" className="block text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="expMonth" className="block text-gray-700 mb-1">
                      Expiration Month
                    </label>
                    <select
                      id="expMonth"
                      name="expMonth"
                      value={formData.expMonth}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                      required
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                        <option key={month} value={month}>
                          {month.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="expYear" className="block text-gray-700 mb-1">
                      Expiration Year
                    </label>
                    <select
                      id="expYear"
                      name="expYear"
                      value={formData.expYear}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                      required
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="XXX"
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <Link
                to="/cart"
                className="text-dark hover:text-lime transition-colors duration-300 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
                Return to Cart
              </Link>

              <button
                type="submit"
                className="bg-lime text-dark py-3 px-8 rounded-xl font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-2xl border-2 border-dark shadow-button p-6">
            <h2 className="text-2xl font-bold mb-6 text-dark">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-3">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-dark font-medium">{item.product.name}</h3>
                      <p className="text-dark/70 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-dark">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-dark/20 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-dark/70">Subtotal</span>
                  <span className="text-dark font-medium">${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-dark/70">Shipping</span>
                  <span className="text-dark font-medium">Free</span>
                </div>
                <div className="flex justify-between font-bold mt-4">
                  <span className="text-dark">Total</span>
                  <span className="text-dark">${calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}