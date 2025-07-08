import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBarDropDown from './NavBarDropDown';


function NavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    axios.post('http://localhost:8000/logout/', {}, { withCredentials: true })
      .then(() => {
        setUserInfo(null);
        window.location.href = '/';
      })
      .catch(err => {
        console.error('Erreur logout:', err);
      });
  };

  useEffect(() => {
    // Appel API pour obtenir les infos de l'utilisateur
    axios.get('http://localhost:8000/api/user/', { withCredentials: true })
      .then(res => setUserInfo(res.data))
      .catch(() => setUserInfo(null));

    // Effet de réduction du navbar au scroll
    const navbarShrink = () => {
      const navbar = document.querySelector('#mainNav');
      if (!navbar) return;
      if (window.scrollY === 0) {
        navbar.classList.remove('navbar-shrink');
      } else {
        navbar.classList.add('navbar-shrink');
      }
    };

    // ScrollSpy et collapse responsive
    const mainNav = document.querySelector('#mainNav');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const responsiveNavItems = document.querySelectorAll('#navbarResponsive .nav-link');

    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    if (mainNav && window.bootstrap?.ScrollSpy) {
      new window.bootstrap.ScrollSpy(document.body, {
        target: '#mainNav',
        rootMargin: '0px 0px -40%',
      });
    }

    responsiveNavItems.forEach((item) => {
      item.addEventListener('click', () => {
        if (window.getComputedStyle(navbarToggler).display !== 'none') {
          navbarToggler.click();
        }
      });
    });

    return () => {
      document.removeEventListener('scroll', navbarShrink);
      responsiveNavItems.forEach((item) => {
        item.removeEventListener('click', () => {});
      });
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
      <div className="container">
        <a className="navbar-brand" href="/">Devime</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
          onClick={toggleNavbar}
        >
          Menu <i className="fas fa-bars ms-1"></i>
        </button>
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
            <li className="nav-item"><a className="nav-link" href="#services">Nos services</a></li>
            <li className="nav-item"><a className="nav-link" href="#about">A propos</a></li>
            <li className="nav-item"><a className="nav-link" href="#team">Notre Équipe</a></li>
            <li className="nav-item"><a className="nav-link" href="#contact">Contactez-nous</a></li>

            {userInfo ? (
              <>
                <li className="nav-item">
                  <div 
                  className="dropdown-trigger d-flex align-items-center" 
                  style={{ cursor: 'pointer' }}
                  >
                    <i className="fa-solid fa-user"></i>
                    <span className="ms-2">
                      {userInfo.username} ({userInfo.role})
                    </span>
                    <NavBarDropDown isSignedIn={!!userInfo} onLogout={handleLogout} />
                  </div>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light ms-3"
                    style={{ cursor: 'pointer' }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a className="btn btn-outline-light me-2" href="/login">Login</a>
                </li>
                <li className="nav-item">
                  <a className="btn btn-primary" href="/register">Sign In</a>
                </li>
              </>
            )}
            

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
