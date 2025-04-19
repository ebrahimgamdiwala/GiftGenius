"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function CartPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

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

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/cart/update/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update quantity")
      }

      setCartItems(prevItems => 
        prevItems.map(item => 
          item.product._id === productId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    } catch (err) {
      console.error("Update quantity error:", err)
      setError(err.message)
    }
  }

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to remove item")
      }

      // Update state locally instead of relying on server response
      setCartItems(prevItems => 
        prevItems.filter(item => item.product._id !== productId)
      )
    } catch (err) {
      console.error("Remove item error:", err)
      setError(err.message)
    }
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product && typeof item.product.price === 'number' ? item.product.price : 0;
      const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
      return total + price * quantity;
    }, 0);
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border-2 border-dark shadow-button p-8 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-dark">Please Login</h1>
          <p className="mb-8 text-dark/70">You need to be logged in to view your cart.</p>
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
          <p className="mb-8 text-dark/70">Looks like you haven't added any items to your cart yet.</p>
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
    <div className="container mx-auto px-4 py-20 bg-cream min-h-screen">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-dark text-center">
        Your Cart <span className="inline-block ml-2 transform rotate-8">🛒</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border-2 border-dark shadow-button overflow-hidden">
            <div className="p-6">
              <div className="hidden md:grid md:grid-cols-12 text-dark/70 font-medium pb-4 border-b border-dark/20">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              <div className="divide-y divide-dark/20">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 flex items-center">
                      <div className="relative w-20 h-20 mr-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-dark">{item.product.name}</h3>
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="text-red-600 text-sm mt-1 hover:text-red-800 hover:underline transition-colors duration-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="md:hidden flex justify-between">
                      <span className="text-dark/70">Price:</span>
                      <span className="text-dark">
                        {item.product && typeof item.product.price === 'number' 
                          ? `$${item.product.price.toFixed(2)}` 
                          : 'N/A'}
                      </span>
                    </div>

                    <div className="hidden md:block md:col-span-2 text-center text-dark">
                      {item.product && typeof item.product.price === 'number' 
                        ? `$${item.product.price.toFixed(2)}` 
                        : 'N/A'}
                    </div>

                    <div className="md:hidden flex justify-between items-center">
                      <span className="text-dark/70">Quantity:</span>
                      <div className="flex items-center border-2 border-dark rounded-lg overflow-hidden shadow-button-sm">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="bg-white px-3 py-1 hover:bg-lime/20 transition-colors duration-300 text-dark"
                        >
                          -
                        </button>
                        <span className="bg-white border-l border-r border-dark px-4 py-1 text-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="bg-white px-3 py-1 hover:bg-lime/20 transition-colors duration-300 text-dark"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="hidden md:flex md:col-span-2 justify-center items-center">
                      <div className="flex items-center border-2 border-dark rounded-lg overflow-hidden shadow-button-sm">
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="bg-white px-3 py-1 hover:bg-lime/20 transition-colors duration-300 text-dark"
                        >
                          -
                        </button>
                        <span className="bg-white border-l border-r border-dark px-4 py-1 text-dark">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="bg-white px-3 py-1 hover:bg-lime/20 transition-colors duration-300 text-dark"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="md:hidden flex justify-between">
                      <span className="text-dark/70">Total:</span>
                      <span className="font-medium text-dark">
                        {item.product && typeof item.product.price === 'number' && typeof item.quantity === 'number'
                          ? `$${(item.product.price * item.quantity).toFixed(2)}`
                          : '$0.00'}
                      </span>
                    </div>

                    <div className="hidden md:block md:col-span-2 text-center font-medium text-dark">
                      {item.product && typeof item.product.price === 'number' && typeof item.quantity === 'number'
                        ? `$${(item.product.price * item.quantity).toFixed(2)}`
                        : '$0.00'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <Link
                  to="/products"
                  className="text-dark hover:text-lime transition-colors duration-300 flex items-center font-medium group"
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
                  Continue Shopping
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime group-hover:w-full transition-all duration-300"></span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl border-2 border-dark shadow-button p-6">
            <h2 className="text-2xl font-bold mb-6 text-dark">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-dark/70">Subtotal</span>
                <span className="text-dark font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/70">Shipping</span>
                <span className="text-dark font-medium">Free</span>
              </div>
              <div className="border-t border-dark/20 pt-4">
                <div className="flex justify-between">
                  <span className="text-dark font-bold">Total</span>
                  <span className="text-dark font-bold">${calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link
              to="/checkout"
              className="w-full bg-lime text-dark py-3 px-6 rounded-xl font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 mt-6 block text-center"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
