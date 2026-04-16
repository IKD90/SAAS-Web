import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCRM } from '../../contexts/CRMContext';

const Contacts = () => {
  const { contacts, addContact, updateContact, deleteContact, setEditingItem, editingItem, loading } = useCRM();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    company: '' 
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fixed: Properly handle editing and new contact forms with safe data mapping
  useEffect(() => {
    // Only proceed if we have an id parameter
    if (!id) return;
    
    if (id !== 'new') {
      // For editing existing contact - check if editingItem exists and has data
      if (editingItem && Object.keys(editingItem).length > 0) {
        setFormData({
          name: editingItem.name || '',
          email: editingItem.email || '',
          phone: editingItem.phone || '',
          company: editingItem.company || ''
        });
      } else {
        // Try to find the contact in the contacts array if editingItem is empty
        const contactToEdit = contacts?.find(contact => contact.id === id);
        if (contactToEdit) {
          setFormData({
            name: contactToEdit.name || '',
            email: contactToEdit.email || '',
            phone: contactToEdit.phone || '',
            company: contactToEdit.company || ''
          });
        }
      }
    } else if (id === 'new') {
      // Reset form for new contact
      setFormData({ name: '', email: '', phone: '', company: '' });
    }
  }, [id, editingItem, contacts]);

  // Fixed: Added safe checking for undefined contacts array
  const filteredContacts = (contacts || []).filter(contact =>
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id === 'new') {
        await addContact(formData);
      } else if (id && id !== 'new') {
        // Use the id from URL directly instead of relying on editingItem
        await updateContact({ ...formData, id: id });
      }
      setFormData({ name: '', email: '', phone: '', company: '' });
      navigate('/crm/contacts');
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleEdit = (contact) => {
    setEditingItem(contact);
    navigate(`/crm/contacts/${contact.id}`);
  };

  const handleCloseModal = () => {
    navigate('/crm/contacts');
    setFormData({ name: '', email: '', phone: '', company: '' });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="contacts-container" style={{ padding: '20px', background: '#f7fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ margin: 0 }}>Contacts ({filteredContacts.length})</h1>
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                marginTop: '10px',
                padding: '10px',
                border: '1px solid #cbd5e0',
                borderRadius: '5px',
                width: '300px'
              }}
            />
          </div>
          <button 
            onClick={() => navigate('/crm/contacts/new')}
            style={{ 
              padding: '10px 20px', 
              background: '#48bb78', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            ➕ New Contact
          </button>
        </div>
      </div>

      {/* Form Modal - Fixed condition */}
      {id && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '10px', 
            maxWidth: '500px', 
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px' }}>{id === 'new' ? 'New Contact' : 'Edit Contact'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #cbd5e0', 
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #cbd5e0', 
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #cbd5e0', 
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1px solid #cbd5e0', 
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{ 
                    padding: '10px 20px', 
                    background: '#a0aec0', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ 
                    padding: '10px 20px', 
                    background: '#48bb78', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {id === 'new' ? 'Add Contact' : 'Update Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contacts Table */}
      <div style={{ 
        background: 'white', 
        borderRadius: '10px', 
        padding: '20px', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
        overflowX: 'auto' 
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7fafc' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Phone</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Company</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Created</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((contact) => (
              <tr key={contact.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{contact.name}</td>
                <td style={{ padding: '12px' }}>{contact.email}</td>
                <td style={{ padding: '12px' }}>{contact.phone || '-'}</td>
                <td style={{ padding: '12px' }}>{contact.company || '-'}</td>
                <td style={{ padding: '12px' }}>
                  {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleEdit(contact)}
                    style={{ 
                      marginRight: '10px', 
                      padding: '6px 12px', 
                      background: '#667eea', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '3px', 
                      cursor: 'pointer', 
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this contact?')) {
                        deleteContact(contact.id);
                      }
                    }}
                    style={{ 
                      padding: '6px 12px', 
                      background: '#f56565', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '3px', 
                      cursor: 'pointer', 
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  <p>No contacts yet. Add your first contact above!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Contacts;