import React, { useState } from 'react';
import { useStripe, CardElement, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    // Mock Stripe - always success for demo
    setTimeout(() => {
      window.location.href = '/payment-success?method=stripe';
      setLoading(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={{style: {base: {fontSize: '16px'}}}} />
      <button disabled={!stripe || loading} className="btn-signup">
        {loading ? 'Processing...' : 'Pay Securely'}
      </button>
    </form>
  );
};

const StripeCheckout = () => (
  <div className="container">
    <h1>Secure Checkout (Demo)</h1>
    <div style={{padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px'}}>
      <p>Stripe demo button below</p>
      <button onClick={() => window.location.href = '/payment-success?method=stripe&plan=pro'} className="btn-signup" style={{marginTop: '20px'}}>
        Mock Stripe Payment $99
      </button>
    </div>
  </div>
);

export default StripeCheckout;

