import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true, // 🔒 pour que le cookie de session soit inclus
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
