# Gifting Genius

Gifting Genius is a modern e-commerce platform that helps users find the perfect gifts for their loved ones. The platform leverages AI technology to provide personalized gift recommendations based on user preferences and recipient profiles.

## Project Structure

The project is divided into two main components:

### Frontend (`/frontend`)
- Built with React.js and Vite
- Uses TailwindCSS for styling
- Implements React Router for navigation
- Modern UI/UX design

### Backend (`/backend`)
- Node.js and Express.js server
- MongoDB database with Mongoose ODM
- JWT authentication
- Stripe integration for payments
- Google's Generative AI integration for gift recommendations

## Features

- User authentication and authorization
- Personalized gift recommendations using AI
- Secure payment processing with Stripe
- Responsive and modern user interface
- Product catalog and search functionality
- User profile management
- Shopping cart and checkout process

## Tech Stack

### Frontend
- React.js
- Vite
- TailwindCSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Stripe
- Google Generative AI
- Bcryptjs

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:3000` (backend).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please reach out to the project maintainers. 