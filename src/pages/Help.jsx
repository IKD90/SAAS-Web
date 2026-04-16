import React from 'react';

const Help = () => {
  return (
    <div className="container">
      <h1>Help & Support</h1>
      
      <div className="features">
        <div className="card">
          <h3>FAQ</h3>
          <div>
            <h4>How to use Builder?</h4>
            <p>Login → Builder → Drag elements → Edit → Save</p>
            <h4>What's multi-tenant?</h4>
            <p>Isolated data per customer on shared infra.</p>
          </div>
        </div>
        <div className="card">
          <h3>Support</h3>
          <p><strong>Email:</strong> support@rksdev.com</p>
          <p><strong>Live Chat:</strong> Bottom right</p>
          <a href="/contact" className="learn-more">Contact Us →</a>
        </div>
      </div>
    </div>
  );
};

export default Help;

