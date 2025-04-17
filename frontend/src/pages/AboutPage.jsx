import { Link } from "react-router-dom"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      bio: "Sarah founded GiftGenius with a vision to revolutionize gift-giving through AI technology. With over 15 years in e-commerce and a background in machine learning, she leads our company's strategic direction.",
      image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Sarah+J",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Michael oversees all technical aspects of GiftGenius. His expertise in AI and natural language processing has been instrumental in developing our gift recommendation engine.",
      image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Michael+C",
    },
    {
      name: "Priya Patel",
      role: "Head of Curation",
      bio: "Priya leads our product curation team, ensuring that every item in our catalog meets our quality standards. Her background in retail and merchandising helps us source unique gifts from around the world.",
      image: "https://placehold.co/300x300/e2e8f0/1e293b?text=Priya+P",
    },
    {
      name: "David Rodriguez",
      role: "Customer Experience Director",
      bio: "David ensures that every customer interaction with GiftGenius is exceptional. His team handles customer support, packaging, and the overall shopping experience.",
      image: "https://placehold.co/300x300/e2e8f0/1e293b?text=David+R",
    },
  ]

  const timeline = [
    {
      year: "2020",
      title: "The Idea",
      description:
        "GiftGenius was born from a simple frustration: finding the perfect gift is hard. Our founder envisioned using AI to solve this universal problem.",
    },
    {
      year: "2021",
      title: "Launch",
      description:
        "After months of development, we launched our beta platform with a small catalog of curated gifts and our first version of the AI recommendation engine.",
    },
    {
      year: "2022",
      title: "Expansion",
      description:
        "We expanded our product catalog to over 1,000 unique items and enhanced our AI algorithm to provide even more personalized recommendations.",
    },
    {
      year: "2023",
      title: "Mobile App",
      description:
        "We launched our mobile app, making it even easier for customers to find the perfect gift on the go.",
    },
    {
      year: "2024",
      title: "Today",
      description:
        "GiftGenius now serves thousands of customers worldwide with an ever-growing selection of thoughtfully curated gifts and continuously improving AI technology.",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 pt-24"> {/* Added pt-24 for navbar spacing */}
      {/* Hero Section */}
      <div className="bg-dark text-dark/80 rounded-2xl overflow-hidden mb-20 border-2 border-dark shadow-button"> {/* Increased mb */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-cream">Our Story <span className="inline-block ml-2 transform rotate-8">📖</span></h1> {/* Changed text color */}
            <p className="text-lg mb-6 text-cream/80"> {/* Changed text color */}
              GiftGenius was founded with a simple mission: to take the stress out of gift-giving and replace it with
              joy. We believe that finding the perfect gift should be a delightful experience, not a chore.
            </p>
            <p className="text-lg text-cream/80"> {/* Changed text color */}
              By combining AI technology with thoughtful curation, we've created a platform that helps you discover
              meaningful gifts for every person and occasion in your life.
            </p>
          </div>
          <div className="relative h-64 md:h-full">
            <img
              src="https://placehold.co/600x600/e2e8f0/1e293b?text=Our+Team"
              alt="GiftGenius team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="mb-20"> {/* Increased mb */}
        <h2 className="text-3xl font-bold text-center mb-12 text-dark">
          Our Mission & Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Value Card 1 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300">
            <div className="w-16 h-16 bg-lime rounded-lg flex items-center justify-center mb-4 border-2 border-dark shadow-button-sm">
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
                <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"></path>
                <path d="M14 3v5h5M18 21v-6M15 18h6"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-dark">Thoughtful Curation</h3>
            <p className="text-dark/80">
              We carefully select each product in our catalog, ensuring quality, uniqueness, and value. Our team
              searches globally for gifts that delight and surprise.
            </p>
          </div>

          {/* Value Card 2 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300">
            <div className="w-16 h-16 bg-lime rounded-lg flex items-center justify-center mb-4 border-2 border-dark shadow-button-sm">
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
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z"></path>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-dark">Innovative Technology</h3>
            <p className="text-dark/80">
              Our AI-powered recommendation engine learns from every interaction, continuously improving to provide
              increasingly personalized gift suggestions.
            </p>
          </div>

          {/* Value Card 3 */}
          <div className="bg-white rounded-2xl p-6 border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300">
            <div className="w-16 h-16 bg-lime rounded-lg flex items-center justify-center mb-4 border-2 border-dark shadow-button-sm">
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
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-dark">Customer Happiness</h3>
            <p className="text-dark/80">
              We measure our success by the smiles we create. Our team is dedicated to providing exceptional service and
              ensuring every gift brings joy.
            </p>
          </div>
        </div>
      </div>

      {/* Our Journey */}
      <div className="mb-20"> {/* Increased mb */}
        <h2 className="text-3xl font-bold text-center mb-12 text-dark">
          Our Journey
        </h2>
        <div className="relative overflow-hidden px-2"> {/* Added overflow-hidden and horizontal padding */}
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-lime/50 top-0"></div>

          {/* Timeline Items */}
          <div className="space-y-16"> {/* Increased space-y */}
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`relative flex items-start ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-col md:items-center`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-lime z-10 border-2 border-dark top-0 md:top-auto"></div>

                {/* Content */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"} mb-8 md:mb-0`}> {/* Adjusted padding and added margin for mobile */}
                  <div className="bg-white rounded-2xl p-6 border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300">
                    <span className="text-lime font-bold text-xl block mb-1">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-bold mb-2 text-dark">{item.title}</h3>
                    <p className="text-dark/80">{item.description}</p>
                  </div>
                </div>

                {/* Empty Space for Desktop */}
                <div className="hidden md:block w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20"> {/* Increased mb */}
        <h2 className="text-3xl font-bold text-center mb-12 text-dark">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"> {/* Changed md to sm */} 
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 flex flex-col" /* Added flex flex-col */
            >
              <div className="relative h-64 group"> {/* Added group class */} 
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" /* Added hover effect */
                />
                {/* Removed hover overlay for cleaner look */}
              </div>
              <div className="p-6 flex flex-col flex-grow"> {/* Added flex flex-col flex-grow */}
                <h3 className="text-xl font-bold mb-1 text-dark">{member.name}</h3>
                <p className="text-lime mb-3 font-medium">{member.role}</p>
                <p className="text-dark/80 text-sm flex-grow">{member.bio}</p> {/* Added text-sm and flex-grow */}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-cream rounded-2xl p-8 md:p-12 text-center border-2 border-dark shadow-button mb-8"> {/* Added mb */}
        <h2 className="text-3xl font-bold mb-4 text-dark">
          Join Us on Our Mission
        </h2>
        <p className="text-lg text-dark/80 mb-8 max-w-3xl mx-auto">
          We're always looking for passionate individuals to join our team and help us make gift-giving a joyful
          experience for everyone.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/careers"
            className="bg-lime text-dark px-8 py-3 rounded-xl text-lg font-bold border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
          >
            View Careers
          </Link>
          <Link
            to="/contact"
            className="bg-white text-dark px-8 py-3 rounded-xl text-lg font-bold border-2 border-dark shadow-button-lime hover:shadow-button-lime-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
