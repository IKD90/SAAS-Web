import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const method = urlParams.get('method') || 'Payment';
  const plan = urlParams.get('plan') || 'Pro';

  return (
    <div className="container" style={{textAlign: 'center', padding: '60px 20px'}}>
      <div style={{fontSize: '80px', color: '#10b981'}}>✅</div>
      <h1>{method} Payment Successful!</h1>
      <p>Thank you for choosing the {plan} plan. Your subscription is active!</p>
      <div style={{margin: '40px 0'}}>
        <Link to="/builder" className="btn-signup" style={{marginRight: '10px'}}>Go to Builder</Link>
        <Link to="/" className="learn-more">Back Home</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;

