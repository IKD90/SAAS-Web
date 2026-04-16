import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CRMContext = createContext(null);

const CRMProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);

  // Load CRM data from tenant localStorage
  const loadCRMData = useCallback(() => {
    try {
      const tenantData = JSON.parse(localStorage.getItem('current_tenant') || '{}');
      setContacts(tenantData.contacts || []);
      setLeads(tenantData.leads || []);
      setDeals(tenantData.deals || []);
    } catch (error) {
      console.error('Error loading CRM data:', error);
      setContacts([]);
      setLeads([]);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCRMData();
  }, [loadCRMData]);

  // Save to tenant localStorage
  const saveToTenant = useCallback((updates) => {
    try {
      const tenantData = JSON.parse(localStorage.getItem('current_tenant') || '{}');
      const updatedTenant = { ...tenantData, ...updates };
      localStorage.setItem('current_tenant', JSON.stringify(updatedTenant));

      // Update tenants list
      const tenants = JSON.parse(localStorage.getItem('tenants') || '{}');
      if (tenantData.id) {
        tenants[tenantData.id] = updatedTenant;
        localStorage.setItem('tenants', JSON.stringify(tenants));
      }
    } catch (error) {
      console.error('Error saving CRM data:', error);
    }
  }, []);

  // CRUD Operations
  const addContact = (contact) => {
    const newContact = { ...contact, id: Date.now(), createdAt: new Date().toISOString() };
    const updated = [...contacts, newContact];
    setContacts(updated);
    saveToTenant({ contacts: updated });
  };

  const updateContact = (updatedContact) => {
    const updated = contacts.map(c => c.id === updatedContact.id ? updatedContact : c);
    setContacts(updated);
    saveToTenant({ contacts: updated });
    setEditingItem(null);
  };

  const deleteContact = (id) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    saveToTenant({ contacts: updated });
  };

  const addLead = (lead) => {
    const newLead = { ...lead, id: Date.now(), stage: 'new', createdAt: new Date().toISOString() };
    const updated = [...leads, newLead];
    setLeads(updated);
    saveToTenant({ leads: updated });
  };

  const updateLead = (updatedLead) => {
    const updated = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    setLeads(updated);
    saveToTenant({ leads: updated });
    setEditingItem(null);
  };

  const deleteLead = (id) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    saveToTenant({ leads: updated });
  };

  const addDeal = (deal) => {
    const newDeal = { ...deal, id: Date.now(), stage: 'prospect', createdAt: new Date().toISOString() };
    const updated = [...deals, newDeal];
    setDeals(updated);
    saveToTenant({ deals: updated });
  };

  const updateDeal = (updatedDeal) => {
    const updated = deals.map(d => d.id === updatedDeal.id ? updatedDeal : d);
    setDeals(updated);
    saveToTenant({ deals: updated });
    setEditingItem(null);
  };

  const deleteDeal = (id) => {
    const updated = deals.filter(d => d.id !== id);
    setDeals(updated);
    saveToTenant({ deals: updated });
  };

  // Stats helpers
  const getStats = () => ({
    totalContacts: contacts.length,
    totalLeads: leads.length,
    totalDeals: deals.length,
    totalDealValue: deals.reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0),
    leadsByStage: {
      new: leads.filter(l => l.stage === 'new').length,
      contacted: leads.filter(l => l.stage === 'contacted').length,
      qualified: leads.filter(l => l.stage === 'qualified').length
    }
  });

  const value = {
    contacts,
    leads,
    deals,
    loading,
    editingItem,
    setEditingItem,
    addContact,
    updateContact,
    deleteContact,
    addLead,
    updateLead,
    deleteLead,
    addDeal,
    updateDeal,
    deleteDeal,
    loadCRMData,
    getStats
  };

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within CRMProvider');
  }
  return context;
};

export default CRMProvider;

