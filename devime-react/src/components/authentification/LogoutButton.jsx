import React from 'react';
import api from '../api';
import { getCsrfToken } from '../utils/csrf';

export default function LogoutButton({ onLogout }) {
  const handleLogout = async () => {
    await getCsrfToken();
    try {
      await api.post('/logout/');
      onLogout();
    } catch (err) {
      console.error("Erreur logout", err);
    }
  };

  return <button onClick={handleLogout}>Se déconnecter</button>;
}
