"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import ProductCard from "../components/ProductCard"

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState("description")
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:5000/api/products/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch product")
        }
        const data = await response.json()
        setProduct(data)

        // Fetch related products
        const relatedResponse = await fetch(`http://localhost:5000/api/products/${id}/related`)
        if (!relatedResponse.ok) {
          throw new Error("Failed to fetch related products")
        }
        const relatedData = await relatedResponse.json()
        setRelatedProducts(relatedData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login")
      return
    }

    try {
      setIsAddingToCart(true)
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add to cart")
      }

      alert("Product added to cart successfully!")
    } catch (err) {
      console.error("Add to cart error:", err)
      alert(err.message || "Failed to add to cart")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleAddToWishlist = async () => {
    if (!user) {
      navigate("/login")
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

      alert("Product added to wishlist successfully!")
    } catch (err) {
      console.error("Add to wishlist error:", err)
      alert(err.message || "Failed to add to wishlist")
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-dark shadow-button">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Error Loading Product</h3>
            <p className="text-gray-600 mb-4">{error || "Product not found"}</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-lime text-dark py-2 px-6 rounded-lg transition-colors duration-300 border-2 border-dark shadow-button-sm hover:shadow-none hover:translate-y-1 hover:translate-x-1"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-lime transition-colors duration-300">
          Home
        </Link>
        {" > "}
        <Link to="/products" className="hover:text-lime transition-colors duration-300">
          Products
        </Link>
        {" > "}
        <span className="text-dark">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="bg-white rounded-2xl p-6 border-2 border-dark shadow-button">
          <div className="relative h-96 mb-4">
            <img
              src={product.images?.[activeImage] || product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(product.images || [product.image]).map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative h-20 rounded-lg overflow-hidden border-2 ${
                  activeImage === index ? "border-lime" : "border-dark"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white rounded-2xl p-6 border-2 border-dark shadow-button">
          <h1 className="text-3xl font-black mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.category}</p>
          <p className="text-2xl font-bold text-dark mb-6">${product.price.toFixed(2)}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Features</h2>
            <ul className="list-disc pl-5 space-y-1">
              {(product.features || []).map((feature, index) => (
                <li key={index} className="text-gray-700">{feature}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <span className="font-semibold">{key}:</span> {value}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Reviews</h2>
            <div>
              {(product.reviews || []).map((review, index) => (
                <div key={index} className={`${index > 0 ? "border-t pt-4" : ""} mb-4`}>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={i < (review.rating || 0) ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth={i < (review.rating || 0) ? "0" : "2"}
                          className={i >= (review.rating || 0) ? "text-gray-300" : ""}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      ))}
                    </div>
                    <span className="font-semibold">{review.name || "Anonymous"}</span>
                  </div>
                  <p className="text-gray-700">{review.comment || "No comment provided"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Quantity</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-lime text-dark w-10 h-10 rounded-lg flex items-center justify-center border-2 border-dark shadow-button-sm hover:shadow-none hover:translate-y-1 hover:translate-x-1"
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-lime text-dark w-10 h-10 rounded-lg flex items-center justify-center border-2 border-dark shadow-button-sm hover:shadow-none hover:translate-y-1 hover:translate-x-1"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="bg-lime text-dark py-3 rounded-lg font-bold border-2 border-dark shadow-button-sm hover:shadow-none hover:translate-y-1 hover:translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
            </button>
            <button
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
              className="bg-white text-dark py-3 rounded-lg font-bold border-2 border-dark shadow-button-sm hover:shadow-none hover:translate-y-1 hover:translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToWishlist ? "Adding to Wishlist..." : "Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="bg-white rounded-2xl border-2 border-dark shadow-button overflow-hidden mb-16">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "description"
                  ? "border-b-2 border-lime text-dark font-bold"
                  : "text-dark/60 hover:text-dark"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("specifications")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "specifications"
                  ? "border-b-2 border-lime text-dark font-bold"
                  : "text-dark/60 hover:text-dark"
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === "reviews"
                  ? "border-b-2 border-lime text-dark font-bold"
                  : "text-dark/60 hover:text-dark"
              }`}
            >
              Reviews ({(product.reviews || []).length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "description" && (
            <div>
              <p className="text-gray-700 whitespace-pre-line">{product.longDescription}</p>
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <span className="font-semibold">{key}:</span> {value}
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {product.reviews.map((review, index) => (
                <div key={index} className={`${index > 0 ? "border-t pt-4" : ""} mb-4`}>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill={i < review.rating ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth={i < review.rating ? "0" : "2"}
                          className={i >= review.rating ? "text-gray-300" : ""}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      ))}
                    </div>
                    <span className="font-semibold">{review.name}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}

              <button className="mt-4 bg-white text-dark px-4 py-2 rounded-lg font-bold border-2 border-dark shadow-button-sm hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all duration-300">
                Write a Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* You Might Also Like */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {(relatedProducts || []).map((product) => (
            <ProductCard key={product._id} product={product} className="h-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
