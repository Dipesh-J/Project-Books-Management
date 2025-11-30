# BookShelf - Books Management System

A full-stack books management application with a React frontend and Node.js/Express backend.

## 🎯 Features

- **User Authentication**: Register and login with JWT-based authentication
- **Books Management**: Create, read, update, and delete books
- **Reviews System**: Add, edit, and delete book reviews with ratings
- **Filtering**: Filter books by category and subcategory
- **Responsive Design**: Works on desktop and mobile devices

## 🏗 Project Structure

```
/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── validator/     # Input validation
│   └── index.js           # Server entry point
│
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client
│   │   ├── stores/        # Zustand state management
│   │   └── theme/         # Design tokens
│   └── index.html
│
└── package.json       # Workspace configuration
```

## 🎨 Design System

The frontend uses a custom design token system with:

- **Colors**: Primary (#735F32), Primary Variant (#C69749), Dark backgrounds
- **Typography**: Poppins font family
- **Spacing**: Consistent spacing scale (xs to 6xl)
- **Components**: Button, Input, Card, Table, Modal, Badge, and more

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (or MongoDB Atlas connection)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dipesh-J/Project-Books-Management.git
cd Project-Books-Management
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### Running Locally

1. Start the backend server:
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

3. Open http://localhost:5173 in your browser

### Building for Production

```bash
# Build the frontend
cd frontend
npm run build
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login and get JWT token |

### Books (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | Get all books (with optional filters) |
| GET | `/books/:bookId` | Get book details with reviews |
| POST | `/books` | Create a new book |
| PUT | `/books/:bookId` | Update a book |
| DELETE | `/books/:bookId` | Delete a book |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/books/:bookId/review` | Add a review |
| PUT | `/books/:bookId/review/:reviewId` | Update a review |
| DELETE | `/books/:bookId/review/:reviewId` | Delete a review |

## 🛠 Tech Stack

### Frontend
- React 19 with Vite
- React Router v6 for routing
- TanStack Query for data fetching
- Zustand for state management
- Tailwind CSS v4 for styling
- Axios for HTTP requests
- react-hot-toast for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication

## 🌐 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend && npm run build
```

2. Deploy the `dist` folder to Vercel or Netlify

3. Set environment variable for API URL:
```
VITE_API_URL=https://your-backend-url.com
```

### Backend (Render/Railway)

1. Deploy the backend folder
2. Set environment variables:
```
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
```

## 📝 License

ISC

## 👥 Author

Dipesh Joshi
