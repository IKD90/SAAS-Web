import React, { useState, useEffect } from 'react';
import './HealthCareSolutions.css';

const HealthCareSolutions = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(true);
  
  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginTenantId, setLoginTenantId] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('doctor');
  const [signupSpecialty, setSignupSpecialty] = useState('');
  const [signupTenantId, setSignupTenantId] = useState('');
  
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientCondition, setPatientCondition] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  
  const [apptPatientName, setApptPatientName] = useState('');
  const [apptDateTime, setApptDateTime] = useState('');
  const [apptDoctor, setApptDoctor] = useState('');
  const [apptReason, setApptReason] = useState('');
  
  const [prescPatient, setPrescPatient] = useState('');
  const [prescMedication, setPrescMedication] = useState('');
  const [prescDosage, setPrescDosage] = useState('');
  const [prescInstructions, setPrescInstructions] = useState('');
  
  const [teamMsg, setTeamMsg] = useState('');
  const [deptMsg, setDeptMsg] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  
  const [newDeptName, setNewDeptName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('doctor');
  
  const [reportTitle, setReportTitle] = useState('');
  const [reportContent, setReportContent] = useState('');
  
  const [refresh, setRefresh] = useState(0);
  
  // Initialize database on component mount
  useEffect(() => {
    initDB();
  }, []);
  
  const initDB = () => {
    if (!localStorage.getItem('healthcare_users')) {
      const users = {
        "dr.smith@cityclinic.com": { email: "dr.smith@cityclinic.com", userId: "doc001", name: "Dr. Sarah Smith", password: "doctor123", tenantId: "CLINIC_CITY", role: "doctor", specialty: "Cardiology" }
      };
      localStorage.setItem('healthcare_users', JSON.stringify(users));
    }
    if (!localStorage.getItem('healthcare_tenants')) {
      const tenants = { "CLINIC_CITY": { id: "CLINIC_CITY", name: "City Medical Center", departments: ["Cardiology", "Pediatrics", "Emergency", "Radiology"], members: ["dr.smith@cityclinic.com"], createdAt: Date.now() } };
      localStorage.setItem('healthcare_tenants', JSON.stringify(tenants));
    }
    if (!localStorage.getItem('healthcare_patients')) localStorage.setItem('healthcare_patients', JSON.stringify([]));
    if (!localStorage.getItem('healthcare_appointments')) localStorage.setItem('healthcare_appointments', JSON.stringify([]));
    if (!localStorage.getItem('healthcare_prescriptions')) localStorage.setItem('healthcare_prescriptions', JSON.stringify([]));
    if (!localStorage.getItem('healthcare_messages')) localStorage.setItem('healthcare_messages', JSON.stringify({ team: [], department: {} }));
    if (!localStorage.getItem('healthcare_reports')) localStorage.setItem('healthcare_reports', JSON.stringify([]));
  };

  const getUsers = () => JSON.parse(localStorage.getItem('healthcare_users') || '{}');
  const saveUsers = (u) => localStorage.setItem('healthcare_users', JSON.stringify(u));
  const getTenants = () => JSON.parse(localStorage.getItem('healthcare_tenants') || '{}');
  const saveTenants = (t) => localStorage.setItem('healthcare_tenants', JSON.stringify(t));
  const getPatients = () => JSON.parse(localStorage.getItem('healthcare_patients') || '[]');
  const savePatients = (p) => localStorage.setItem('healthcare_patients', JSON.stringify(p));
  const getAppointments = () => JSON.parse(localStorage.getItem('healthcare_appointments') || '[]');
  const saveAppointments = (a) => localStorage.setItem('healthcare_appointments', JSON.stringify(a));
  const getPrescriptions = () => JSON.parse(localStorage.getItem('healthcare_prescriptions') || '[]');
  const savePrescriptions = (p) => localStorage.setItem('healthcare_prescriptions', JSON.stringify(p));
  const getMessages = () => JSON.parse(localStorage.getItem('healthcare_messages') || '{"team":[], "department":{}}');
  const saveMessages = (m) => localStorage.setItem('healthcare_messages', JSON.stringify(m));
  const getReports = () => JSON.parse(localStorage.getItem('healthcare_reports') || '[]');
  const saveReports = (r) => localStorage.setItem('healthcare_reports', JSON.stringify(r));

  // Auth functions
  const signup = (email, name, password, role, specialty, existingTenantId) => {
    const users = getUsers();
    if (users[email]) return { success: false, error: "Email exists" };
    let tenantId = existingTenantId;
    const tenants = getTenants();
    let newRole = role;
    if (!tenantId || !tenants[tenantId]) {
      tenantId = "CLINIC_" + Math.random().toString(36).substring(2, 8).toUpperCase();
      tenants[tenantId] = { id: tenantId, name: `${name}'s Clinic`, departments: ["General Medicine", "Pediatrics", "Cardiology"], members: [email], createdAt: Date.now() };
      newRole = "admin";
      saveTenants(tenants);
    } else {
      if (!tenants[tenantId].members.includes(email)) tenants[tenantId].members.push(email);
      saveTenants(tenants);
    }
    users[email] = { email, userId: "med_" + Math.random().toString(36).substring(2, 8), name, password, tenantId, role: newRole, specialty: specialty || "General" };
    saveUsers(users);
    return { success: true, tenantId, role: newRole };
  };

  const login = (email, password, tenantId) => {
    const users = getUsers();
    const user = users[email];
    if (!user) return { success: false, error: "User not found" };
    if (user.password !== password) return { success: false, error: "Wrong password" };
    if (user.tenantId !== tenantId) return { success: false, error: `Tenant mismatch. Your facility ID: ${user.tenantId}` };
    return { success: true, user };
  };

  // Data operations
  const addPatient = (tenantId, name, age, condition, notes, addedBy) => {
    const patients = getPatients();
    patients.push({ id: Date.now(), tenantId, name, age, condition, notes, addedBy, createdAt: new Date().toISOString() });
    savePatients(patients);
  };

  const scheduleAppointment = (tenantId, patientName, datetime, doctor, reason) => {
    const apps = getAppointments();
    apps.push({ id: Date.now(), tenantId, patientName, datetime, doctor, reason, status: "scheduled" });
    saveAppointments(apps);
  };

  const issuePrescription = (tenantId, patientName, medication, dosage, instructions, issuedBy) => {
    const presc = getPrescriptions();
    presc.push({ id: Date.now(), tenantId, patientName, medication, dosage, instructions, issuedBy, date: new Date().toISOString() });
    savePrescriptions(presc);
  };

  const sendTeamMsg = (tenantId, fromUser, text) => {
    const msgs = getMessages();
    msgs.team.push({ tenantId, fromEmail: fromUser.email, fromName: fromUser.name, text, timestamp: Date.now() });
    saveMessages(msgs);
  };

  const sendDeptMsg = (tenantId, dept, fromUser, text) => {
    const msgs = getMessages();
    const key = `${tenantId}:${dept}`;
    if (!msgs.department[key]) msgs.department[key] = [];
    msgs.department[key].push({ fromName: fromUser.name, text, timestamp: Date.now() });
    saveMessages(msgs);
  };

  const handleAddStaff = () => {
    if (!newStaffEmail.trim()) return alert('Staff email required');
    const users = getUsers();
    const tenants = getTenants();
    const tenant = tenants[currentUser.tenantId];
    
    if (!users[newStaffEmail]) {
      return alert('User not found. Please ask them to sign up first.');
    }
    
    if (!tenant.members.includes(newStaffEmail)) {
      tenant.members.push(newStaffEmail);
      saveTenants(tenants);
      alert('Staff member added successfully!');
      setRefresh(r => r + 1);
    } else {
      alert('Staff member already exists in this facility');
    }
    setNewStaffEmail('');
    setNewStaffRole('doctor');
  };

  const escapeHtml = (str) => str?.replace(/[&<>"']/g, m => ({'&': '&amp;', '<': '<', '>': '>', '"': '"', "'": '&#39;'})[m]) || '';

  const getTenantData = () => {
    if (!currentUser) return { allMembers: [], patients: [], appointments: [], prescriptions: [], depts: [], reports: [] };
    const tenantId = currentUser.tenantId;
    const users = getUsers();
    const tenants = getTenants();
    const allMembers = (tenants[tenantId]?.members || []).map(email => users[email]).filter(Boolean);
    const patients = getPatients().filter(p => p.tenantId === tenantId);
    const appointments = getAppointments().filter(a => a.tenantId === tenantId);
    const prescriptions = getPrescriptions().filter(p => p.tenantId === tenantId);
    const depts = tenants[tenantId]?.departments || [];
    const reports = getReports().filter(r => r.tenantId === tenantId);
    return { allMembers, patients, appointments, prescriptions, depts, reports, tenantId };
  };

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
    const res = signup(signupEmail, signupName, signupPassword, signupRole, signupSpecialty, signupTenantId);
    if (res.success) {
      alert(`Registration successful! Your Facility ID: ${res.tenantId}. Please login.`);
      setShowLogin(true);
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupRole('doctor');
      setSignupSpecialty('');
      setSignupTenantId('');
    } else {
      alert(res.error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleAddPatient = () => {
    if (!patientName.trim()) return alert('Patient name required');
    addPatient(currentUser.tenantId, patientName, patientAge, patientCondition, patientNotes, currentUser.name);
    setRefresh(r => r + 1);
    setPatientName(''); setPatientAge(''); setPatientCondition(''); setPatientNotes('');
    alert('Patient added successfully!');
  };

  const handleScheduleAppt = () => {
    if (!apptPatientName.trim() || !apptDateTime) return alert('Patient name and date/time required');
    scheduleAppointment(currentUser.tenantId, apptPatientName, apptDateTime, apptDoctor || currentUser.name, apptReason);
    setRefresh(r => r + 1);
    setApptPatientName(''); setApptDateTime(''); setApptDoctor(''); setApptReason('');
    alert('Appointment scheduled successfully!');
  };

  const handleIssuePresc = () => {
    if (!prescPatient.trim() || !prescMedication.trim()) return alert('Patient name and medication required');
    issuePrescription(currentUser.tenantId, prescPatient, prescMedication, prescDosage, prescInstructions, currentUser.name);
    setRefresh(r => r + 1);
    setPrescPatient(''); setPrescMedication(''); setPrescDosage(''); setPrescInstructions('');
    alert('Prescription issued successfully!');
  };

  const handleSendTeamMsg = () => {
    if (!teamMsg.trim()) return;
    sendTeamMsg(currentUser.tenantId, currentUser, teamMsg);
    setRefresh(r => r + 1);
    setTeamMsg('');
  };

  const handleSendDeptMsg = () => {
    if (!deptMsg.trim() || !selectedDept) return alert('Please select a department and enter a message');
    sendDeptMsg(currentUser.tenantId, selectedDept, currentUser, deptMsg);
    setRefresh(r => r + 1);
    setDeptMsg('');
  };

  const handleAddDept = () => {
    if (!newDeptName.trim()) return alert('Department name required');
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

  const handleRemoveDept = (dept) => {
    if (window.confirm(`Are you sure you want to remove ${dept} department?`)) {
      const tenants = getTenants();
      tenants[currentUser.tenantId].departments = tenants[currentUser.tenantId].departments.filter(d => d !== dept);
      saveTenants(tenants);
      setRefresh(r => r + 1);
    }
  };

  const handleUploadReport = () => {
    if (!reportTitle.trim() || !reportContent.trim()) return alert('Title and content required');
    const reports = getReports();
    reports.push({ id: Date.now(), tenantId: currentUser.tenantId, title: reportTitle, content: reportContent, uploadedBy: currentUser.name, createdAt: new Date().toISOString() });
    saveReports(reports);
    setRefresh(r => r + 1);
    setReportTitle(''); setReportContent('');
    alert('Report uploaded successfully!');
  };

  const { allMembers, patients, appointments, prescriptions, depts, reports, tenantId } = getTenantData();
  const teamMsgs = getMessages().team.filter(m => m.tenantId === tenantId);
  const deptMsgs = getMessages().department[`${tenantId}:${selectedDept}`] || [];
  const isAdmin = currentUser?.role === 'admin';

  if (!currentUser) {
    return (
      <div className="healthcare-container">
        {showLogin ? (
          <div className="auth-card">
            <div className="medical-icon"></div>
            <h2>MediCollab Portal</h2>
            <div className="subtitle">Multi-Tenant Healthcare Platform</div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="dr.smith@cityclinic.com" />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="doctor123" />
            </div>
            <div className="input-group">
              <label>Tenant/Facility ID</label>
              <input type="text" value={loginTenantId} onChange={(e) => setLoginTenantId(e.target.value)} placeholder="CLINIC_CITY" />
            </div>
            <button className="btn-primary" onClick={handleLogin}>
              Login to Healthcare Portal
            </button>
            <div className="auth-switch">
              New practice? <span className="signup-link" onClick={() => setShowLogin(false)}>Register Facility</span>
            </div>
            <div className="demo-info">
              <strong>Demo Login:</strong><br />
              dr.smith@cityclinic.com / doctor123 / CLINIC_CITY
            </div>
          </div>
        ) : (
          <div className="auth-card">
            <div className="medical-icon"></div>
            <h2>Register Healthcare Facility</h2>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="Dr. John Doe" />
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
              <label>Role</label>
              <select value={signupRole} onChange={(e) => setSignupRole(e.target.value)}>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="lab_operator">Lab Operator</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="input-group">
              <label>Specialty</label>
              <input type="text" value={signupSpecialty} onChange={(e) => setSignupSpecialty(e.target.value)} placeholder="Cardiology, Pediatrics, etc." />
            </div>
            <div className="input-group">
              <label>Facility ID (optional)</label>
              <input type="text" value={signupTenantId} onChange={(e) => setSignupTenantId(e.target.value)} placeholder="Leave blank for new facility" />
            </div>
            <button className="btn-primary" onClick={handleSignup}>
              Create Healthcare Facility
            </button>
            <div className="auth-switch">
              <span className="login-link" onClick={() => setShowLogin(true)}>Back to Login</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="main-app">
      <header className="app-header">
        <div className="logo-area">
          <h1> MediCollab | {getTenants()[tenantId]?.name || 'Healthcare Suite'}</h1>
        </div>
        <div className="user-info">
          <span>{currentUser.name} ({currentUser.role})</span>
          <span className="tenant-badge">ID: {tenantId}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      
      <nav className="tabs">
        <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
           Dashboard
        </button>
        <button className={`tab-btn ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
           Patients
        </button>
        <button className={`tab-btn ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}>
           Appointments
        </button>
        <button className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`} onClick={() => setActiveTab('prescriptions')}>
           Prescriptions
        </button>
        <button className={`tab-btn ${activeTab === 'collab' ? 'active' : ''}`} onClick={() => setActiveTab('collab')}>
           Team Chat
        </button>
        {isAdmin && (
          <button className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
             Admin
          </button>
        )}
      </nav>

      <main className="app-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            <section className="overview-card">
              <h2> Today's Overview</h2>
              <div className="metrics">
                <div className="metric">
                  <span className="metric-number">{patients.length}</span>
                  <span className="metric-label">Total Patients</span>
                </div>
                <div className="metric">
                  <span className="metric-number">{appointments.length}</span>
                  <span className="metric-label">Appointments</span>
                </div>
                <div className="metric">
                  <span className="metric-number">{prescriptions.length}</span>
                  <span className="metric-label">Prescriptions</span>
                </div>
                <div className="metric">
                  <span className="metric-number">{allMembers.length}</span>
                  <span className="metric-label">Staff Members</span>
                </div>
              </div>
            </section>
            <section className="recent-card">
              <h2> Recent Patients</h2>
              {patients.length === 0 ? (
                <p>No patients yet. Add your first patient!</p>
              ) : (
                patients.slice(-5).reverse().map(p => (
                  <article key={p.id} className="patient-summary">
                    <h3>{p.name} {p.age ? `(${p.age}y)` : ''}</h3>
                    <p>{p.condition || 'No diagnosis recorded'}</p>
                    <small>Added: {new Date(p.createdAt).toLocaleDateString()}</small>
                  </article>
                ))
              )}
            </section>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="patients-section">
            <div className="form-card">
              <h2> Add New Patient</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleAddPatient(); }}>
                <input type="text" placeholder="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} required />
                <input type="number" placeholder="Age" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} />
                <input type="text" placeholder="Condition/Diagnosis" value={patientCondition} onChange={(e) => setPatientCondition(e.target.value)} />
                <textarea placeholder="Medical Notes" value={patientNotes} onChange={(e) => setPatientNotes(e.target.value)} rows="3" />
                <button type="submit" className="primary-btn">Add Patient</button>
              </form>
            </div>
            <div className="list-card">
              <h2> Patient Records ({patients.length})</h2>
              <div className="list">
                {patients.length === 0 ? (
                  <p>No patients registered yet.</p>
                ) : (
                  patients.map(p => (
                    <div key={p.id} className="list-item patient-item">
                      <div>
                        <strong>{p.name}</strong> {p.age ? `(${p.age} years)` : ''}
                        <br />
                        <small>Condition: {p.condition || 'Not specified'}</small>
                        <br />
                        <small className="notes">{p.notes ? `Notes: ${p.notes.substring(0, 50)}...` : ''}</small>
                      </div>
                      <small>Added by: {p.addedBy}<br />{new Date(p.createdAt).toLocaleDateString()}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="appointments-section">
            <div className="form-card">
              <h2> Schedule Appointment</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleScheduleAppt(); }}>
                <input type="text" placeholder="Patient Name" value={apptPatientName} onChange={(e) => setApptPatientName(e.target.value)} required />
                <input type="datetime-local" value={apptDateTime} onChange={(e) => setApptDateTime(e.target.value)} required />
                <input type="text" placeholder="Doctor (leave blank for self)" value={apptDoctor} onChange={(e) => setApptDoctor(e.target.value)} />
                <input type="text" placeholder="Reason for visit" value={apptReason} onChange={(e) => setApptReason(e.target.value)} />
                <button type="submit" className="primary-btn">Schedule Appointment</button>
              </form>
            </div>
            <div className="list-card">
              <h2> Upcoming Appointments ({appointments.length})</h2>
              <div className="list">
                {appointments.length === 0 ? (
                  <p>No appointments scheduled.</p>
                ) : (
                  appointments.map(a => (
                    <div key={a.id} className="list-item appointment-item">
                      <div>
                        <strong>{a.patientName}</strong>
                        <br />
                        <span> Dr. {a.doctor || 'Not assigned'}</span>
                        <br />
                        <span> {a.reason || 'No reason specified'}</span>
                      </div>
                      <div className="appointment-details">
                        <span className="status-badge status-scheduled">{a.status}</span>
                        <br />
                        <small>{new Date(a.datetime).toLocaleString()}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div className="prescriptions-section">
            <div className="form-card">
              <h2> Issue Prescription</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleIssuePresc(); }}>
                <input type="text" placeholder="Patient Name" value={prescPatient} onChange={(e) => setPrescPatient(e.target.value)} required />
                <input type="text" placeholder="Medication" value={prescMedication} onChange={(e) => setPrescMedication(e.target.value)} required />
                <input type="text" placeholder="Dosage (e.g., 500mg twice daily)" value={prescDosage} onChange={(e) => setPrescDosage(e.target.value)} />
                <textarea placeholder="Instructions" value={prescInstructions} onChange={(e) => setPrescInstructions(e.target.value)} rows="3" />
                <button type="submit" className="primary-btn">Issue Prescription</button>
              </form>
            </div>
            <div className="list-card">
              <h2> Prescriptions ({prescriptions.length})</h2>
              <div className="list">
                {prescriptions.length === 0 ? (
                  <p>No prescriptions issued yet.</p>
                ) : (
                  prescriptions.map(p => (
                    <div key={p.id} className="list-item prescription-item">
                      <div>
                        <strong>{p.patientName}</strong>
                        <br />
                        <span> {p.medication}</span>
                        <br />
                        <span> Dosage: {p.dosage || 'As directed'}</span>
                        <br />
                        <small>{p.instructions}</small>
                      </div>
                      <div>
                        <small>Issued by: {p.issuedBy}</small>
                        <br />
                        <small>{new Date(p.date).toLocaleDateString()}</small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'collab' && (
          <div className="chat-section">
            <div className="chat-container">
              <h2> Team Chat</h2>
              <div className="chat-messages">
                {teamMsgs.length === 0 ? (
                  <p>No messages yet. Start the conversation!</p>
                ) : (
                  teamMsgs.map((msg, idx) => (
                    <div key={idx} className="chat-message">
                      <div className="message-header">{msg.fromName}</div>
                      <div className="message-text">{msg.text}</div>
                      <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type your message..." value={teamMsg} onChange={(e) => setTeamMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendTeamMsg()} />
                <button onClick={handleSendTeamMsg}>Send</button>
              </div>
            </div>
            
            <div className="chat-container">
              <h2> Department Chat</h2>
              <select className="dept-select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                <option value="">Select Department</option>
                {depts.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <div className="chat-messages">
                {!selectedDept ? (
                  <p>Select a department to view messages</p>
                ) : deptMsgs.length === 0 ? (
                  <p>No messages in this department yet.</p>
                ) : (
                  deptMsgs.map((msg, idx) => (
                    <div key={idx} className="chat-message">
                      <div className="message-header">{msg.fromName}</div>
                      <div className="message-text">{msg.text}</div>
                      <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type department message..." value={deptMsg} onChange={(e) => setDeptMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendDeptMsg()} disabled={!selectedDept} />
                <button onClick={handleSendDeptMsg} disabled={!selectedDept}>Send</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && isAdmin && (
          <div className="admin-section">
            <div className="admin-card">
              <h3> Manage Departments</h3>
              <div className="input-group">
                <input type="text" placeholder="New Department Name" value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} />
                <button className="primary-btn" onClick={handleAddDept} style={{ marginTop: '10px' }}>Add Department</button>
              </div>
              <ul className="department-list">
                {depts.map(dept => (
                  <li key={dept}>
                    <span>{dept}</span>
                    <button className="remove-btn" onClick={() => handleRemoveDept(dept)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="admin-card">
              <h3> Manage Staff</h3>
              <div className="input-group">
                <input type="email" placeholder="Staff Email to Add" value={newStaffEmail} onChange={(e) => setNewStaffEmail(e.target.value)} />
                <select value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)} style={{ marginTop: '10px' }}>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="admin">Admin</option>
                </select>
                <button className="primary-btn" onClick={handleAddStaff} style={{ marginTop: '10px' }}>Add Staff Member</button>
              </div>
              <div className="staff-list">
                <h4>Current Staff ({allMembers.length})</h4>
                {allMembers.map(member => (
                  <div key={member.email} className="staff-item">
                    <div>
                      <strong>{member.name}</strong>
                      <br />
                      <small>{member.email} - {member.role}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-card">
              <h3> Upload Report</h3>
              <div className="input-group">
                <input type="text" placeholder="Report Title" value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} />
                <textarea placeholder="Report Content" value={reportContent} onChange={(e) => setReportContent(e.target.value)} rows="5" style={{ marginTop: '10px' }} />
                <button className="primary-btn" onClick={handleUploadReport} style={{ marginTop: '10px' }}>Upload Report</button>
              </div>
              <div className="reports-list" style={{ marginTop: '20px' }}>
                <h4>Recent Reports ({reports.length})</h4>
                {reports.slice(-5).reverse().map(report => (
                  <div key={report.id} className="staff-item">
                    <div>
                      <strong>{report.title}</strong>
                      <br />
                      <small>Uploaded by: {report.uploadedBy}</small>
                      <br />
                      <small>{new Date(report.createdAt).toLocaleDateString()}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HealthCareSolutions;