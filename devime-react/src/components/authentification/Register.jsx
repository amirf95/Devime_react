import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import NavBar from '../NavBar';
import Footer from '../Footer';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password1: '',
    password2: '',
    role: 'client',
  });

  const [message, setMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');

  // ✅ Obtenir le CSRF token au chargement
  useEffect(() => {
    axios.get('http://localhost:8000/csrf/', { withCredentials: true })
      .then(() => {
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('csrftoken='))
          ?.split('=')[1];
        setCsrfToken(cookieValue || '');
      })
      .catch(err => {
        console.error('Failed to get CSRF token:', err);
      });
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post(
      'http://localhost:8000/register/',
      JSON.stringify(formData),
      {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )
    .then(response => {
      setMessage('Utilisateur inscrit avec succès !');

      // ✅ Réinitialiser les champs après inscription
      setFormData({
        username: '',
        email: '',
        phoneNumber: '',
        password1: '',
        password2: '',
        role: 'client',
      });
    })
    .catch(error => {
      if (error.response) {
        console.log('Form errors:', error.response.data);
        setMessage(JSON.stringify(error.response.data.errors));
      } else {
        setMessage('Une erreur inconnue est survenue.');
      }
    });
  };

  return (
    <>
    <NavBar />
    <div className="register-container">
      <h2>Créer un compte</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input className='input-register'
          name="username"
          placeholder="Nom d'utilisateur"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input className='input-register'
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input className='input-register'
          name="phoneNumber"
          type="tel"
          pattern="[0-9]{10}" // Format tunisien 10 chiffres
          placeholder="Numéro de téléphone"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <input className='input-register'
          name="password1"
          type="password"
          placeholder="Mot de passe"
          value={formData.password1}
          onChange={handleChange}
          required
        />
        <input className='input-register'
          name="password2"
          type="password"
          placeholder="Confirmer le mot de passe"
          value={formData.password2}
          onChange={handleChange}
          required
        />
        <select className='input-register'
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="client">Client</option>
          <option value="entrepreneur">Entrepreneur</option>
          <option value="admin">Admin</option>
        </select>
        <button className='submit-button' type="submit">S'inscrire</button>
      </form>
    </div>
    <Footer />
    </>
  );
}

export default Register;