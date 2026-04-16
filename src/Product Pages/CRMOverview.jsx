import React from 'react';
import { useCRM } from '../../contexts/CRMContext';
import { useNavigate } from 'react-router-dom';

const CRMOverview = () => {
  const { getStats, loading } = useCRM();
  const navigate = useNavigate();
  const stats = getStats();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#667eea' }}></i>
          <h3 style={{ marginTop: '20px' }}>Loading CRM...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="crm-container" style={{ padding: '20px', background: '#f7fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem' }}>CRM Dashboard</h1>
            <p style={{ margin: '5px 0 0 0', color: '#666' }}>Manage your contacts, leads, and deals</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Total Contacts</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#48bb78' }}>{stats.totalContacts}</div>
        </div>
        <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Total Leads</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ed8936' }}>{stats.totalLeads}</div>
        </div>
        <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Total Deals</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{stats.totalDeals}</div>
        </div>
        <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Pipeline Value</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f6ad55' }}>${stats.totalDealValue.toLocaleString()}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate('/crm/contacts/new')} 
            style={{ padding: '12px 24px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '500' }}
          >
            ➕ New Contact
          </button>
          <button 
            onClick={() => navigate('/crm/leads/new')} 
            style={{ padding: '12px 24px', background: '#ed8936', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '500' }}
          >
            ➕ New Lead
          </button>
          <button 
            onClick={() => navigate('/crm/deals/new')} 
            style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '500' }}
          >
            ➕ New Deal
          </button>
        </div>
      </div>

      {/* Leads by Stage Chart */}
      <div className="leads-chart" style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '20px' }}>Leads by Stage</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f56565' }}>{stats.leadsByStage.new}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>New</div>
              </div>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ed8936' }}>{stats.leadsByStage.contacted}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>Contacted</div>
              </div>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#48bb78' }}>{stats.leadsByStage.qualified}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>Qualified</div>
              </div>
            </div>
          </div>
          <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <i className="fas fa-chart-pie" style={{ fontSize: '48px', color: '#667eea', marginBottom: '10px' }}></i>
            <h4 style={{ marginBottom: '10px' }}>Conversion Rate</h4>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#48bb78' }}>
              {stats.totalLeads > 0 ? ((stats.totalDeals / stats.totalLeads) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMOverview;

