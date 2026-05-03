import React, { useState } from 'react';
import './CoreSaaSPlatform.css';

const CoreSaaSPlatform = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    alert(isLogin ? 'Login successful!' : 'Signup successful! Welcome to Core SaaS Platform!');
    setFormData({ email: '', password: '' });
  };

  return (
    <div className="core-saas-wrapper">
      <header className="core-saas-hero">
        <div className="hero-content">
          <h1>Core SaaS Platform</h1>
          <p>Multi-tenant SaaS foundation with advanced tenant isolation, white-labeling, and unlimited scalability</p>
        </div>
      </header>

      <div className="core-saas-container">
        <div className="auth-card">
          <div className="card-header">
            <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
            <p>Get instant access to your multi-tenant SaaS dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="your@company.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="auth-btn primary">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-toggle">
            <span>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="auth-toggle-btn">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="features-preview">
          <h3>Platform Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-users"></i>
              <h4>Multi-Tenant</h4>
              <p>Complete tenant isolation with custom domains</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-cog"></i>
              <h4>White Label</h4>
              <p>Brandable UI with your logo & colors</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-database"></i>
              <h4>API Ready</h4>
              <p>REST + GraphQL APIs for all integrations</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-infinity"></i>
              <h4>Unlimited Scale</h4>
              <p>Handle 1000s of tenants without performance loss</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreSaaSPlatform;

