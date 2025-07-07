import { useState,  useEffect } from 'react';
import './NavBar.css';
import NavBarDropDown from './NavBarDropDown';


function NavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false); // State to manage connection status

  // Close dropdown when clicking outside
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      // You can add dropdown close logic here if needed in the future
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler for logout
  const handleLogout = () => {
    // Clear auth tokens or session
    setIsSignedIn(false);
  };

  // Existing navbar scroll effects
  useEffect(() => {
    const navbarShrink = () => {
      const navbarCollapsible = document.querySelector('#mainNav');
      if (!navbarCollapsible) return;
      if (window.scrollY === 0) {
        navbarCollapsible.classList.remove('navbar-shrink');
      } else {
        navbarCollapsible.classList.add('navbar-shrink');
      }
    };

    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    // Initialize Bootstrap ScrollSpy if available
    // This is to ensure that the navbar highlights the current section when scrolling
    // This is useful for single-page applications where sections are linked in the navbar

    const mainNav = document.querySelector('#mainNav');
    if (mainNav && window.bootstrap?.ScrollSpy) {
      new window.bootstrap.ScrollSpy(document.body, {
        target: '#mainNav',
        rootMargin: '0px 0px -40%',
      });
    }
    // Handle responsive navbar toggling
    // Add click event to close the navbar when a link is clicked
    // This is to ensure that the navbar collapses on mobile view when a link is clicked
    const navbarToggler = document.querySelector('.navbar-toggler');
    const responsiveNavItems = document.querySelectorAll('#navbarResponsive .nav-link');

    responsiveNavItems.forEach((item) => {
      item.addEventListener('click', () => {
        if (window.getComputedStyle(navbarToggler).display !== 'none') {
          navbarToggler.click();
        }
      });
    });
    // Ensure the navbar is responsive
    if (navbarToggler) {
      navbarToggler.addEventListener('click', () => {
        setIsCollapsed(!isCollapsed);
      });
    }
    // Clean up event listeners
    return () => {
      document.removeEventListener('scroll', navbarShrink);
      responsiveNavItems.forEach((item) => {
        item.removeEventListener('click', () => {});
      });
    };
  }, [isCollapsed]);


  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
        <div className="container">
          <a className="navbar-brand" href="#page-top">Devime</a>
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            Menu
            <i className="fas fa-bars ms-1"></i>
          </button>
          <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`} id="navbarResponsive">
            <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
              <li className="nav-item"><a className="nav-link" href="#services">Nos services</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">A propos</a></li>
              <li className="nav-item"><a className="nav-link" href="#team">notre Equipe</a></li>
              <li className="nav-item"><a className="nav-link" href="#contact">Contactez nous</a></li>
              <li className="nav-item">
                <NavBarDropDown isSignedIn={isSignedIn} onLogout={handleLogout} />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;