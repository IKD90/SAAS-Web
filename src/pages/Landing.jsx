import React from "react";
import { Link } from "react-router-dom";
import "./../App.css"; // use App.css styles

const Landing = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to RKS Developers Group</h1>
        <p>Enterprise-Grade Multi-Tenant SaaS Platform for Modern Businesses</p>

        <div className="hero-buttons">
          <Link to="/signup" className="btn-signup">Get Started Free</Link>
        </div>
      </div>

      {/* Features */}
      <div className="features">
        <div className="card">
          <i className="fas fa-cloud"></i>
          <h3>Cloud Native</h3>
          <p>Fully scalable cloud infrastructure designed for multi-tenant architecture with 99.9% uptime.</p>
          <a href="#" className="learn-more">Learn More →</a>
        </div>

        <div className="card">
          <i className="fas fa-shield-alt"></i>
          <h3>Enterprise Security</h3>
          <p>Bank-level encryption, isolated tenant data, and advanced security protocols.</p>
          <a href="#" className="learn-more">Learn More →</a>
        </div>

        <div className="card">
          <i className="fas fa-chart-line"></i>
          <h3>Real-time Analytics</h3>
          <p>Comprehensive analytics and reporting tools for data-driven decisions.</p>
          <a href="#" className="learn-more">Learn More →</a>
        </div>
      </div>

      {/* Stats */}
      <div className="stats">
        <div>
          <h2>500+</h2>
          <p>Active Tenants</p>
        </div>
        <div>
          <h2>99.9%</h2>
          <p>Uptime Guarantee</p>
        </div>
        <div>
          <h2>24/7</h2>
          <p>Support Available</p>
        </div>
        <div>
          <h2>1000+</h2>
          <p>Happy Clients</p>
        </div>
      </div>

      {/* Trusted Section */}
      <div className="trusted-section">
        <h3>Trusted by Industry Leaders</h3>
        <div className="trusted-logos">
          <i className="fab fa-google"></i>
          <i className="fab fa-microsoft"></i>
          <i className="fab fa-amazon"></i>
          <i className="fab fa-salesforce"></i>
          <i className="fab fa-slack"></i>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials">
        <h3>What Our Clients Say</h3>

        <div className="testimonial-grid">
          <div className="testimonial-card">
            <i className="fas fa-quote-left"></i>
            <p>"RKS Developers Group transformed our business with their multi-tenant SaaS platform. The scalability and security are unmatched!"</p>
            <div className="testimonial-author">
              <strong>John Anderson</strong>
              <span>CTO, TechCorp Solutions</span>
            </div>
          </div>

          <div className="testimonial-card">
            <i className="fas fa-quote-left"></i>
            <p>"The AI integration capabilities and analytics tools have given us invaluable insights into our operations."</p>
            <div className="testimonial-author">
              <strong>Sarah Johnson</strong>
              <span>CEO, CreativeStudio</span>
            </div>
          </div>

          <div className="testimonial-card">
            <i className="fas fa-quote-left"></i>
            <p>"Exceptional support and a platform that grows with our business. Highly recommended!"</p>
            <div className="testimonial-author">
              <strong>Michael Chen</strong>
              <span>Director, InnovateLabs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
