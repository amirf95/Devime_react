import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar';
import Footer from '../Footer';
import Swal from 'sweetalert2';


function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

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
        console.error('Erreur CSRF :', err);
      });
  }, []);

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  const showToast = (icon, title) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({ icon, title });
 };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post(
      'http://localhost:8000/login/',
      credentials,
      {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )
    .then(response => {
      showToast("success", "Connexion réussie !");
      setCredentials({ username: '', password: '' });
      navigate('/'); // 🔁 Redirection vers la page d'accueil
    })
    .catch(error => {
      if (error.response) {
        const errorData = error.response.data;
        let errorMessage = 'Nom ou mot de passe invalide.';
        if (typeof errorData === 'object') {
          errorMessage = Object.values(errorData)
          .flat()
          .join('\n');
      } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
        showToast("error", errorMessage);
      } else {

      showToast("error", "Erreur de connexion. Veuillez réessayer plus tard.");
      }
    });
  };

  return (
    <>
      <NavBar variant="login"/>
      <div className="login-container">
        <h2>Connexion</h2>
        <form onSubmit={handleSubmit}>
          <input 
            className='login-input'
            name="username"
            placeholder="Nom d'utilisateur"
            value={credentials.username}
            onChange={handleChange}
            required
          />
          <input
            className='login-input'
            name="password"
            type="password"
            placeholder="Mot de passe"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Se connecter</button>
        </form>
      </div>
      <Footer/>
    </>
  );
}

export default Login;