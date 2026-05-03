import React from "react";
import { Link } from "react-router-dom";
import "./../App.css"; // use App.css styles

const Services = () => {
  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Our Comprehensive Services</h1>
        <p>End-to-end solutions tailored for your business success in the multi-tenant SaaS ecosystem</p>
        
        <div className="hero-buttons">
          <Link to="/contact" className="btn-signup">Contact Our Team</Link>
        </div>
      </div>

      {/* Main Services */}
      <div className="features">
        <div className="card">
          <i className="fas fa-code"></i>
          <h3>Custom SaaS Development</h3>
          <p>Build scalable multi-tenant applications with modern tech stacks including React, Node.js, Python, and cloud-native architectures.</p>
          <a href="#" className="learn-more">Learn More →</a>
        </div>

        <div className="card">
          <i className="fas fa-cloud-upload-alt"></i>
          <h3>Cloud Migration Services</h3>
          <p>Seamlessly migrate your existing applications to AWS, Azure, or Google Cloud with minimal downtime and maximum efficiency.</p>
          <a href="#" className="learn-more">Learn More →</a>
        </div>

        <div className="card">
          <i className="fas fa-robot"></i>
          <h3>AI & ML Integration</h3>
          <p>Leverage artificial intelligence and machine learning to automate processes, gain insights, and enhance user experiences.</p>
          <a href="#" className="learn-more">Learn More →</a>
        </div>

        <div className="card">
          <i className="fas fa-database"></i>
          <h3>Database Architecture</h3>
          <p>Design optimized, scalable database solutions with proper tenant isolation and data partitioning strategies.</p>
          <a href="#" className="learn-more">Learn More →</a>
        </div>

        <div className="card">
          <i className="fas fa-shield-virus"></i>
          <h3>Security & Compliance</h3>
          <p>Implement enterprise-grade security, GDPR compliance, SOC2 audits, and data encryption for your SaaS platform.</p>
          <a href="#" className="learn-more">Learn More →</a>
        </div>

        <div className="card">
          <i className="fas fa-chart-pie"></i>
          <h3>Analytics & BI Solutions</h3>
          <p>Build custom dashboards, real-time reporting tools, and business intelligence systems for data-driven decisions.</p>
          <a href="#" className="learn-more">Learn More →</a>
        </div>
      </div>

      {/* Process Section */}
      <div className="trusted-section">
        <h3>Our Development Process</h3>
        <div className="stats">
          <div>
            <h2>01</h2>
            <p>Discovery & Planning</p>
            <small>Requirement analysis and architecture design</small>
          </div>
          <div>
            <h2>02</h2>
            <p>Development</p>
            <small>Agile sprints with continuous delivery</small>
          </div>
          <div>
            <h2>03</h2>
            <p>Testing & QA</p>
            <small>Rigorous testing and security audits</small>
          </div>
          <div>
            <h2>04</h2>
            <p>Deployment & Support</p>
            <small>24/7 monitoring and maintenance</small>
          </div>
        </div>
      </div>

      {/* Live Product Demos */}
      <div className="features">
      <div className="card" style={{textAlign: 'center'}}>
          <Link to="/products/Invoices" className="btn-signup" style={{display: 'inline-block', margin: '0.5rem'}}>
            <i className="fas fa-video" style={{marginRight: '8px'}}></i>
            InvoicePro Billing System
          </Link>
          <p>Live video calls, screen sharing & chat</p>
        </div>
        <div className="card" style={{textAlign: 'center'}}>
          <Link to="/products/team-collaboration" className="btn-signup" style={{display: 'inline-block', margin: '0.5rem'}}>
            <i className="fas fa-users" style={{marginRight: '8px'}}></i>
            TeamCollab Enterprise
          </Link>
          <p>Real-time team chat, tasks, and admin tools</p>
        </div>
        <div className="card" style={{textAlign: 'center'}}>
          <Link to="/products/Video-Conference" className="btn-signup" style={{display: 'inline-block', margin: '0.5rem'}}>
            <i className="fas fa-video" style={{marginRight: '8px'}}></i>
            MeetHub Video Conference
          </Link>
          <p>Live video calls, screen sharing & chat</p>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="testimonials">
        <h3>Technologies We Work With</h3>
        <div className="trusted-logos" style={{ marginBottom: "2rem" }}>
          <i className="fab fa-react"></i>
          <i className="fab fa-node-js"></i>
          <i className="fab fa-python"></i>
          <i className="fab fa-java"></i>
          <i className="fab fa-aws"></i>
          <i className="fas fa-database"></i>
          <i className="fab fa-docker"></i>
          <i className="fab fa-kubernetes"></i>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="features" style={{ marginTop: "2rem" }}>
        <h3 style={{ textAlign: "center", width: "100%", marginBottom: "2rem" }}>Service Packages</h3>
        
        <div className="card">
          <i className="fas fa-rocket"></i>
          <h3>Starter Package</h3>
          <h2>$5,000</h2>
          <p>Perfect for startups and small businesses</p>
          <ul style={{ textAlign: "left", marginTop: "1rem", listStyle: "none", padding: 0 }}>
            <li>✓ Basic SaaS Architecture</li>
            <li>✓ Up to 3 Microservices</li>
            <li>✓ Basic Security Implementation</li>
            <li>✓ 3 Months Support</li>
          </ul>
          <Link to="/contact" className="btn-signup" style={{ marginTop: "1rem", display: "inline-block" }}>Get Started</Link>
        </div>

        <div className="card">
          <i className="fas fa-building"></i>
          <h3>Professional Package</h3>
          <h2>$15,000</h2>
          <p>Ideal for growing businesses</p>
          <ul style={{ textAlign: "left", marginTop: "1rem", listStyle: "none", padding: 0 }}>
            <li>✓ Advanced Multi-Tenant Architecture</li>
            <li>✓ Up to 10 Microservices</li>
            <li>✓ Enterprise Security & Compliance</li>
            <li>✓ Real-time Analytics Dashboard</li>
            <li>✓ 12 Months Support</li>
          </ul>
          <Link to="/contact" className="btn-signup" style={{ marginTop: "1rem", display: "inline-block" }}>Get Started</Link>
        </div>

        <div className="card">
          <i className="fas fa-crown"></i>
          <h3>Enterprise Package</h3>
          <h2>Custom Pricing</h2>
          <p>For large organizations with specific needs</p>
          <ul style={{ textAlign: "left", marginTop: "1rem", listStyle: "none", padding: 0 }}>
            <li>✓ Custom Architecture Design</li>
            <li>✓ Unlimited Microservices</li>
            <li>✓ AI/ML Integration</li>
            <li>✓ Dedicated Support Team</li>
            <li>✓ 24/7 Monitoring & SLA</li>
          </ul>
          <Link to="/contact" className="btn-signup" style={{ marginTop: "1rem", display: "inline-block" }}>Contact Sales</Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="hero" style={{ marginTop: "3rem" }}>
        <h2>Ready to Transform Your Business?</h2>
        <p>Get a free consultation with our experts and discover how we can help you scale</p>
        <div className="hero-buttons">
          <Link to="/contact" className="btn-signup">Schedule Consultation</Link>
        </div>
      </div>
    </div>
  );
};

export default Services;