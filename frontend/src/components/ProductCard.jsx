"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const { user } = useAuth()

  const handleAddToCart = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = "/login"
      return
    }

    try {
      setIsAdding(true)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add to cart")
      }

      // Show success message or update UI as needed
      alert("Product added to cart successfully!")
    } catch (err) {
      console.error("Add to cart error:", err)
      alert(err.message || "Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  const handleAddToWishlist = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = "/login"
      return
    }

    try {
      setIsAddingToWishlist(true)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add to wishlist")
      }

      // Show success message
      alert("Product added to wishlist successfully!")
    } catch (err) {
      console.error("Add to wishlist error:", err)
      alert(err.message || "Failed to add to wishlist")
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  return (
    <div
      className={`
        bg-white rounded-2xl overflow-hidden
        transition-all duration-300 border-2 border-dark
        ${isHovered ? "shadow-button-sm translate-x-1 translate-y-1" : "shadow-button"}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center transition-opacity duration-300">
            <button 
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
              className="bg-white text-dark rounded-full p-2 transform hover:scale-110 transition-transform duration-300 border-2 border-dark disabled:opacity-50 disabled:cursor-not-allowed"
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
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <p className="text-dark font-bold mb-3">${product.price.toFixed(2)}</p>
        <div className="flex space-x-2">
          <Link
            to={`/products/${product._id}`}
            className="text-dark border-2 border-dark rounded-lg px-3 py-1 text-sm hover:bg-lime/20 transition-colors duration-300 flex-1 text-center"
          >
            View Details
          </Link>
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-lime text-dark rounded-lg px-3 py-1 text-sm transition-colors duration-300 flex-1 border-2 border-dark shadow-button-sm hover:shadow-none hover:translate-y-1 hover:translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  )
}
