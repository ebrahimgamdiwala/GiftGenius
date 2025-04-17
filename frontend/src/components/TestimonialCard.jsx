export default function TestimonialCard({ quote, name, role }) {
  return (
    <div className="bg-cream p-6 md:p-8 rounded-2xl border-2 border-dark shadow-button hover:shadow-button-sm hover:translate-y-1 hover:translate-x-1 transition-all duration-300 flex flex-col h-full"> {/* Added md:p-8, flex, flex-col, h-full */}
      <div className="mb-5"> {/* Increased mb */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-lime"
        >
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
        </svg>
      </div>
      <p className="text-dark mb-6 italic flex-grow">{quote}</p> {/* Increased mb, added flex-grow */}
      <div className="flex items-center mt-auto"> {/* Added mt-auto */}
        <div className="w-12 h-12 bg-lime rounded-lg flex items-center justify-center mr-4 border-2 border-dark shadow-button-sm"> {/* Increased size and mr */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" /* Increased size */
            height="24" /* Increased size */
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-dark"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-dark text-lg">{name}</h4> {/* Increased text size */}
          <p className="text-lime text-sm font-medium">{role}</p> {/* Added font-medium */}
        </div>
      </div>
    </div>
  )
}
