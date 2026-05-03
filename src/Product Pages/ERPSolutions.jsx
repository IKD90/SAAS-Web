import React, { useState } from 'react';
import './ERPSolutions.css';

const ERPSolutions = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const products = [
    { id: 1, name: 'ERP Core', price: 99 },
    { id: 2, name: 'Inventory Mgmt', price: 49 },
    { id: 3, name: 'Financials', price: 79 },
    { id: 4, name: 'HR Module', price: 59 }
  ];
  const [orderForm, setOrderForm] = useState({ product: '', quantity: 1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isLogin ? 'Login successful!' : 'Signup successful! Welcome to ERP Solutions!');
    setFormData({ email: '', password: '' });
  };

  const handleOrderDemo = (e) => {
    e.preventDefault();
    alert(`Demo request submitted for ${orderForm.product} x${orderForm.quantity}!`);
    setOrderForm({ product: '', quantity: 1 });
  };

  return (
    <div className="erp-wrapper">
      <header className="erp-hero">
        <div className="hero-content">
          <h1>ERP Solutions</h1>
          <p>Complete Enterprise Resource Planning for multi-tenant operations. Inventory, Finance, HR all integrated.</p>
        </div>
      </header>

      <div className="erp-container">
        <div className="auth-card">
          <div className="card-header">
            <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
            <p>Access your ERP dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="erp@company.com"
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
            <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="auth-toggle-btn">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>

        <div className="demo-section">
          <h3>Request ERP Demo</h3>
          <form onSubmit={handleOrderDemo} className="demo-form">
            <div className="form-group">
              <label>Product</label>
              <select 
                value={orderForm.product} 
                onChange={(e) => setOrderForm({...orderForm, product: e.target.value})}
                required
              >
                <option value="">Select ERP Module</option>
                {products.map(p => (
                  <option key={p.id} value={p.name}>{p.name} - ${p.price}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value)})}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Demo Date</label>
                <input type="date" required />
              </div>
            </div>
            <button type="submit" className="demo-btn">Request Live Demo</button>
          </form>

          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-boxes"></i>
              <h4>Inventory</h4>
              <p>Real-time tracking across all tenants</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-chart-line"></i>
              <h4>Financials</h4>
              <p>Multi-currency accounting</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-users"></i>
              <h4>HR Integration</h4>
              <p>Payroll + employee management</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-cogs"></i>
              <h4>Workflows</h4>
              <p>Approval automation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERPSolutions;

