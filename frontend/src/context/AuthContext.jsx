"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("token")
    if (token) {
      // Verify token and get user data
      fetchUserData(token)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // If token is invalid, clear it and user data
        localStorage.removeItem("token")
        setUser(null)
        navigate("/login")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      localStorage.removeItem("token")
      setUser(null)
      navigate("/login")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      localStorage.setItem("token", data.token)
      setUser(data.user)
      return data
    } catch (error) {
      throw error
    }
  }

  const signup = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Signup failed")
      }

      localStorage.setItem("token", data.token)
      setUser(data.user)
      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, log out the user
          logout()
          throw new Error("Session expired. Please login again.")
        }
        throw new Error(data.message || "Profile update failed")
      }

      setUser({ ...user, ...profileData })
      return data
    } catch (error) {
      throw error
    }
  }

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/users/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid, log out the user
          logout()
          throw new Error("Session expired. Please login again.")
        }
        throw new Error(data.message || "Password update failed")
      }

      return data
    } catch (error) {
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    updatePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 