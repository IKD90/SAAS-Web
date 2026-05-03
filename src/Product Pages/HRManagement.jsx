import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './HRManagement.css';

const HRManagement = () => {
  const [currentTenantId, setCurrentTenantId] = useState('acme');
  const [activeTab, setActiveTab] = useState('employees');
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  
  // Filter states
  const [empSearch, setEmpSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [leaveStatusFilter, setLeaveStatusFilter] = useState('all');
  
  // Form states
  const [employeeForm, setEmployeeForm] = useState({ name: '', email: '', departmentId: '', role: '', status: 'Active' });
  const [deptForm, setDeptForm] = useState({ name: '' });
  const [leaveForm, setLeaveForm] = useState({ employeeId: '', type: 'Sick', startDate: '', endDate: '', reason: '' });
  
  // Tenant Settings
  const [tenantSettings, setTenantSettings] = useState({ name: '', region: '', email: '', currency: '' });
  
  // Charts refs
  const [deptChart, setDeptChart] = useState(null);
  const [attendanceChart, setAttendanceChart] = useState(null);
  
  // Tenant Data
  const [tenantData, setTenantData] = useState({
    acme: {
      tenantInfo: { name: "Acme Corp", region: "America/New_York", email: "hr@acme.com", currency: "USD" },
      employees: [
        { id: "emp1", name: "John Carter", email: "john.carter@acme.com", departmentId: "dept1", role: "HR Director", status: "Active" },
        { id: "emp2", name: "Sarah Lee", email: "sarah.lee@acme.com", departmentId: "dept2", role: "Software Engineer", status: "Active" },
        { id: "emp3", name: "Mike Ross", email: "mike.ross@acme.com", departmentId: "dept1", role: "Recruiter", status: "Active" }
      ],
      departments: [
        { id: "dept1", name: "Human Resources" },
        { id: "dept2", name: "Engineering" },
        { id: "dept3", name: "Sales" }
      ],
      attendance: [
        { employeeId: "emp1", date: "2026-04-02", checkIn: "09:00", checkOut: "17:30", status: "Present" },
        { employeeId: "emp2", date: "2026-04-02", checkIn: "09:15", checkOut: "17:45", status: "Present" }
      ],
      leaves: [
        { id: "lv1", employeeId: "emp2", type: "Vacation", startDate: "2026-04-10", endDate: "2026-04-14", reason: "Family trip", status: "pending" }
      ]
    },
    techstar: {
      tenantInfo: { name: "TechStar GmbH", region: "Europe/Berlin", email: "hr@techstar.de", currency: "EUR" },
      employees: [
        { id: "t1", name: "Anna Schmidt", email: "anna.schmidt@techstar.de", departmentId: "td1", role: "CTO", status: "Active" },
        { id: "t2", name: "Lukas Wagner", email: "lukas.wagner@techstar.de", departmentId: "td2", role: "Backend Lead", status: "Active" }
      ],
      departments: [
        { id: "td1", name: "Leadership" },
        { id: "td2", name: "Development" }
      ],
      attendance: [
        { employeeId: "t1", date: "2026-04-02", checkIn: "08:30", checkOut: "17:00", status: "Present" }
      ],
      leaves: []
    },
    finwise: {
      tenantInfo: { name: "FinWise Solutions", region: "Europe/London", email: "hr@finwise.co.uk", currency: "GBP" },
      employees: [
        { id: "f1", name: "Oliver Twist", email: "oliver@finwise.co.uk", departmentId: "fd1", role: "Finance Manager", status: "Active" },
        { id: "f2", name: "Emma Clark", email: "emma@finwise.co.uk", departmentId: "fd2", role: "Analyst", status: "Active" }
      ],
      departments: [
        { id: "fd1", name: "Finance" },
        { id: "fd2", name: "Operations" }
      ],
      attendance: [],
      leaves: []
    }
  });
  
  const getCurrentTenantData = () => {
    return tenantData[currentTenantId];
  };
  
  const updateTenantData = (tenantId, newData) => {
    setTenantData(prev => ({ ...prev, [tenantId]: newData }));
  };
  
  // Render Functions
  const renderEmployees = () => {
    const tenant = getCurrentTenantData();
    let employees = [...tenant.employees];
    
    if (empSearch) {
      employees = employees.filter(emp => 
        emp.name.toLowerCase().includes(empSearch.toLowerCase()) || 
        emp.email.toLowerCase().includes(empSearch.toLowerCase()) || 
        emp.role.toLowerCase().includes(empSearch.toLowerCase())
      );
    }
    
    if (deptFilter !== "all") {
      employees = employees.filter(emp => emp.departmentId === deptFilter);
    }
    
    return employees;
  };
  
  const renderDepartments = () => {
    const tenant = getCurrentTenantData();
    return tenant.departments.map(dept => ({
      ...dept,
      employeeCount: tenant.employees.filter(e => e.departmentId === dept.id).length
    }));
  };
  
  const renderAttendance = () => {
    const tenant = getCurrentTenantData();
    const attendanceList = tenant.attendance;
    const presentCount = attendanceList.filter(a => a.status === "Present").length;
    const totalRecords = attendanceList.length;
    
    return { attendanceList, presentCount, totalRecords };
  };
  
  const renderLeaves = () => {
    const tenant = getCurrentTenantData();
    let leaves = [...tenant.leaves];
    
    if (leaveStatusFilter !== "all") {
      leaves = leaves.filter(l => l.status === leaveStatusFilter);
    }
    
    return leaves;
  };
  
  const renderAnalytics = () => {
    const tenant = getCurrentTenantData();
    const deptCounts = {};
    
    tenant.employees.forEach(emp => {
      const dept = tenant.departments.find(d => d.id === emp.departmentId);
      if (dept) {
        deptCounts[dept.name] = (deptCounts[dept.name] || 0) + 1;
      }
    });
    
    const presentCount = tenant.attendance.filter(a => a.status === "Present").length;
    const totalAtt = tenant.attendance.length;
    
    return {
      deptLabels: Object.keys(deptCounts),
      deptData: Object.values(deptCounts),
      presentCount,
      totalAtt,
      totalEmployees: tenant.employees.length,
      totalDepartments: tenant.departments.length,
      pendingLeaves: tenant.leaves.filter(l => l.status === 'pending').length
    };
  };
  
  // Employee CRUD
  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeForm({ name: '', email: '', departmentId: '', role: '', status: 'Active' });
    setShowEmployeeModal(true);
  };
  
  const handleEditEmployee = (id) => {
    const tenant = getCurrentTenantData();
    const emp = tenant.employees.find(e => e.id === id);
    if (emp) {
      setEditingEmployee(emp);
      setEmployeeForm({
        name: emp.name,
        email: emp.email,
        departmentId: emp.departmentId,
        role: emp.role,
        status: emp.status
      });
      setShowEmployeeModal(true);
    }
  };
  
  const handleDeleteEmployee = (id) => {
    if (window.confirm("Delete employee?")) {
      const tenant = getCurrentTenantData();
      const updatedEmployees = tenant.employees.filter(e => e.id !== id);
      const updatedTenant = { ...tenant, employees: updatedEmployees };
      updateTenantData(currentTenantId, updatedTenant);
    }
  };
  
  const handleSaveEmployee = (e) => {
    e.preventDefault();
    const tenant = getCurrentTenantData();
    
    if (editingEmployee) {
      const updatedEmployees = tenant.employees.map(emp =>
        emp.id === editingEmployee.id ? { ...emp, ...employeeForm } : emp
      );
      updateTenantData(currentTenantId, { ...tenant, employees: updatedEmployees });
    } else {
      const newId = "emp" + Date.now();
      const newEmployee = { id: newId, ...employeeForm };
      const updatedEmployees = [...tenant.employees, newEmployee];
      updateTenantData(currentTenantId, { ...tenant, employees: updatedEmployees });
    }
    
    setShowEmployeeModal(false);
  };
  
  // Department CRUD
  const handleAddDepartment = () => {
    setEditingDept(null);
    setDeptForm({ name: '' });
    setShowDeptModal(true);
  };
  
  const handleDeleteDepartment = (id) => {
    const tenant = getCurrentTenantData();
    const used = tenant.employees.some(e => e.departmentId === id);
    if (used) {
      alert("Cannot delete department with assigned employees.");
      return;
    }
    const updatedDepartments = tenant.departments.filter(d => d.id !== id);
    updateTenantData(currentTenantId, { ...tenant, departments: updatedDepartments });
  };
  
  const handleSaveDepartment = (e) => {
    e.preventDefault();
    const tenant = getCurrentTenantData();
    
    if (editingDept) {
      const updatedDepartments = tenant.departments.map(dept =>
        dept.id === editingDept.id ? { ...dept, name: deptForm.name } : dept
      );
      updateTenantData(currentTenantId, { ...tenant, departments: updatedDepartments });
    } else {
      const newId = "dept" + Date.now();
      const newDepartment = { id: newId, name: deptForm.name };
      const updatedDepartments = [...tenant.departments, newDepartment];
      updateTenantData(currentTenantId, { ...tenant, departments: updatedDepartments });
    }
    
    setShowDeptModal(false);
  };
  
  // Attendance
  const handleMarkAttendance = () => {
    const tenant = getCurrentTenantData();
    const today = new Date().toISOString().slice(0, 10);
    const newAttendance = [...tenant.attendance];
    
    tenant.employees.forEach(emp => {
      const already = tenant.attendance.some(a => a.employeeId === emp.id && a.date === today);
      if (!already) {
        newAttendance.push({
          employeeId: emp.id,
          date: today,
          checkIn: "09:00",
          checkOut: "17:00",
          status: "Present"
        });
      }
    });
    
    updateTenantData(currentTenantId, { ...tenant, attendance: newAttendance });
    alert("Attendance marked for today for all employees.");
  };
  
  // Leave Requests
  const handleAddLeave = () => {
    setLeaveForm({ employeeId: '', type: 'Sick', startDate: '', endDate: '', reason: '' });
    setShowLeaveModal(true);
  };
  
  const handleSaveLeave = (e) => {
    e.preventDefault();
    const tenant = getCurrentTenantData();
    const newLeave = {
      id: "lv" + Date.now(),
      ...leaveForm,
      status: "pending"
    };
    const updatedLeaves = [...tenant.leaves, newLeave];
    updateTenantData(currentTenantId, { ...tenant, leaves: updatedLeaves });
    setShowLeaveModal(false);
  };
  
  const handleUpdateLeaveStatus = (leaveId, newStatus) => {
    const tenant = getCurrentTenantData();
    const updatedLeaves = tenant.leaves.map(leave =>
      leave.id === leaveId ? { ...leave, status: newStatus } : leave
    );
    updateTenantData(currentTenantId, { ...tenant, leaves: updatedLeaves });
  };
  
  // Tenant Settings
  const handleSaveTenantSettings = () => {
    const tenant = getCurrentTenantData();
    const updatedTenant = {
      ...tenant,
      tenantInfo: {
        ...tenant.tenantInfo,
        name: tenantSettings.name,
        region: tenantSettings.region,
        email: tenantSettings.email,
        currency: tenantSettings.currency
      }
    };
    updateTenantData(currentTenantId, updatedTenant);
    alert("Tenant settings saved");
  };
  
  // Switch Tenant
  const handleSwitchTenant = (tenantId) => {
    setCurrentTenantId(tenantId);
    setEmpSearch('');
    setDeptFilter('all');
    setLeaveStatusFilter('all');
  };
  
  // Update Charts
  useEffect(() => {
    if (activeTab === 'analytics') {
      const analytics = renderAnalytics();
      
      if (deptChart) deptChart.destroy();
      if (attendanceChart) attendanceChart.destroy();
      
      const deptCtx = document.getElementById("deptChart")?.getContext("2d");
      if (deptCtx) {
        const newDeptChart = new Chart(deptCtx, {
          type: 'pie',
          data: {
            labels: analytics.deptLabels,
            datasets: [{
              label: 'Employees per Dept',
              data: analytics.deptData,
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']
            }]
          },
          options: { responsive: true, maintainAspectRatio: true }
        });
      }
      
      const attCtx = document.getElementById("attendanceChart")?.getContext("2d");
      if (attCtx) {
        attendanceChart = new Chart(attCtx, {
          type: 'bar',
          data: {
            labels: ['Present', 'Others'],
            datasets: [{
              label: 'Attendance Summary',
              data: [analytics.presentCount, analytics.totalAtt - analytics.presentCount],
              backgroundColor: '#3b82f6'
            }]
          },
          options: { responsive: true, maintainAspectRatio: true }
        });
      }
    }
    
    return () => {
      if (deptChart) deptChart.destroy();
      if (attendanceChart) attendanceChart.destroy();
    };
  }, [activeTab, currentTenantId, tenantData]);
  
  // Load tenant settings when switching
  useEffect(() => {
    const tenant = getCurrentTenantData();
    setTenantSettings({
      name: tenant.tenantInfo.name,
      region: tenant.tenantInfo.region,
      email: tenant.tenantInfo.email,
      currency: tenant.tenantInfo.currency
    });
  }, [currentTenantId]);
  
  const currentTenant = getCurrentTenantData();
  const employees = renderEmployees();
  const departments = renderDepartments();
  const { attendanceList, presentCount, totalRecords } = renderAttendance();
  const leaves = renderLeaves();
  const analytics = renderAnalytics();
  
  return (
    <div className="hr-app-wrapper">
      {/* Header */}
      <header className="hr-saas-header">
        <div className="hr-logo-area">
          <i className="fas fa-building-users"></i>
          <span>HR<span className="light">MultiTenant</span></span>
        </div>
        <div className="hr-tenant-selector">
          <label><i className="fas fa-cloud"></i> Tenant:</label>
          <select value={currentTenantId} onChange={(e) => handleSwitchTenant(e.target.value)}>
            <option value="acme">Acme Corp (USA)</option>
            <option value="techstar">TechStar GmbH (Germany)</option>
            <option value="finwise">FinWise Solutions (UK)</option>
          </select>
          <span className="hr-tenant-badge">🏢 {currentTenant.tenantInfo.name}</span>
        </div>
        <div className="hr-header-actions">
          <button className="hr-icon-btn" onClick={() => window.location.reload()} title="Refresh data">
            <i className="fas fa-sync-alt"></i>
          </button>
          <div className="hr-avatar"><i className="fas fa-user-circle"></i></div>
        </div>
      </header>
      
      {/* Main Layout */}
      <div className="hr-dashboard-container">
        {/* Sidebar */}
        <aside className="hr-sidebar-nav">
          <nav>
            <ul>
              <li className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>
                <i className="fas fa-users"></i><span>Employees</span>
              </li>
              <li className={activeTab === 'departments' ? 'active' : ''} onClick={() => setActiveTab('departments')}>
                <i className="fas fa-building"></i><span>Departments</span>
              </li>
              <li className={activeTab === 'attendance' ? 'active' : ''} onClick={() => setActiveTab('attendance')}>
                <i className="fas fa-calendar-check"></i><span>Attendance</span>
              </li>
              <li className={activeTab === 'leave' ? 'active' : ''} onClick={() => setActiveTab('leave')}>
                <i className="fas fa-umbrella-beach"></i><span>Leave Requests</span>
              </li>
              <li className={activeTab === 'analytics' ? 'active' : ''} onClick={() => setActiveTab('analytics')}>
                <i className="fas fa-chart-line"></i><span>HR Analytics</span>
              </li>
              <li className={activeTab === 'tenantsettings' ? 'active' : ''} onClick={() => setActiveTab('tenantsettings')}>
                <i className="fas fa-cog"></i><span>Tenant Settings</span>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Content Panel */}
        <main className="hr-content-panel">
          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <div className="hr-tab-content active">
              <div className="hr-panel-header">
                <h2><i className="fas fa-user-tie"></i> Employee Directory</h2>
                <button className="hr-btn-primary" onClick={handleAddEmployee}>
                  <i className="fas fa-plus"></i> Add Employee
                </button>
              </div>
              <div className="hr-search-filter-bar">
                <div className="hr-search-box">
                  <i className="fas fa-search"></i>
                  <input type="text" placeholder="Search by name, email, role..." value={empSearch} onChange={(e) => setEmpSearch(e.target.value)} />
                </div>
                <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
                  <option value="all">All Departments</option>
                  {currentTenant.departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="hr-table-responsive">
                <table className="hr-data-table">
                  <thead>
                    <tr><th>ID</th><th>Full Name</th><th>Email</th><th>Department</th><th>Role</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => {
                      const dept = currentTenant.departments.find(d => d.id === emp.departmentId);
                      return (
                        <tr key={emp.id}>
                          <td>{emp.id}</td>
                          <td>{emp.name}</td>
                          <td>{emp.email}</td>
                          <td>{dept?.name || 'N/A'}</td>
                          <td>{emp.role}</td>
                          <td><span className={`hr-status-badge ${emp.status === 'Inactive' ? 'inactive' : ''}`}>{emp.status}</span></td>
                          <td className="hr-action-icons">
                            <i className="fas fa-edit" onClick={() => handleEditEmployee(emp.id)}></i>
                            <i className="fas fa-trash-alt" onClick={() => handleDeleteEmployee(emp.id)}></i>
                          </td>
                        </tr>
                      );
                    })}
                    {employees.length === 0 && (
                      <tr><td colSpan="7" className="text-center">No employees found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Departments Tab */}
          {activeTab === 'departments' && (
            <div className="hr-tab-content active">
              <div className="hr-panel-header">
                <h2><i className="fas fa-building"></i> Departments</h2>
                <button className="hr-btn-primary" onClick={handleAddDepartment}>
                  <i className="fas fa-plus"></i> New Department
                </button>
              </div>
              <div className="hr-dept-grid">
                {departments.map(dept => (
                  <div key={dept.id} className="hr-dept-card">
                    <div>
                      <strong>{dept.name}</strong>
                      <br />
                      <span style={{ fontSize: '12px' }}>{dept.employeeCount} employees</span>
                    </div>
                    <div>
                      <i className="fas fa-trash-alt" onClick={() => handleDeleteDepartment(dept.id)}></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="hr-tab-content active">
              <div className="hr-panel-header">
                <h2><i className="fas fa-fingerprint"></i> Attendance Overview</h2>
                <button className="hr-btn-outline" onClick={handleMarkAttendance}>
                  <i className="fas fa-clock"></i> Mark Today's Attendance
                </button>
              </div>
              <div className="hr-attendance-summary-cards">
                <div className="hr-summary-card"><i className="fas fa-check-circle"></i> Present: {presentCount}</div>
                <div className="hr-summary-card"><i className="fas fa-calendar-day"></i> Total Records: {totalRecords}</div>
              </div>
              <div className="hr-table-responsive">
                <table className="hr-data-table">
                  <thead><tr><th>Employee</th><th>Date</th><th>Check-In</th><th>Check-Out</th><th>Status</th></tr></thead>
                  <tbody>
                    {attendanceList.map((rec, idx) => {
                      const emp = currentTenant.employees.find(e => e.id === rec.employeeId);
                      return (
                        <tr key={idx}>
                          <td>{emp?.name || 'Unknown'}</td>
                          <td>{rec.date}</td>
                          <td>{rec.checkIn}</td>
                          <td>{rec.checkOut}</td>
                          <td>{rec.status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Leave Tab */}
          {activeTab === 'leave' && (
            <div className="hr-tab-content active">
              <div className="hr-panel-header">
                <h2><i className="fas fa-envelope-open-text"></i> Leave Requests</h2>
                <button className="hr-btn-primary" onClick={handleAddLeave}>
                  <i className="fas fa-paper-plane"></i> Request Leave
                </button>
              </div>
              <div className="hr-filter-bar-leave">
                <select value={leaveStatusFilter} onChange={(e) => setLeaveStatusFilter(e.target.value)}>
                  <option value="all">All status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="hr-table-responsive">
                <table className="hr-data-table">
                  <thead><tr><th>Employee</th><th>Type</th><th>Start Date</th><th>End Date</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {leaves.map(leave => {
                      const emp = currentTenant.employees.find(e => e.id === leave.employeeId);
                      return (
                        <tr key={leave.id}>
                          <td>{emp?.name || 'Unknown'}</td>
                          <td>{leave.type}</td>
                          <td>{leave.startDate}</td>
                          <td>{leave.endDate}</td>
                          <td>{leave.reason}</td>
                          <td><span className="hr-status-badge">{leave.status}</span></td>
                          <td>
                            {leave.status === "pending" && (
                              <>
                                <i className="fas fa-check-circle approve-leave" onClick={() => handleUpdateLeaveStatus(leave.id, "approved")} style={{ color: 'green', marginRight: '8px', cursor: 'pointer' }}></i>
                                <i className="fas fa-times-circle reject-leave" onClick={() => handleUpdateLeaveStatus(leave.id, "rejected")} style={{ color: 'red', cursor: 'pointer' }}></i>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="hr-tab-content active">
              <h2><i className="fas fa-chart-pie"></i> HR Insights (per tenant)</h2>
              <div className="hr-analytics-grid">
                <div className="hr-chart-card"><canvas id="deptChart" width="400" height="300"></canvas></div>
                <div className="hr-chart-card"><canvas id="attendanceChart" width="400" height="300"></canvas></div>
                <div className="hr-stats-card">
                  <p><i className="fas fa-users"></i> Total Employees: {analytics.totalEmployees}</p>
                  <p><i className="fas fa-building"></i> Departments: {analytics.totalDepartments}</p>
                  <p><i className="fas fa-calendar-week"></i> Pending Leaves: {analytics.pendingLeaves}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Tenant Settings Tab */}
          {activeTab === 'tenantsettings' && (
            <div className="hr-tab-content active">
              <div className="hr-panel-header"><h2><i className="fas fa-tenant"></i> Tenant Configuration</h2></div>
              <div className="hr-settings-form">
                <div className="hr-form-row">
                  <label>Tenant Name:</label>
                  <input type="text" value={tenantSettings.name} onChange={(e) => setTenantSettings({...tenantSettings, name: e.target.value})} placeholder="Company name" />
                </div>
                <div className="hr-form-row">
                  <label>Timezone / Region:</label>
                  <input type="text" value={tenantSettings.region} onChange={(e) => setTenantSettings({...tenantSettings, region: e.target.value})} placeholder="e.g., America/New_York" />
                </div>
                <div className="hr-form-row">
                  <label>HR Contact Email:</label>
                  <input type="email" value={tenantSettings.email} onChange={(e) => setTenantSettings({...tenantSettings, email: e.target.value})} placeholder="hr@company.com" />
                </div>
                <div className="hr-form-row">
                  <label>Default Currency:</label>
                  <input type="text" value={tenantSettings.currency} onChange={(e) => setTenantSettings({...tenantSettings, currency: e.target.value})} placeholder="USD / EUR / GBP" />
                </div>
                <button className="hr-btn-primary" onClick={handleSaveTenantSettings}><i className="fas fa-save"></i> Save Settings</button>
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* Employee Modal */}
      {showEmployeeModal && (
        <div className="hr-modal" onClick={() => setShowEmployeeModal(false)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="hr-close-modal" onClick={() => setShowEmployeeModal(false)}>&times;</span>
            <h3>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h3>
            <form onSubmit={handleSaveEmployee}>
              <div className="hr-form-group">
                <label>Full Name</label>
                <input type="text" value={employeeForm.name} onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})} required />
              </div>
              <div className="hr-form-group">
                <label>Email</label>
                <input type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})} required />
              </div>
              <div className="hr-form-group">
                <label>Department</label>
                <select value={employeeForm.departmentId} onChange={(e) => setEmployeeForm({...employeeForm, departmentId: e.target.value})} required>
                  <option value="">Select Department</option>
                  {currentTenant.departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="hr-form-group">
                <label>Role</label>
                <input type="text" value={employeeForm.role} onChange={(e) => setEmployeeForm({...employeeForm, role: e.target.value})} placeholder="e.g., Senior Developer" />
              </div>
              <div className="hr-form-group">
                <label>Status</label>
                <select value={employeeForm.status} onChange={(e) => setEmployeeForm({...employeeForm, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className="hr-btn-primary">Save Employee</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Department Modal */}
      {showDeptModal && (
        <div className="hr-modal" onClick={() => setShowDeptModal(false)}>
          <div className="hr-modal-content small" onClick={(e) => e.stopPropagation()}>
            <span className="hr-close-modal" onClick={() => setShowDeptModal(false)}>&times;</span>
            <h3>Department</h3>
            <form onSubmit={handleSaveDepartment}>
              <input type="text" value={deptForm.name} onChange={(e) => setDeptForm({name: e.target.value})} placeholder="Department Name" required />
              <button type="submit" className="hr-btn-primary">Save</button>
            </form>
          </div>
        </div>
      )}
      
      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="hr-modal" onClick={() => setShowLeaveModal(false)}>
          <div className="hr-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="hr-close-modal" onClick={() => setShowLeaveModal(false)}>&times;</span>
            <h3>Request Leave</h3>
            <form onSubmit={handleSaveLeave}>
              <select value={leaveForm.employeeId} onChange={(e) => setLeaveForm({...leaveForm, employeeId: e.target.value})} required>
                <option value="">Select Employee</option>
                {currentTenant.employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
              <select value={leaveForm.type} onChange={(e) => setLeaveForm({...leaveForm, type: e.target.value})}>
                <option value="Sick">Sick</option>
                <option value="Vacation">Vacation</option>
                <option value="Personal">Personal</option>
              </select>
              <input type="date" value={leaveForm.startDate} onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})} required />
              <input type="date" value={leaveForm.endDate} onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})} required />
              <textarea value={leaveForm.reason} onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})} placeholder="Reason" rows="3"></textarea>
              <button type="submit" className="hr-btn-primary">Submit Request</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRManagement;