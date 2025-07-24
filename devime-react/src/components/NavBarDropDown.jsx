import './NavBarDropDown.css';

const NavBarDropDown = ({ isSignedIn, onLogout, isOpen}) => {
  return (
    <div className="dropdown-container">
      {/* Dropdown content (now controlled by parent) */}
      <div className={`dropdown-content ${isOpen ? 'show' : ''}`}>
        <ul>
          {!isSignedIn ? (
            <>
              <li>
                <a href="/login">Login</a>
              </li>
              <li>
                <a href="/signup">Sign Up</a>
              </li>
            </>
          ) : (
            <>
              <li>
                <a href="/profile">My Account</a>
              </li>
              <li>
                <a href="/projects">My Projects</a>
              </li>
              <li>
                <a href="/contact">Contact Us</a>
              </li>
                  <li>
                <a href="/prix-page">Liste prix</a>
              </li>
              <li>
                <button onClick={onLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBarDropDown;