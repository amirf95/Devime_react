import axios from 'axios';

export const getCsrfToken = async () => {
  try {
    await axios.get('http://localhost:8000/csrf/', { withCredentials: true });
  } catch (err) {
    console.error("Erreur CSRF:", err);
  }
};
