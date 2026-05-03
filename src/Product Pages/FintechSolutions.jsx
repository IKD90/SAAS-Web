import React, { useState, useEffect } from 'react';
import './FintechSolutions.css';

const FinCollab = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(true);
  
  // Auth form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginTenantId, setLoginTenantId] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('cfo');
  const [signupDept, setSignupDept] = useState('');
  const [signupTenantId, setSignupTenantId] = useState('');
  
  // Transaction form states
  const [transDescription, setTransDescription] = useState('');
  const [transType, setTransType] = useState('income');
  const [transAmount, setTransAmount] = useState('');
  const [transCategory, setTransCategory] = useState('');
  const [transDate, setTransDate] = useState('');
  
  // Invoice form states
  const [invoiceClient, setInvoiceClient] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [invoiceItems, setInvoiceItems] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  
  // Budget form states
  const [budgetCategory, setBudgetCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState('Monthly');
  
  // Report states
  const [reportType, setReportType] = useState('profitloss');
  const [reportPeriod, setReportPeriod] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  
  // Chat states
  const [teamMsg, setTeamMsg] = useState('');
  const [deptMsg, setDeptMsg] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  
  // Admin states
  const [newDeptName, setNewDeptName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('cfo');
  
  const [refresh, setRefresh] = useState(0);
  
  // Initialize database
  useEffect(() => {
    initDB();
  }, []);
  
  const initDB = () => {
    if (!localStorage.getItem('fintech_users')) {
      const users = { 
        "cfo@acmecorp.com": { 
          email: "cfo@acmecorp.com", 
          userId: "fin001", 
          name: "John CFO", 
          password: "cfo123", 
          tenantId: "CORP_ACM01", 
          role: "cfo", 
          department: "Finance" 
        } 
      };
      localStorage.setItem('fintech_users', JSON.stringify(users));
    }
    if (!localStorage.getItem('fintech_tenants')) {
      const tenants = { 
        "CORP_ACM01": { 
          id: "CORP_ACM01", 
          name: "Acme Corporation", 
          departments: ["Finance", "Accounting", "Audit", "Tax"], 
          members: ["cfo@acmecorp.com"], 
          currency: "USD", 
          fiscalYearStart: "2024-01-01" 
        } 
      };
      localStorage.setItem('fintech_tenants', JSON.stringify(tenants));
    }
    if (!localStorage.getItem('fintech_transactions')) localStorage.setItem('fintech_transactions', JSON.stringify([]));
    if (!localStorage.getItem('fintech_invoices')) localStorage.setItem('fintech_invoices', JSON.stringify([]));
    if (!localStorage.getItem('fintech_budgets')) localStorage.setItem('fintech_budgets', JSON.stringify([]));
    if (!localStorage.getItem('fintech_reports')) localStorage.setItem('fintech_reports', JSON.stringify([]));
    if (!localStorage.getItem('fintech_messages')) localStorage.setItem('fintech_messages', JSON.stringify({ team: [], department: {} }));
    if (!localStorage.getItem('fintech_audit')) localStorage.setItem('fintech_audit', JSON.stringify([]));
  };
  
  // Helper functions
  const getUsers = () => JSON.parse(localStorage.getItem('fintech_users') || '{}');
  const saveUsers = (u) => localStorage.setItem('fintech_users', JSON.stringify(u));
  const getTenants = () => JSON.parse(localStorage.getItem('fintech_tenants') || '{}');
  const saveTenants = (t) => localStorage.setItem('fintech_tenants', JSON.stringify(t));
  const getTransactions = () => JSON.parse(localStorage.getItem('fintech_transactions') || '[]');
  const saveTransactions = (t) => localStorage.setItem('fintech_transactions', JSON.stringify(t));
  const getInvoices = () => JSON.parse(localStorage.getItem('fintech_invoices') || '[]');
  const saveInvoices = (i) => localStorage.setItem('fintech_invoices', JSON.stringify(i));
  const getBudgets = () => JSON.parse(localStorage.getItem('fintech_budgets') || '[]');
  const saveBudgets = (b) => localStorage.setItem('fintech_budgets', JSON.stringify(b));
  const getReports = () => JSON.parse(localStorage.getItem('fintech_reports') || '[]');
  const saveReports = (r) => localStorage.setItem('fintech_reports', JSON.stringify(r));
  const getMessages = () => JSON.parse(localStorage.getItem('fintech_messages') || '{"team":[], "department":{}}');
  const saveMessages = (m) => localStorage.setItem('fintech_messages', JSON.stringify(m));
  const getAudit = () => JSON.parse(localStorage.getItem('fintech_audit') || '[]');
  const saveAudit = (a) => localStorage.setItem('fintech_audit', JSON.stringify(a));
  
  const addAuditLog = (tenantId, action, userEmail, details) => {
    const audit = getAudit();
    audit.unshift({ tenantId, action, userEmail, details, timestamp: new Date().toISOString() });
    if (audit.length > 200) audit.pop();
    saveAudit(audit);
  };
  
  // Auth functions
  const signup = (email, name, password, role, department, existingTenantId) => {
    const users = getUsers();
    if (users[email]) return { success: false, error: "Email exists" };
    let tenantId = existingTenantId;
    const tenants = getTenants();
    let newRole = role;
    if (!tenantId || !tenants[tenantId]) {
      tenantId = "CORP_" + Math.random().toString(36).substring(2, 8).toUpperCase();
      tenants[tenantId] = { 
        id: tenantId, 
        name: `${name}'s Company`, 
        departments: ["Finance", "Accounting", "Audit"], 
        members: [email], 
        currency: "USD", 
        createdAt: Date.now() 
      };
      newRole = "cfo";
      saveTenants(tenants);
    } else {
      if (!tenants[tenantId].members.includes(email)) tenants[tenantId].members.push(email);
      saveTenants(tenants);
    }
    users[email] = { 
      email, 
      userId: "fin_" + Math.random().toString(36).substring(2, 8), 
      name, 
      password, 
      tenantId, 
      role: newRole, 
      department: department || "Finance" 
    };
    saveUsers(users);
    addAuditLog(tenantId, "COMPANY_REGISTER", email, `Registered as ${newRole}`);
    return { success: true, tenantId, role: newRole };
  };
  
  const login = (email, password, tenantId) => {
    const users = getUsers();
    const user = users[email];
    if (!user) return { success: false, error: "User not found" };
    if (user.password !== password) return { success: false, error: "Wrong password" };
    if (user.tenantId !== tenantId) return { success: false, error: `Tenant mismatch. Your company ID: ${user.tenantId}` };
    return { success: true, user };
  };
  
  // Financial Operations
  const addTransaction = (tenantId, description, type, amount, category, date, userEmail) => {
    const transactions = getTransactions();
    transactions.push({ 
      id: Date.now(), 
      tenantId, 
      description, 
      type, 
      amount: parseFloat(amount), 
      category, 
      date, 
      recordedBy: userEmail, 
      createdAt: new Date().toISOString() 
    });
    saveTransactions(transactions);
    addAuditLog(tenantId, "TRANSACTION_ADD", userEmail, `${type}: ${description} - $${amount}`);
  };
  
  const createInvoice = (tenantId, client, amount, items, dueDate, userEmail) => {
    const invoices = getInvoices();
    invoices.push({ 
      id: Date.now(), 
      tenantId, 
      client, 
      amount: parseFloat(amount), 
      items, 
      dueDate, 
      status: "pending", 
      createdBy: userEmail, 
      createdAt: new Date().toISOString() 
    });
    saveInvoices(invoices);
    addAuditLog(tenantId, "INVOICE_CREATE", userEmail, `Invoice to ${client}: $${amount}`);
  };
  
  const setBudget = (tenantId, category, amount, period, userEmail) => {
    const budgets = getBudgets();
    budgets.push({ 
      id: Date.now(), 
      tenantId, 
      category, 
      amount: parseFloat(amount), 
      period, 
      year: new Date().getFullYear(), 
      createdAt: new Date().toISOString() 
    });
    saveBudgets(budgets);
    addAuditLog(tenantId, "BUDGET_SET", userEmail, `${category}: $${amount} (${period})`);
  };
  
  const sendTeamMsg = (tenantId, fromUser, text) => {
    const msgs = getMessages();
    msgs.team.push({ 
      tenantId, 
      fromEmail: fromUser.email, 
      fromName: fromUser.name, 
      text, 
      timestamp: Date.now() 
    });
    saveMessages(msgs);
  };
  
  const sendDeptMsg = (tenantId, dept, fromUser, text) => {
    const msgs = getMessages();
    const key = `${tenantId}:${dept}`;
    if (!msgs.department[key]) msgs.department[key] = [];
    msgs.department[key].push({ fromName: fromUser.name, text, timestamp: Date.now() });
    saveMessages(msgs);
  };
  
  const markInvoicePaid = (id) => {
    const invoices = getInvoices();
    const invoice = invoices.find(i => i.id === id);
    if (invoice) invoice.status = 'paid';
    saveInvoices(invoices);
    addAuditLog(currentUser.tenantId, "INVOICE_PAID", currentUser.email, `Invoice #${id} paid`);
    setRefresh(r => r + 1);
  };
  
  const removeDept = (dept) => {
    const tenants = getTenants();
    if (tenants[currentUser.tenantId]) {
      tenants[currentUser.tenantId].departments = tenants[currentUser.tenantId].departments.filter(d => d !== dept);
      saveTenants(tenants);
      setRefresh(r => r + 1);
    }
  };
  
  const getFinancialTotals = (transactions) => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, profit: income - expense };
  };
  
  const getTenantData = () => {
    if (!currentUser) return { allMembers: [], transactions: [], invoices: [], budgets: [], depts: [], reports: [], audit: [] };
    const tenantId = currentUser.tenantId;
    const users = getUsers();
    const tenants = getTenants();
    const allMembers = (tenants[tenantId]?.members || []).map(email => users[email]).filter(Boolean);
    const transactions = getTransactions().filter(t => t.tenantId === tenantId);
    const invoices = getInvoices().filter(i => i.tenantId === tenantId);
    const budgets = getBudgets().filter(b => b.tenantId === tenantId);
    const depts = tenants[tenantId]?.departments || [];
    const reports = getReports().filter(r => r.tenantId === tenantId);
    const audit = getAudit().filter(a => a.tenantId === tenantId);
    return { allMembers, transactions, invoices, budgets, depts, reports, audit, tenantId, tenants };
  };
  
  // Event Handlers
  const handleLogin = () => {
    if (!loginEmail || !loginPassword || !loginTenantId) {
      alert('Please fill in all fields');
      return;
    }
    const res = login(loginEmail, loginPassword, loginTenantId);
    if (res.success) {
      setCurrentUser(res.user);
      setActiveTab('dashboard');
    } else {
      alert(res.error);
    }
  };
  
  const handleSignup = () => {
    if (!signupName || !signupEmail || !signupPassword) {
      alert('Please fill in all required fields');
      return;
    }
    const res = signup(signupEmail, signupName, signupPassword, signupRole, signupDept, signupTenantId);
    if (res.success) {
      alert(`Registration successful! Your Company ID: ${res.tenantId}. Please login.`);
      setShowLogin(true);
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupRole('cfo');
      setSignupDept('');
      setSignupTenantId('');
    } else {
      alert(res.error);
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };
  
  const handleAddTransaction = () => {
    if (!transDescription || !transAmount || !transCategory || !transDate) {
      alert('Please fill in all transaction fields');
      return;
    }
    addTransaction(currentUser.tenantId, transDescription, transType, transAmount, transCategory, transDate, currentUser.email);
    setRefresh(r => r + 1);
    setTransDescription('');
    setTransAmount('');
    setTransCategory('');
    setTransDate('');
    alert('Transaction added successfully!');
  };
  
  const handleCreateInvoice = () => {
    if (!invoiceClient || !invoiceAmount || !invoiceDueDate) {
      alert('Please fill in client, amount, and due date');
      return;
    }
    createInvoice(currentUser.tenantId, invoiceClient, invoiceAmount, invoiceItems, invoiceDueDate, currentUser.email);
    setRefresh(r => r + 1);
    setInvoiceClient('');
    setInvoiceAmount('');
    setInvoiceItems('');
    setInvoiceDueDate('');
    alert('Invoice created successfully!');
  };
  
  const handleSetBudget = () => {
    if (!budgetCategory || !budgetAmount) {
      alert('Please fill in category and amount');
      return;
    }
    setBudget(currentUser.tenantId, budgetCategory, budgetAmount, budgetPeriod, currentUser.email);
    setRefresh(r => r + 1);
    setBudgetCategory('');
    setBudgetAmount('');
    alert('Budget set successfully!');
  };
  
  const handleGenerateReport = () => {
    const transactions = getTransactions().filter(t => t.tenantId === currentUser.tenantId);
    const totals = getFinancialTotals(transactions);
    const reportDiv = document.getElementById('reportOutput');
    if (reportDiv) {
      reportDiv.innerHTML = `
        <strong>Financial Report Generated</strong><br>
        Period: ${reportPeriod || 'All Time'}<br>
        Type: ${reportType}<br>
        Total Revenue: $${totals.income.toLocaleString()}<br>
        Total Expenses: $${totals.expense.toLocaleString()}<br>
        Net Profit: $${totals.profit.toLocaleString()}
      `;
    }
  };
  
  const handleUploadReport = () => {
    if (!reportTitle || !reportContent) {
      alert('Please enter report title and content');
      return;
    }
    const reports = getReports();
    reports.push({ 
      id: Date.now(), 
      tenantId: currentUser.tenantId, 
      title: reportTitle, 
      content: reportContent, 
      uploadedBy: currentUser.name, 
      createdAt: new Date().toISOString() 
    });
    saveReports(reports);
    setRefresh(r => r + 1);
    setReportTitle('');
    setReportContent('');
    alert('Report uploaded successfully!');
  };
  
  const handleSendTeamMsg = () => {
    if (!teamMsg.trim()) return;
    sendTeamMsg(currentUser.tenantId, currentUser, teamMsg);
    setRefresh(r => r + 1);
    setTeamMsg('');
  };
  
  const handleSendDeptMsg = () => {
    if (!deptMsg.trim() || !selectedDept) {
      alert('Please select a department and enter a message');
      return;
    }
    sendDeptMsg(currentUser.tenantId, selectedDept, currentUser, deptMsg);
    setRefresh(r => r + 1);
    setDeptMsg('');
  };
  
  const handleAddDept = () => {
    if (!newDeptName.trim()) {
      alert('Please enter department name');
      return;
    }
    const tenants = getTenants();
    if (!tenants[currentUser.tenantId].departments.includes(newDeptName)) {
      tenants[currentUser.tenantId].departments.push(newDeptName);
      saveTenants(tenants);
      setRefresh(r => r + 1);
      setNewDeptName('');
      alert('Department added successfully!');
    } else {
      alert('Department already exists!');
    }
  };
  
  const handleAddStaff = () => {
    alert("In production: Send invitation. For demo, use signup with existing Tenant ID.");
  };
  
  const { allMembers, transactions, invoices, budgets, depts, reports, audit, tenantId, tenants } = getTenantData();
  const totals = getFinancialTotals(transactions);
  const teamMsgs = getMessages().team.filter(m => m.tenantId === tenantId);
  const deptMsgs = getMessages().department[`${tenantId}:${selectedDept}`] || [];
  const isAdmin = currentUser?.role === 'cfo';
  
  const escapeHtml = (str) => {
    return str?.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    }) || '';
  };
  
  if (!currentUser) {
    return (
      <div className="fincollab-container">
        <div className="auth-container">
          {showLogin ? (
            <div className="auth-card">
              <div className="finance-icon">💰</div>
              <h2>FinCollab Platform</h2>
              <div className="subtitle">Multi-Tenant Finance & Accounting</div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="cfo@company.com" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••" />
              </div>
              <div className="input-group">
                <label>Tenant ID (Organization ID)</label>
                <input type="text" value={loginTenantId} onChange={(e) => setLoginTenantId(e.target.value)} placeholder="e.g., CORP_FIN01" />
              </div>
              <button className="btn-primary" onClick={handleLogin}>Login →</button>
              <div className="auth-switch">
                New organization? <span className="link" onClick={() => setShowLogin(false)}>Register Company</span>
              </div>
              <div className="demo-info">
                <strong>Demo Login:</strong><br />
                cfo@acmecorp.com / cfo123 / CORP_ACM01
              </div>
            </div>
          ) : (
            <div className="auth-card">
              <div className="finance-icon">🏢</div>
              <h2>Register Company</h2>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="John Doe" />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="email@company.com" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="••••" />
              </div>
              <div className="input-group">
                <label>Role</label>
                <select value={signupRole} onChange={(e) => setSignupRole(e.target.value)}>
                  <option value="cfo">CFO / Finance Director</option>
                  <option value="accountant">Accountant</option>
                  <option value="auditor">Auditor</option>
                </select>
              </div>
              <div className="input-group">
                <label>Department</label>
                <input type="text" value={signupDept} onChange={(e) => setSignupDept(e.target.value)} placeholder="Finance, Accounting, Audit" />
              </div>
              <div className="input-group">
                <label>Tenant ID (optional)</label>
                <input type="text" value={signupTenantId} onChange={(e) => setSignupTenantId(e.target.value)} placeholder="Leave blank for new company" />
              </div>
              <button className="btn-primary" onClick={handleSignup}>Register Company</button>
              <div className="auth-switch">
                <span className="link" onClick={() => setShowLogin(true)}>Back to Login</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="fincollab-app">
      <div className="app-wrapper">
        <header className="app-header">
          <div className="logo-area">
            <h1>💰 FinCollab | Finance & Accounting Suite</h1>
          </div>
          <div className="user-info">
            <span>{currentUser.name} ({currentUser.role})</span>
            <span className="tenant-badge">🏢 {tenantId}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        
        <nav className="tabs">
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
            💸 Transactions
          </button>
          <button className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`} onClick={() => setActiveTab('invoices')}>
            📄 Invoices
          </button>
          <button className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`} onClick={() => setActiveTab('budget')}>
            📈 Budget & Planning
          </button>
          <button className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            📑 Financial Reports
          </button>
          <button className={`tab-btn ${activeTab === 'collab' ? 'active' : ''}`} onClick={() => setActiveTab('collab')}>
            💬 Team Chat
          </button>
          {isAdmin && (
            <button className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
              ⚙️ Admin Panel
            </button>
          )}
        </nav>
        
        <main className="app-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="tab-content active">
              <div className="grid-3col">
                <div className="card">
                  <h3>💰 Financial Summary</h3>
                  <div className="financial-stats">
                    <div className="stat-card">
                      <div className="stat-number">${totals.income.toLocaleString()}</div>
                      <div>Total Income</div>
                    </div>
                    <div className="stat-card expense">
                      <div className="stat-number">${totals.expense.toLocaleString()}</div>
                      <div>Total Expenses</div>
                    </div>
                    <div className="stat-card profit">
                      <div className="stat-number">${totals.profit.toLocaleString()}</div>
                      <div>Net Profit</div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <h3>📊 Cash Flow</h3>
                  <div className="stat-card">
                    <div className="stat-number">${(totals.income - totals.expense).toLocaleString()}</div>
                    <div>Cash Balance</div>
                  </div>
                </div>
                <div className="card">
                  <h3>⚠️ Pending Approvals</h3>
                  {invoices.filter(i => i.status === 'pending').length > 0 ? (
                    invoices.filter(i => i.status === 'pending').map(i => (
                      <div key={i.id} className="transaction-item">
                        Invoice to {i.client}: ${i.amount} due {i.dueDate}
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">No pending approvals</div>
                  )}
                </div>
              </div>
              <div className="card" style={{ marginTop: '1rem' }}>
                <h3>📈 Recent Transactions</h3>
                {transactions.slice(-5).reverse().map(t => (
                  <div key={t.id} className="transaction-item">
                    <strong>{t.description}</strong> - <span className={t.type === 'income' ? 'amount-positive' : 'amount-negative'}>${t.amount.toLocaleString()}</span>
                    <br />
                    <small>{t.category} | {t.date}</small>
                  </div>
                ))}
                {transactions.length === 0 && <div className="empty-state">No transactions yet</div>}
              </div>
            </div>
          )}
          
          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>➕ Record Transaction</h3>
                  <input type="text" placeholder="Description" value={transDescription} onChange={(e) => setTransDescription(e.target.value)} />
                  <select value={transType} onChange={(e) => setTransType(e.target.value)}>
                    <option value="income">Income / Revenue</option>
                    <option value="expense">Expense</option>
                  </select>
                  <input type="number" placeholder="Amount" value={transAmount} onChange={(e) => setTransAmount(e.target.value)} />
                  <input type="text" placeholder="Category (e.g., Sales, Salaries)" value={transCategory} onChange={(e) => setTransCategory(e.target.value)} />
                  <input type="date" value={transDate} onChange={(e) => setTransDate(e.target.value)} />
                  <button className="action-btn" onClick={handleAddTransaction}>Record Transaction</button>
                </div>
                <div className="card">
                  <h3>📋 Transaction History</h3>
                  <div className="scrollable-list">
                    {transactions.slice().reverse().map(t => (
                      <div key={t.id} className="transaction-item">
                        <strong>{t.description}</strong>
                        <br />
                        Type: {t.type} | Amount: <span className={t.type === 'income' ? 'amount-positive' : 'amount-negative'}>${t.amount.toLocaleString()}</span>
                        <br />
                        Category: {t.category} | Date: {t.date}
                        <br />
                        <small>Recorded by: {t.recordedBy}</small>
                      </div>
                    ))}
                    {transactions.length === 0 && <div className="empty-state">No transactions</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>📄 Create Invoice</h3>
                  <input type="text" placeholder="Client Name" value={invoiceClient} onChange={(e) => setInvoiceClient(e.target.value)} />
                  <input type="number" placeholder="Amount" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} />
                  <input type="text" placeholder="Items/Services" value={invoiceItems} onChange={(e) => setInvoiceItems(e.target.value)} />
                  <input type="date" value={invoiceDueDate} onChange={(e) => setInvoiceDueDate(e.target.value)} />
                  <button className="action-btn" onClick={handleCreateInvoice}>Generate Invoice</button>
                </div>
                <div className="card">
                  <h3>📋 Invoices & Payments</h3>
                  <div className="scrollable-list">
                    {invoices.map(i => (
                      <div key={i.id} className="invoice-item">
                        <strong>{i.client}</strong> - ${i.amount.toLocaleString()}
                        <br />
                        Items: {i.items}
                        <br />
                        Due: {i.dueDate} | Status: {i.status}
                        {i.status === 'pending' && (
                          <button className="action-btn small" onClick={() => markInvoicePaid(i.id)}>Mark Paid</button>
                        )}
                      </div>
                    ))}
                    {invoices.length === 0 && <div className="empty-state">No invoices</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Budget Tab */}
          {activeTab === 'budget' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>🎯 Set Budget</h3>
                  <input type="text" placeholder="Category (e.g., Marketing, R&D)" value={budgetCategory} onChange={(e) => setBudgetCategory(e.target.value)} />
                  <input type="number" placeholder="Budget Amount" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} />
                  <select value={budgetPeriod} onChange={(e) => setBudgetPeriod(e.target.value)}>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                  <button className="action-btn" onClick={handleSetBudget}>Set Budget</button>
                </div>
                <div className="card">
                  <h3>📊 Budget vs Actual</h3>
                  <div className="scrollable-list">
                    {budgets.map(b => {
                      const actualSpent = transactions.filter(t => t.type === 'expense' && t.category === b.category).reduce((sum, t) => sum + t.amount, 0);
                      const variance = b.amount - actualSpent;
                      return (
                        <div key={b.id} className="budget-item">
                          <strong>{b.category}</strong>
                          <br />
                          Budget: ${b.amount.toLocaleString()} | Actual: ${actualSpent.toLocaleString()} | Variance: <span className={variance >= 0 ? 'amount-positive' : 'amount-negative'}>${variance.toLocaleString()}</span>
                          <br />
                          Period: {b.period}
                        </div>
                      );
                    })}
                    {budgets.length === 0 && <div className="empty-state">No budgets set</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>📑 Generate Report</h3>
                  <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option value="profitloss">Profit & Loss Statement</option>
                    <option value="balancesheet">Balance Sheet</option>
                    <option value="cashflow">Cash Flow Statement</option>
                  </select>
                  <input type="month" value={reportPeriod} onChange={(e) => setReportPeriod(e.target.value)} />
                  <button className="action-btn" onClick={handleGenerateReport}>Generate Report</button>
                  <div id="reportOutput" className="report-output"></div>
                </div>
                <div className="card">
                  <h3>📎 Shared Financial Reports</h3>
                  <div className="scrollable-list">
                    {reports.map(r => (
                      <div key={r.id} className="report-item">
                        <strong>{r.title}</strong>
                        <br />
                        {r.content}
                        <br />
                        <small>Uploaded by {r.uploadedBy}</small>
                      </div>
                    ))}
                    {reports.length === 0 && <div className="empty-state">No shared reports</div>}
                  </div>
                  <div className="file-upload">
                    <input type="text" placeholder="Report Title" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} />
                    <textarea placeholder="Report summary" rows="2" value={reportContent} onChange={(e) => setReportContent(e.target.value)}></textarea>
                    <button className="action-btn" onClick={handleUploadReport}>Upload Report</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Collaboration Tab */}
          {activeTab === 'collab' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>💬 Finance Team Chat</h3>
                  <div className="team-members-list">
                    {allMembers.map(m => (
                      <div key={m.email} className="member-item">
                        <span>{m.name} ({m.role}) - {m.department}</span>
                      </div>
                    ))}
                  </div>
                  <div className="chat-input-group">
                    <input type="text" placeholder="Message to finance team..." value={teamMsg} onChange={(e) => setTeamMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendTeamMsg()} />
                    <button className="send-btn" onClick={handleSendTeamMsg}>Send</button>
                  </div>
                  <div className="chat-messages">
                    {teamMsgs.map((m, idx) => (
                      <div key={idx} className="message-bubble">
                        <strong>{m.fromName}</strong> <small>{new Date(m.timestamp).toLocaleTimeString()}</small>
                        <br />
                        {escapeHtml(m.text)}
                      </div>
                    ))}
                    {teamMsgs.length === 0 && <div className="empty-state">No messages</div>}
                  </div>
                </div>
                <div className="card">
                  <h3>🏢 Department Chat</h3>
                  <select className="dept-selector" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                    <option value="">Select Department</option>
                    {depts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="chat-messages">
                    {deptMsgs.map((m, idx) => (
                      <div key={idx} className="message-bubble">
                        <strong>{m.fromName}</strong> <small>{new Date(m.timestamp).toLocaleTimeString()}</small>
                        <br />
                        {escapeHtml(m.text)}
                      </div>
                    ))}
                    {deptMsgs.length === 0 && <div className="empty-state">No department messages</div>}
                  </div>
                  <div className="chat-input-group">
                    <input type="text" placeholder="Message to department..." value={deptMsg} onChange={(e) => setDeptMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendDeptMsg()} disabled={!selectedDept} />
                    <button className="send-btn" onClick={handleSendDeptMsg} disabled={!selectedDept}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Admin Tab */}
          {activeTab === 'admin' && isAdmin && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>👥 Team Management</h3>
                  <div className="staff-list">
                    {allMembers.map(m => (
                      <div key={m.email} className="staff-item">
                        <div>
                          <strong>{m.name}</strong> ({m.email})
                          <br />
                          {m.role} | {m.department}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="add-staff">
                    <input type="email" placeholder="User email to add" value={newStaffEmail} onChange={(e) => setNewStaffEmail(e.target.value)} />
                    <select value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)}>
                      <option value="cfo">CFO</option>
                      <option value="accountant">Accountant</option>
                      <option value="auditor">Auditor</option>
                    </select>
                    <button className="action-btn" onClick={handleAddStaff}>Add Team Member</button>
                  </div>
                </div>
                <div className="card">
                  <h3>🏢 Departments & Cost Centers</h3>
                  <div className="dept-list">
                    {depts.map(d => (
                      <div key={d} className="dept-item">
                        {d}
                        <button className="remove-btn" onClick={() => removeDept(d)}>❌</button>
                      </div>
                    ))}
                  </div>
                  <div className="add-dept">
                    <input type="text" placeholder="New department" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} />
                    <button className="action-btn" onClick={handleAddDept}>Add Cost Center</button>
                  </div>
                </div>
                <div className="card">
                  <h3>📊 Audit Log & Compliance</h3>
                  <div className="audit-log">
                    {audit.map((a, idx) => (
                      <div key={idx} className="audit-item">
                        <small>{new Date(a.timestamp).toLocaleString()}</small>
                        <br />
                        <strong>{a.action}</strong> by {a.userEmail}
                        <br />
                        {a.details}
                      </div>
                    ))}
                    {audit.length === 0 && <div className="empty-state">No audit logs</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FinCollab;