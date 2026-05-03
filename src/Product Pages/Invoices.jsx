import React, { useState, useEffect } from 'react';
import './Invoices.css';

const Invoices = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [invoices, setInvoices] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState({
    id: '',
    customer: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, rate: 0, tax: 0 }],
    notes: '',
    status: 'pending',
    logo: null,
    logoColor: '#4f46e5',
    currency: 'USD'
  });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Load invoices from localStorage on mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    } else {
      // Sample data
      const sampleInvoices = [
        {
          id: 'INV001',
          customer: 'Acme Corp',
          email: 'billing@acmecorp.com',
          date: '2024-01-15',
          dueDate: '2024-02-15',
          total: '$2,450.00',
          status: 'paid',
          items: [{ description: 'Web Development', quantity: 1, rate: 2450, tax: 0 }],
          notes: 'Thank you for your business!'
        },
        {
          id: 'INV002',
          customer: 'Tech Solutions Ltd',
          email: 'accounts@techsol.com',
          date: '2024-01-20',
          dueDate: '2024-02-20',
          total: '$1,890.00',
          status: 'pending',
          items: [{ description: 'Software License', quantity: 3, rate: 630, tax: 0 }],
          notes: ''
        },
        {
          id: 'INV003',
          customer: 'Global Trading Inc',
          email: 'finance@globaltrading.com',
          date: '2024-01-25',
          dueDate: '2024-01-30',
          total: '$5,670.00',
          status: 'overdue',
          items: [{ description: 'Consulting Services', quantity: 10, rate: 567, tax: 0 }],
          notes: ''
        }
      ];
      setInvoices(sampleInvoices);
      localStorage.setItem('invoices', JSON.stringify(sampleInvoices));
    }
  }, []);

  const addItem = () => {
    setCurrentInvoice({
      ...currentInvoice,
      items: [...currentInvoice.items, { description: '', quantity: 1, rate: 0, tax: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = currentInvoice.items.filter((_, i) => i !== index);
    setCurrentInvoice({ ...currentInvoice, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...currentInvoice.items];
    newItems[index][field] = field === 'quantity' || field === 'rate' || field === 'tax' ? parseFloat(value) || 0 : value;
    setCurrentInvoice({ ...currentInvoice, items: newItems });
  };

  const calculateSubtotal = () => {
    return currentInvoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return currentInvoice.items.reduce((sum, item) => sum + (item.quantity * item.rate * item.tax / 100), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const saveInvoice = (e) => {
    e.preventDefault();
    if (!currentInvoice.customer) {
      alert('Please enter customer name');
      return;
    }

    const total = calculateTotal();
    const newInvoice = {
      id: `INV${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      customer: currentInvoice.customer,
      email: currentInvoice.email,
      date: currentInvoice.date || new Date().toISOString().split('T')[0],
      dueDate: currentInvoice.dueDate,
      items: currentInvoice.items.filter(item => item.description && item.rate > 0),
      notes: currentInvoice.notes,
      status: currentInvoice.status,
      total: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currentInvoice.currency || 'USD'
      }).format(total)
    };

    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    // Reset form
    setCurrentInvoice({
      id: '',
      customer: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      items: [{ description: '', quantity: 1, rate: 0, tax: 0 }],
      notes: '',
      status: 'pending',
      logo: currentInvoice.logo,
      logoColor: currentInvoice.logoColor,
      currency: currentInvoice.currency
    });
    
    alert('Invoice saved successfully!');
    setActiveTab('records');
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'paid': return 'status-paid';
      case 'pending': return 'status-pending';
      case 'overdue': return 'status-overdue';
      default: return '';
    }
  };

  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setModalContent('view');
    setShowModal(true);
  };

  const editInvoice = (invoice) => {
    // Parse total to get amount
    const parseAmount = (total) => {
      return parseFloat(total.replace(/[^0-9.-]+/g, '')) || 0;
    };
    
    setCurrentInvoice({
      ...currentInvoice,
      id: invoice.id,
      customer: invoice.customer,
      email: invoice.email,
      date: invoice.date,
      dueDate: invoice.dueDate,
      items: invoice.items || [{ description: '', quantity: 1, rate: 0, tax: 0 }],
      notes: invoice.notes || '',
      status: invoice.status
    });
    setActiveTab('create');
    setShowModal(false);
  };

  const deleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      const updatedInvoices = invoices.filter(inv => inv.id !== id);
      setInvoices(updatedInvoices);
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
      alert('Invoice deleted successfully!');
    }
  };

  const updateInvoiceStatus = (id, newStatus) => {
    const updatedInvoices = invoices.map(inv => 
      inv.id === id ? { ...inv, status: newStatus } : inv
    );
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
  };

  const printInvoice = (invoice) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .invoice-header { text-align: center; margin-bottom: 30px; }
          .invoice-details { margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>INVOICE</h1>
          <p>Invoice #: ${invoice.id}</p>
        </div>
        <div class="invoice-details">
          <p><strong>Bill To:</strong> ${invoice.customer}</p>
          <p><strong>Email:</strong> ${invoice.email}</p>
          <p><strong>Date:</strong> ${invoice.date}</p>
          <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
        </div>
        <table>
          <thead>
            <tr><th>Description</th><th>Qty</th><th>Rate</th><th>Tax</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${invoice.items?.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${item.rate.toFixed(2)}</td>
                <td>${item.tax}%</td>
                <td>$${(item.quantity * item.rate * (1 + item.tax / 100)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">
          <p>Total: ${invoice.total}</p>
        </div>
        ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
        <p style="text-align: center; margin-top: 50px;">Thank you for your business!</p>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
    setModalContent(null);
  };

  const renderCreateTab = () => (
    <div className="invoice-create">
      <h2><i className="fas fa-plus-circle"></i> Create New Invoice</h2>
      <form onSubmit={saveInvoice}>
        <div className="form-section">
          <h3><i className="fas fa-user"></i> Customer Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Customer Name *</label>
              <input
                type="text"
                value={currentInvoice.customer}
                onChange={(e) => setCurrentInvoice({ ...currentInvoice, customer: e.target.value })}
                required
                placeholder="Enter customer name"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={currentInvoice.email}
                onChange={(e) => setCurrentInvoice({ ...currentInvoice, email: e.target.value })}
                placeholder="customer@example.com"
              />
            </div>
            <div className="form-group">
              <label>Invoice Date</label>
              <input
                type="date"
                value={currentInvoice.date}
                onChange={(e) => setCurrentInvoice({ ...currentInvoice, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={currentInvoice.dueDate}
                onChange={(e) => setCurrentInvoice({ ...currentInvoice, dueDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><i className="fas fa-list"></i> Invoice Items</h3>
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Tax %</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentInvoice.items.map((item, index) => {
                  const subtotal = item.quantity * item.rate;
                  const taxAmount = subtotal * (item.tax / 100);
                  const itemTotal = subtotal + taxAmount;
                  return (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          min="1"
                          step="1"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', e.target.value)}
                          step="0.01"
                          min="0"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={item.tax}
                          onChange={(e) => updateItem(index, 'tax', e.target.value)}
                          step="0.1"
                          min="0"
                        />
                      </td>
                      <td>${itemTotal.toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-danger-small"
                          onClick={() => removeItem(index)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn-secondary" onClick={addItem}>
            <i className="fas fa-plus"></i> Add Item
          </button>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label>Notes</label>
            <textarea
              rows="3"
              value={currentInvoice.notes}
              onChange={(e) => setCurrentInvoice({ ...currentInvoice, notes: e.target.value })}
              placeholder="Additional notes for customer..."
            />
          </div>
        </div>

        <div className="invoice-summary">
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Tax:</span>
            <span>${calculateTax().toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => setActiveTab('records')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <i className="fas fa-save"></i> Save Invoice
          </button>
        </div>
      </form>
    </div>
  );

  const renderRecordsTab = () => {
    const paidCount = invoices.filter(inv => inv.status === 'paid').length;
    const pendingCount = invoices.filter(inv => inv.status === 'pending').length;
    const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;
    const totalRevenue = invoices.reduce((sum, inv) => {
      const amount = parseFloat(inv.total.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + amount;
    }, 0);

    return (
      <div className="invoice-records">
        <h2><i className="fas fa-file-invoice"></i> Invoice Records</h2>
        
        <div className="records-stats">
          <div className="stat-card">
            <i className="fas fa-check-circle"></i>
            <div>
              <h4>Paid</h4>
              <p>{paidCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-clock"></i>
            <div>
              <h4>Pending</h4>
              <p>{pendingCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-exclamation-triangle"></i>
            <div>
              <h4>Overdue</h4>
              <p>{overdueCount}</p>
            </div>
          </div>
          <div className="stat-card">
            <i className="fas fa-dollar-sign"></i>
            <div>
              <h4>Total Revenue</h4>
              <p>${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="records-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>#{invoice.id}</td>
                  <td>{invoice.customer}</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.dueDate}</td>
                  <td>{invoice.total}</td>
                  <td>
                    <select 
                      className={`status-select ${getStatusClass(invoice.status)}`}
                      value={invoice.status}
                      onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => viewInvoice(invoice)} title="View">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn-icon" onClick={() => editInvoice(invoice)} title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-icon" onClick={() => printInvoice(invoice)} title="Print">
                        <i className="fas fa-print"></i>
                      </button>
                      <button className="btn-icon delete" onClick={() => deleteInvoice(invoice.id)} title="Delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <i className="fas fa-inbox"></i>
                    <p>No invoices yet. Create your first invoice!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCustomizeTab = () => (
    <div className="invoice-customize">
      <h2><i className="fas fa-palette"></i> Customize Branding</h2>
      <div className="customize-layout">
        <div className="customize-form">
          <div className="form-group">
            <label>Company Logo</label>
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => setCurrentInvoice({ ...currentInvoice, logo: event.target.result });
                reader.readAsDataURL(file);
              }
            }} />
            {currentInvoice.logo && (
              <div className="logo-preview">
                <img src={currentInvoice.logo} alt="Logo Preview" />
              </div>
            )}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Primary Color</label>
              <input
                type="color"
                value={currentInvoice.logoColor}
                onChange={(e) => setCurrentInvoice({ ...currentInvoice, logoColor: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Currency</label>
              <select
                value={currentInvoice.currency}
                onChange={(e) => setCurrentInvoice({ ...currentInvoice, currency: e.target.value })}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
          <button 
            className="btn-primary" 
            onClick={() => {
              localStorage.setItem('invoiceSettings', JSON.stringify({
                logo: currentInvoice.logo,
                logoColor: currentInvoice.logoColor,
                currency: currentInvoice.currency
              }));
              alert('Settings saved successfully!');
            }}
            style={{ marginTop: '20px', width: '100%' }}
          >
            <i className="fas fa-save"></i> Save Settings
          </button>
        </div>
        
        <div className="preview-card">
          <h3>Live Preview</h3>
          <div className="preview-invoice">
            <div className="preview-header" style={{ backgroundColor: currentInvoice.logoColor }}>
              <div className="preview-logo">
                {currentInvoice.logo ? (
                  <img src={currentInvoice.logo} alt="Logo" style={{ maxHeight: '50px' }} />
                ) : (
                  <h3>Your Company</h3>
                )}
              </div>
              <div className="preview-title">INVOICE</div>
            </div>
            <div className="preview-body">
              <p><strong>Bill To:</strong> Sample Customer</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Due:</strong> {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
              <hr />
              <p><strong>Item:</strong> Professional Services</p>
              <p><strong>Quantity:</strong> 1 | <strong>Rate:</strong> {currentInvoice.currency} 1,250.00</p>
              <hr />
              <p><strong>Total:</strong> {currentInvoice.currency} 1,250.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!showModal || !selectedInvoice) return null;

    return (
      <div className="modal" onClick={closeModal}>
        <div className={`modal-content ${modalContent === 'view' ? 'large' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{modalContent === 'view' ? 'Invoice Details' : 'Edit Invoice'}</h3>
            <button className="close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body">
            {modalContent === 'view' && (
              <div className="invoice-details-modal">
                <div className="invoice-info-grid">
                  <div className="info-section">
                    <h4>Bill To:</h4>
                    <p><strong>{selectedInvoice.customer}</strong></p>
                    <p>{selectedInvoice.email}</p>
                  </div>
                  <div className="info-section">
                    <h4>Invoice Details:</h4>
                    <p><strong>Invoice #:</strong> {selectedInvoice.id}</p>
                    <p><strong>Date:</strong> {selectedInvoice.date}</p>
                    <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
                    <p><strong>Status:</strong> 
                      <span className={`status-badge ${getStatusClass(selectedInvoice.status)}`}>
                        {selectedInvoice.status.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
                
                {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                  <table className="items-summary-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Tax</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, idx) => {
                        const subtotal = item.quantity * item.rate;
                        const taxAmount = subtotal * (item.tax / 100);
                        const itemTotal = subtotal + taxAmount;
                        return (
                          <tr key={idx}>
                            <td>{item.description}</td>
                            <td>{item.quantity}</td>
                            <td>${item.rate.toFixed(2)}</td>
                            <td>{item.tax}%</td>
                            <td>${itemTotal.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                
                <div className="invoice-total">
                  <p><strong>Total: {selectedInvoice.total}</strong></p>
                </div>
                
                {selectedInvoice.notes && (
                  <div className="invoice-notes">
                    <h4>Notes:</h4>
                    <p>{selectedInvoice.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn-secondary" onClick={closeModal}>Close</button>
            {modalContent === 'view' && (
              <>
                <button className="btn-primary" onClick={() => editInvoice(selectedInvoice)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button className="btn-success" onClick={() => printInvoice(selectedInvoice)}>
                  <i className="fas fa-print"></i> Print
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="invoice-app">
      <div className="invoice-header-bar">
        <div className="logo">
          <i className="fas fa-file-invoice-dollar"></i>
          <h1>Invoice Manager</h1>
        </div>
        <div className="header-actions">
          <button
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <i className="fas fa-plus"></i>
            <span>Create</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            <i className="fas fa-list"></i>
            <span>Records</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'customize' ? 'active' : ''}`}
            onClick={() => setActiveTab('customize')}
          >
            <i className="fas fa-palette"></i>
            <span>Customize</span>
          </button>
        </div>
      </div>

      <div className="invoice-container">
        {activeTab === 'create' && renderCreateTab()}
        {activeTab === 'records' && renderRecordsTab()}
        {activeTab === 'customize' && renderCustomizeTab()}
      </div>

      {renderModal()}
    </div>
  );
};

export default Invoices;