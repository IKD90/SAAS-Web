import React, { useState } from 'react';
import './WhiteLabelSolution.css';

const WhiteLabelSolution = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isLogin ? 'Login successful!' : 'Signup successful! Welcome to White Label Solution!');
    setFormData({ email: '', password: '' });
  };

  return (
    <div className="whitelabel-wrapper">
      <header className="whitelabel-hero">
        <div className="hero-content">
          <h1>White Label Solution</h1>
          <p>Complete rebranding platform - Your SaaS, Your brand, Your domain. Unlimited customization.</p>
        </div>
      </header>

      <div className="whitelabel-container">
        <div className="auth-card">
          <div className="card-header">
            <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
            <p>Access your white-label SaaS dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="admin@yourbrand.com"
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
          <h3>White Label Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-palette"></i>
              <h4>Full Rebranding</h4>
              <p>Logo, colors, fonts - complete customization</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-globe"></i>
              <h4>Custom Domain</h4>
              <p>Use yourdomain.com on all tenant instances</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-mobile-alt"></i>
              <h4>Mobile Apps</h4>
              <p>Native iOS/Android with your branding</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-infinity"></i>
              <h4>Unlimited Tenants</h4>
              <p>Scale to 1000s of branded instances</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteLabelSolution;

