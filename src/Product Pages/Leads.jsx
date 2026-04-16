import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCRM } from '../../contexts/CRMContext';

const Leads = () => {
  const { leads, addLead, updateLead, deleteLead, setEditingItem, editingItem, loading } = useCRM();
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ FIXED

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    source: '',
    stage: 'new',
    notes: ''
  });

  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Fixed useEffect
  useEffect(() => {
    if (!id || !leads) return;

    if (id !== 'new') {
      if (editingItem && Object.keys(editingItem).length > 0) {
        setFormData({
          name: editingItem.name || '',
          email: editingItem.email || '',
          source: editingItem.source || '',
          stage: editingItem.stage || 'new',
          notes: editingItem.notes || ''
        });
      } else {
        const leadToEdit = leads.find(
          (lead) => String(lead.id) === String(id)
        );

        if (leadToEdit) {
          setFormData({
            name: leadToEdit.name || '',
            email: leadToEdit.email || '',
            source: leadToEdit.source || '',
            stage: leadToEdit.stage || 'new',
            notes: leadToEdit.notes || ''
          });
        }
      }
    } else {
      setFormData({
        name: '',
        email: '',
        source: '',
        stage: 'new',
        notes: ''
      });
    }
  }, [id, editingItem, leads]);

  // ✅ Safe filtering
  const filteredLeads = (leads || []).filter((lead) =>
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.stage?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id === 'new') {
        await addLead(formData);
      } else if (id) {
        await updateLead({ ...formData, id });
      }

      setFormData({
        name: '',
        email: '',
        source: '',
        stage: 'new',
        notes: ''
      });

      navigate('/crm/leads');
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleEdit = (lead) => {
    setEditingItem(lead);
    navigate(`/crm/leads/${lead.id}`);
  };

  const handleCloseModal = () => {
    navigate('/crm/leads');
    setFormData({
      name: '',
      email: '',
      source: '',
      stage: 'new',
      notes: ''
    });
  };

  const stages = ['new', 'contacted', 'qualified'];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="leads-container" style={{ padding: '20px', background: '#f7fafc', minHeight: '100vh' }}>
      
      {/* Header */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <h1>Leads ({filteredLeads.length})</h1>
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button onClick={() => navigate('/crm/leads/new')}>
            ➕ New Lead
          </button>
        </div>
      </div>

      {/* Modal */}
      {id && (
        <div>
          <h2>{id === 'new' ? 'New Lead' : 'Edit Lead'}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <input
              type="text"
              placeholder="Source"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            />

            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />

            <button type="button" onClick={handleCloseModal}>Cancel</button>
            <button type="submit">
              {id === 'new' ? 'Add' : 'Update'}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Stage</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.name}</td>
              <td>{lead.email}</td>
              <td>{lead.stage}</td>
              <td>
                <button onClick={() => handleEdit(lead)}>Edit</button>
                <button onClick={() => deleteLead(lead.id)}>Delete</button>
              </td>
            </tr>
          ))}

          {filteredLeads.length === 0 && (
            <tr>
              <td colSpan="4">No leads found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Leads;