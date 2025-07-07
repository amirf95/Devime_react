import  { useState } from 'react';

const NavBarDropDown = ({ isSignedIn, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="dropdown-container">
      <button 
        className="user-icon nav-link" 
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <i className="fa-solid fa-user"></i>
      </button>

      <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
        <ul>
          {!isSignedIn ? (
            <>
              <li>
                <a href="/login" className="hover:bg-gray-100 hover:text-yellow-500">
                  Login
                </a>
              </li>
              <li>
                <a href="/signup" className="hover:bg-gray-100 hover:text-yellow-500">
                  Sign Up
                </a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/account" className="hover:bg-gray-100 hover:text-yellow-500">
                  My Account
                </a>
              </li>
              <li>
                <a href="/projects" className="hover:bg-gray-100 hover:text-yellow-500">
                  My Projects
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:bg-gray-100 hover:text-yellow-500">
                  Contact Us
                </a>
              </li>
              <li>
                <button
                  onClick={onLogout}
                  className="w-full text-left hover:bg-gray-100 hover:text-yellow-500"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBarDropDown;