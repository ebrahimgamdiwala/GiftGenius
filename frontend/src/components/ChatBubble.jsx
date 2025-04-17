export default function ChatBubble({ sender, message }) {
  const isAI = sender === "ai"

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`
          ${
            isAI
              ? "bg-white rounded-lg rounded-tl-none border-2 border-dark shadow-button-sm"
              : "bg-lime-300 rounded-lg rounded-tl-none border-2 border-dark shadow-button-sm"
          } 
          p-3 max-w-[80%] transform transition-all duration-300 hover:scale-105
        `}
      >
        {message}
      </div>
    </div>
  )
}
