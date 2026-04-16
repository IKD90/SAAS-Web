import React from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import CRMOverview from './CRMOverview';

import Contacts from './Contacts';
import Leads from './Leads';
import Deals from './Deals';
import { useCRM } from '../../contexts/CRMContext';

const CRMWrapper = () => {
  const { getStats } = useCRM();
  const stats = getStats();
  const location = useLocation();

  return (
    <div className="crm-app" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: 'white',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        padding: '20px',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginBottom: '30px', color: '#2d3748' }}>CRM</h2>
        <nav>
          <Link 
            to="/crm" 
            style={{ 
              display: 'block', 
              padding: '12px 16px', 
              marginBottom: '10px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: location.pathname === '/crm' ? '#667eea' : '#4a5568',
              background: location.pathname === '/crm' ? '#ebf4ff' : 'transparent',
              fontWeight: location.pathname === '/crm' ? '600' : '400'
            }}
          >
            <i className="fas fa-chart-dashboard" style={{ marginRight: '10px' }}></i>
            Overview
            <span style={{ float: 'right', fontSize: '12px', opacity: '0.7' }}>{stats.totalContacts + stats.totalLeads + stats.totalDeals}</span>
          </Link>
          <Link 
            to="/crm/contacts" 
            style={{ 
              display: 'block', 
              padding: '12px 16px', 
              marginBottom: '10px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: location.pathname.startsWith('/crm/contacts') ? '#48bb78' : '#4a5568',
              background: location.pathname.startsWith('/crm/contacts') ? '#f0fff4' : 'transparent',
              fontWeight: location.pathname.startsWith('/crm/contacts') ? '600' : '400'
            }}
          >
            <i className="fas fa-users" style={{ marginRight: '10px' }}></i>
            Contacts ({stats.totalContacts})
          </Link>
          <Link 
            to="/crm/leads" 
            style={{ 
              display: 'block', 
              padding: '12px 16px', 
              marginBottom: '10px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: location.pathname.startsWith('/crm/leads') ? '#ed8936' : '#4a5568',
              background: location.pathname.startsWith('/crm/leads') ? '#fffaf0' : 'transparent',
              fontWeight: location.pathname.startsWith('/crm/leads') ? '600' : '400'
            }}
          >
            <i className="fas fa-bullseye" style={{ marginRight: '10px' }}></i>
            Leads ({stats.totalLeads})
          </Link>
          <Link 
            to="/crm/deals" 
            style={{ 
              display: 'block', 
              padding: '12px 16px', 
              marginBottom: '10px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: location.pathname.startsWith('/crm/deals') ? '#667eea' : '#4a5568',
              background: location.pathname.startsWith('/crm/deals') ? '#ebf4ff' : 'transparent',
              fontWeight: location.pathname.startsWith('/crm/deals') ? '600' : '400'
            }}
          >
            <i className="fas fa-handshake" style={{ marginRight: '10px' }}></i>
            Deals ({stats.totalDeals}) ${stats.totalDealValue.toLocaleString()}
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px', background: '#f7fafc' }}>
        <Routes>
          <Route path="/" element={<CRMOverview />} />
          <Route path="/contacts/*" element={<Contacts />} />
          <Route path="/leads/*" element={<Leads />} />
          <Route path="/deals/*" element={<Deals />} />
        </Routes>
      </div>
    </div>
  );
};

export default CRMWrapper;

