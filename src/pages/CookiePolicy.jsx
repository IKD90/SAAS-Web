import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="container" style={{maxWidth: '800px'}}>
      <h1>Cookie Policy</h1>
      <p><strong>Last updated: December 2024</strong></p>

      <h2>What Are Cookies?</h2>
      <p>Cookies are small text files stored on your browser/device that enable website functionality.</p>

      <h2>Cookie Categories</h2>
      <ul>
        <li><strong>Essential</strong>: Required for core functionality (login, builder)</li>
        <li><strong>Performance</strong>: Analytics (none active)</li>
        <li><strong>Advertising</strong>: None used</li>
      </ul>

      <h2>Our Cookies</h2>
      <table style={{width: '100%', borderCollapse: 'collapse', margin: '20px 0', fontSize: '14px'}}>
        <thead>
          <tr style={{background: '#f1f5f9'}}>
            <th style={{border: '1px solid #e2e8f0', padding: '12px', textAlign: 'left'}}>Name</th>
            <th style={{border: '1px solid #e2e8f0', padding: '12px', textAlign: 'left'}}>Purpose</th>
            <th style={{border: '1px solid #e2e8f0', padding: '12px', textAlign: 'left'}}>Type</th>
            <th style={{border: '1px solid #e2e8f0', padding: '12px', textAlign: 'left'}}>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{border: '1px solid #e2e8f0', padding: '12px'}}>saas-user</td>
            <td style={{border: '1px solid #e2e8f0', padding: '12px'}}>User authentication token</td>
            <td style={{border: '1px solid #e2e8f0', padding: '12px'}}>Essential</td>
            <td style={{border: '1px solid #e2e8f0', padding: '12px'}}>Session (deleted on logout)</td>
          </tr>
          <tr style={{background: '#f8fafc'}}>
            <td style={{border: '1px solid #e2e8f0', padding: '12px'}}>builder-data</td>
            <td style={{border: '1px solid #e2e8f0', padding: '12px'}}>Your page builder content</td>
            <td style={{border: '1px solid #e2e8f0', padding: '12px'}}>Essential</td>
            <td style={{border: '1px solid #e2e8f0', padding: '12px'}}>Session (localStorage)</td>
          </tr>
        </tbody>
      </table>

      <h2>Third Party Cookies</h2>
      <p>Google Maps (when used) sets own cookies for location services.</p>

      <h2>3. Managing Cookies</h2>
      <ul>
        <li>Browser settings to block/delete</li>
        <li>Essential cookies required for login/builder</li>
        <li>No tracking cookies currently</li>
      </ul>

      <h2>4. Third Parties</h2>
      <p>No third-party cookies. Google Maps uses own cookies.</p>

      <h2>5. Changes</h2>
      <p>We may update this policy. Check regularly.</p>

      <p><strong>Contact:</strong> privacy@rksdev.com</p>
    </div>
  );
};

export default CookiePolicy;
