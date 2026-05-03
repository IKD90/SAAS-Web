import React, { useState } from 'react';
import './AppMarketplace.css';

const AppMarketplace = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isLogin ? 'Login successful!' : 'Signup successful! Welcome to App Marketplace!');
    setFormData({ email: '', password: '' });
  };

  return (
    <div className="marketplace-wrapper">
      <header className="marketplace-hero">
        <div className="hero-content">
          <h1>App Marketplace</h1>
          <p>Discover, install and monetize apps for your multi-tenant SaaS platform</p>
        </div>
      </header>

      <div className="marketplace-container">
        <div className="auth-card">
          <div className="card-header">
            <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
            <p>Access app marketplace & developer console</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="marketplace@yourapp.com"
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
          <h3>Marketplace Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-store"></i>
              <h4>App Store</h4>
              <p>100+ apps for all categories</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-dollar-sign"></i>
              <h4>Revenue Share</h4>
              <p>70% revenue to developers</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-plug"></i>
              <h4>1-Click Install</h4>
              <p>Auto tenant provisioning</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-chart-bar"></i>
              <h4>Analytics</h4>
              <p>App usage & revenue tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppMarketplace;

