"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match")
    }

    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long")
    }

    setIsLoading(true)

    try {
      await signup(formData.name, formData.email, formData.password)
      navigate("/")
    } catch (err) {
      setError(err.message || "Failed to create an account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-dark text-white rounded-full px-4 py-2 mb-4 border-2 border-dark shadow-button-light">
            <div className="w-2 h-2 bg-lime rounded-full"></div>
            <span className="text-sm font-medium">Join GiftGenius</span>
          </div>
          <h1 className="text-3xl font-black mb-2 text-dark">Create Your Account</h1>
          <p className="text-gray-600">Start your journey with us today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-dark shadow-button-sm focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-dark shadow-button-sm focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-dark shadow-button-sm focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-dark shadow-button-sm focus:outline-none focus:ring-2 focus:ring-lime focus:border-transparent"
              placeholder="Confirm your password"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-lime focus:ring-lime border-dark rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <Link to="/terms" className="text-dark hover:text-lime">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-dark hover:text-lime">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-lime text-dark px-8 py-4 rounded-xl text-lg font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-dark hover:text-lime">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
} 