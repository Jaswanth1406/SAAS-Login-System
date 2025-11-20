import axios from 'axios';

// Don't add /api here - it's in the backend routes
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response.data;
  },
  (error) => {
    console.error('Response Error:', error);
    
    if (error.response) {
      const message = error.response.data.message || error.response.data.error || 'Something went wrong';
      
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error(error.message || 'An error occurred');
    }
  }
);

const api = {
  signup: async (userData) => {
    return await axiosInstance.post('/api/auth/signup', userData);
  },

  login: async (credentials) => {
    return await axiosInstance.post('/api/auth/login', credentials);
  },

  getProfile: async () => {
    return await axiosInstance.get('/api/me');
  },

  getLogs: async () => {
    return await axiosInstance.get('/api/logs');
  },
};

export default api;

