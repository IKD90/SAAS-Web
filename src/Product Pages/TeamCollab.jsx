import React, { useState, useEffect } from 'react';
import './TeamCollab.css';

const TeamCollab = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('collab');
  const [showLogin, setShowLogin] = useState(true);
  
  // Auth form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginTenantId, setLoginTenantId] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupTenantId, setSignupTenantId] = useState('');
  const [signupDept, setSignupDept] = useState('Engineering');
  
  // Task states
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  
  // Report states
  const [reportTitle, setReportTitle] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportFile, setReportFile] = useState(null);
  
  // Chat states
  const [teamMsg, setTeamMsg] = useState('');
  const [deptMsg, setDeptMsg] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  
  // Admin states
  const [newDeptName, setNewDeptName] = useState('');
  const [roleChangeEmail, setRoleChangeEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [memberEmailInput, setMemberEmailInput] = useState('');
  
  const [refresh, setRefresh] = useState(0);
  
  // Initialize database
  useEffect(() => {
    initDB();
  }, []);
  
  const initDB = () => {
    if (!localStorage.getItem('enterprise_users')) {
      const users = {
        "super@system.com": { 
          email: "super@system.com", 
          userId: "super1", 
          name: "Super Admin", 
          password: "super123", 
          tenantId: "SYSTEM", 
          role: "superadmin", 
          department: "Admin" 
        }
      };
      localStorage.setItem('enterprise_users', JSON.stringify(users));
    }
    if (!localStorage.getItem('enterprise_tenants')) {
      const tenants = { 
        "TENANT_A99": { 
          id: "TENANT_A99", 
          name: "Acme Corp", 
          departments: ["Engineering", "Sales", "Product", "Support"], 
          members: ["super@system.com"], 
          createdBy: "system", 
          createdAt: Date.now() 
        } 
      };
      localStorage.setItem('enterprise_tenants', JSON.stringify(tenants));
    }
    if (!localStorage.getItem('enterprise_messages')) {
      localStorage.setItem('enterprise_messages', JSON.stringify({ team: [], department: {} }));
    }
    if (!localStorage.getItem('enterprise_tasks')) {
      localStorage.setItem('enterprise_tasks', JSON.stringify([]));
    }
    if (!localStorage.getItem('enterprise_reports')) {
      localStorage.setItem('enterprise_reports', JSON.stringify([]));
    }
    if (!localStorage.getItem('enterprise_activity')) {
      localStorage.setItem('enterprise_activity', JSON.stringify([]));
    }
  };
  
  // Helper functions
  const getUsers = () => JSON.parse(localStorage.getItem('enterprise_users') || '{}');
  const saveUsers = (u) => localStorage.setItem('enterprise_users', JSON.stringify(u));
  const getTenants = () => JSON.parse(localStorage.getItem('enterprise_tenants') || '{}');
  const saveTenants = (t) => localStorage.setItem('enterprise_tenants', JSON.stringify(t));
  const getMessages = () => JSON.parse(localStorage.getItem('enterprise_messages') || '{"team":[], "department":{}}');
  const saveMessages = (m) => localStorage.setItem('enterprise_messages', JSON.stringify(m));
  const getTasks = () => JSON.parse(localStorage.getItem('enterprise_tasks') || '[]');
  const saveTasks = (t) => localStorage.setItem('enterprise_tasks', JSON.stringify(t));
  const getReports = () => JSON.parse(localStorage.getItem('enterprise_reports') || '[]');
  const saveReports = (r) => localStorage.setItem('enterprise_reports', JSON.stringify(r));
  const getActivity = () => JSON.parse(localStorage.getItem('enterprise_activity') || '[]');
  const saveActivity = (a) => localStorage.setItem('enterprise_activity', JSON.stringify(a));
  
  const logActivity = (tenantId, action, userEmail, details) => {
    const logs = getActivity();
    logs.unshift({ tenantId, action, userEmail, details, timestamp: new Date().toISOString() });
    if (logs.length > 200) logs.pop();
    saveActivity(logs);
  };
  
  // Auth functions
  const signup = (email, name, password, existingTenantId, department) => {
    const users = getUsers();
    if (users[email]) return { success: false, error: "Email exists" };
    let tenantId = existingTenantId;
    let role = "member";
    const tenants = getTenants();
    if (!tenantId || !tenants[tenantId]) {
      tenantId = "TENANT_" + Math.random().toString(36).substring(2, 8).toUpperCase();
      tenants[tenantId] = { 
        id: tenantId, 
        name: `${name}'s Workspace`, 
        departments: ["Engineering", "Sales", "Product", "Support"], 
        members: [email], 
        createdBy: email, 
        createdAt: Date.now() 
      };
      role = "admin";
      saveTenants(tenants);
    } else {
      if (!tenants[tenantId].members.includes(email)) tenants[tenantId].members.push(email);
      saveTenants(tenants);
    }
    const userId = "user_" + Math.random().toString(36).substring(2, 8);
    users[email] = { email, userId, name, password, tenantId, role, department };
    saveUsers(users);
    logActivity(tenantId, "USER_SIGNUP", email, `Joined tenant as ${role}`);
    return { success: true, tenantId, role };
  };
  
  const login = (email, password, tenantId) => {
    const users = getUsers();
    const user = users[email];
    if (!user) return { success: false, error: "User not found" };
    if (user.password !== password) return { success: false, error: "Wrong password" };
    if (user.tenantId !== tenantId && user.role !== 'superadmin') {
      return { success: false, error: `Tenant mismatch. Your tenant: ${user.tenantId}` };
    }
    return { success: true, user };
  };
  
  // Admin functions
  const addDepartment = (tenantId, deptName, adminEmail) => {
    const tenants = getTenants();
    if (!tenants[tenantId]) return false;
    if (!tenants[tenantId].departments.includes(deptName)) {
      tenants[tenantId].departments.push(deptName);
      saveTenants(tenants);
      logActivity(tenantId, "DEPT_ADD", adminEmail, `Added department: ${deptName}`);
    }
    return true;
  };
  
  const changeUserRole = (email, newRole, adminEmail) => {
    const users = getUsers();
    if (!users[email]) return false;
    users[email].role = newRole;
    saveUsers(users);
    logActivity(users[email].tenantId, "ROLE_CHANGE", adminEmail, `Changed ${email} to ${newRole}`);
    return true;
  };
  
  const addMemberToTenant = (tenantId, email, adminEmail) => {
    const users = getUsers();
    const tenants = getTenants();
    if (!users[email]) return { error: "User not found. They must sign up first." };
    if (!tenants[tenantId]) return { error: "Tenant not found" };
    if (!tenants[tenantId].members.includes(email)) {
      tenants[tenantId].members.push(email);
      saveTenants(tenants);
      users[email].tenantId = tenantId;
      saveUsers(users);
      logActivity(tenantId, "MEMBER_ADD", adminEmail, `Added ${email}`);
      return { success: true };
    }
    return { error: "Already member" };
  };
  
  const removeMember = (tenantId, email, adminEmail) => {
    const tenants = getTenants();
    const users = getUsers();
    if (email === adminEmail) return { error: "Cannot remove yourself" };
    if (tenants[tenantId] && tenants[tenantId].members.includes(email)) {
      tenants[tenantId].members = tenants[tenantId].members.filter(e => e !== email);
      saveTenants(tenants);
      if (users[email] && users[email].tenantId === tenantId) users[email].tenantId = null;
      saveUsers(users);
      logActivity(tenantId, "MEMBER_REMOVE", adminEmail, `Removed ${email}`);
      return { success: true };
    }
    return { error: "Member not found" };
  };
  
  const removeDepartment = (tenantId, deptName, adminEmail) => {
    const tenants = getTenants();
    if (tenants[tenantId]) {
      tenants[tenantId].departments = tenants[tenantId].departments.filter(d => d !== deptName);
      saveTenants(tenants);
      logActivity(tenantId, "DEPT_REMOVE", adminEmail, `Removed department: ${deptName}`);
    }
  };
  
  // Tasks & Reports
  const addTask = (tenantId, userEmail, title, desc) => {
    const tasks = getTasks();
    tasks.push({ 
      id: Date.now(), 
      tenantId, 
      userEmail, 
      title, 
      desc, 
      status: "pending", 
      createdAt: new Date().toISOString() 
    });
    saveTasks(tasks);
    logActivity(tenantId, "TASK_ADD", userEmail, `Task: ${title}`);
  };
  
  const addReport = (tenantId, userEmail, title, content, fileData) => {
    const reports = getReports();
    reports.push({ 
      id: Date.now(), 
      tenantId, 
      userEmail, 
      title, 
      content, 
      fileData: fileData || null, 
      createdAt: new Date().toISOString() 
    });
    saveReports(reports);
    logActivity(tenantId, "REPORT_UPLOAD", userEmail, `Report: ${title}`);
  };
  
  // Messaging
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
    msgs.department[key].push({ 
      fromEmail: fromUser.email, 
      fromName: fromUser.name, 
      text, 
      timestamp: Date.now() 
    });
    saveMessages(msgs);
  };
  
  const getTeamMsgs = (tenantId) => {
    return getMessages().team.filter(m => m.tenantId === tenantId).sort((a, b) => a.timestamp - b.timestamp);
  };
  
  const getDeptMsgs = (tenantId, dept) => {
    return (getMessages().department[`${tenantId}:${dept}`] || []).sort((a, b) => a.timestamp - b.timestamp);
  };
  
  const getTenantData = () => {
    if (!currentUser) return { allMembers: [], tasks: [], reports: [], depts: [], activity: [] };
    const tenantId = currentUser.tenantId;
    const users = getUsers();
    const tenants = getTenants();
    const allMembers = (tenants[tenantId]?.members || []).map(email => users[email]).filter(Boolean);
    const tasks = getTasks().filter(t => t.tenantId === tenantId);
    const reports = getReports().filter(r => r.tenantId === tenantId);
    const depts = tenants[tenantId]?.departments || [];
    const activity = getActivity().filter(a => a.tenantId === tenantId || currentUser.role === 'superadmin');
    return { allMembers, tasks, reports, depts, activity, tenantId, tenants };
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
      setActiveTab('collab');
    } else {
      alert(res.error);
    }
  };
  
  const handleSignup = () => {
    if (!signupName || !signupEmail || !signupPassword) {
      alert('Please fill in all required fields');
      return;
    }
    const res = signup(signupEmail, signupName, signupPassword, signupTenantId, signupDept);
    if (res.success) {
      alert(`Success! Tenant: ${res.tenantId}. Please login.`);
      setShowLogin(true);
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupTenantId('');
      setSignupDept('Engineering');
    } else {
      alert(res.error);
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('collab');
  };
  
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      alert('Please enter a task title');
      return;
    }
    addTask(currentUser.tenantId, currentUser.email, newTaskTitle, newTaskDesc);
    setRefresh(prev => prev + 1);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };
  
  const handleUploadReport = () => {
    if (!reportTitle.trim()) {
      alert('Please enter a report title');
      return;
    }
    addReport(currentUser.tenantId, currentUser.email, reportTitle, reportDesc, null);
    setRefresh(prev => prev + 1);
    setReportTitle('');
    setReportDesc('');
    alert('Report shared successfully!');
  };
  
  const handleSendTeamMsg = () => {
    if (!teamMsg.trim()) return;
    sendTeamMsg(currentUser.tenantId, currentUser, teamMsg);
    setRefresh(prev => prev + 1);
    setTeamMsg('');
  };
  
  const handleSendDeptMsg = () => {
    if (!deptMsg.trim() || !selectedDept) return;
    sendDeptMsg(currentUser.tenantId, selectedDept, currentUser, deptMsg);
    setRefresh(prev => prev + 1);
    setDeptMsg('');
  };
  
  const handleAddDept = () => {
    if (!newDeptName.trim()) return;
    addDepartment(currentUser.tenantId, newDeptName, currentUser.email);
    setRefresh(prev => prev + 1);
    setNewDeptName('');
  };
  
  const handleRemoveDept = (deptName) => {
    if (window.confirm(`Remove department: ${deptName}?`)) {
      removeDepartment(currentUser.tenantId, deptName, currentUser.email);
      setRefresh(prev => prev + 1);
    }
  };
  
  const handlePromoteUser = () => {
    if (!roleChangeEmail) {
      alert('Please enter an email address');
      return;
    }
    changeUserRole(roleChangeEmail, newMemberRole, currentUser.email);
    setRefresh(prev => prev + 1);
    setRoleChangeEmail('');
    alert('Role updated successfully!');
  };
  
  const handleAddMember = () => {
    if (!memberEmailInput) {
      alert('Please enter an email address');
      return;
    }
    const res = addMemberToTenant(currentUser.tenantId, memberEmailInput, currentUser.email);
    if (res.error) {
      alert(res.error);
    } else {
      alert('Member added successfully!');
      setRefresh(prev => prev + 1);
      setMemberEmailInput('');
    }
  };
  
  const handleRemoveMember = () => {
    if (!memberEmailInput) {
      alert('Please enter an email address');
      return;
    }
    const res = removeMember(currentUser.tenantId, memberEmailInput, currentUser.email);
    if (res.error) {
      alert(res.error);
    } else {
      alert('Member removed successfully!');
      setRefresh(prev => prev + 1);
      setMemberEmailInput('');
    }
  };
  
  const { allMembers, tasks, reports, depts, activity, tenantId } = getTenantData();
  const userTasks = tasks.filter(t => t.userEmail === currentUser?.email);
  const teamMsgs = getTeamMsgs(tenantId);
  const deptMsgs = getDeptMsgs(tenantId, selectedDept);
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
  
  const deptMembers = allMembers.filter(m => m.department === selectedDept);
  
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
      <div className="teamcollab-container">
        <div className="auth-container">
          {showLogin ? (
            <div className="auth-card">
              <h2>TeamCollab Enterprise</h2>
              <div className="subtitle">Sign in to your workspace</div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="admin@company.com" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••" />
              </div>
              <div className="input-group">
                <label>Tenant ID</label>
                <input type="text" value={loginTenantId} onChange={(e) => setLoginTenantId(e.target.value)} placeholder="e.g., TENANT_A99" />
              </div>
              <button className="btn-primary" onClick={handleLogin}>Login</button>
              <div className="auth-switch">
                New user? <span className="link" onClick={() => setShowLogin(false)}>Create Account</span>
              </div>
              <div className="demo-info">
                <strong>Demo Login:</strong><br />
                super@system.com / super123 / TENANT_A99
              </div>
            </div>
          ) : (
            <div className="auth-card">
              <h2>Create Account</h2>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Tenant ID (optional)</label>
                <input type="text" value={signupTenantId} onChange={(e) => setSignupTenantId(e.target.value)} placeholder="Leave blank for new tenant" />
              </div>
              <div className="input-group">
                <label>Department</label>
                <select value={signupDept} onChange={(e) => setSignupDept(e.target.value)}>
                  <option>Engineering</option>
                  <option>Sales</option>
                  <option>Product</option>
                  <option>Support</option>
                </select>
              </div>
              <button className="btn-primary" onClick={handleSignup}>Sign Up</button>
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
    <div className="teamcollab-app">
      <div className="app-wrapper">
        <header className="app-header">
          <h2>TeamCollab Enterprise</h2>
          <div className="user-info">
            <span>{currentUser.name} ({currentUser.role})</span>
            <span className="tenant-badge">{tenantId}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        
        <nav className="tabs">
          <button className={`tab-btn ${activeTab === 'collab' ? 'active' : ''}`} onClick={() => setActiveTab('collab')}>
            Collaboration
          </button>
          <button className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
            Tasks & Reports
          </button>
          {isAdmin && (
            <button className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
              Admin Panel
            </button>
          )}
        </nav>
        
        <main className="app-content">
          {/* Collaboration Tab */}
          {activeTab === 'collab' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>Team Chat</h3>
                  <div className="members-list">
                    {allMembers.map(m => (
                      <div key={m.email} className="member-item">
                        <span>{m.name} ({m.department})</span>
                        <span className={`role-badge role-${m.role === 'teamleader' ? 'leader' : (m.role === 'admin' ? 'admin' : 'member')}`}>
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="chat-input-group">
                    <input type="text" placeholder="Message to team..." value={teamMsg} onChange={(e) => setTeamMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendTeamMsg()} />
                    <button className="send-btn" onClick={handleSendTeamMsg}>Send</button>
                  </div>
                  <div className="chat-messages">
                    {teamMsgs.length > 0 ? (
                      teamMsgs.map((m, idx) => (
                        <div key={idx} className="message-bubble">
                          <div className="message-header">
                            <strong>{m.fromName}</strong>
                            <small>{new Date(m.timestamp).toLocaleTimeString()}</small>
                          </div>
                          <div className="message-text">{escapeHtml(m.text)}</div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No messages</div>
                    )}
                  </div>
                </div>
                
                <div className="card">
                  <h3>Department Hub</h3>
                  <select className="dept-selector" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                    <option value="">Select Department</option>
                    {depts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <div className="dept-members-list">
                    {deptMembers.map(m => (
                      <div key={m.email} className="member-item">
                        <span>{m.name}</span>
                        <span className="role-badge">{m.role}</span>
                      </div>
                    ))}
                  </div>
                  <div className="chat-input-group">
                    <input type="text" placeholder="Message to department..." value={deptMsg} onChange={(e) => setDeptMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendDeptMsg()} disabled={!selectedDept} />
                    <button className="send-btn" onClick={handleSendDeptMsg} disabled={!selectedDept}>Send</button>
                  </div>
                  <div className="chat-messages">
                    {deptMsgs.length > 0 ? (
                      deptMsgs.map((m, idx) => (
                        <div key={idx} className="message-bubble">
                          <div className="message-header">
                            <strong>{m.fromName}</strong>
                            <small>{new Date(m.timestamp).toLocaleTimeString()}</small>
                          </div>
                          <div className="message-text">{escapeHtml(m.text)}</div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No messages</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Tasks & Reports Tab */}
          {activeTab === 'tasks' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>My Tasks</h3>
                  <div className="tasks-list">
                    {userTasks.length > 0 ? (
                      userTasks.map(t => (
                        <div key={t.id} className="task-item">
                          <div className="task-header">
                            <span className="task-title">{escapeHtml(t.title)}</span>
                            <span className="task-date">{new Date(t.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="task-desc">{escapeHtml(t.desc)}</div>
                          <div className="task-status">Status: {t.status}</div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No tasks yet</div>
                    )}
                  </div>
                  <div className="add-task-form">
                    <input type="text" placeholder="Task title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
                    <textarea placeholder="Task description" rows="2" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)}></textarea>
                    <button className="btn-success" onClick={handleAddTask}>Add Task</button>
                  </div>
                </div>
                
                <div className="card">
                  <h3>Shared Reports</h3>
                  <div className="reports-list">
                    {reports.length > 0 ? (
                      reports.map(r => (
                        <div key={r.id} className="report-item">
                          <div className="report-header">
                            <span className="report-title">{escapeHtml(r.title)}</span>
                            <span className="report-meta">by {r.userEmail}</span>
                          </div>
                          <div className="report-content">{escapeHtml(r.content)}</div>
                          <div className="report-date">{new Date(r.createdAt).toLocaleString()}</div>
                          {r.fileData && <div className="report-attachment">File attached</div>}
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No reports shared</div>
                    )}
                  </div>
                  <div className="upload-report-form">
                    <input type="text" placeholder="Report title" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} />
                    <textarea placeholder="Report content / summary" rows="2" value={reportDesc} onChange={(e) => setReportDesc(e.target.value)}></textarea>
                    <button className="btn-primary" onClick={handleUploadReport}>Upload Report</button>
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
                  <h3>Team Members & Roles</h3>
                  <div className="admin-members-list">
                    {allMembers.map(m => (
                      <div key={m.email} className="member-item">
                        <div className="member-info">
                          <strong>{m.name}</strong>
                          <br />
                          <small>{m.email} | {m.department}</small>
                          <br />
                          <small>Leader: {m.role === 'teamleader' ? 'Yes' : 'No'}</small>
                        </div>
                        <button className="btn-small" onClick={() => { changeUserRole(m.email, 'teamleader', currentUser.email); setRefresh(prev => prev + 1); }}>
                          Make Leader
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="role-change-form">
                    <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)}>
                      <option value="member">Member</option>
                      <option value="teamleader">Team Leader</option>
                      <option value="admin">Admin</option>
                    </select>
                    <input type="email" placeholder="User email" value={roleChangeEmail} onChange={(e) => setRoleChangeEmail(e.target.value)} />
                    <button className="btn-primary" onClick={handlePromoteUser}>Change Role</button>
                  </div>
                </div>
                
                <div className="card">
                  <h3>Manage Departments</h3>
                  <div className="departments-list">
                    {depts.map(d => (
                      <div key={d} className="dept-item">
                        <span>{d}</span>
                        <button className="btn-icon" onClick={() => handleRemoveDept(d)}>Remove</button>
                      </div>
                    ))}
                  </div>
                  <div className="add-dept-form">
                    <input type="text" placeholder="New department name" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} />
                    <button className="btn-success" onClick={handleAddDept}>Add Department</button>
                  </div>
                  <div className="member-management">
                    <h4>Add / Remove Members</h4>
                    <input type="email" placeholder="User email to add/remove" value={memberEmailInput} onChange={(e) => setMemberEmailInput(e.target.value)} />
                    <button className="btn-primary" onClick={handleAddMember}>Add Member to Tenant</button>
                    <button className="btn-danger" onClick={handleRemoveMember}>Remove Member</button>
                  </div>
                </div>
                
                <div className="card">
                  <h3>Activity & Reports Log</h3>
                  <div className="activity-log">
                    {activity.length > 0 ? (
                      activity.map((a, idx) => (
                        <div key={idx} className="activity-item">
                          <div className="activity-time">{new Date(a.timestamp).toLocaleString()}</div>
                          <div className="activity-action">
                            <strong>{a.action}</strong> by {a.userEmail}
                          </div>
                          <div className="activity-details">{a.details}</div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">No activity logs</div>
                    )}
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

export default TeamCollab;