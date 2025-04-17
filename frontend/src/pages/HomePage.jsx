"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import TestimonialCard from "../components/TestimonialCard"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef(null)
  const parallaxRef1 = useRef(null)
  const parallaxRef2 = useRef(null)
  const parallaxRef3 = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const features = [
    {
      title: "AI-powered Recommendations",
      description: "Our smart AI understands preferences to suggest perfect gifts",
      icon: "brain",
    },
    {
      title: "Curated for Every Occasion",
      description: "Find gifts for birthdays, anniversaries, holidays, and more",
      icon: "gift",
    },
    {
      title: "Fast & Secure Checkout",
      description: "Shop with confidence with our secure payment system",
      icon: "shield-check",
    },
    {
      title: "Free Shipping Over $50",
      description: "Enjoy free shipping on all orders over $50",
      icon: "truck",
    },
  ]

  const testimonials = [
    {
      quote: "GiftGenius helped me find the perfect birthday gift for my dad who's impossible to shop for!",
      name: "Sarah Johnson",
      role: "Happy Customer",
    },
    {
      quote: "The AI recommendations were spot on. Saved me hours of browsing through different stores.",
      name: "Michael Chen",
      role: "Repeat Customer",
    },
    {
      quote: "I was skeptical at first, but the gift finder tool suggested exactly what my wife wanted!",
      name: "David Rodriguez",
      role: "New Customer",
    },
  ]

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="w-full bg-cream text-dark min-h-screen flex items-center relative overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(#151616 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* Parallax Elements */}
        <div
          ref={parallaxRef1}
          className="absolute top-20 left-10 w-20 h-20 bg-lime rounded-full opacity-20 blur-xl"
          style={{
            transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.05}deg)`,
            transition: "transform 0.1s ease-out",
          }}
        ></div>
        <div
          ref={parallaxRef2}
          className="absolute bottom-40 right-20 w-32 h-32 bg-lime rounded-full opacity-20 blur-xl"
          style={{
            transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * -0.05}deg)`,
            transition: "transform 0.1s ease-out",
          }}
        ></div>
        <div
          ref={parallaxRef3}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pattern pointer-events-none"
          style={{
            transform: `translateY(${scrollY * 0.05}px)`,
            transition: "transform 0.1s ease-out",
          }}
        ></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-dark text-white rounded-full px-4 py-2 mb-6 border-2 border-dark shadow-button-light">
            <div className="w-2 h-2 bg-lime rounded-full"></div>
            <span className="text-sm font-medium">AI-Powered Gift Recommendations</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Find the{" "}
            <span className="relative inline-block mx-2">
              <span className="relative z-10">Perfect</span>
              <span className="absolute bottom-2 left-0 right-0 h-4 bg-lime -z-0"></span>
            </span>{" "}
            Gift Every Time
          </h1>

          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            Our AI understands preferences to recommend thoughtful, personalized gifts for your loved ones on any
            occasion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/gift-finder"
              className="bg-lime text-dark px-8 py-4 rounded-xl text-lg font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Finding Gifts
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
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </Link>
            <Link
              to="/products"
              className="bg-white text-dark px-8 py-4 rounded-xl text-lg font-bold border-2 border-dark shadow-button-lime hover:shadow-button-lime-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-dark text-white rounded-full px-4 py-2 mb-4 border-2 border-dark shadow-button-light">
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
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
            </svg>
            <span className="text-sm font-medium">Core Features</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-4 text-dark">
            Why Choose GiftGenius?
            <span className="inline-block ml-2 transform rotate-8">🎁</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover how our AI-powered platform makes finding the perfect gift easier than ever before.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-lime rounded-lg flex items-center justify-center mb-4 border-2 border-dark shadow-button-sm">
                {feature.icon === "brain" && (
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
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z"></path>
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z"></path>
                  </svg>
                )}
                {feature.icon === "gift" && (
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
                )}
                {feature.icon === "shield-check" && (
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                )}
                {feature.icon === "truck" && (
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
                    <path d="M10 17h4V5H2v12h3"></path>
                    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"></path>
                    <path d="M14 17h1"></path>
                    <circle cx="7.5" cy="17.5" r="2.5"></circle>
                    <circle cx="17.5" cy="17.5" r="2.5"></circle>
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-dark">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              <a href="#" className="inline-flex items-center mt-4 text-dark font-medium relative group">
                Learn more
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-dark">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from real people who found the perfect gifts with GiftGenius.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} quote={testimonial.quote} name={testimonial.name} role={testimonial.role} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-dark">Featured Gifts</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular gift ideas, hand-picked by our curation team and loved by our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl overflow-hidden group border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300">
            <div className="relative h-64">
              <img
                src="https://luxurylondon.co.uk/wp-content/uploads/2022/08/best-classic-watches-xl-hd.jpg"
                alt="Classic Analog Watch"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-bold text-lg">Classic Analog Watch</h3>
                  <p className="text-sm">An elegant timepiece featuring stainless steel</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden group border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300">
            <div className="relative h-64">
              <img
                src="https://dzasv7x7a867v.cloudfront.net/product_photos/50721671/il_fullxfull.1038871992_2gcy_original.jpg"
                alt="Premium Assorted Chocolate Gift Box"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-bold text-lg">Premium Chocolate Box</h3>
                  <p className="text-sm">Luxurious assortment of handcrafted chocolates</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden group border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300">
            <div className="relative h-64">
              <img
                src="https://img.freepik.com/premium-photo/designer-leather-wallets-4k-image-downloaded_555090-12917.jpg"
                alt="Premium Leather Wallet"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end">
                <div className="p-4 text-white">
                  <h3 className="font-bold text-lg">Premium Leather Wallet</h3>
                  <p className="text-sm">Crafted from genuine full-grain leather</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="bg-lime text-dark px-8 py-4 rounded-xl text-lg font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 inline-block"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-lime py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 text-dark">Ready to Find the Perfect Gift?</h2>
          <p className="text-xl text-dark/80 mb-10 max-w-2xl mx-auto">
            Let our AI help you discover thoughtful, personalized gifts for your loved ones.
          </p>
          <Link
            to="/gift-finder"
            className="bg-dark text-white px-8 py-4 rounded-xl text-lg font-bold border-2 border-dark shadow-button-light hover:shadow-button-light-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-2"
          >
            Try Gift Finder Now
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
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
