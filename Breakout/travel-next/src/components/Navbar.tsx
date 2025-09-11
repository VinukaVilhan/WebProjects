import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false); // Close menu when switching to desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-header">
        {/* Mobile hamburger menu */}
        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Navigation menu */}
      <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul className="nav-list">
          <li className="nav-item">
            <a href="#home" className="nav-link" data-text="Home" onClick={closeMenu}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="#culture" className="nav-link" data-text="Culture" onClick={closeMenu}>
              Culture
            </a>
          </li>
          <li className="nav-item">
            <a href="#history" className="nav-link" data-text="History" onClick={closeMenu}>
              History
            </a>
          </li>
          <li className="nav-item">
            <a href="#explore" className="nav-link" data-text="Explore" onClick={closeMenu}>
              Explore
            </a>
          </li>
        </ul>
      </div>

      {/* Mobile overlay */}
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </nav>
  );
};

export default Navbar;