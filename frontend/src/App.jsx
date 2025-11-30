import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  BooksListPage,
  BookDetailPage,
  CreateBookPage,
  EditBookPage,
} from './pages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/books"
                element={
                  <ProtectedRoute>
                    <BooksListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books/create"
                element={
                  <ProtectedRoute>
                    <CreateBookPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books/:bookId"
                element={
                  <ProtectedRoute>
                    <BookDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/books/:bookId/edit"
                element={
                  <ProtectedRoute>
                    <EditBookPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#282A3A',
            color: '#ffffff',
            border: '1px solid #735F32',
          },
          success: {
            iconTheme: {
              primary: '#735F32',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
