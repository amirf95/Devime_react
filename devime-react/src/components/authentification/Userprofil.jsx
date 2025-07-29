import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import NavBar from '../NavBar';  // <-- ici l'import relatif
import Footer from '../Footer';
import Chatbot from '../Chatbot/ChatBot';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default function UserProfile() {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone_number: '',
    role: '',
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password1: '',
    new_password2: '',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetch('http://localhost:8000/csrf/', { credentials: 'include' });
    fetch('http://localhost:8000/api/profile/', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Vous devez être connecté');
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setMessage({ type: 'error', text: err.message });
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');
    try {
      const res = await fetch('http://localhost:8000/api/profile/', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur inconnue');
      }

      setMessage({ type: 'success', text: 'Profil mis à jour !' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');
    try {
      const res = await fetch('http://localhost:8000/api/change-password/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(passwordData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur changement mot de passe');
      }

      setMessage({ type: 'success', text: 'Mot de passe changé avec succès' });
      setPasswordData({ old_password: '', new_password1: '', new_password2: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
  
    <>
    <NavBar variant="login"/>
    
    <div className="user-profile-container">
      

      <h2 className="user-profile-title">Mon Profil</h2>

      {message.text && (
        <p className={message.type === 'error' ? 'user-profile-error' : 'user-profile-message'}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmitProfile} className="user-profile-form">
        <input className="user-profile-input" name="username" placeholder="Nom d'utilisateur" value={profile.username} onChange={handleChange} />
        <input className="user-profile-input" name="email" type="email" placeholder="Email" value={profile.email} onChange={handleChange} />
        <input className="user-profile-input" name="phone_number" placeholder="Téléphone" value={profile.phone_number || ''} onChange={handleChange} />
        <input className="user-profile-input" value={profile.role} disabled />
        <button type="submit" className="user-profile-button">
          💾 <span>Mettre à jour</span>
        </button>      </form>

      <h3 className="user-profile-subtitle">Changer le mot de passe</h3>
      <form onSubmit={handleChangePassword} className="user-profile-form">
        <input className="user-profile-input" name="old_password" type="password" placeholder="Ancien mot de passe" value={passwordData.old_password} onChange={handlePasswordChange} />
        <input className="user-profile-input" name="new_password1" type="password" placeholder="Nouveau mot de passe" value={passwordData.new_password1} onChange={handlePasswordChange} />
        <input className="user-profile-input" name="new_password2" type="password" placeholder="Confirmer le mot de passe" value={passwordData.new_password2} onChange={handlePasswordChange} />
        <button type="submit" className="user-profile-button">
          🔒 <span>Modifier mot de passe</span>
        </button>      </form>
        
    </div>
    <Chatbot />
    <Footer />
    </>
  );
}
