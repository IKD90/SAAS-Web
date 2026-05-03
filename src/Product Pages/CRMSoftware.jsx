import React, { useState } from 'react';
import './CRMSoftware.css';

const CRMSoftware = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [contacts, setContacts] = useState([
    { id: 1, name: 'John Doe', company: 'Acme Corp', status: 'Lead' },
    { id: 2, name: 'Jane Smith', company: 'Tech Innovators', status: 'Qualified' },
    { id: 3, name: 'Bob Johnson', company: 'Global Traders', status: 'Customer' }
  ]);
  const [newContact, setNewContact] = useState({ name: '', company: '', email: '', status: 'Lead' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isLogin ? 'CRM Login successful!' : 'CRM Signup successful!');
    setFormData({ email: '', password: '' });
  };

  const addContact = (e) => {
    e.preventDefault();
    const contact = {
      id: contacts.length + 1,
      ...newContact
    };
    setContacts([contact, ...contacts]);
    setNewContact({ name: '', company: '', email: '', status: 'Lead' });
  };

  const stats = {
    total: contacts.length,
    leads: contacts.filter(c => c.status === 'Lead').length,
    qualified: contacts.filter(c => c.status === 'Qualified').length,
    customers: contacts.filter(c => c.status === 'Customer').length
  };

  return (
    <div className="crm-wrapper">
      <header className="crm-hero">
        <div className="hero-content">
          <h1>CRM Software</h1>
          <p>Complete Customer Relationship Management for multi-tenant SaaS. Leads, Deals, Contacts all integrated.</p>
        </div>
      </header>

      <div className="crm-container">
        <div className="sidebar">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Contacts</div>
            </div>
            <div className="stat-card lead">
              <div className="stat-number">{stats.leads}</div>
              <div className="stat-label">Leads</div>
            </div>
            <div className="stat-card qualified">
              <div className="stat-number">{stats.qualified}</div>
              <div className="stat-label">Qualified</div>
            </div>
            <div className="stat-card customer">
              <div className="stat-number">{stats.customers}</div>
              <div className="stat-label">Customers</div>
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="quick-btn primary">New Contact</button>
            <button className="quick-btn secondary">New Deal</button>
            <button className="quick-btn secondary">Import CSV</button>
          </div>
        </div>

        <div className="main-content">
          <div className="auth-card">
            <div className="card-header">
              <h2>{isLogin ? 'Sign In' : 'Sign Up'}</h2>
              <p>Access your CRM dashboard</p>
            </div>
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="crm@company.com"
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
                {isLogin ? 'Sign In to CRM' : 'Join CRM'}
              </button>
            </form>

            <div className="auth-toggle">
              <span>{isLogin ? "New to CRM?" : "Have account?"}</span>
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="auth-toggle-btn">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </div>

          <div className="crm-demo">
            <h3>Add New Contact</h3>
            <form onSubmit={addContact} className="new-contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    value={newContact.company}
                    onChange={(e) => setNewContact({...newContact, company: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={newContact.status}
                    onChange={(e) => setNewContact({...newContact, status: e.target.value})}
                  >
                    <option>Lead</option>
                    <option>Qualified</option>
                    <option>Customer</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="crm-btn primary">Add Contact</button>
            </form>

            <div className="contacts-table">
              <h3>Recent Contacts ({contacts.length})</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.slice(0, 5).map(contact => (
                      <tr key={contact.id}>
                        <td>{contact.name}</td>
                        <td>{contact.company}</td>
                        <td>
                          <span className={`status-badge ${contact.status.toLowerCase()}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn edit">Edit</button>
                          <button className="action-btn delete">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMSoftware;

