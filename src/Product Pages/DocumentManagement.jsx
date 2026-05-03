import React, { useState, useEffect } from 'react';
import './DocumentManagement.css';

const DocuVault = () => {
  const [currentTenant, setCurrentTenant] = useState('acme');
  const [currentModule, setCurrentModule] = useState('myDocs');
  const [currentFolderStack, setCurrentFolderStack] = useState([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareItemId, setShareItemId] = useState('');
  const [shareItemType, setShareItemType] = useState('');
  const [folderName, setFolderName] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('pdf');
  const [fileDesc, setFileDesc] = useState('');
  const [shareWithTenant, setShareWithTenant] = useState('acme');

  // Initial tenant data structure
  const [tenantStorage, setTenantStorage] = useState({
    acme: {
      name: "Acme Corp",
      folders: [
        { id: "root_acme", name: "Root", parentId: null, isRoot: true },
        { id: "f1", name: "Contracts", parentId: "root_acme" },
        { id: "f2", name: "Invoices", parentId: "root_acme" }
      ],
      files: [
        { id: "file1", name: "Service Agreement.pdf", type: "pdf", parentFolderId: "f1", owner: "acme", size: 1250, description: "2026 agreement", createdAt: "2026-04-01", sharedWith: [] },
        { id: "file2", name: "Q1 Report.docx", type: "docx", parentFolderId: "root_acme", owner: "acme", size: 840, description: "Financials", createdAt: "2026-03-28", sharedWith: ["techwave"] }
      ],
      sharedItems: []
    },
    techwave: {
      name: "TechWave Solutions",
      folders: [
        { id: "root_tech", name: "Root", parentId: null, isRoot: true },
        { id: "tf1", name: "Technical Docs", parentId: "root_tech" }
      ],
      files: [
        { id: "tfile1", name: "API Spec.pdf", type: "pdf", parentFolderId: "tf1", owner: "techwave", size: 2300, description: "OpenAPI", createdAt: "2026-03-30", sharedWith: ["acme"] }
      ],
      sharedItems: []
    },
    greenleaf: {
      name: "GreenLeaf Energy",
      folders: [
        { id: "root_green", name: "Root", parentId: null, isRoot: true },
        { id: "gf1", name: "Sustainability Reports", parentId: "root_green" }
      ],
      files: [
        { id: "gfile1", name: "Carbon Footprint.pdf", type: "pdf", parentFolderId: "gf1", owner: "greenleaf", size: 3400, description: "NetZero", createdAt: "2026-03-25", sharedWith: [] }
      ],
      sharedItems: []
    }
  });

  // Rebuild shared items across tenants
  const rebuildSharedItems = (storage) => {
    const newStorage = { ...storage };
    for (let tenantId in newStorage) {
      const tenant = newStorage[tenantId];
      tenant.sharedItems = [];
      for (let otherId in newStorage) {
        if (otherId === tenantId) continue;
        const otherTenant = newStorage[otherId];
        otherTenant.files.forEach(file => {
          if (file.sharedWith && file.sharedWith.includes(tenantId)) {
            tenant.sharedItems.push({
              id: file.id,
              name: file.name,
              owner: otherTenant.name,
              sharedDate: file.createdAt,
              type: file.type,
              originalTenant: otherId
            });
          }
        });
      }
    }
    return newStorage;
  };

  // Helper functions
  const getRootFolderId = () => {
    const folders = tenantStorage[currentTenant].folders;
    const root = folders.find(f => f.isRoot === true && f.parentId === null);
    return root ? root.id : null;
  };

  const getCurrentFolderObject = () => {
    const currentId = currentFolderStack.length ? currentFolderStack[currentFolderStack.length - 1] : getRootFolderId();
    return tenantStorage[currentTenant].folders.find(f => f.id === currentId);
  };

  const getChildrenFolders = () => {
    const currentId = currentFolderStack.length ? currentFolderStack[currentFolderStack.length - 1] : getRootFolderId();
    return tenantStorage[currentTenant].folders.filter(f => f.parentId === currentId && !f.isRoot);
  };

  const getFilesInCurrentFolder = () => {
    const currentId = currentFolderStack.length ? currentFolderStack[currentFolderStack.length - 1] : getRootFolderId();
    return tenantStorage[currentTenant].files.filter(f => f.parentFolderId === currentId);
  };

  const addRecentActivity = (fileId) => {
    const recentKey = `recent_${currentTenant}`;
    let recent = JSON.parse(localStorage.getItem(recentKey) || "[]");
    recent = [fileId, ...recent.filter(id => id !== fileId)].slice(0, 10);
    localStorage.setItem(recentKey, JSON.stringify(recent));
  };

  const getRecentFiles = () => {
    const recentKey = `recent_${currentTenant}`;
    const recentIds = JSON.parse(localStorage.getItem(recentKey) || "[]");
    const allFiles = tenantStorage[currentTenant].files;
    return recentIds.map(id => allFiles.find(f => f.id === id)).filter(f => f);
  };

  // Render functions
  const renderMyDocuments = () => {
    const folders = getChildrenFolders();
    const files = getFilesInCurrentFolder();
    const currentFolder = getCurrentFolderObject();
    
    return { folders, files, currentFolder };
  };

  const renderSharedSection = () => {
    return tenantStorage[currentTenant].sharedItems;
  };

  const renderTenantStats = () => {
    const files = tenantStorage[currentTenant].files;
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    return { totalSize, totalDocs: files.length };
  };

  // Event handlers
  const handleSwitchTenant = (tenantId) => {
    setCurrentTenant(tenantId);
    setCurrentFolderStack([]);
  };

  const handleCreateFolder = () => {
    if (!folderName.trim()) return;
    const parentId = currentFolderStack.length ? currentFolderStack[currentFolderStack.length - 1] : getRootFolderId();
    const newId = "fold_" + Date.now();
    const newStorage = { ...tenantStorage };
    newStorage[currentTenant].folders.push({ 
      id: newId, 
      name: folderName, 
      parentId: parentId, 
      isRoot: false 
    });
    setTenantStorage(rebuildSharedItems(newStorage));
    setFolderName('');
    setShowFolderModal(false);
  };

  const handleUploadFile = () => {
    if (!fileName.trim()) return;
    const parentId = currentFolderStack.length ? currentFolderStack[currentFolderStack.length - 1] : getRootFolderId();
    const newFile = {
      id: "file_" + Date.now(),
      name: fileName,
      type: fileType,
      parentFolderId: parentId,
      owner: currentTenant,
      size: Math.floor(Math.random() * 5000) + 500,
      description: fileDesc,
      createdAt: new Date().toISOString().slice(0, 10),
      sharedWith: []
    };
    const newStorage = { ...tenantStorage };
    newStorage[currentTenant].files.push(newFile);
    setTenantStorage(rebuildSharedItems(newStorage));
    setFileName('');
    setFileDesc('');
    setShowUploadModal(false);
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm("Delete this file?")) {
      const newStorage = { ...tenantStorage };
      newStorage[currentTenant].files = newStorage[currentTenant].files.filter(f => f.id !== fileId);
      setTenantStorage(rebuildSharedItems(newStorage));
    }
  };

  const handleDeleteFolder = (folderId) => {
    if (window.confirm("Delete folder and all its contents?")) {
      const newStorage = { ...tenantStorage };
      newStorage[currentTenant].folders = newStorage[currentTenant].folders.filter(f => f.id !== folderId);
      newStorage[currentTenant].files = newStorage[currentTenant].files.filter(f => f.parentFolderId !== folderId);
      setTenantStorage(rebuildSharedItems(newStorage));
    }
  };

  const handleShareItem = () => {
    const newStorage = { ...tenantStorage };
    const file = newStorage[currentTenant].files.find(f => f.id === shareItemId);
    if (file && !file.sharedWith.includes(shareWithTenant)) {
      file.sharedWith.push(shareWithTenant);
      setTenantStorage(rebuildSharedItems(newStorage));
      alert(`Document shared with ${shareWithTenant}`);
    }
    setShowShareModal(false);
    setShareItemId('');
  };

  const handleDownloadFile = (fileId) => {
    alert(`Downloading file: ${fileId}`);
    addRecentActivity(fileId);
  };

  const handleNavigateToFolder = (folderId) => {
    if (folderId === 'root') {
      setCurrentFolderStack([]);
    } else {
      setCurrentFolderStack([folderId]);
    }
  };

  const handleResetTenant = () => {
    if (window.confirm("WARNING: This will delete all custom folders and files for this tenant. Root remains.")) {
      const rootId = getRootFolderId();
      const newStorage = { ...tenantStorage };
      newStorage[currentTenant].folders = newStorage[currentTenant].folders.filter(f => f.isRoot);
      newStorage[currentTenant].files = [];
      setTenantStorage(rebuildSharedItems(newStorage));
      setCurrentFolderStack([]);
    }
  };

  const { folders, files, currentFolder } = renderMyDocuments();
  const sharedItems = renderSharedSection();
  const { totalSize, totalDocs } = renderTenantStats();
  const recentFiles = getRecentFiles();

  // Breadcrumb generation
  const getBreadcrumb = () => {
    const breadcrumb = [{ id: 'root', name: 'Root' }];
    if (currentFolder && !currentFolder.isRoot) {
      let ptr = currentFolder;
      const path = [];
      while (ptr && !ptr.isRoot) {
        path.unshift(ptr);
        ptr = tenantStorage[currentTenant].folders.find(f => f.id === ptr.parentId);
      }
      breadcrumb.push(...path);
    }
    return breadcrumb;
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="dms-app">
      {/* Header */}
      <header className="saas-topbar">
        <div className="logo-area">
          <i className="fas fa-folder-tree"></i>
          <h1>DocuVault <span>| Multi-Tenant DMS</span></h1>
        </div>
        <div className="tenant-switch-panel">
          <i className="fas fa-building"></i>
          <select value={currentTenant} onChange={(e) => handleSwitchTenant(e.target.value)}>
            <option value="acme">Acme Corp (USA)</option>
            <option value="techwave">TechWave Solutions (Germany)</option>
            <option value="greenleaf">GreenLeaf Energy (UK)</option>
          </select>
          <span className="tenant-badge">🏢 {tenantStorage[currentTenant]?.name}</span>
        </div>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className="sidebar-modules">
          <div className={`module-item ${currentModule === 'myDocs' ? 'active' : ''}`} onClick={() => setCurrentModule('myDocs')}>
            <i className="fas fa-folder-open"></i> My Documents
          </div>
          <div className={`module-item ${currentModule === 'shared' ? 'active' : ''}`} onClick={() => setCurrentModule('shared')}>
            <i className="fas fa-share-alt"></i> Shared with Me
          </div>
          <div className={`module-item ${currentModule === 'recent' ? 'active' : ''}`} onClick={() => setCurrentModule('recent')}>
            <i className="fas fa-clock"></i> Recent Files
          </div>
          <div className={`module-item ${currentModule === 'tenantsettings' ? 'active' : ''}`} onClick={() => setCurrentModule('tenantsettings')}>
            <i className="fas fa-cog"></i> Tenant Storage
          </div>
        </aside>

        {/* Content Area */}
        <div className="content-area">
          {/* My Documents Section */}
          {currentModule === 'myDocs' && (
            <div className="doc-section active-doc-section">
              <div className="section-header">
                <h2><i className="fas fa-cloud-upload-alt"></i> Document Library</h2>
                <div className="header-buttons">
                  <button className="btn-outline" onClick={() => setShowUploadModal(true)}>
                    <i className="fas fa-upload"></i> Upload File
                  </button>
                  <button className="btn-primary" onClick={() => setShowFolderModal(true)}>
                    <i className="fas fa-plus-circle"></i> New Folder
                  </button>
                </div>
              </div>

              {/* Breadcrumb */}
              <div className="breadcrumb">
                {breadcrumb.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && <i className="fas fa-chevron-right"></i>}
                    <span onClick={() => handleNavigateToFolder(item.id)}>
                      {item.id === 'root' ? <><i className="fas fa-home"></i> Root</> : item.name}
                    </span>
                  </React.Fragment>
                ))}
              </div>

              {/* Folders Grid */}
              {folders.length > 0 && (
                <>
                  <h3 className="section-subtitle"><i className="fas fa-folder"></i> Folders</h3>
                  <div className="folder-grid">
                    {folders.map(folder => (
                      <div key={folder.id} className="folder-card" onClick={() => handleNavigateToFolder(folder.id)}>
                        <i className="fas fa-folder"></i>
                        <div className="folder-info">
                          <div className="folder-name">{folder.name}</div>
                          <div className="folder-meta">Folder</div>
                        </div>
                        <div className="folder-actions">
                          <i className="fas fa-share-alt" onClick={(e) => { e.stopPropagation(); setShareItemId(folder.id); setShowShareModal(true); }}></i>
                          <i className="fas fa-trash" onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Files Grid */}
              {files.length > 0 && (
                <>
                  <h3 className="section-subtitle"><i className="fas fa-file"></i> Files</h3>
                  <div className="file-grid">
                    {files.map(file => (
                      <div key={file.id} className="file-card">
                        <i className={`fas ${file.type === 'pdf' ? 'fa-file-pdf' : file.type === 'docx' ? 'fa-file-word' : 'fa-file-alt'} file-icon`}></i>
                        <div className="file-info">
                          <div className="file-name">{file.name}</div>
                          <div className="file-meta">{(file.size / 1024).toFixed(1)} KB • {file.createdAt}</div>
                        </div>
                        <div className="file-actions">
                          <i className="fas fa-download" onClick={() => handleDownloadFile(file.id)}></i>
                          <i className="fas fa-share-alt" onClick={() => { setShareItemId(file.id); setShowShareModal(true); }}></i>
                          <i className="fas fa-trash" onClick={() => handleDeleteFile(file.id)}></i>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {folders.length === 0 && files.length === 0 && (
                <div className="empty-state">
                  <i className="fas fa-folder-open"></i>
                  <p>No documents yet. Create a folder or upload a file to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Shared Section */}
          {currentModule === 'shared' && (
            <div className="doc-section active-doc-section">
              <div className="section-header">
                <h2><i className="fas fa-users"></i> Shared Documents</h2>
              </div>
              {sharedItems.length > 0 ? (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Shared Date</th>
                        <th>Type</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sharedItems.map(item => (
                        <tr key={item.id}>
                          <td><i className="fas fa-share"></i> {item.name}</td>
                          <td>{item.owner}</td>
                          <td>{item.sharedDate}</td>
                          <td><span className="badge">{item.type}</span></td>
                          <td>
                            <button className="btn-outline small" onClick={() => handleDownloadFile(item.id)}>
                              <i className="fas fa-download"></i> Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-share-alt"></i>
                  <p>No documents shared with you yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Recent Section */}
          {currentModule === 'recent' && (
            <div className="doc-section active-doc-section">
              <div className="section-header">
                <h2><i className="fas fa-history"></i> Recently Accessed</h2>
              </div>
              {recentFiles.length > 0 ? (
                <div className="file-grid">
                  {recentFiles.map(file => file && (
                    <div key={file.id} className="file-card">
                      <i className={`fas ${file.type === 'pdf' ? 'fa-file-pdf' : file.type === 'docx' ? 'fa-file-word' : 'fa-file-alt'} file-icon`}></i>
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-meta">Accessed recently</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-clock"></i>
                  <p>No recently accessed files.</p>
                </div>
              )}
            </div>
          )}

          {/* Tenant Settings Section */}
          {currentModule === 'tenantsettings' && (
            <div className="doc-section active-doc-section">
              <div className="section-header">
                <h2><i className="fas fa-database"></i> Tenant Storage Configuration</h2>
              </div>
              <div className="stats-row">
                <div className="stat-card">
                  <i className="fas fa-database"></i>
                  <div className="stat-info">
                    <h3>Storage Used</h3>
                    <p>{(totalSize / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="stat-card">
                  <i className="fas fa-file-alt"></i>
                  <div className="stat-info">
                    <h3>Total Documents</h3>
                    <p>{totalDocs}</p>
                  </div>
                </div>
              </div>
              <div className="settings-card">
                <h4><i className="fas fa-cog"></i> Tenant Policies</h4>
                <button className="btn-danger" onClick={handleResetTenant}>
                  <i className="fas fa-trash-alt"></i> Reset Tenant Library (Clean)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div className="modal" onClick={() => setShowFolderModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-folder-plus"></i> Create Folder</h3>
              <button className="close-modal" onClick={() => setShowFolderModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Folder Name</label>
                <input 
                  type="text" 
                  value={folderName} 
                  onChange={(e) => setFolderName(e.target.value)} 
                  placeholder="e.g., Contracts"
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowFolderModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreateFolder}>Create Folder</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="modal" onClick={() => setShowUploadModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-cloud-upload-alt"></i> Upload Document</h3>
              <button className="close-modal" onClick={() => setShowUploadModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>File Name</label>
                <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="document.pdf" />
              </div>
              <div className="form-group">
                <label>File Type</label>
                <select value={fileType} onChange={(e) => setFileType(e.target.value)}>
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                  <option value="xlsx">XLSX</option>
                  <option value="txt">TXT</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea value={fileDesc} onChange={(e) => setFileDesc(e.target.value)} rows="3" placeholder="Add a description..."></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleUploadFile}>Upload File</button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal" onClick={() => setShowShareModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-share-alt"></i> Share Document</h3>
              <button className="close-modal" onClick={() => setShowShareModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Share with Tenant</label>
                <select value={shareWithTenant} onChange={(e) => setShareWithTenant(e.target.value)}>
                  <option value="acme">Acme Corp</option>
                  <option value="techwave">TechWave Solutions</option>
                  <option value="greenleaf">GreenLeaf Energy</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowShareModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleShareItem}>Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocuVault;