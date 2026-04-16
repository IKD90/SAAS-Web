import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCRM } from '../../contexts/CRMContext';

const Deals = () => {
  const { deals, addDeal, updateDeal, deleteDeal, setEditingItem, editingItem, loading } = useCRM();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', amount: '', leadId: '', contactId: '', stage: 'prospect', closeDate: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (id && editingItem) {
      setFormData(editingItem);
    } else if (id === 'new') {
      setFormData({ title: '', amount: '', leadId: '', contactId: '', stage: 'prospect', closeDate: '' });
    }
  }, [id, editingItem]);

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.stage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const dealData = {
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      closeDate: formData.closeDate || null
    };
    if (id === 'new') {
      addDeal(dealData);
    } else {
      updateDeal({ ...dealData, id: editingItem.id });
    }
    setFormData({ title: '', amount: '', leadId: '', contactId: '', stage: 'prospect', closeDate: '' });
    navigate('/crm/deals');
  };

  const handleEdit = (deal) => {
    setEditingItem(deal);
    navigate(`/crm/deals/${deal.id}`);
  };

  const stages = ['prospect', 'proposal', 'negotiation', 'won', 'lost'];

  if (loading) {
    return <div>Loading deals...</div>;
  }

  return (
    <div className="deals-container" style={{ padding: '20px', background: '#f7fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0 }}>Deals ({filteredDeals.length})</h1>
            <input
              type="text"
              placeholder="Search deals..."
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
            onClick={() => navigate('/crm/deals/new')}
            style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            ➕ New Deal
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {(id === 'new' || id) && (
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
          alignItems: 'center'
        }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '10px', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ marginBottom: '20px' }}>{id === 'new' ? 'New Deal' : 'Edit Deal'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px' }}
                  placeholder="$1000"
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Lead ID</label>
                <input
                  type="text"
                  value={formData.leadId}
                  onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Contact ID</label>
                <input
                  type="text"
                  value={formData.contactId}
                  onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px' }}
                >
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage.charAt(0).toUpperCase() + stage.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Close Date</label>
                <input
                  type="date"
                  value={formData.closeDate}
                  onChange={(e) => setFormData({ ...formData, closeDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => navigate('/crm/deals')}
                  style={{ padding: '10px 20px', background: '#a0aec0', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  {id === 'new' ? 'Add Deal' : 'Update Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deals Table */}
      <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7fafc' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Title</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Amount</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Stage</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Close Date</th>
              <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #e2e8f0' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal) => (
              <tr key={deal.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px' }}>{deal.title}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#48bb78' }}>${deal.amount?.toLocaleString()}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    padding: '4px 12px',
                    background: deal.stage === 'prospect' ? '#bee3f8' : deal.stage === 'proposal' ? '#c6f6d5' : deal.stage === 'negotiation' ? '#fed7aa' : deal.stage === 'won' ? '#c6f6d5' : '#fed7d7',
                    color: deal.stage === 'prospect' ? '#3182ce' : deal.stage === 'won' ? '#38a169' : deal.stage === 'lost' ? '#e53e3e' : '#dd6b20',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {deal.stage.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{deal.closeDate ? new Date(deal.closeDate).toLocaleDateString() : '-'}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleEdit(deal)}
                    style={{ marginRight: '10px', padding: '6px 12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this deal?')) deleteDeal(deal.id);
                    }}
                    style={{ padding: '6px 12px', background: '#f56565', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredDeals.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  <i className="fas fa-handshake" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
                  <p>No deals yet. Add your first deal above!</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Deals;

