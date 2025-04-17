"use client"

import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simulate form submission
    setFormStatus({
      submitted: true,
      success: true,
      message: "Your message has been sent! We will get back to you soon.",
    })

    // Reset form after successful submission
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-cream pt-24">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-center text-dark">
        Contact Us <span className="inline-block ml-2 transform rotate-8">💬</span>
      </h1>
      <p className="text-gray-700 mb-8 text-center max-w-2xl mx-auto">
        Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back to
        you as soon as possible.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Contact Information */}
        <div>
          <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-dark shadow-button">
            <h2 className="text-xl font-bold mb-4 text-dark">Our Information</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-lime rounded-lg flex items-center justify-center mr-4 mt-1 text-dark border-2 border-dark shadow-button-sm">
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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Phone</h3>
                  <p className="text-gray-700">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-lime rounded-lg flex items-center justify-center mr-4 mt-1 text-dark border-2 border-dark shadow-button-sm">
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
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Email</h3>
                  <p className="text-gray-700">support@giftgenius.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-lime rounded-lg flex items-center justify-center mr-4 mt-1 text-dark border-2 border-dark shadow-button-sm">
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
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Address</h3>
                  <p className="text-gray-700">
                    123 Gift Street
                    <br />
                    San Francisco, CA 94103
                    <br />
                    United States
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-lime rounded-lg flex items-center justify-center mr-4 mt-1 text-dark border-2 border-dark shadow-button-sm">
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
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Business Hours</h3>
                  <p className="text-gray-700">
                    Monday - Friday: 9am - 5pm
                    <br />
                    Saturday: 10am - 4pm
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-dark shadow-button">
            <h2 className="text-xl font-bold mb-4 text-dark">Connect With Us</h2>
            <p className="text-gray-700 mb-4">
              Follow us on social media for the latest updates, promotions, and gift ideas.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-lime rounded-lg flex items-center justify-center text-dark border-2 border-dark shadow-button-sm hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
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
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-lime rounded-lg flex items-center justify-center text-dark border-2 border-dark shadow-button-sm hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
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
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-lime rounded-lg flex items-center justify-center text-dark border-2 border-dark shadow-button-sm hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
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
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-lime rounded-lg flex items-center justify-center text-dark border-2 border-dark shadow-button-sm hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
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
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl p-6 border-2 border-dark shadow-button">
          <h2 className="text-xl font-bold mb-4 text-dark">Send Us a Message</h2>

          {formStatus.submitted && (
            <div
              className={`mb-6 p-4 rounded-lg ${formStatus.success ? "bg-lime/20 text-dark border border-lime" : "bg-red-100 text-red-700 border border-red-300"}`}
            >
              {formStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime bg-white"
                required
              >
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Product Question">Product Question</option>
                <option value="Order Status">Order Status</option>
                <option value="Returns & Exchanges">Returns & Exchanges</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full border border-dark rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lime"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-lime text-dark py-3 rounded-xl font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
