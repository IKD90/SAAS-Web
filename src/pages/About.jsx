import React from "react";
import { Link } from "react-router-dom";
import "./../App.css"; // use App.css styles

const About = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>About RKS Developers Group</h1>
        <p>Empowering businesses with innovative multi-tenant SaaS solutions since 2018</p>
        
        <div className="hero-buttons">
          <Link to="/contact" className="btn-signup">Get in Touch</Link>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="trusted-section" style={{ marginTop: "2rem" }}>
        <h3>Our Story</h3>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "1.5rem" }}>
            Founded in 2018, RKS Developers Group started with a simple yet powerful vision: 
            to democratize enterprise-grade technology for businesses of all sizes. What began 
            as a small team of passionate developers has now grown into a leading provider of 
            multi-tenant SaaS solutions.
          </p>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.8", marginBottom: "1.5rem" }}>
            Today, we serve over 500+ active tenants across the globe, helping businesses 
            scale, innovate, and succeed in the digital economy. Our commitment to excellence, 
            security, and innovation has made us the trusted partner for industry leaders worldwide.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="features" style={{ marginTop: "3rem" }}>
        <div className="card">
          <i className="fas fa-bullseye"></i>
          <h3>Our Mission</h3>
          <p>To provide innovative, scalable, and secure multi-tenant SaaS solutions that empower businesses to achieve their full potential in the digital age.</p>
          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#667eea" }}>
            <i className="fas fa-check-circle"></i> Innovation First
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#667eea" }}>
            <i className="fas fa-check-circle"></i> Customer Success
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#667eea" }}>
            <i className="fas fa-check-circle"></i> Excellence Always
          </div>
        </div>

        <div className="card">
          <i className="fas fa-eye"></i>
          <h3>Our Vision</h3>
          <p>To become the world's most trusted multi-tenant SaaS platform provider, enabling digital transformation for businesses across every industry.</p>
          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#667eea" }}>
            <i className="fas fa-globe"></i> Global Impact
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#667eea" }}>
            <i className="fas fa-chart-line"></i> Sustainable Growth
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#667eea" }}>
            <i className="fas fa-handshake"></i> Lasting Partnerships
          </div>
        </div>

        <div className="card">
          <i className="fas fa-heart"></i>
          <h3>Our Values</h3>
          <p>Integrity, innovation, collaboration, and customer-centricity drive everything we do at RKS Developers Group.</p>
          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#667eea" }}>
            <i className="fas fa-shield-alt"></i> Transparency
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#667eea" }}>
            <i className="fas fa-users"></i> Teamwork
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#667eea" }}>
            <i className="fas fa-rocket"></i> Continuous Learning
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats">
        <div>
          <h2>500+</h2>
          <p>Active Tenants</p>
        </div>
        <div>
          <h2>50+</h2>
          <p>Expert Developers</p>
        </div>
        <div>
          <h2>1000+</h2>
          <p>Projects Completed</p>
        </div>
        <div>
          <h2>25+</h2>
          <p>Countries Served</p>
        </div>
      </div>

      {/* Team Section */}
      <div className="testimonials">
        <h3>Meet Our Leadership Team</h3>
        <p style={{ textAlign: "center", marginBottom: "2rem" }}>Passionate experts driving innovation and excellence</p>
        
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <i className="fas fa-user-circle" style={{ fontSize: "4rem", color: "#667eea" }}></i>
            <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Rajesh Kumar</h4>
            <p style={{ color: "#667eea", fontWeight: "bold", marginBottom: "1rem" }}>Founder & CEO</p>
            <p>20+ years of experience in enterprise software architecture and SaaS product development.</p>
            <div style={{ marginTop: "1rem" }}>
              <i className="fab fa-linkedin" style={{ margin: "0 0.5rem", cursor: "pointer" }}></i>
              <i className="fab fa-twitter" style={{ margin: "0 0.5rem", cursor: "pointer" }}></i>
              <i className="fab fa-github" style={{ margin: "0 0.5rem", cursor: "pointer" }}></i>
            </div>
          </div>

          <div className="testimonial-card">
            <i className="fas fa-user-circle" style={{ fontSize: "4rem", color: "#667eea" }}></i>
            <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Priya Sharma</h4>
            <p style={{ color: "#667eea", fontWeight: "bold", marginBottom: "1rem" }}>CTO</p>
            <p>Expert in cloud architecture, AI/ML integration, and building scalable distributed systems.</p>
            <div style={{ marginTop: "1rem" }}>
              <i className="fab fa-linkedin" style={{ margin: "0 0.5rem", cursor: "pointer" }}></i>
              <i className="fab fa-twitter" style={{ margin: "0 0.5rem", cursor: "pointer" }}></i>
              <i className="fab fa-github" style={{ margin: "0 0.5rem", cursor: "pointer" }}></i>
            </div>
          </div>

          <div className="testimonial-card">
            <i className="fas fa-user-circle" style={{ fontSize: "4rem", color: "#667eea" }}></i>
            <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>Ankit Verma</h4>
            <p style={{ color: "#667eea", fontWeight: "bold", marginBottom: "1rem" }}>Head of Product</p>
            <p>Product strategist with a passion for creating intuitive and impactful user experiences.</p>
            <div style={{ marginTop: "1rem" }}>
              <i className="fab fa-linkedin" style={{ margin: "0 0.5rem", cursor: "pointer" }}></i>
              <i className="fab fa-twitter" style={{ margin: "0 0.5rem", cursor: "pointer" }}></i>
              <i className="fab fa-github" style={{ margin: "0 0.5rem", cursor: "pointer" }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="trusted-section" style={{ marginTop: "3rem" }}>
        <h3>Why Choose RKS Developers Group?</h3>
        <div className="features" style={{ marginTop: "2rem" }}>
          <div className="card">
            <i className="fas fa-tachometer-alt"></i>
            <h3>Performance</h3>
            <p>Lightning-fast response times and 99.9% uptime guaranteed for all our SaaS solutions.</p>
          </div>

          <div className="card">
            <i className="fas fa-lock"></i>
            <h3>Security First</h3>
            <p>Enterprise-grade security with regular audits, compliance checks, and data encryption.</p>
          </div>

          <div className="card">
            <i className="fas fa-headset"></i>
            <h3>24/7 Support</h3>
            <p>Round-the-clock technical support and dedicated customer success managers.</p>
          </div>

          <div className="card">
            <i className="fas fa-expand-arrows-alt"></i>
            <h3>Scalability</h3>
            <p>Solutions that grow with your business, from startup to enterprise level.</p>
          </div>

          <div className="card">
            <i className="fas fa-code-branch"></i>
            <h3>Modern Tech Stack</h3>
            <p>Built with cutting-edge technologies including React, Node.js, Python, and cloud-native solutions.</p>
          </div>

          <div className="card">
            <i className="fas fa-chart-line"></i>
            <h3>Proven Track Record</h3>
            <p>Successfully delivered 1000+ projects with 98% client satisfaction rate.</p>
          </div>
        </div>
      </div>

      {/* Technology Partners */}
      <div className="trusted-section">
        <h3>Our Technology Partners</h3>
        <div className="trusted-logos">
          <i className="fab fa-aws"></i>
          <i className="fab fa-microsoft"></i>
          <i className="fab fa-google"></i>
          <i className="fab fa-docker"></i>
          <i className="fab fa-kubernetes"></i>
          <i className="fab fa-react"></i>
          <i className="fab fa-node-js"></i>
          <i className="fab fa-python"></i>
        </div>
      </div>

      {/* Certifications */}
      <div className="stats" style={{ marginTop: "2rem" }}>
        <div>
          <i className="fas fa-certificate" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
          <h2>ISO 27001</h2>
          <p>Certified</p>
        </div>
        <div>
          <i className="fas fa-shield-alt" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
          <h2>SOC 2 Type II</h2>
          <p>Compliant</p>
        </div>
        <div>
          <i className="fas fa-gdpr" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
          <h2>GDPR</h2>
          <p>Compliant</p>
        </div>
        <div>
          <i className="fas fa-cc-visa" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
          <h2>PCI DSS</h2>
          <p>Certified</p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="testimonials">
        <h3>Our Journey</h3>
        <div className="stats" style={{ marginTop: "2rem" }}>
          <div>
            <h2>2018</h2>
            <p>Company Founded</p>
            <small>Started with 5 members</small>
          </div>
          <div>
            <h2>2020</h2>
            <p>First Major Release</p>
            <small>Launched multi-tenant platform</small>
          </div>
          <div>
            <h2>2022</h2>
            <p>Global Expansion</p>
            <small>Opened 3 international offices</small>
          </div>
          <div>
            <h2>2024</h2>
            <p>AI Integration</p>
            <small>Launched AI-powered features</small>
          </div>
          <div>
            <h2>2026</h2>
            <p>500+ Tenants</p>
            <small>Milestone achievement</small>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="hero" style={{ marginTop: "3rem" }}>
        <h2>Ready to Transform Your Business?</h2>
        <p>Join hundreds of satisfied businesses already using our platform</p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn-signup">Start Free Trial</Link>
          <Link to="/contact" className="btn-signup" style={{ background: "transparent", border: "2px solid white", marginLeft: "1rem" }}>Contact Sales</Link>
        </div>
      </div>
    </div>
  );
};

export default About;