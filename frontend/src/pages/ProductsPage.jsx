"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useAuth } from "../context/AuthContext"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
    sortBy: "featured",
  })

  // Mock categories - these should match your backend categories
  const categories = [
    { id: "all", name: "All Products" },
    { id: "personalized", name: "Personalized Gifts" },
    { id: "tech", name: "Tech Gifts" },
    { id: "home", name: "Home & Living" },
    { id: "food", name: "Food & Drink" },
    { id: "experience", name: "Experiences" },
  ]

  // Mock price ranges - these should match your backend price ranges
  const priceRanges = [
    { id: "all", name: "All Prices" },
    { id: "under25", name: "Under $25" },
    { id: "25to50", name: "$25 to $50" },
    { id: "50to100", name: "$50 to $100" },
    { id: "over100", name: "Over $100" },
  ]

  // Mock sort options - these should match your backend sort options
  const sortOptions = [
    { id: "featured", name: "Featured" },
    { id: "newest", name: "Newest" },
    { id: "priceAsc", name: "Price: Low to High" },
    { id: "priceDesc", name: "Price: High to Low" },
    { id: "bestSelling", name: "Best Selling" },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const queryParams = new URLSearchParams()
        
        // Only add non-"all" filter values to query params
        if (filters.category !== "all") {
          queryParams.append("category", filters.category)
        }
        if (filters.priceRange !== "all") {
          queryParams.append("priceRange", filters.priceRange)
        }
        if (filters.sortBy !== "featured") {
          queryParams.append("sortBy", filters.sortBy)
        }

        // Set a high limit to get all products
        queryParams.append("limit", "1000")

        const response = await fetch(`http://localhost:5000/api/products?${queryParams}`)
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data.products)
      } catch (err) {
        setError(err.message || "Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters])

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-6xl font-black mb-2 text-center text-dark">Our Gift Collection</h1>
      <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
        Browse our curated selection of unique and thoughtful gifts for every person and occasion.
      </p>

      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg border-2 border-dark">
        <img
          src="./giftbg1.png"
          alt="Gift Collection"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-dark/60 flex items-center">
          <div className="container mx-auto px-4">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Find the Perfect Gift</h2>
            <p className="text-white text-lg mb-6 max-w-lg">
              Discover unique gifts that will delight your loved ones for any occasion.
            </p>
            <Link
              to="/gift-finder"
              className="bg-lime text-white py-2 px-6 rounded-xl font-bold border-2 border-white shadow-button shadow-white hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
            >
              Try Our Gift Finder
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-2xl p-6 sticky top-24 border-2 border-dark shadow-button">
            <h2 className="text-xl font-bold mb-4">Filters</h2>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`category-${category.id}`}
                      name="category"
                      checked={filters.category === category.id}
                      onChange={() => handleFilterChange("category", category.id)}
                      className="mr-2 accent-lime"
                    />
                    <label htmlFor={`category-${category.id}`} className="text-gray-700">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <div key={range.id} className="flex items-center">
                    <input
                      type="radio"
                      id={`price-${range.id}`}
                      name="priceRange"
                      checked={filters.priceRange === range.id}
                      onChange={() => handleFilterChange("priceRange", range.id)}
                      className="mr-2 accent-lime"
                    />
                    <label htmlFor={`price-${range.id}`} className="text-gray-700">
                      {range.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Filters Button */}
            <button
              onClick={() => setFilters({ category: "all", priceRange: "all", sortBy: "featured" })}
              className="w-full bg-dark text-white py-2 rounded-lg transition-colors duration-300 border-2 border-dark hover:bg-dark/80"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          {/* Sort Options */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl border-2 border-dark shadow-button-sm">
            <p className="mb-3 sm:mb-0">
              Showing <span className="font-semibold">{products.length}</span> products
            </p>
            <div className="flex items-center">
              <label htmlFor="sortBy" className="mr-2 text-gray-700">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="border-2 border-dark rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-lime"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime"></div>
            </div>
          ) : error ? (
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
                <h3 className="text-xl font-semibold mb-2">Error Loading Products</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-lime text-dark py-2 px-6 rounded-lg transition-colors duration-300 border-2 border-dark shadow-button-sm hover:shadow-none hover:translate-y-1 hover:translate-x-1"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-dark shadow-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400 mx-auto mb-4"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" x2="12" y1="8" y2="12"></line>
                <line x1="12" x2="12.01" y1="16" y2="16"></line>
              </svg>
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">We couldn't find any products matching your current filters.</p>
              <button
                onClick={() => setFilters({ category: "all", priceRange: "all", sortBy: "featured" })}
                className="bg-lime text-dark py-2 px-6 rounded-lg transition-colors duration-300 border-2 border-dark shadow-button-sm hover:shadow-none hover:translate-y-1 hover:translate-x-1"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
