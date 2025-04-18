"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.dropdown-container')
      const dropdownMenu = document.querySelector('.dropdown-menu')
      
      if (dropdown && !dropdown.contains(event.target) && dropdownMenu) {
        dropdownMenu.classList.add('hidden')
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchCounts = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token")
          const [cartResponse, wishlistResponse] = await Promise.all([
            fetch("http://localhost:5000/api/cart", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch("http://localhost:5000/api/wishlist", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ])

          if (cartResponse.ok) {
            const cartData = await cartResponse.json()
            setCartCount(cartData.items.length)
          }

          if (wishlistResponse.ok) {
            const wishlistData = await wishlistResponse.json()
            setWishlistCount(wishlistData.items.length)
          }
        } catch (error) {
          console.error("Error fetching counts:", error)
        }
      } else {
        // Clear counts when user logs out
        setCartCount(0)
        setWishlistCount(0)
      }
    }

    fetchCounts()
    
    // Set up interval to refresh counts every minute
    const intervalId = setInterval(fetchCounts, 60000)
    
    return () => clearInterval(intervalId)
  }, [user])

  const handleLogout = () => {
    logout()
    setCartCount(0)
    setWishlistCount(0)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-lime flex items-center justify-center mr-2 rounded-lg border-2 border-dark shadow-button">
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
                className="text-dark"
              >
                <path d="M20 12v10H4V12"></path>
                <path d="M2 7h20v5H2z"></path>
                <path d="M12 22V7"></path>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
              </svg>
            </div>
            <span className="text-xl font-bold text-dark">GiftGenius</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-dark hover:text-lime transition-colors duration-300 flex items-center gap-2">
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
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </Link>
            <Link
              to="/gift-finder"
              className="text-dark hover:text-lime transition-colors duration-300 flex items-center gap-2"
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
              >
                <path d="M2 12h5"></path>
                <path d="M17 12h5"></path>
                <path d="M12 2v5"></path>
                <path d="M12 17v5"></path>
                <path d="M4.93 4.93l3.54 3.54"></path>
                <path d="M15.54 15.54l3.54 3.54"></path>
                <path d="M4.93 19.07l3.54-3.54"></path>
                <path d="M15.54 8.46l3.54-3.54"></path>
              </svg>
              Gift Finder
            </Link>
            <Link
              to="/products"
              className="text-dark hover:text-lime transition-colors duration-300 flex items-center gap-2"
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
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Products
            </Link>
            <Link
              to="/about"
              className="text-dark hover:text-lime transition-colors duration-300 flex items-center gap-2"
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
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              About
            </Link>
            <Link
              to="/contact"
              className="text-dark hover:text-lime transition-colors duration-300 flex items-center gap-2"
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
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Contact
            </Link>
          </div>

          {/* Cart and User Icons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/wishlist" className="text-dark hover:text-lime transition-colors duration-300 relative group">
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
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-lime text-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-dark">
                      {wishlistCount}
                    </span>
                  )}
                  <span className="absolute -top-8 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs bg-dark text-white px-2 py-1 rounded-md whitespace-nowrap">
                    Wishlist
                  </span>
                </Link>
                <Link to="/cart" className="text-dark hover:text-lime transition-colors duration-300 relative group">
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
                  >
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-lime text-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-dark">
                      {cartCount}
                    </span>
                  )}
                  <span className="absolute -top-8 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs bg-dark text-white px-2 py-1 rounded-md whitespace-nowrap">
                    Cart
                  </span>
                </Link>
                <div className="relative dropdown-container">
                  <button onClick={() => document.querySelector('.dropdown-menu').classList.toggle('hidden')} className="text-dark hover:text-lime transition-colors duration-300">
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
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </button>
                  <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-button border-2 border-dark py-2 hidden z-50">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-dark hover:bg-lime hover:text-dark transition-colors duration-300"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-dark hover:bg-lime hover:text-dark transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-lime text-dark px-4 py-2 rounded-lg font-medium border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-dark focus:outline-none w-10 h-10 rounded-lg border-2 border-dark flex items-center justify-center bg-lime shadow-button-sm hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all duration-300" 
              onClick={toggleMenu}
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
                className={isMenuOpen ? "hidden" : "block"}
              >
                <line x1="4" x2="20" y1="12" y2="12"></line>
                <line x1="4" x2="20" y1="6" y2="6"></line>
                <line x1="4" x2="20" y1="18" y2="18"></line>
              </svg>
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
                className={isMenuOpen ? "block" : "hidden"}
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"} pb-4 bg-white border-t-2 border-dark/10 mt-2 rounded-b-2xl shadow-lg`}>
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-dark hover:text-lime transition-colors duration-300 py-2 flex items-center gap-2"
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
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Home
            </Link>
            <Link
              to="/gift-finder"
              className="text-dark hover:text-lime transition-colors duration-300 py-2 flex items-center gap-2"
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
              >
                <path d="M2 12h5"></path>
                <path d="M17 12h5"></path>
                <path d="M12 2v5"></path>
                <path d="M12 17v5"></path>
                <path d="M4.93 4.93l3.54 3.54"></path>
                <path d="M15.54 15.54l3.54 3.54"></path>
                <path d="M4.93 19.07l3.54-3.54"></path>
                <path d="M15.54 8.46l3.54-3.54"></path>
              </svg>
              Gift Finder
            </Link>
            <Link
              to="/products"
              className="text-dark hover:text-lime transition-colors duration-300 py-2 flex items-center gap-2"
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
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              Products
            </Link>
            <Link
              to="/about"
              className="text-dark hover:text-lime transition-colors duration-300 py-2 flex items-center gap-2"
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
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
              About
            </Link>
            <Link
              to="/contact"
              className="text-dark hover:text-lime transition-colors duration-300 py-2 flex items-center gap-2"
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
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Contact
            </Link>
            {user ? (
              <>
                <Link
                  to="/wishlist"
                  className="text-dark hover:text-lime transition-colors duration-300 py-2 flex items-center gap-2"
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
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link
                  to="/cart"
                  className="text-dark hover:text-lime transition-colors duration-300 py-2 flex items-center gap-2"
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
                  >
                    <circle cx="8" cy="21" r="1"></circle>
                    <circle cx="19" cy="21" r="1"></circle>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                <Link
                  to="/account"
                  className="text-dark hover:text-lime transition-colors duration-300 py-2 flex items-center gap-2"
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
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-dark hover:text-lime transition-colors duration-300 py-2 flex items-center gap-2"
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
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" x2="9" y1="12" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-lime text-dark px-4 py-2 rounded-lg font-medium border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
