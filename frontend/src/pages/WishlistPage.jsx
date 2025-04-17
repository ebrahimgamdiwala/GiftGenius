"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return

      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:5000/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist")
        }

        const data = await response.json()
        setWishlistItems(data.items)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user])

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/wishlist/remove/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist")
      }

      setWishlistItems(prevItems => prevItems.filter(item => item.product._id !== productId))
      alert("Item removed from wishlist successfully!")
    } catch (err) {
      setError(err.message)
      alert(err.message || "Failed to remove item from wishlist")
    }
  }

  const moveToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:5000/api/wishlist/move-to-cart/${productId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to move item to cart")
      }

      const data = await response.json()
      setWishlistItems(prevItems => prevItems.filter(item => item.product._id !== productId))
      alert("Item moved to cart successfully!")
    } catch (err) {
      setError(err.message)
      alert(err.message || "Failed to move item to cart")
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border-2 border-dark shadow-button p-8 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-dark">Please Login</h1>
          <p className="mb-8 text-dark/70">You need to be logged in to view your wishlist.</p>
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

  if (wishlistItems.length === 0) {
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
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-dark">Your Wishlist is Empty</h1>
          <p className="mb-8 text-dark/70">You haven't added any items to your wishlist yet.</p>
          <Link
            to="/products"
            className="bg-lime text-dark px-6 py-3 rounded-xl font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 inline-block"
          >
            Discover Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-20 bg-cream min-h-screen">
      <h1 className="text-5xl md:text-6xl font-black mb-8 text-dark drop-shadow-sm tracking-tight pt-8">
        Your Wishlist <span className="inline-block ml-2 transform rotate-8">💝</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.product._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-dark"
          >
            <div className="relative h-48">
              <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
              <button
                onClick={() => removeFromWishlist(item.product._id)}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <path d="m18 6-12 12"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{item.product.description}</p>
              <p className="text-lime font-bold mb-3">${item.product.price.toFixed(2)}</p>
              <div className="flex space-x-2">
                <Link
                  to={`/products/${item.product._id}`}
                  className="text-dark border border-dark rounded-lg px-3 py-1 text-sm hover:bg-cream hover:text-dark hover:shadow-button-sm transition-colors duration-300 flex-1 text-center"
                >
                  View Details
                </Link>
                <button
                  onClick={() => moveToCart(item.product._id)}
                  className="bg-lime text-dark border-2 border-dark rounded-lg px-3 py-1 text-sm font-medium hover:bg-cream hover:text-dark hover:shadow-button-sm transition-colors duration-300 flex-1"
                >
                  Move to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
