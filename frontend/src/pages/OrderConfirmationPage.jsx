import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  const receiptRef = useRef(null)
  
  const handleDownloadReceipt = async () => {
    if (!orderDetails || !receiptRef.current) return;
    
    try {
      setGeneratingPdf(true);
      
      // Create a clone of the receipt element to modify for PDF
      const receiptElement = receiptRef.current.cloneNode(true);
      const tempDiv = document.createElement('div');
      tempDiv.appendChild(receiptElement);
      document.body.appendChild(tempDiv);
      
      // Add a header with logo and company info
      const header = document.createElement('div');
      header.style.padding = '20px';
      header.style.textAlign = 'center';
      header.style.borderBottom = '1px solid #e2e8f0';
      header.innerHTML = `
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">GiftGenius</h1>
        <p style="margin-bottom: 4px;">Order Receipt</p>
        <p style="margin-bottom: 4px;">Order ID: ${orderDetails.orderId}</p>
        <p style="margin-bottom: 4px;">Date: ${orderDetails.date}</p>
      `;
      receiptElement.insertBefore(header, receiptElement.firstChild);
      
      // Capture the element as canvas
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      // Remove the temp element
      document.body.removeChild(tempDiv);
      
      // Generate PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`GiftGenius_Receipt_${orderDetails.orderId}.pdf`);
      
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
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
        
        const orderId = localStorage.getItem("lastOrderId")
        
        if (!orderId) {
          // If no order ID in localStorage, fetch the most recent order
          const ordersResponse = await fetch("http://localhost:5000/api/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (!ordersResponse.ok) {
            const errorData = await ordersResponse.json()
            throw new Error(errorData.message || "Failed to fetch orders")
          }
          
          const orders = await ordersResponse.json()
          
          if (orders.length === 0) {
            throw new Error("No orders found")
          }
          
          // Sort orders by date and get the most recent one
          orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          const mostRecentOrder = orders[0]
          
          // Fetch the complete order details
          const orderResponse = await fetch(`http://localhost:5000/api/orders/${mostRecentOrder._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (!orderResponse.ok) {
            const errorData = await orderResponse.json()
            throw new Error(errorData.message || "Failed to fetch order details")
          }
          
          const orderData = await orderResponse.json()
          setOrderDetails({
            orderId: orderData._id,
            date: new Date(orderData.createdAt).toLocaleDateString(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            items: orderData.items.map(item => ({
              id: item.product._id,
              name: item.product.name,
              price: item.price,
              quantity: item.quantity,
              image: item.product.image || "https://placehold.co/100x100/e2e8f0/1e293b?text=Product",
            })),
            subtotal: orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0),
            shipping: orderData.shippingPrice,
            total: orderData.totalPrice,
          })
        } else {
          // Fetch specific order details using the ID from localStorage
          const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Failed to fetch order details")
          }
          
          const orderData = await response.json()
          setOrderDetails({
            orderId: orderData._id,
            date: new Date(orderData.createdAt).toLocaleDateString(),
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            items: orderData.items.map(item => ({
              id: item.product._id,
              name: item.product.name,
              price: item.price,
              quantity: item.quantity,
              image: item.product.image || "https://placehold.co/100x100/e2e8f0/1e293b?text=Product",
            })),
            subtotal: orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0),
            shipping: orderData.shippingPrice,
            total: orderData.totalPrice,
          })
          
          // Clear the order ID from localStorage to prevent confusion on future visits
          localStorage.removeItem("lastOrderId")
        }
      } catch (err) {
        console.error("Order fetch error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrderDetails()
  }, [user, navigate])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your order details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border-2 border-dark shadow-button p-8 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-dark">Error</h1>
          <p className="mb-8 text-dark/70">{error}</p>
          <Link
            to="/products"
            className="bg-lime text-dark px-6 py-3 rounded-xl font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl border-2 border-dark shadow-button p-8 max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-dark">No Order Found</h1>
          <p className="mb-8 text-dark/70">We couldn't find your order details. Please try placing an order first.</p>
          <Link
            to="/products"
            className="bg-lime text-dark px-6 py-3 rounded-xl font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center bg-cream min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-2xl border-2 border-dark shadow-button overflow-hidden p-8 text-center mb-8">
          <div className="w-20 h-20 bg-lime rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-dark shadow-button-sm">
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
              className="text-dark"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-4 text-dark">
            Thank You for Your Order!
            <span className="inline-block ml-2 transform rotate-8">🎁</span>
          </h1>
          <p className="text-xl text-dark/70 mb-8">
            Your order has been received and is being processed. You will receive an email confirmation shortly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <div className="bg-cream rounded-xl px-6 py-4 border-2 border-dark shadow-button-sm">
              <p className="text-dark/70 text-sm">Order ID</p>
              <p className="font-bold text-dark">{orderDetails.orderId}</p>
            </div>
            <div className="bg-cream rounded-xl px-6 py-4 border-2 border-dark shadow-button-sm">
              <p className="text-dark/70 text-sm">Order Date</p>
              <p className="font-bold text-dark">{orderDetails.date}</p>
            </div>
            <div className="bg-cream rounded-xl px-6 py-4 border-2 border-dark shadow-button-sm">
              <p className="text-dark/70 text-sm">Estimated Delivery</p>
              <p className="font-bold text-dark">{orderDetails.estimatedDelivery}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="bg-lime text-dark px-8 py-3 rounded-xl font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
            >
              Return to Home
            </Link>
            <Link
              to="/account"
              className="bg-dark text-white px-8 py-3 rounded-xl font-bold border-2 border-dark shadow-button-light hover:shadow-button-light-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
            >
              View Order History
            </Link>
            <button
              onClick={handleDownloadReceipt}
              disabled={generatingPdf}
              className="bg-cream text-dark px-8 py-3 rounded-xl font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {generatingPdf ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download Receipt
                </>
              )}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div ref={receiptRef} className="bg-white rounded-2xl border-2 border-dark shadow-button overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-dark flex items-center">
              <div className="w-8 h-8 bg-lime/20 rounded-full flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-lime"
                >
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                  <path d="M16.5 9.4 7.55 4.24"></path>
                  <polyline points="3.29 7 12 12 20.71 7"></polyline>
                  <line x1="12" y1="22" x2="12" y2="12"></line>
                </svg>
              </div>
              Order Summary
            </h2>

            <div className="divide-y divide-dark/10">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center">
                  <div className="relative w-16 h-16 mr-4 border-2 border-dark rounded-lg overflow-hidden shadow-button-sm">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-dark">{item.name}</h3>
                    <p className="text-dark/70 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-dark">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-dark/10 mt-4 pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-dark/70">Subtotal</span>
                <span className="text-dark font-medium">${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/70">Shipping</span>
                <span className="text-dark font-medium">{orderDetails.shipping === 0 ? "Free" : `$${orderDetails.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-dark/10">
                <span className="text-dark">Total</span>
                <span className="text-dark">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
