import React, { useState } from 'react';
import './APIManagement.css';

const APIManagement = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isLogin ? 'Login successful!' : 'Signup successful! Welcome to API Management!');
    setFormData({ email: '', password: '' });
  };

  return (
    <div className="api-wrapper">
      <header className="api-hero">
        <div className="hero-content">
          <h1>API Management</h1>
          <p>Complete API gateway with rate limiting, authentication, analytics, and developer portal</p>
        </div>
      </header>

      <div className="api-container">
        <div className="auth-card">
          <div className="card-header">
            <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
            <p>Access your API dashboard and developer portal</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="dev@yourapi.com"
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
          <h3>API Management Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-key"></i>
              <h4>API Keys</h4>
              <p>Granular permissions & usage tracking</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-chart-line"></i>
              <h4>Analytics</h4>
              <p>Real-time usage metrics & performance</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-clock"></i>
              <h4>Rate Limiting</h4>
              <p>Flexible quotas & throttling</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-shield-alt"></i>
              <h4>OAuth 2.0</h4>
              <p>Enterprise-grade authentication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIManagement;

