import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className={`nav-logo ${location.pathname === '/' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/calendar" className={`nav-link ${location.pathname === '/calendar' ? 'active' : ''}`}>
              Calendario
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;