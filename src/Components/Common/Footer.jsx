import React, { useState } from "react";
import "./Footer.css";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState(null);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    
    if (!newsletterEmail) {
      setNewsletterStatus({ type: 'error', message: 'Please enter your email address' });
      setTimeout(() => setNewsletterStatus(null), 3000);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus({ type: 'error', message: 'Please enter a valid email address' });
      setTimeout(() => setNewsletterStatus(null), 3000);
      return;
    }
    
    // Save to localStorage
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (!subscribers.find(s => s.email === newsletterEmail)) {
      subscribers.push({ 
        email: newsletterEmail, 
        subscribedAt: new Date().toISOString(),
        source: 'footer'
      });
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      setNewsletterStatus({ type: 'success', message: 'Successfully subscribed! Check your email for updates.' });
      setNewsletterEmail('');
    } else {
      setNewsletterStatus({ type: 'error', message: 'This email is already subscribed!' });
    }
    
    setTimeout(() => setNewsletterStatus(null), 5000);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info Section */}
          <div className="footer-section">
            <h3>RKS Developers Group</h3>
            <p className="company-description">
              Empowering businesses with cutting-edge multi-tenant SaaS solutions. 
              We deliver innovation, scalability, and excellence.
            </p>
            <div className="contact-info">
              <p><i className="fas fa-map-marker-alt"></i> 123 Tech Park, Silicon Valley, CA 94025</p>
              <p><i className="fas fa-phone-alt"></i> +1 (555) 123-4567</p>
              <p><i className="fas fa-envelope"></i> info@rksdevelopers.com</p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/blogs">Blogs</a></li>
              <li><a href="/pricing">Pricing</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>

          {/* //  {/* Social + Newsletter */}
           <div className="footer-section">
             <h3>Connect With Us</h3>

             <div className="social-links">
               <a href="#"><i className="fab fa-linkedin"></i></a>
               <a href="#"><i className="fab fa-twitter"></i></a>
               <a href="#"><i className="fab fa-github"></i></a>
               <a href="#"><i className="fab fa-youtube"></i></a>
               <a href="#"><i className="fab fa-facebook"></i></a>
             </div>
             
            <div className="newsletter">
              <h4>Subscribe to Newsletter</h4>
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit">
                  <i className="fas fa-paper-plane"></i> Subscribe
                </button>
              </form>
              {newsletterStatus && (
                <div className={`newsletter-status ${newsletterStatus.type}`}>
                  <i className={`fas ${newsletterStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                  <span>{newsletterStatus.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} RKS Developers Group. All rights reserved. | 
            Designed and Developed by RKS Developers Group
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;