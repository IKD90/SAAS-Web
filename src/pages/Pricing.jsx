import React from 'react';
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <div className="container">
      <h1>Pricing Plans</h1>
      <p>Flexible pricing for every business size.</p>
      
      <div className="features" style={{display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center'}}>
        <div className="card pricing-card" style={{width: '300px'}}>
          <h3>Starter</h3>
          <div style={{fontSize: '2em', color: 'var(--accent)'}}>$29/mo</div>
          <ul>
            <li>1 Tenant</li>
            <li>Basic Builder</li>
            <li>10 Pages</li>
            <li>Email Support</li>
          </ul>
          <Link to="/signup" className="btn-signup">Get Started</Link>
        </div>
        <div className="card pricing-card popular" style={{width: '300px'}}>
          <h3>Pro <span style={{fontSize: '12px', background: 'var(--accent)', color: 'white', padding: '2px 6px', borderRadius: '12px'}}>Popular</span></h3>
          <div style={{fontSize: '2em', color: 'var(--accent)'}}>$99/mo</div>
          <ul>
            <li>Unlimited Tenants</li>
            <li>Full Builder</li>
            <li>Unlimited Pages</li>
            <li>Priority Support</li>
          </ul>
          <Link to="/signup" className="btn-signup">Get Started</Link>
        </div>
        <div className="card pricing-card" style={{width: '300px'}}>
          <h3>Enterprise</h3>
          <div style={{fontSize: '2em', color: 'var(--accent)'}}>$Custom</div>
          <ul>
            <li>Custom Tenants</li>
            <li>Advanced Features</li>
            <li>24/7 Support</li>
            <li>Dedicated Manager</li>
          </ul>
          <Link to="/contact" className="btn-signup">Contact Us</Link>
        </div>
      </div>
<div style={{marginTop: '60px', textAlign: 'center'}}>
        <h3>Secure Payment Methods</h3>
        <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
          <div style={{padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', minWidth: '140px'}}>
            <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_buynowCC_L.png" alt="PayPal" style={{width: '100px'}} />
            <p>PayPal</p>
            <button onClick={() => window.open('https://www.paypal.com/ncp/billing/PP-Subscription?planId=P-123456789', '_blank')} className="learn-more" style={{marginTop: '5px'}}>Pay $29</button>
          </div>
          <div style={{padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', minWidth: '140px'}}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Upi-logo.png/220px-Upi-logo.png" alt="UPI" style={{width: '80px'}} />
            <p>UPI</p>
            <button onClick={() => alert('UPI Payment Intent: paytm://upi/pay?pa=rksdev@paytm&am=29&cu=INR&tn=Pro Monthly')} className="learn-more" style={{marginTop: '5px'}}>Pay ₹2400</button>
          </div>
          <div style={{padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', minWidth: '140px'}}>
            <i className="fab fa-stripe" style={{fontSize: '40px', color: '#635bff'}}></i>
            <p>Stripe</p>
            <button onClick={() => window.location.href = '/payment-success?method=stripe&plan=pro'} className="learn-more" style={{marginTop: '5px'}}>Pay $99</button>
          </div>
          <div style={{padding: '20px', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', minWidth: '140px'}}>
            <i className="fas fa-credit-card" style={{fontSize: '40px', color: '#6772e5'}}></i>
            <p>Cards</p>
            <button onClick={() => window.location.href = '/payment-success?method=card&plan=pro'} className="learn-more" style={{marginTop: '5px'}}>Pay $99</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

