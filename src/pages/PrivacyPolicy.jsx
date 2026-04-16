import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container" style={{maxWidth: '800px'}}>
      <h1>Privacy Policy</h1>
      <p><strong>Last updated: December 2024</strong></p>

      <h2>1. Information Collection and Use</h2>
      <p>RKS Developers Group ("Company", "we", "us") collects information to provide our services:</p>
      <ul>
        <li><strong>Account Data</strong>: Name, email, password (hashed) for signup/login</li>
        <li><strong>Contact Data</strong>: Name, email, message for support</li>
        <li><strong>Technical Data</strong>: IP, browser, device via standard web logs</li>
        <li><strong>Builder Data</strong>: Your page designs stored in browser localStorage</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use data to:</p>
      <ul>
        <li>Operate and improve SaaS platform</li>
        <li>Process account registration/login</li>
        <li>Provide customer support</li>
        <li>Send service updates (unsubscribe anytime)</li>
        <li>Ensure security and prevent fraud</li>
      </ul>

      <h2>3. Legal Basis</h2>
      <p>Processing based on:</p>
      <ul>
        <li>Contract performance (your account/services)</li>
        <li>Legitimate interest (security, improvements)</li>
        <li>Consent (marketing emails)</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>Provide and improve our SaaS platform</li>
        <li>Respond to support requests</li>
        <li>Send important notices (no spam)</li>
        <li>Analytics for better service</li>
      </ul>

      <h2>3. Data Sharing</h2>
      <p>We do NOT sell your data. We share with:</p>
      <ul>
        <li>Service providers (analytics, hosting)</li>
        <li>Legal requirements only</li>
      </ul>

      <h2>4. Security</h2>
      <p>Your data is protected with encryption and secure servers.</p>

      <h2>5. Cookies</h2>
      <p>We use essential cookies for authentication. See Cookie Policy for details.</p>

      <h2>6. Your Rights</h2>
      <ul>
        <li>Access, delete your data</li>
        <li>Opt-out of communications</li>
        <li>Contact: privacy@rksdev.com</li>
      </ul>

      <h2>7. Changes</h2>
      <p>We may update this policy. Check regularly.</p>

      <p><strong>Contact us:</strong> privacy@rksdev.com</p>
    </div>
  );
};

export default PrivacyPolicy;
