import { useEffect } from 'react';
import { useState } from 'react';

function NavBar() {
  const [isCollapsed,setIsCollapsed]=useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

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

    navbarShrink(); // Initial check
    document.addEventListener('scroll', navbarShrink);

    // Bootstrap ScrollSpy
    const mainNav = document.querySelector('#mainNav');
    if (mainNav && window.bootstrap?.ScrollSpy) {
      new window.bootstrap.ScrollSpy(document.body, {
        target: '#mainNav',
        rootMargin: '0px 0px -40%',
      });
    }

    // Responsive nav collapse
    const navbarToggler = document.querySelector('.navbar-toggler');
    const responsiveNavItems = document.querySelectorAll('#navbarResponsive .nav-link');

    responsiveNavItems.forEach((item) => {
      item.addEventListener('click', () => {
        if (window.getComputedStyle(navbarToggler).display !== 'none') {
          navbarToggler.click();
        }
      });
    });

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('scroll', navbarShrink);
      responsiveNavItems.forEach((item) => {
        item.removeEventListener('click', () => {});
      });
    };
  }, []);

    return(
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top" id="mainNav">
            <div className="container">
                <a className="navbar-brand" href="#page-top">Devime</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation" onClick={toggleNavbar}>
                    Menu
                    <i className="fas fa-bars ms-1"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav text-uppercase ms-auto py-4 py-lg-0">
                        <li className="nav-item"><a className="nav-link" href="#services">Nos services</a></li>
                        <li className="nav-item"><a className="nav-link" href="#about">A propos</a></li>
                        <li className="nav-item"><a className="nav-link" href="#team">notre Equipe</a></li>
                        <li className="nav-item"><a className="nav-link" href="#contact">Contactez nous</a></li>
                        <li className="nav-item"><a className="nav-link" href="#signin "><i className="fa-solid fa-user"></i></a></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
