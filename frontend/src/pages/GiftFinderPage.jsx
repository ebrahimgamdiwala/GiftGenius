import AIChatInterface from "../components/AIChatInterface"

export default function GiftFinder() {
  return (
    <div className="container mx-auto px-4 py-16 bg-cream">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4 text-dark">
          AI Gift Finder <span className="inline-block ml-2 transform rotate-8">🤖</span>
        </h1>
        <p className="text-xl text-dark/80 mb-10 max-w-2xl mx-auto">
          Chat with our AI assistant to find the perfect gift. Answer a few questions about the recipient, and we'll
          suggest personalized gift ideas.
        </p>

        <AIChatInterface />
      </div>
    </div>
  )
}
