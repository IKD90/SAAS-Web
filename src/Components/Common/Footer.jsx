import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">

          {/* Company Info */}
          <div className="footer-section">
            <h3>RKS Developers Group</h3>
            <p>
              Empowering businesses with cutting-edge multi-tenant SaaS solutions.
            </p>

            <div className="contact-info">
              <p><i className="fas fa-map-marker-alt"></i> 123 Tech Park, Silicon Valley</p>
              <p><i className="fas fa-phone"></i> +1 (555) 123-4567</p>
              <p><i className="fas fa-envelope"></i> info@rksdevelopers.com</p>
            </div>
          </div>

          {/* Quick Links */}
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

          {/* Support */}
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Social + Newsletter */}
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
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>
            © 2024 RKS Developers Group. All rights reserved. | Designed and Developed by RKS Developers Group
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;