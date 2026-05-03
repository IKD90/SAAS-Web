import React, { useState, useEffect, useRef } from 'react';
import './WorkFlowAutomation.css';

const WorkflowAutomation = () => {
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [currentStepConfig, setCurrentStepConfig] = useState(null);
  const [showStepsPanel, setShowStepsPanel] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [executionLogs, setExecutionLogs] = useState([]);
  
  // Workflow form states
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDesc, setWorkflowDesc] = useState('');
  const [workflowActive, setWorkflowActive] = useState(true);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  
  // Filter states
  const [searchLogs, setSearchLogs] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState('all');
  
  const canvasRef = useRef(null);
  
  // Initialize data
  useEffect(() => {
    initializeData();
  }, []);
  
  const initializeData = () => {
    const savedWorkflows = localStorage.getItem('workflows');
    const savedExecutions = localStorage.getItem('executions');
    
    if (savedWorkflows) {
      setWorkflows(JSON.parse(savedWorkflows));
    } else {
      const sampleWorkflows = [
        {
          id: 'wf1',
          name: 'New User Onboarding',
          description: 'Automated onboarding process for new employees',
          active: true,
          steps: [
            {
              id: 'step1',
              type: 'trigger',
              trigger: 'schedule',
              config: { cron: '0 9 * * 1' },
              position: 0
            },
            {
              id: 'step2',
              type: 'action',
              action: 'sendEmail',
              config: { subject: 'Welcome!', body: 'Welcome to the team!' },
              position: 1
            },
            {
              id: 'step3',
              type: 'action',
              action: 'createTask',
              config: { title: 'Complete onboarding', assignee: 'HR' },
              position: 2
            }
          ],
          createdAt: new Date().toISOString(),
          executions: 145,
          lastRun: '2024-01-20 09:00:00'
        },
        {
          id: 'wf2',
          name: 'Invoice Approval',
          description: 'Automated invoice approval workflow',
          active: true,
          steps: [
            {
              id: 'step1',
              type: 'trigger',
              trigger: 'email',
              config: { subject: 'New Invoice' },
              position: 0
            },
            {
              id: 'step2',
              type: 'action',
              action: 'condition',
              config: { condition: 'amount > 1000' },
              position: 1
            },
            {
              id: 'step3',
              type: 'connector',
              connector: 'slack',
              config: { channel: '#approvals', message: 'Invoice needs approval' },
              position: 2
            }
          ],
          createdAt: new Date().toISOString(),
          executions: 89,
          lastRun: '2024-01-19 14:30:00'
        }
      ];
      setWorkflows(sampleWorkflows);
      localStorage.setItem('workflows', JSON.stringify(sampleWorkflows));
    }
    
    if (savedExecutions) {
      setExecutions(JSON.parse(savedExecutions));
    } else {
      const sampleExecutions = [
        {
          id: 'exec1',
          workflowId: 'wf1',
          workflowName: 'New User Onboarding',
          status: 'success',
          duration: 2.5,
          trigger: 'schedule',
          timestamp: '2024-01-20 09:00:00',
          details: 'Workflow completed successfully'
        },
        {
          id: 'exec2',
          workflowId: 'wf1',
          workflowName: 'New User Onboarding',
          status: 'success',
          duration: 2.3,
          trigger: 'schedule',
          timestamp: '2024-01-19 09:00:00',
          details: 'Workflow completed successfully'
        },
        {
          id: 'exec3',
          workflowId: 'wf2',
          workflowName: 'Invoice Approval',
          status: 'failed',
          duration: 1.2,
          trigger: 'email',
          timestamp: '2024-01-19 14:30:00',
          details: 'Error: Slack API timeout'
        }
      ];
      setExecutions(sampleExecutions);
      localStorage.setItem('executions', JSON.stringify(sampleExecutions));
    }
  };
  
  const saveWorkflows = (newWorkflows) => {
    localStorage.setItem('workflows', JSON.stringify(newWorkflows));
    setWorkflows(newWorkflows);
  };
  
  const saveExecutions = (newExecutions) => {
    localStorage.setItem('executions', JSON.stringify(newExecutions));
    setExecutions(newExecutions);
  };
  
  const getStepName = (step) => {
    if (step.type === 'trigger') {
      const triggers = {
        schedule: 'Schedule Trigger',
        webhook: 'Webhook Trigger',
        email: 'Email Trigger',
        database: 'Database Change'
      };
      return triggers[step.trigger] || 'Trigger';
    } else if (step.type === 'action') {
      const actions = {
        sendEmail: 'Send Email',
        createTask: 'Create Task',
        updateRecord: 'Update Record',
        httpRequest: 'HTTP Request',
        wait: 'Wait/Delay',
        condition: 'Condition'
      };
      return actions[step.action] || 'Action';
    } else {
      const connectors = {
        slack: 'Slack',
        googleSheets: 'Google Sheets',
        trello: 'Trello'
      };
      return connectors[step.connector] || 'Connector';
    }
  };
  
  const getStepIcon = (step) => {
    if (step.type === 'trigger') {
      const icons = {
        schedule: 'fa-calendar-alt',
        webhook: 'fa-code-branch',
        email: 'fa-envelope',
        database: 'fa-database'
      };
      return icons[step.trigger] || 'fa-bolt';
    } else if (step.type === 'action') {
      const icons = {
        sendEmail: 'fa-paper-plane',
        createTask: 'fa-tasks',
        updateRecord: 'fa-edit',
        httpRequest: 'fa-globe',
        wait: 'fa-hourglass-half',
        condition: 'fa-code-branch'
      };
      return icons[step.action] || 'fa-cogs';
    } else {
      const icons = {
        slack: 'fa-slack',
        googleSheets: 'fa-table',
        trello: 'fa-trello'
      };
      return icons[step.connector] || 'fa-plug';
    }
  };
  
  const renderStepConfig = (step) => {
    if (step.type === 'trigger') {
      if (step.trigger === 'schedule') {
        return (
          <div className="config-row">
            <label>Cron Expression:</label>
            <input type="text" className="config-input" data-config-key="cron" defaultValue={step.config?.cron || '0 9 * * *'} placeholder="0 9 * * *" />
            <label>Time Zone:</label>
            <select className="config-input" data-config-key="timezone" defaultValue={step.config?.timezone || 'UTC'}>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
        );
      } else if (step.trigger === 'webhook') {
        return (
          <div className="config-row">
            <label>Webhook URL:</label>
            <input type="text" className="config-input" data-config-key="url" defaultValue={step.config?.url || ''} placeholder="https://api.example.com/webhook" />
            <label>Method:</label>
            <select className="config-input" data-config-key="method" defaultValue={step.config?.method || 'POST'}>
              <option value="POST">POST</option>
              <option value="GET">GET</option>
              <option value="PUT">PUT</option>
            </select>
          </div>
        );
      } else if (step.trigger === 'email') {
        return (
          <div className="config-row">
            <label>Email Address:</label>
            <input type="email" className="config-input" data-config-key="email" defaultValue={step.config?.email || ''} />
            <label>Subject Filter:</label>
            <input type="text" className="config-input" data-config-key="subject" defaultValue={step.config?.subject || ''} />
          </div>
        );
      }
    } else if (step.type === 'action') {
      if (step.action === 'sendEmail') {
        return (
          <div className="config-row">
            <label>To:</label>
            <input type="email" className="config-input" data-config-key="to" defaultValue={step.config?.to || ''} />
            <label>Subject:</label>
            <input type="text" className="config-input" data-config-key="subject" defaultValue={step.config?.subject || ''} />
            <label>Body:</label>
            <textarea className="config-input" data-config-key="body" rows="3" defaultValue={step.config?.body || ''}></textarea>
          </div>
        );
      } else if (step.action === 'createTask') {
        return (
          <div className="config-row">
            <label>Task Title:</label>
            <input type="text" className="config-input" data-config-key="title" defaultValue={step.config?.title || ''} />
            <label>Assignee:</label>
            <input type="text" className="config-input" data-config-key="assignee" defaultValue={step.config?.assignee || ''} />
            <label>Due Date:</label>
            <input type="date" className="config-input" data-config-key="dueDate" defaultValue={step.config?.dueDate || ''} />
          </div>
        );
      } else if (step.action === 'wait') {
        return (
          <div className="config-row">
            <label>Wait Duration:</label>
            <input type="number" className="config-input" data-config-key="duration" defaultValue={step.config?.duration || 5} />
            <select className="config-input" data-config-key="unit" defaultValue={step.config?.unit || 'seconds'}>
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
            </select>
          </div>
        );
      } else if (step.action === 'condition') {
        return (
          <div className="config-row">
            <label>Condition:</label>
            <input type="text" className="config-input" data-config-key="condition" defaultValue={step.config?.condition || ''} placeholder="e.g., amount > 1000" />
            <label>True Branch:</label>
            <input type="text" className="config-input" data-config-key="trueBranch" defaultValue={step.config?.trueBranch || ''} />
            <label>False Branch:</label>
            <input type="text" className="config-input" data-config-key="falseBranch" defaultValue={step.config?.falseBranch || ''} />
          </div>
        );
      }
    } else if (step.type === 'connector') {
      if (step.connector === 'slack') {
        return (
          <div className="config-row">
            <label>Channel:</label>
            <input type="text" className="config-input" data-config-key="channel" defaultValue={step.config?.channel || '#general'} />
            <label>Message:</label>
            <textarea className="config-input" data-config-key="message" rows="3" defaultValue={step.config?.message || ''}></textarea>
          </div>
        );
      } else if (step.connector === 'googleSheets') {
        return (
          <div className="config-row">
            <label>Spreadsheet ID:</label>
            <input type="text" className="config-input" data-config-key="spreadsheetId" defaultValue={step.config?.spreadsheetId || ''} />
            <label>Sheet Name:</label>
            <input type="text" className="config-input" data-config-key="sheetName" defaultValue={step.config?.sheetName || 'Sheet1'} />
          </div>
        );
      }
    }
    return null;
  };
  
  const handleDragStart = (e, stepData) => {
    e.dataTransfer.setData('application/json', JSON.stringify(stepData));
    e.dataTransfer.effectAllowed = 'copy';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    
    const newStep = {
      id: 'step_' + Date.now() + '_' + Math.random(),
      type: data.type,
      trigger: data.trigger,
      action: data.action,
      connector: data.connector,
      config: {},
      position: workflowSteps.length
    };
    
    setWorkflowSteps([...workflowSteps, newStep]);
  };
  
  const updateStepConfig = (stepId, config) => {
    setWorkflowSteps(workflowSteps.map(step => 
      step.id === stepId ? { ...step, config: { ...step.config, ...config } } : step
    ));
  };
  
  const deleteStep = (stepId) => {
    setWorkflowSteps(workflowSteps.filter(step => step.id !== stepId));
  };
  
  const saveWorkflow = () => {
    if (!workflowName.trim()) {
      alert('Please enter a workflow name');
      return;
    }
    
    if (workflowSteps.length === 0) {
      alert('Please add at least one step to your workflow');
      return;
    }
    
    const workflowData = {
      id: editingWorkflow ? editingWorkflow.id : 'wf_' + Date.now(),
      name: workflowName,
      description: workflowDesc,
      active: workflowActive,
      steps: workflowSteps.map((step, index) => ({ ...step, position: index })),
      createdAt: editingWorkflow ? editingWorkflow.createdAt : new Date().toISOString(),
      executions: editingWorkflow ? editingWorkflow.executions || 0 : 0,
      lastRun: editingWorkflow ? editingWorkflow.lastRun : null
    };
    
    let newWorkflows;
    if (editingWorkflow) {
      newWorkflows = workflows.map(w => w.id === editingWorkflow.id ? workflowData : w);
    } else {
      newWorkflows = [...workflows, workflowData];
    }
    
    saveWorkflows(newWorkflows);
    setCurrentView('dashboard');
    resetWorkflowForm();
    alert('Workflow saved successfully!');
  };
  
  const resetWorkflowForm = () => {
    setWorkflowName('');
    setWorkflowDesc('');
    setWorkflowActive(true);
    setWorkflowSteps([]);
    setEditingWorkflow(null);
  };
  
  const editWorkflow = (workflow) => {
    setEditingWorkflow(workflow);
    setWorkflowName(workflow.name);
    setWorkflowDesc(workflow.description || '');
    setWorkflowActive(workflow.active);
    setWorkflowSteps(workflow.steps || []);
    setCurrentView('builder');
    setShowStepsPanel(true);
  };
  
  const deleteWorkflow = (id) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      const newWorkflows = workflows.filter(w => w.id !== id);
      saveWorkflows(newWorkflows);
    }
  };
  
  const runWorkflow = async (workflow) => {
    if (!workflow.active) {
      alert('This workflow is inactive. Please activate it first.');
      return;
    }
    
    const executionId = 'exec_' + Date.now();
    const startTime = Date.now();
    const logs = [];
    
    setShowExecutionModal(true);
    setExecutionProgress(0);
    setExecutionLogs(['Starting workflow execution...']);
    
    const totalSteps = workflow.steps.length;
    
    for (let i = 0; i < totalSteps; i++) {
      const step = workflow.steps[i];
      const progress = ((i + 1) / totalSteps) * 100;
      setExecutionProgress(progress);
      setExecutionLogs(prev => [...prev, `Executing step ${i + 1}/${totalSteps}: ${getStepName(step)}...`]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const duration = (Date.now() - startTime) / 1000;
    setExecutionLogs(prev => [...prev, '✓ Workflow completed successfully!']);
    setExecutionProgress(100);
    
    const newExecution = {
      id: executionId,
      workflowId: workflow.id,
      workflowName: workflow.name,
      status: 'success',
      duration: duration,
      trigger: 'manual',
      timestamp: new Date().toLocaleString(),
      details: 'Workflow executed successfully'
    };
    
    const newExecutions = [newExecution, ...executions].slice(0, 100);
    saveExecutions(newExecutions);
    
    const updatedWorkflows = workflows.map(w => 
      w.id === workflow.id 
        ? { ...w, executions: (w.executions || 0) + 1, lastRun: newExecution.timestamp }
        : w
    );
    saveWorkflows(updatedWorkflows);
  };
  
  const getDashboardStats = () => {
    const activeWorkflows = workflows.filter(w => w.active).length;
    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter(e => e.status === 'success').length;
    const successRate = totalExecutions > 0 ? (successfulExecutions / totalExecutions * 100).toFixed(1) : 0;
    const avgTime = executions.length > 0 ? 
      (executions.reduce((sum, e) => sum + e.duration, 0) / executions.length).toFixed(1) : 0;
    
    return { activeWorkflows, totalExecutions, successRate, avgTime };
  };
  
  const stats = getDashboardStats();
  const recentExecutions = executions.slice(0, 5);
  
  const filteredLogs = executions.filter(log => {
    const matchesSearch = log.workflowName.toLowerCase().includes(searchLogs.toLowerCase()) ||
                         log.id.toLowerCase().includes(searchLogs.toLowerCase());
    const matchesStatus = logStatusFilter === 'all' || log.status === logStatusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const templates = [
    { name: 'Welcome Email Series', description: 'Send welcome emails to new users', icon: 'fa-envelope', steps: 3 },
    { name: 'Data Backup', description: 'Automated database backup schedule', icon: 'fa-database', steps: 2 },
    { name: 'Lead Scoring', description: 'Score and route leads automatically', icon: 'fa-chart-line', steps: 4 },
    { name: 'Order Processing', description: 'Process orders and update inventory', icon: 'fa-shopping-cart', steps: 5 }
  ];
  
  return (
    <div className="automation-container">
      <header className="header">
        <div className="logo">
          <h1>Workflow Automation</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => { resetWorkflowForm(); setCurrentView('builder'); setShowStepsPanel(true); }}>
            <i className="fas fa-plus"></i> Create Workflow
          </button>
          <button className="btn btn-secondary" onClick={() => setCurrentView('dashboard')}>
            <i className="fas fa-chart-line"></i> Dashboard
          </button>
          <button className="btn btn-info" onClick={() => setCurrentView('templates')}>
            <i className="fas fa-copy"></i> Templates
          </button>
          <button className="btn btn-info" onClick={() => setCurrentView('logs')}>
            <i className="fas fa-list-alt"></i> Logs
          </button>
        </div>
      </header>
      
      <main className="main-content">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="view active">
            <div className="stats-grid">
              <div className="stat-card">
                <i className="fas fa-code-branch"></i>
                <div className="stat-info">
                  <h3>Active Workflows</h3>
                  <p>{stats.activeWorkflows}</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-play-circle"></i>
                <div className="stat-info">
                  <h3>Total Executions</h3>
                  <p>{stats.totalExecutions}</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-check-circle"></i>
                <div className="stat-info">
                  <h3>Success Rate</h3>
                  <p>{stats.successRate}%</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-clock"></i>
                <div className="stat-info">
                  <h3>Avg. Execution Time</h3>
                  <p>{stats.avgTime}s</p>
                </div>
              </div>
            </div>
            
            <div className="workflow-list">
              <h2><i className="fas fa-flowchart"></i> My Workflows</h2>
              <div className="workflow-grid">
                {workflows.length === 0 ? (
                  <div className="empty-state">No workflows created yet. Click "Create Workflow" to get started.</div>
                ) : (
                  workflows.map(workflow => (
                    <div key={workflow.id} className="workflow-card">
                      <div className="workflow-card-header">
                        <h3>{workflow.name}</h3>
                        <span className={`workflow-status ${workflow.active ? 'status-active' : 'status-inactive'}`}>
                          {workflow.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p>{workflow.description || 'No description'}</p>
                      <div className="workflow-stats">
                        <span><i className="fas fa-play"></i> {workflow.executions || 0} runs</span>
                        <span><i className="fas fa-clock"></i> Last: {workflow.lastRun || 'Never'}</span>
                      </div>
                      <div className="workflow-actions">
                        <button className="btn btn-secondary" onClick={() => editWorkflow(workflow)}>
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button className="btn btn-primary" onClick={() => runWorkflow(workflow)}>
                          <i className="fas fa-play"></i> Run
                        </button>
                        <button className="btn btn-danger" onClick={() => deleteWorkflow(workflow.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="recent-executions">
              <h2><i className="fas fa-history"></i> Recent Executions</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Workflow</th>
                      <th>Status</th>
                      <th>Duration</th>
                      <th>Triggered By</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentExecutions.length === 0 ? (
                      <tr><td colSpan="5" className="text-center">No executions yet</td></tr>
                    ) : (
                      recentExecutions.map(exec => (
                        <tr key={exec.id}>
                          <td>{exec.workflowName}</td>
                          <td><span className={`status-badge status-${exec.status}`}>{exec.status}</span></td>
                          <td>{exec.duration}s</td>
                          <td>{exec.trigger}</td>
                          <td>{exec.timestamp}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Workflow Builder View */}
        {currentView === 'builder' && (
          <div className="view active">
            <div className="builder-header">
              <h2><i className="fas fa-plus-circle"></i> {editingWorkflow ? 'Edit Workflow' : 'Create New Workflow'}</h2>
              <div className="builder-actions">
                <button className="btn btn-secondary" onClick={() => { setCurrentView('dashboard'); setShowStepsPanel(false); }}>
                  <i className="fas fa-times"></i> Cancel
                </button>
                <button className="btn btn-success" onClick={saveWorkflow}>
                  <i className="fas fa-save"></i> Save Workflow
                </button>
                {editingWorkflow && (
                  <button className="btn btn-primary" onClick={() => runWorkflow(editingWorkflow)}>
                    <i className="fas fa-play"></i> Test Run
                  </button>
                )}
              </div>
            </div>
            
            <div className="workflow-info">
              <div className="form-group">
                <label>Workflow Name *</label>
                <input type="text" value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} placeholder="e.g., New User Onboarding" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={workflowDesc} onChange={(e) => setWorkflowDesc(e.target.value)} rows="2" placeholder="Describe what this workflow does..."></textarea>
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={workflowActive} onChange={(e) => setWorkflowActive(e.target.checked)} /> Active
                </label>
              </div>
            </div>
            
            <div className="workflow-canvas">
              <div className="canvas-dropzone" ref={canvasRef} onDragOver={handleDragOver} onDrop={handleDrop}>
                {workflowSteps.length === 0 ? (
                  <div className="empty-canvas">
                    <i className="fas fa-arrow-down"></i>
                    <p>Drag and drop triggers and actions here</p>
                  </div>
                ) : (
                  workflowSteps.map((step, index) => (
                    <div key={step.id} className="workflow-step" data-step-id={step.id}>
                      <div className="step-header">
                        <div className="step-header-left">
                          <div className="step-icon">
                            <i className={`fas ${getStepIcon(step)}`}></i>
                          </div>
                          <div>
                            <span className="step-title">{getStepName(step)}</span>
                            <span className="step-type">{step.type}</span>
                          </div>
                        </div>
                        <div className="step-header-actions">
                          <button className="btn-icon" onClick={() => setCurrentStepConfig(step)}>
                            <i className="fas fa-cog"></i>
                          </button>
                          <button className="btn-icon" onClick={() => deleteStep(step.id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="step-content">
                        <div className="step-config">
                          {renderStepConfig(step)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Templates View */}
        {currentView === 'templates' && (
          <div className="view active">
            <div className="module-header">
              <h2><i className="fas fa-copy"></i> Workflow Templates</h2>
              <p>Choose a template to get started quickly</p>
            </div>
            <div className="templates-grid">
              {templates.map((template, index) => (
                <div key={index} className="template-card" onClick={() => { resetWorkflowForm(); setWorkflowName(template.name); setCurrentView('builder'); setShowStepsPanel(true); }}>
                  <i className={`fas ${template.icon}`}></i>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <small>{template.steps} steps</small>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Logs View */}
        {currentView === 'logs' && (
          <div className="view active">
            <div className="module-header">
              <h2><i className="fas fa-list-alt"></i> Execution Logs</h2>
              <button className="btn btn-secondary" onClick={() => { if (window.confirm('Clear all logs?')) { setExecutions([]); localStorage.setItem('executions', JSON.stringify([])); } }}>
                <i className="fas fa-trash"></i> Clear Logs
              </button>
            </div>
            <div className="filter-bar">
              <div className="filter-group">
                <label>Search:</label>
                <input type="text" placeholder="Search logs..." value={searchLogs} onChange={(e) => setSearchLogs(e.target.value)} />
              </div>
              <div className="filter-group">
                <label>Status:</label>
                <select value={logStatusFilter} onChange={(e) => setLogStatusFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="running">Running</option>
                </select>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Workflow</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Trigger</th>
                    <th>Time</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.length === 0 ? (
                    <tr><td colSpan="7" className="text-center">No logs found</td></tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id}>
                        <td>{log.id}</td>
                        <td>{log.workflowName}</td>
                        <td><span className={`status-badge status-${log.status}`}>{log.status}</span></td>
                        <td>{log.duration}s</td>
                        <td>{log.trigger}</td>
                        <td>{log.timestamp}</td>
                        <td><button className="btn-icon" onClick={() => alert(`Details:\n\n${log.details}`)}><i className="fas fa-info-circle"></i></button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      
      {/* Steps Panel */}
      {showStepsPanel && currentView === 'builder' && (
        <div className="steps-panel open">
          <div className="panel-header">
            <h3><i className="fas fa-plus-circle"></i> Add Step</h3>
            <button className="close-panel" onClick={() => setShowStepsPanel(false)}>&times;</button>
          </div>
          <div className="panel-content">
            <div className="step-category">
              <h4><i className="fas fa-bolt"></i> Triggers</h4>
              <div className="step-item" draggable onDragStart={(e) => handleDragStart(e, { type: 'trigger', trigger: 'schedule' })}>
                <i className="fas fa-calendar-alt"></i>
                <div><strong>Schedule Trigger</strong><small>Run at specific times</small></div>
              </div>
              <div className="step-item" draggable onDragStart={(e) => handleDragStart(e, { type: 'trigger', trigger: 'webhook' })}>
                <i className="fas fa-code-branch"></i>
                <div><strong>Webhook Trigger</strong><small>HTTP endpoint</small></div>
              </div>
              <div className="step-item" draggable onDragStart={(e) => handleDragStart(e, { type: 'trigger', trigger: 'email' })}>
                <i className="fas fa-envelope"></i>
                <div><strong>Email Trigger</strong><small>On email received</small></div>
              </div>
            </div>
            
            <div className="step-category">
              <h4><i className="fas fa-cogs"></i> Actions</h4>
              <div className="step-item" draggable onDragStart={(e) => handleDragStart(e, { type: 'action', action: 'sendEmail' })}>
                <i className="fas fa-paper-plane"></i>
                <div><strong>Send Email</strong><small>Send notification email</small></div>
              </div>
              <div className="step-item" draggable onDragStart={(e) => handleDragStart(e, { type: 'action', action: 'createTask' })}>
                <i className="fas fa-tasks"></i>
                <div><strong>Create Task</strong><small>Create a new task</small></div>
              </div>
              <div className="step-item" draggable onDragStart={(e) => handleDragStart(e, { type: 'action', action: 'wait' })}>
                <i className="fas fa-hourglass-half"></i>
                <div><strong>Wait/Delay</strong><small>Wait for specified time</small></div>
              </div>
              <div className="step-item" draggable onDragStart={(e) => handleDragStart(e, { type: 'action', action: 'condition' })}>
                <i className="fas fa-code-branch"></i>
                <div><strong>Condition</strong><small>If/Else logic</small></div>
              </div>
            </div>
            
            <div className="step-category">
              <h4><i className="fas fa-exchange-alt"></i> Connectors</h4>
              <div className="step-item" draggable onDragStart={(e) => handleDragStart(e, { type: 'connector', connector: 'slack' })}>
                <i className="fab fa-slack"></i>
                <div><strong>Slack</strong><small>Send Slack messages</small></div>
              </div>
              <div className="step-item" draggable onDragStart={(e) => handleDragStart(e, { type: 'connector', connector: 'googleSheets' })}>
                <i className="fas fa-table"></i>
                <div><strong>Google Sheets</strong><small>Update spreadsheets</small></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Step Config Modal */}
      {showStepModal && currentStepConfig && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Configure Step</h3>
              <button className="close" onClick={() => setShowStepModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {renderStepConfig(currentStepConfig)}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowStepModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => { setShowStepModal(false); alert('Configuration saved!'); }}>Save Configuration</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Execution Modal */}
      {showExecutionModal && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Test Workflow Execution</h3>
              <button className="close" onClick={() => setShowExecutionModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="execution-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${executionProgress}%` }}></div>
                </div>
                <div className="execution-logs">
                  {executionLogs.map((log, index) => (
                    <div key={index} className="execution-log">{log}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowExecutionModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowAutomation;