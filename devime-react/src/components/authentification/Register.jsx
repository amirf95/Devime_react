import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Register.css';
import NavBar from '../NavBar';
import Footer from '../Footer';
import Swal from 'sweetalert2';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'



function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password1: '',
    password2: '',
    role: 'client',
  });



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
  // ✅ Afficher un toast de succès ou d'erreur
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
        console.log('Registration successful:', response.data);
        showToast('success', 'Utilisateur inscrit avec succès !');

        // ✅ Réinitialiser les champs après inscription
        setFormData({
          username: '',
          email: '',
          phone_number: '',  // ✅ ici aussi
          password1: '',
          password2: '',
          role: 'client',
        });
      })
      .catch(error => {
        if (error.response) {
          const errorData = error.response.data;
          let errorMessage = 'Erreur d\'inscription.';
          if (typeof errorData === 'object') {
            // Handle nested error objects (common in Django)
            if (errorData.errors) {
              // Case 1: Error object with 'errors' property
              errorMessage = Object.entries(errorData.errors)
                .map(([field, errors]) => {
                  const fieldName = field === 'password1' ? 'Mot de passe' :
                    field === 'password2' ? 'Confirmation mot de passe' :
                      field;
                  return `${fieldName}: ${Array.isArray(errors) ? errors.join(', ') : errors}`;
                })
                .join('\n');
            } else {
              // Case 2: Direct field errors
              errorMessage = Object.entries(errorData)
                .map(([field, errors]) => {
                  const fieldName = field === 'password1' ? 'Mot de passe' :
                    field === 'password2' ? 'Confirmation mot de passe' :
                      field;
                  return `${fieldName}: ${Array.isArray(errors) ? errors.join(', ') : errors}`;
                })
                .join('\n');
            }

          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
          showToast('error', errorMessage);
        } else {
          showToast('error', 'Erreur de connexion. Veuillez réessayer plus tard.');
        }
      });
  };

  return (
    <>
      <NavBar variant="login"/>
      <div className="register-container">
        <h2>Créer un compte</h2>
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
          <PhoneInput
            defaultCountry='TN'
            placeholder="Numéro de téléphone"
            value={formData.phone_number}
            onChange={(value) =>
              setFormData({ ...formData, phone_number: value })
            }
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