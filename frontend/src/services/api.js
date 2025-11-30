import axios from 'axios';

// Base API configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-api-key'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
};

// Books API
export const booksAPI = {
  getAll: (params) => api.get('/books', { params }),
  getById: (bookId) => api.get(`/books/${bookId}`),
  create: (data) => api.post('/books', data),
  update: (bookId, data) => api.put(`/books/${bookId}`, data),
  delete: (bookId) => api.delete(`/books/${bookId}`),
};

// Reviews API
export const reviewsAPI = {
  create: (bookId, data) => api.post(`/books/${bookId}/review`, data),
  update: (bookId, reviewId, data) => api.put(`/books/${bookId}/review/${reviewId}`, data),
  delete: (bookId, reviewId) => api.delete(`/books/${bookId}/review/${reviewId}`),
};

export default api;
