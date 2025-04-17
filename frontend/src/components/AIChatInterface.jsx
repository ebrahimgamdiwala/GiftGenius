"use client"

import { useState, useRef, useEffect } from "react"
import ChatBubble from "./ChatBubble"
import ProductCard from "./ProductCard"
import { useAuth } from "../context/AuthContext"

export default function AIChatInterface() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      message:
        "Hi there! I'm your AI gift assistant. I'll help you find the perfect gift. Who are you buying a gift for?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showProducts, setShowProducts] = useState(false)
  const chatContainerRef = useRef(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (input.trim() === "") return

    // Add user message
    const newMessages = [...messages, { sender: "user", message: input }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Only add auth token if user is logged in
      if (user) {
        const token = localStorage.getItem('token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch('http://localhost:5000/api/chatbot/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: input,
          conversationHistory: messages
        }),
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Add AI response and products
      setMessages([...newMessages, { 
        sender: "ai", 
        message: data.message,
        products: data.products || [] // Ensure products is always an array
      }])
      setShowProducts(data.products && data.products.length > 0)
    } catch (error) {
      console.error('Error:', error)
      // Show a more user-friendly error message
      const errorMessage = error.message.includes('HTTP error') 
        ? "I'm having trouble connecting to the server. Please try again later."
        : error.message;
        
      setMessages([...newMessages, { 
        sender: "ai", 
        message: errorMessage,
        products: [] // Ensure products is always an array
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl overflow-hidden border-2 border-dark shadow-button">
      
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-cream/50">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <ChatBubble key={index} sender={msg.sender} message={msg.message} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-[80%] shadow-md border-2 border-dark/10">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-lime rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-lime rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-lime rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {showProducts && messages[messages.length - 1].products && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4 text-dark/90">Recommended Gifts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {messages[messages.length - 1].products.slice(0, 3).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-dark/30 p-4 bg-white">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border-2 border-dark/30 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime bg-cream/50 text-dark placeholder-dark/50 shadow-button-sm"
          />
          <button
            onClick={handleSendMessage}
            className="bg-lime text-dark px-4 py-2 rounded-r-lg transition-all duration-300 border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1"
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
              <path d="m22 2-7 20-4-9-9-4Z"></path>
              <path d="M22 2 11 13"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
