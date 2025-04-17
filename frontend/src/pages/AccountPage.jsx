"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          const data = await response.json();
          throw new Error(data.message || "Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          zipCode: data.address?.zipCode || "",
          country: data.address?.country || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load user data");
        if (err.message === "No authentication token found") {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          const data = await response.json();
          throw new Error(data.message || "Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        if (err.message === "No authentication token found") {
          navigate("/login");
        }
      }
    }

    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch("http://localhost:5000/api/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          const data = await response.json();
          throw new Error(data.message || "Failed to fetch wishlist");
        }

        const data = await response.json();
        setWishlist(data.items || []);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
        if (err.message === "No authentication token found") {
          navigate("/login");
        }
      }
    }

    if (user) {
      fetchUserData()
      fetchOrders()
      fetchWishlist()
    } else {
      navigate("/login")
    }
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      const data = await response.json();
      setUserData(data.user);
      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        address: data.user.address?.street || "",
        city: data.user.address?.city || "",
        state: data.user.address?.state || "",
        zipCode: data.user.address?.zipCode || "",
        country: data.user.address?.country || "",
      });
      setError("");
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("New passwords do not match");
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError("New password must be at least 6 characters long");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update password");
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError("");
      alert("Password updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update password");
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/wishlist/remove/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist");
      }

      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      setError(err.message || "Failed to remove item from wishlist");
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/wishlist/move-to-cart/${productId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to move item to cart");
      }

      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      alert("Item moved to cart successfully!");
    } catch (err) {
      setError(err.message || "Failed to move item to cart");
    }
  };

  const renderProfileTab = () => (
    <div>
      <h2 className="text-4xl md:text-4xl lg:text-4xl font-black mb-6 text-dark">
        Your Profile
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
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
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-gray-700 mb-1">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="India">India</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-cream text-dark border-2 border-dark shadow-button py-2 px-6 rounded-lg font-medium transition-colors duration-300 hover:bg-lime hover:text-dark hover:shadow-button-sm"
          >
            Save Changes
          </button>
        </div>
      </form>

      <div className="mt-12 border-t pt-8">
        <h3 className="text-xl font-bold mb-4">Password & Security</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="bg-cream text-dark border-2 border-dark shadow-button py-2 px-6 rounded-lg font-medium transition-colors duration-300 hover:bg-lime hover:text-dark hover:shadow-button-sm"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  )

  const renderOrdersTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-dark">
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="bg-lime text-dark border-2 border-dark shadow-button py-2 px-6 rounded-lg font-medium transition-colors duration-300 hover:bg-cream hover:text-dark hover:shadow-button-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-purple-100">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <div>
                    <h3 className="font-bold">Order #{order._id}</h3>
                    <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Shipped"
                            ? "bg-lime text-dark border-2 border-dark shadow-button-sm"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-b py-4 my-4">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between py-2">
                      <div>
                        <span>{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/orders/${order._id}`}
                    className="text-lime hover:text-dark transition-colors duration-300 font-semibold"
                  >
                    View Order Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderWishlistTab = () => (
    <div className="py-10">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r text-gray-800 bg-clip-text">
        Your Wishlist
      </h2>

      {wishlist.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
          <Link
            to="/products"
            className="bg-lime text-dark border-2 border-dark shadow-button py-2 px-6 rounded-lg font-medium transition-colors duration-300 hover:bg-cream hover:text-dark hover:shadow-button-sm"
          >
            Discover Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-dark hover:shadow-lg transition-all duration-300"
            >
              <div className="p-4 flex items-center">
                <div className="relative w-20 h-20 mr-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-dark">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-1">{item.description}</p>
                  <p className="font-bold text-lime">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item._id)}
                    className="bg-lime text-dark border-2 border-dark py-1 px-4 rounded text-sm font-medium hover:bg-cream hover:text-dark hover:shadow-button-sm transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    className="text-red-500 text-sm hover:text-red-700 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-cream pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-cream pt-24 min-h-screen">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-dark text-center">
        Your Account <span className="inline-block ml-2 transform rotate-8">👤</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border-2 border-dark shadow-button overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-lime rounded-full flex items-center justify-center mr-4 text-dark border-2 border-dark shadow-button-sm">
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
                </div>
                <div>
                  <h2 className="font-bold text-dark">{userData?.name}</h2>
                  <p className="text-gray-500 text-sm">{userData?.email}</p>
                </div>
              </div>

              <nav>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-300 ${
                        activeTab === "profile"
                          ? "bg-lime text-dark border-2 border-dark shadow-button-sm"
                          : "hover:bg-gray-100 text-dark"
                      }`}
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-300 ${
                        activeTab === "orders"
                          ? "bg-lime text-dark border-2 border-dark shadow-button-sm"
                          : "hover:bg-gray-100 text-dark"
                      }`}
                    >
                      Order History
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/wishlist"
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-300 ${
                        activeTab === "wishlist"
                          ? "bg-lime text-dark border-2 border-dark shadow-button-sm"
                          : "hover:bg-gray-100 text-dark"
                      }`}
                    >
                      Wishlist
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="mt-8 pt-6 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 border-2 border-dark shadow-button-sm transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-2xl border-2 border-dark shadow-button overflow-hidden">
            <div className="p-6">
              {activeTab === "profile" && renderProfileTab()}
              {activeTab === "orders" && renderOrdersTab()}
              {activeTab === "wishlist" && renderWishlistTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
