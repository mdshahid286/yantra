import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <FaLeaf className="logo-icon" />
          <span className="logo-text">AgriSmart AI</span>
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/market">Market</Link></li>
          <li><Link to="/advisory">Advisory</Link></li>
        </ul>
        <div className="user-profile">
          <FaUserCircle size={24} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
