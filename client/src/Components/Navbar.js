import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      verifyAuthentication(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      verifyAuthentication(token);
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  const verifyAuthentication = async (token) => {
    try {

      const response = await fetch(`${process.env.REACT_APP_API_URL}/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok && data.isAuthenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      setIsAuthenticated(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">MyCars.com</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/addcar">Add Car</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/allcars">All Cars</Link>
                </li>
              </>
            ) : null}
          </ul>
          <div className="d-flex">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2 text-primary">Login</Link>
                <Link to="/signup" className="btn btn-primary text-white">Sign Up</Link>
              </>
            ) : (
              <button className="btn btn-outline-primary me-2 text-primary" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
