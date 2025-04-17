import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="bg-cream text-dark border-t-2 border-dark shadow-button bg-pattern">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <div className="w-8 h-8 bg-lime rounded-lg flex items-center justify-center mr-2 border-2 border-dark shadow-button-light">
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
                  className="text-dark"
                >
                  <path d="M20 12v10H4V12"></path>
                  <path d="M2 7h20v5H2z"></path>
                  <path d="M12 22V7"></path>
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                  <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                </svg>
              </div>
              GiftGenius
            </h3>
            <p className="text-dark/80 mb-4">
              AI-powered gifting solutions to help you find the perfect present for any occasion.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-dark hover:text-lime transition-all duration-300 transform hover:scale-125 hover:rotate-12"
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
                className="text-dark hover:text-lime transition-all duration-300 transform hover:scale-125 hover:rotate-12"
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
                className="text-dark hover:text-lime transition-all duration-300 transform hover:scale-125 hover:rotate-12"
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
                className="text-dark hover:text-lime transition-all duration-300 transform hover:scale-125 hover:rotate-12"
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

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-dark/80 hover:text-lime transition-colors duration-300 hover:translate-x-1 inline-block hover:underline"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/gift-finder"
                  className="text-dark/80 hover:text-lime transition-colors duration-300 hover:translate-x-1 inline-block hover:underline"
                >
                  Gift Finder
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-dark/80 hover:text-lime transition-colors duration-300 hover:translate-x-1 inline-block hover:underline"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-dark/80 hover:text-lime transition-colors duration-300 hover:translate-x-1 inline-block hover:underline"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-dark/80 hover:text-lime transition-colors duration-300 hover:translate-x-1 inline-block hover:underline"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-dark/80 hover:text-lime transition-colors duration-300 hover:translate-x-1 inline-block hover:underline"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-dark/80 hover:text-lime transition-colors duration-300 hover:translate-x-1 inline-block hover:underline"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-dark/80 hover:text-lime transition-colors duration-300 hover:translate-x-1 inline-block hover:underline"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-dark/80 hover:text-lime transition-colors duration-300 hover:translate-x-1 inline-block hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-dark/80 hover:text-lime transition-colors duration-300 hover:translate-x-1 inline-block hover:underline"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
            <p className="text-dark/80 mb-4">Subscribe to our newsletter for the latest products and offers.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime text-dark border-2 border-dark shadow-button-light bg-cream placeholder-dark/50"
              />
              <button
                type="submit"
                className="bg-lime text-dark hover:bg-lime/90 transition-colors duration-300 px-4 py-2 rounded-lg border-2 border-dark shadow-button hover:shadow-none hover:translate-y-1 hover:translate-x-1"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-dark/30 mt-8 pt-8 text-center text-dark/80">
          <p>&copy; {new Date().getFullYear()} GiftGenius. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
