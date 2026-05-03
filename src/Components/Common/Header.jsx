import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
useEffect(() => {
  setMobileNavOpen(false);
  setActiveDropdown(null);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileNavOpen]);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeMobileMenu = () => {
    setMobileNavOpen(false);
    setActiveDropdown(null);
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && mobileNavOpen) {
        closeMobileMenu();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [mobileNavOpen]);

  return (
    <>
      <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="logo-link" onClick={closeMobileMenu}>
            <div className="logo">
              <img 
                src="/Uploads/WhatsApp Image 2025-12-10 at 2.37.52 PM.jpeg" 
                alt="RKS Developers Group Logo" 
              />
              <span className="logo-text">RKS Developers Group</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <Link to="/" className="nav-item">Home</Link>
            <Link to="/about" className="nav-item">About</Link>
            <Link to="/pricing" className="nav-item">Pricing</Link>
            <Link to="/services" className="nav-item">Services</Link>
            
            {/* Products Mega Dropdown */}
            <div className="nav-dropdown mega">
              <button 
                className="dropdown-trigger-btn"
                aria-expanded={activeDropdown === 'products'}
                aria-haspopup="true"
              >
                Products
              </button>
              <div className="mega-panel">
                <div className="mega-grid">
                  <div className="mega-column">
                    <h4>Core SaaS Platform</h4>
                <Link to="/products/white-label-solution" className="mega-link">White Label Solution</Link>
                <Link to="/products/api-management" className="mega-link">API Management</Link>
                <Link to="/products/app-marketplace" className="mega-link">App Marketplace</Link>
                  </div>
                  <div className="mega-column">
                    <h4>Business Applications</h4>
                    <Link to="/crm" className="mega-link">CRM System</Link>
                    <Link to="/products/erp" className="mega-link">ERP Solutions</Link>
                    <Link to="/products/hr" className="mega-link">HR Management</Link>
                    <Link to="/ecommerce" className="mega-link">E-Commerce Platform</Link>
                    <Link to="/products/hr-management" className="mega-link">Project Management</Link>
                    <Link to="/products/invoices" className="mega-link">Invoicing</Link>
                  </div>
                  <div className="mega-column">
                    <h4>Collaboration Tools</h4>
<Link to="/products/team-collaboration" className="mega-link">TeamCollab</Link>
<Link to="/products/Video-Conference" className="mega-link">
  <i className="fas fa-video" style={{ marginRight: '5px' }}></i>
  MeetHub Video Conference
</Link>
                    <Link to="/products/document-management" className="mega-link">Document Management</Link>
                    <Link to="/products/workflow" className="mega-link">Workflow Automation</Link>
                  </div>
                  <div className="mega-column">
                    <h4>Industry Solutions</h4>
                    <Link to="/products/healthcare" className="mega-link">Healthcare Solutions</Link>
                    <Link to="/products/fintech" className="mega-link">FinTech Platform</Link>
                    <Link to="/products/edtech" className="mega-link">EdTech Solutions</Link>
                    <Link to="/products/retail" className="mega-link">Retail Management</Link>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/blogs" className="nav-item">Blog</Link>
            <Link to="/contact" className="nav-item">Contact</Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="header-cta desktop-cta">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign up</Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`hamburger-toggle ${mobileNavOpen ? 'active' : ''}`} 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`mobile-nav-overlay ${mobileNavOpen ? 'active' : ''}`} 
        onClick={closeMobileMenu}
        aria-hidden={!mobileNavOpen}
      ></div>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={`mobile-nav ${mobileNavOpen ? 'active' : ''}`}
        aria-hidden={!mobileNavOpen}
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        <div className="mobile-nav-header">
          <div className="mobile-logo">
            <img 
              src="/Uploads/WhatsApp Image 2025-12-10 at 2.37.52 PM.jpeg" 
              alt="RKS Developers Group Logo" 
            />
            <span>RKS Developers Group</span>
          </div>
          <button 
            className="mobile-close-btn" 
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        
        <div className="mobile-nav-links">
          <Link to="/" className="mobile-nav-item" onClick={closeMobileMenu}>Home</Link>
          <Link to="/about" className="mobile-nav-item" onClick={closeMobileMenu}>About</Link>
          <Link to="/pricing" className="mobile-nav-item" onClick={closeMobileMenu}>Pricing</Link>
          <Link to="/services" className="mobile-nav-item" onClick={closeMobileMenu}>Services</Link>
          
          {/* Mobile Products Dropdown */}
          <div className="mobile-dropdown">
            <button 
              className={`mobile-dropdown-btn ${activeDropdown === 'products' ? 'active' : ''}`}
              onClick={() => toggleDropdown('products')}
              aria-expanded={activeDropdown === 'products'}
            >
              Products
              <span className="dropdown-arrow">{activeDropdown === 'products' ? '▲' : '▼'}</span>
            </button>
            <div className={`mobile-dropdown-content ${activeDropdown === 'products' ? 'active' : ''}`}>
              <div className="mobile-dropdown-section">
                <h4>Core SaaS Platform</h4>
                <Link to="/products/erp" onClick={closeMobileMenu}>White Label Solution</Link>
                <Link to="/products/erp" onClick={closeMobileMenu}>API Management</Link>
                <Link to="/products/erp" onClick={closeMobileMenu}>App Marketplace</Link>
              </div>
              <div className="mobile-dropdown-section">
                <h4>Business Applications</h4>
                <Link to="/crm" onClick={closeMobileMenu}>CRM System</Link>
                <Link to="/products/erp" onClick={closeMobileMenu}>ERP Solutions</Link>
                <Link to="/products/hr" onClick={closeMobileMenu}>HR Management</Link>
                <Link to="/ecommerce" onClick={closeMobileMenu}>E-Commerce Platform</Link>
                <Link to="/products/project-management" onClick={closeMobileMenu}>Project Management</Link>
                <Link to="/products/invoicing" onClick={closeMobileMenu}>Invoicing</Link>
              </div>
              <div className="mobile-dropdown-section">
                <h4>Collaboration Tools</h4>
                <Link to="/products/team-collaboration" onClick={closeMobileMenu}>TeamCollab</Link>
                <Link to="/products/Video-Conference" onClick={closeMobileMenu}>
                  <i className="fas fa-video" style={{ marginRight: '5px' }}></i>
                  MeetHub Video
                </Link>
                <Link to="/products/document-management" onClick={closeMobileMenu}>Document Management</Link>
                <Link to="/products/workflow" onClick={closeMobileMenu}>Workflow Automation</Link>
              </div>
              <div className="mobile-dropdown-section">
                <h4>Industry Solutions</h4>
                <Link to="/products/healthcare" onClick={closeMobileMenu}>Healthcare Solutions</Link>
                <Link to="/products/fintech" onClick={closeMobileMenu}>FinTech Platform</Link>
                <Link to="/products/edtech" onClick={closeMobileMenu}>EdTech Solutions</Link>
                <Link to="/products/retail" onClick={closeMobileMenu}>Retail Management</Link>
              </div>
            </div>
          </div>
          
          <Link to="/blogs" className="mobile-nav-item" onClick={closeMobileMenu}>Blog</Link>
          <Link to="/contact" className="mobile-nav-item" onClick={closeMobileMenu}>Contact</Link>
        </div>
        
        <div className="mobile-nav-cta">
          <Link to="/login" className="mobile-btn mobile-btn-secondary" onClick={closeMobileMenu}>Login</Link>
          <Link to="/signup" className="mobile-btn mobile-btn-primary" onClick={closeMobileMenu}>Sign up</Link>
        </div>
      </div>
    </>
  );
};

export default Header;