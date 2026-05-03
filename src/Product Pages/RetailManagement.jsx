import React, { useState, useEffect } from 'react';
import './RetailManagement.css';

const RetailCollab = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(true);
  const [currentCart, setCurrentCart] = useState([]);
  
  // Auth form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginTenantId, setLoginTenantId] = useState('');
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('manager');
  const [signupStoreName, setSignupStoreName] = useState('');
  const [signupTenantId, setSignupTenantId] = useState('');
  
  // Product form states
  const [productName, setProductName] = useState('');
  const [productSku, setProductSku] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCost, setProductCost] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productCategory, setProductCategory] = useState('Electronics');
  
  // Stock adjustment states
  const [adjustProduct, setAdjustProduct] = useState('');
  const [adjustQuantity, setAdjustQuantity] = useState('');
  const [adjustType, setAdjustType] = useState('add');
  
  // POS states
  const [scanProduct, setScanProduct] = useState('');
  const [saleQuantity, setSaleQuantity] = useState('');
  const [barcodeProduct, setBarcodeProduct] = useState('');
  const [barcodeDisplay, setBarcodeDisplay] = useState('');
  
  // Order states
  const [supplierName, setSupplierName] = useState('');
  const [orderItems, setOrderItems] = useState('');
  const [orderDeliveryDate, setOrderDeliveryDate] = useState('');
  
  // Chat states
  const [teamMsg, setTeamMsg] = useState('');
  const [deptMsg, setDeptMsg] = useState('');
  const [selectedDept, setSelectedDept] = useState('Sales');
  
  // Admin states
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('staff');
  const [newCategory, setNewCategory] = useState('');
  
  const [refresh, setRefresh] = useState(0);
  
  // Initialize database
  useEffect(() => {
    initDB();
  }, []);
  
  const initDB = () => {
    if (!localStorage.getItem('retail_users')) {
      const users = { 
        "manager@megastore.com": { 
          email: "manager@megastore.com", 
          userId: "ret001", 
          name: "Store Manager", 
          password: "manager123", 
          tenantId: "STORE_MEGA01", 
          role: "manager", 
          storeName: "MegaStore" 
        } 
      };
      localStorage.setItem('retail_users', JSON.stringify(users));
    }
    if (!localStorage.getItem('retail_tenants')) {
      const tenants = { 
        "STORE_MEGA01": { 
          id: "STORE_MEGA01", 
          name: "MegaStore", 
          categories: ["Electronics", "Clothing", "Groceries", "Furniture"], 
          members: ["manager@megastore.com"], 
          currency: "USD", 
          taxRate: 0.08 
        } 
      };
      localStorage.setItem('retail_tenants', JSON.stringify(tenants));
    }
    if (!localStorage.getItem('retail_products')) localStorage.setItem('retail_products', JSON.stringify([]));
    if (!localStorage.getItem('retail_inventory')) localStorage.setItem('retail_inventory', JSON.stringify([]));
    if (!localStorage.getItem('retail_sales')) localStorage.setItem('retail_sales', JSON.stringify([]));
    if (!localStorage.getItem('retail_orders')) localStorage.setItem('retail_orders', JSON.stringify([]));
    if (!localStorage.getItem('retail_messages')) localStorage.setItem('retail_messages', JSON.stringify({ team: [], department: {} }));
  };
  
  // Helper functions
  const getUsers = () => JSON.parse(localStorage.getItem('retail_users') || '{}');
  const saveUsers = (u) => localStorage.setItem('retail_users', JSON.stringify(u));
  const getTenants = () => JSON.parse(localStorage.getItem('retail_tenants') || '{}');
  const saveTenants = (t) => localStorage.setItem('retail_tenants', JSON.stringify(t));
  const getProducts = () => JSON.parse(localStorage.getItem('retail_products') || '[]');
  const saveProducts = (p) => localStorage.setItem('retail_products', JSON.stringify(p));
  const getInventory = () => JSON.parse(localStorage.getItem('retail_inventory') || '[]');
  const saveInventory = (i) => localStorage.setItem('retail_inventory', JSON.stringify(i));
  const getSales = () => JSON.parse(localStorage.getItem('retail_sales') || '[]');
  const saveSales = (s) => localStorage.setItem('retail_sales', JSON.stringify(s));
  const getOrders = () => JSON.parse(localStorage.getItem('retail_orders') || '[]');
  const saveOrders = (o) => localStorage.setItem('retail_orders', JSON.stringify(o));
  const getMessages = () => JSON.parse(localStorage.getItem('retail_messages') || '{"team":[], "department":{}}');
  const saveMessages = (m) => localStorage.setItem('retail_messages', JSON.stringify(m));
  
  // Auth functions
  const signup = (email, name, password, role, storeName, existingTenantId) => {
    const users = getUsers();
    if (users[email]) return { success: false, error: "Email exists" };
    let tenantId = existingTenantId;
    const tenants = getTenants();
    let newRole = role;
    if (!tenantId || !tenants[tenantId]) {
      tenantId = "STORE_" + Math.random().toString(36).substring(2, 8).toUpperCase();
      tenants[tenantId] = { 
        id: tenantId, 
        name: storeName, 
        categories: ["Electronics", "Clothing", "Groceries"], 
        members: [email], 
        currency: "USD", 
        taxRate: 0.08 
      };
      newRole = "manager";
      saveTenants(tenants);
    } else {
      if (!tenants[tenantId].members.includes(email)) tenants[tenantId].members.push(email);
      saveTenants(tenants);
    }
    users[email] = { 
      email, 
      userId: "ret_" + Math.random().toString(36).substring(2, 8), 
      name, 
      password, 
      tenantId, 
      role: newRole, 
      storeName: storeName 
    };
    saveUsers(users);
    return { success: true, tenantId, role: newRole };
  };
  
  const login = (email, password, tenantId) => {
    const users = getUsers();
    const user = users[email];
    if (!user) return { success: false, error: "User not found" };
    if (user.password !== password) return { success: false, error: "Wrong password" };
    if (user.tenantId !== tenantId) return { success: false, error: `Store ID mismatch. Your store ID: ${user.tenantId}` };
    return { success: true, user };
  };
  
  // Retail Operations
  const addProduct = (tenantId, name, sku, price, cost, stock, category, addedBy) => {
    const products = getProducts();
    const newProduct = { 
      id: Date.now(), 
      tenantId, 
      name, 
      sku, 
      price: parseFloat(price), 
      cost: parseFloat(cost), 
      category, 
      addedBy, 
      createdAt: new Date().toISOString() 
    };
    products.push(newProduct);
    saveProducts(products);
    
    const inventory = getInventory();
    inventory.push({ 
      productId: newProduct.id, 
      tenantId, 
      quantity: parseInt(stock), 
      lastUpdated: new Date().toISOString() 
    });
    saveInventory(inventory);
  };
  
  const updateStock = (productId, quantityChange, tenantId) => {
    const inventory = getInventory();
    const item = inventory.find(i => i.productId === productId && i.tenantId === tenantId);
    if (item) {
      item.quantity += quantityChange;
    } else {
      inventory.push({ productId, tenantId, quantity: quantityChange, lastUpdated: new Date().toISOString() });
    }
    saveInventory(inventory);
  };
  
  const recordSale = (tenantId, items, total, cashierEmail) => {
    const sales = getSales();
    const sale = { 
      id: Date.now(), 
      tenantId, 
      items, 
      total, 
      cashier: cashierEmail, 
      date: new Date().toISOString() 
    };
    sales.push(sale);
    saveSales(sales);
    
    items.forEach(item => {
      updateStock(item.productId, -item.quantity, tenantId);
    });
  };
  
  const createOrder = (tenantId, supplier, itemsList, deliveryDate, createdBy) => {
    const orders = getOrders();
    orders.push({ 
      id: Date.now(), 
      tenantId, 
      supplier, 
      items: itemsList, 
      deliveryDate, 
      status: "pending", 
      createdBy, 
      createdAt: new Date().toISOString() 
    });
    saveOrders(orders);
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
  
  const addCategory = (tenantId, category) => {
    const tenants = getTenants();
    if (!tenants[tenantId].categories.includes(category)) {
      tenants[tenantId].categories.push(category);
      saveTenants(tenants);
      return true;
    }
    return false;
  };
  
  const getTenantData = () => {
    if (!currentUser) return { allMembers: [], products: [], inventory: [], sales: [], orders: [], categories: [] };
    const tenantId = currentUser.tenantId;
    const users = getUsers();
    const tenants = getTenants();
    const allMembers = (tenants[tenantId]?.members || []).map(email => users[email]).filter(Boolean);
    const products = getProducts().filter(p => p.tenantId === tenantId);
    const inventory = getInventory().filter(i => i.tenantId === tenantId);
    const sales = getSales().filter(s => s.tenantId === tenantId);
    const orders = getOrders().filter(o => o.tenantId === tenantId);
    const categories = tenants[tenantId]?.categories || [];
    return { allMembers, products, inventory, sales, orders, categories, tenantId, tenants };
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
      setCurrentCart([]);
      setActiveTab('dashboard');
    } else {
      alert(res.error);
    }
  };
  
  const handleSignup = () => {
    if (!signupName || !signupEmail || !signupPassword || !signupStoreName) {
      alert('Please fill in all required fields');
      return;
    }
    const res = signup(signupEmail, signupName, signupPassword, signupRole, signupStoreName, signupTenantId);
    if (res.success) {
      alert(`Registration successful! Your Store ID: ${res.tenantId}. Please login.`);
      setShowLogin(true);
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setSignupRole('manager');
      setSignupStoreName('');
      setSignupTenantId('');
    } else {
      alert(res.error);
    }
  };
  
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentCart([]);
    setActiveTab('dashboard');
  };
  
  const handleAddProduct = () => {
    if (!productName || !productSku || !productPrice || !productStock) {
      alert('Please fill in all product fields');
      return;
    }
    addProduct(currentUser.tenantId, productName, productSku, productPrice, productCost, productStock, productCategory, currentUser.email);
    setRefresh(prev => prev + 1);
    setProductName('');
    setProductSku('');
    setProductPrice('');
    setProductCost('');
    setProductStock('');
    alert('Product added successfully!');
  };
  
  const handleAdjustStock = () => {
    if (!adjustProduct || !adjustQuantity) {
      alert('Please select a product and enter quantity');
      return;
    }
    const change = adjustType === 'add' ? parseInt(adjustQuantity) : -parseInt(adjustQuantity);
    updateStock(parseInt(adjustProduct), change, currentUser.tenantId);
    setRefresh(prev => prev + 1);
    setAdjustQuantity('');
    alert('Stock updated successfully!');
  };
  
  const handleAddToCart = () => {
    if (!scanProduct || !saleQuantity) {
      alert('Please scan a product and enter quantity');
      return;
    }
    const products = getProducts().filter(p => p.tenantId === currentUser.tenantId);
    const product = products.find(p => p.sku === scanProduct || p.name.toLowerCase().includes(scanProduct.toLowerCase()));
    if (product) {
      const inventory = getInventory().find(i => i.productId === product.id && i.tenantId === currentUser.tenantId);
      if (inventory && inventory.quantity >= parseInt(saleQuantity)) {
        setCurrentCart(prev => [...prev, { productId: product.id, quantity: parseInt(saleQuantity) }]);
        setScanProduct('');
        setSaleQuantity('');
        alert('Product added to cart!');
      } else {
        alert('Insufficient stock!');
      }
    } else {
      alert("Product not found");
    }
  };
  
  const handleRemoveFromCart = (index) => {
    setCurrentCart(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCheckout = () => {
    if (currentCart.length === 0) {
      alert('Cart is empty');
      return;
    }
    const products = getProducts().filter(p => p.tenantId === currentUser.tenantId);
    const total = currentCart.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (item.quantity * (product?.price || 0));
    }, 0);
    recordSale(currentUser.tenantId, currentCart, total, currentUser.email);
    setCurrentCart([]);
    setRefresh(prev => prev + 1);
    alert(`Sale completed! Total: $${total.toFixed(2)}`);
  };
  
  const handleCreateOrder = () => {
    if (!supplierName || !orderItems || !orderDeliveryDate) {
      alert('Please fill in all order fields');
      return;
    }
    createOrder(currentUser.tenantId, supplierName, orderItems, orderDeliveryDate, currentUser.email);
    setRefresh(prev => prev + 1);
    setSupplierName('');
    setOrderItems('');
    setOrderDeliveryDate('');
    alert('Purchase order created successfully!');
  };
  
  const handleSendTeamMsg = () => {
    if (!teamMsg.trim()) return;
    sendTeamMsg(currentUser.tenantId, currentUser, teamMsg);
    setRefresh(prev => prev + 1);
    setTeamMsg('');
  };
  
  const handleSendDeptMsg = () => {
    if (!deptMsg.trim()) return;
    sendDeptMsg(currentUser.tenantId, selectedDept, currentUser, deptMsg);
    setRefresh(prev => prev + 1);
    setDeptMsg('');
  };
  
  const handleGenerateBarcode = () => {
    if (!barcodeProduct) {
      alert('Please enter a product ID or name');
      return;
    }
    setBarcodeDisplay(`📊 BARCODE: |||||| ${barcodeProduct.toUpperCase()} ||||||`);
  };
  
  const handleAddStaff = () => {
    alert("In production: Invitation system. For demo, use signup with existing Store ID.");
  };
  
  const handleAddCategory = () => {
    if (!newCategory) {
      alert('Please enter a category name');
      return;
    }
    if (addCategory(currentUser.tenantId, newCategory)) {
      setRefresh(prev => prev + 1);
      setNewCategory('');
      alert('Category added successfully!');
    } else {
      alert('Category already exists!');
    }
  };
  
  const handleExportReport = () => {
    alert("Export feature: In production, would generate CSV report.");
  };
  
  const { allMembers, products, inventory, sales, orders, categories, tenantId, tenants } = getTenantData();
  const teamMsgs = getMessages().team.filter(m => m.tenantId === tenantId);
  const deptMsgs = getMessages().department[`${tenantId}:${selectedDept}`] || [];
  const isAdmin = currentUser?.role === 'manager';
  
  // Dashboard calculations
  const todaySales = sales.filter(s => new Date(s.date).toDateString() === new Date().toDateString());
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0);
  const lowStock = inventory.filter(i => i.quantity < 5 && i.quantity > 0);
  const pendingOrders = orders.filter(o => o.status === 'pending');
  
  // Top products calculation
  const productSales = {};
  sales.forEach(s => {
    s.items.forEach(item => {
      productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
    });
  });
  const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
  
  // Cart total
  const cartTotal = currentCart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (item.quantity * (product?.price || 0));
  }, 0);
  
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
      <div className="retailcollab-container">
        <div className="auth-container">
          {showLogin ? (
            <div className="auth-card">
              <div className="retail-icon">🛍️</div>
              <h2>RetailCollab</h2>
              <div className="subtitle">Multi-Store Retail Management System</div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="manager@store.com" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••" />
              </div>
              <div className="input-group">
                <label>Store ID (Tenant ID)</label>
                <input type="text" value={loginTenantId} onChange={(e) => setLoginTenantId(e.target.value)} placeholder="e.g., STORE_RTL01" />
              </div>
              <button className="btn-primary" onClick={handleLogin}>Login →</button>
              <div className="auth-switch">
                New store? <span className="link" onClick={() => setShowLogin(false)}>Register Store</span>
              </div>
              <div className="demo-info">
                <strong>Demo Login:</strong><br />
                manager@megastore.com / manager123 / STORE_MEGA01
              </div>
            </div>
          ) : (
            <div className="auth-card">
              <div className="retail-icon">🏪</div>
              <h2>Register Store</h2>
              <div className="input-group">
                <label>Full Name</label>
                <input type="text" value={signupName} onChange={(e) => setSignupName(e.target.value)} placeholder="John Doe" />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} placeholder="manager@store.com" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="••••" />
              </div>
              <div className="input-group">
                <label>Role</label>
                <select value={signupRole} onChange={(e) => setSignupRole(e.target.value)}>
                  <option value="manager">Store Manager</option>
                  <option value="staff">Sales Staff</option>
                </select>
              </div>
              <div className="input-group">
                <label>Store Name</label>
                <input type="text" value={signupStoreName} onChange={(e) => setSignupStoreName(e.target.value)} placeholder="Your Store Name" />
              </div>
              <div className="input-group">
                <label>Tenant ID (optional)</label>
                <input type="text" value={signupTenantId} onChange={(e) => setSignupTenantId(e.target.value)} placeholder="Leave blank for new store" />
              </div>
              <button className="btn-primary" onClick={handleSignup}>Register Store</button>
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
    <div className="retailcollab-app">
      <div className="app-wrapper">
        <header className="app-header">
          <div className="logo-area">
            <h1>🛍️ RetailCollab | Store Management System</h1>
          </div>
          <div className="user-info">
            <span>{currentUser.name} ({currentUser.role})</span>
            <span className="tenant-badge">🏬 {tenants[tenantId]?.name || tenantId}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        
        <nav className="tabs">
          <button className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
          <button className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
            📦 Inventory
          </button>
          <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            🏷️ Products
          </button>
          <button className={`tab-btn ${activeTab === 'sales' ? 'active' : ''}`} onClick={() => setActiveTab('sales')}>
            💰 Sales & POS
          </button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            📋 Orders
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
              <div className="grid-4col">
                <div className="stat-card">
                  <div className="stat-number">${todayTotal.toFixed(2)}</div>
                  <div>Today's Sales</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{products.length}</div>
                  <div>Products</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{lowStock.length}</div>
                  <div>Low Stock Items</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{pendingOrders.length}</div>
                  <div>Pending Orders</div>
                </div>
              </div>
              <div className="grid-2col" style={{ marginTop: '1.5rem' }}>
                <div className="card">
                  <h3>📈 Recent Sales</h3>
                  {todaySales.length > 0 ? (
                    todaySales.slice(-5).reverse().map(s => (
                      <div key={s.id} className="sale-item">
                        ${s.total.toFixed(2)} - {new Date(s.date).toLocaleTimeString()} ({s.items.length} items)
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">No sales today</div>
                  )}
                </div>
                <div className="card">
                  <h3>⚠️ Low Stock Alerts</h3>
                  {lowStock.map(i => {
                    const product = products.find(p => p.id === i.productId);
                    return (
                      <div key={i.productId} className="inventory-item stock-low">
                        ⚠️ {product?.name || 'Product'} - Only {i.quantity} left!
                      </div>
                    );
                  })}
                  {lowStock.length === 0 && <div className="empty-state">All stock levels are good</div>}
                </div>
              </div>
              <div className="card" style={{ marginTop: '1.5rem' }}>
                <h3>📊 Top Selling Products</h3>
                {topProducts.map(([pid, qty]) => {
                  const product = products.find(p => p.id === parseInt(pid));
                  return (
                    <div key={pid}>
                      {product?.name || 'Product'} - {qty} units sold
                    </div>
                  );
                })}
                {topProducts.length === 0 && <div className="empty-state">No sales data yet</div>}
              </div>
            </div>
          )}
          
          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>🔍 Inventory Overview</h3>
                  <div className="scrollable-list">
                    {inventory.map(i => {
                      const product = products.find(p => p.id === i.productId);
                      const stockClass = i.quantity <= 0 ? 'stock-out' : (i.quantity < 5 ? 'stock-low' : '');
                      return (
                        <div key={i.productId} className={`inventory-item ${stockClass}`}>
                          <strong>{product?.name || 'Unknown'}</strong>
                          <br />
                          SKU: {product?.sku}
                          <br />
                          Stock: {i.quantity} units
                          <br />
                          Price: ${product?.price}
                        </div>
                      );
                    })}
                    {inventory.length === 0 && <div className="empty-state">No inventory items</div>}
                  </div>
                </div>
                <div className="card">
                  <h3>📦 Stock Adjustment</h3>
                  <select value={adjustProduct} onChange={(e) => setAdjustProduct(e.target.value)}>
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                    ))}
                  </select>
                  <input type="number" placeholder="Quantity to add/subtract" value={adjustQuantity} onChange={(e) => setAdjustQuantity(e.target.value)} />
                  <select value={adjustType} onChange={(e) => setAdjustType(e.target.value)}>
                    <option value="add">Add Stock</option>
                    <option value="remove">Remove Stock</option>
                  </select>
                  <button className="action-btn" onClick={handleAdjustStock}>Update Stock</button>
                  <hr style={{ margin: '1rem 0' }} />
                  <h4>🏷️ Generate Barcode</h4>
                  <input type="text" placeholder="Product ID or Name" value={barcodeProduct} onChange={(e) => setBarcodeProduct(e.target.value)} />
                  <button className="action-btn" onClick={handleGenerateBarcode}>Generate Barcode</button>
                  {barcodeDisplay && <div className="barcode-preview" style={{ marginTop: '1rem' }}>{barcodeDisplay}</div>}
                </div>
              </div>
            </div>
          )}
          
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>➕ Add New Product</h3>
                  <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
                  <input type="text" placeholder="SKU (Stock Keeping Unit)" value={productSku} onChange={(e) => setProductSku(e.target.value)} />
                  <input type="number" placeholder="Price" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
                  <input type="number" placeholder="Cost Price" value={productCost} onChange={(e) => setProductCost(e.target.value)} />
                  <input type="number" placeholder="Initial Stock" value={productStock} onChange={(e) => setProductStock(e.target.value)} />
                  <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button className="action-btn" onClick={handleAddProduct}>Add Product</button>
                </div>
                <div className="card">
                  <h3>🏷️ Product Catalog</h3>
                  <div className="scrollable-list">
                    {products.map(p => {
                      const inv = inventory.find(i => i.productId === p.id);
                      return (
                        <div key={p.id} className="product-item">
                          <strong>{p.name}</strong>
                          <br />
                          SKU: {p.sku} | Price: ${p.price} | Stock: {inv?.quantity || 0}
                          <br />
                          Category: {p.category}
                        </div>
                      );
                    })}
                    {products.length === 0 && <div className="empty-state">No products</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Sales Tab */}
          {activeTab === 'sales' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>🛒 Point of Sale</h3>
                  <div className="cart-items" style={{ maxHeight: '300px', overflowY: 'auto', background: '#f8fafc', borderRadius: '1rem', padding: '0.5rem', marginBottom: '1rem' }}>
                    {currentCart.length === 0 ? (
                      <div className="empty-state">Cart is empty</div>
                    ) : (
                      currentCart.map((item, idx) => {
                        const product = products.find(p => p.id === item.productId);
                        return (
                          <div key={idx} className="cart-item">
                            {product?.name} x {item.quantity} = ${(item.quantity * (product?.price || 0)).toFixed(2)}
                            <button className="remove-cart-btn" onClick={() => handleRemoveFromCart(idx)}>Remove</button>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input type="text" placeholder="Scan or enter Product ID/SKU" value={scanProduct} onChange={(e) => setScanProduct(e.target.value)} style={{ flex: 1 }} />
                    <input type="number" placeholder="Qty" value={saleQuantity} onChange={(e) => setSaleQuantity(e.target.value)} style={{ width: '80px' }} />
                    <button className="action-btn" onClick={handleAddToCart}>Add</button>
                  </div>
                  <div><strong>Total: ${cartTotal.toFixed(2)}</strong></div>
                  <button className="action-btn success-btn" onClick={handleCheckout} style={{ width: '100%', marginTop: '1rem' }}>💳 Checkout</button>
                </div>
                <div className="card">
                  <h3>📊 Today's Transactions</h3>
                  {todaySales.map(s => (
                    <div key={s.id} className="sale-item">
                      Sale #{s.id} - ${s.total.toFixed(2)} - {new Date(s.date).toLocaleTimeString()}
                    </div>
                  ))}
                  {todaySales.length === 0 && <div className="empty-state">No transactions today</div>}
                </div>
              </div>
            </div>
          )}
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>📋 Create Purchase Order</h3>
                  <input type="text" placeholder="Supplier Name" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} />
                  <input type="text" placeholder="Items (e.g., ProductID:Qty, ...)" value={orderItems} onChange={(e) => setOrderItems(e.target.value)} />
                  <input type="date" value={orderDeliveryDate} onChange={(e) => setOrderDeliveryDate(e.target.value)} />
                  <button className="action-btn" onClick={handleCreateOrder}>Create Purchase Order</button>
                </div>
                <div className="card">
                  <h3>📦 All Orders</h3>
                  {orders.map(o => (
                    <div key={o.id} className="order-item">
                      <strong>Order #{o.id}</strong>
                      <br />
                      Supplier: {o.supplier}
                      <br />
                      Status: {o.status}
                      <br />
                      Delivery: {o.deliveryDate}
                    </div>
                  ))}
                  {orders.length === 0 && <div className="empty-state">No orders</div>}
                </div>
              </div>
            </div>
          )}
          
          {/* Collaboration Tab */}
          {activeTab === 'collab' && (
            <div className="tab-content active">
              <div className="grid-2col">
                <div className="card">
                  <h3>💬 Store Team Chat</h3>
                  <div className="staff-list" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {allMembers.map(m => (
                      <div key={m.email} className="member-item">
                        {m.name} ({m.role})
                      </div>
                    ))}
                  </div>
                  <div className="chat-input-group">
                    <input type="text" placeholder="Message to team..." value={teamMsg} onChange={(e) => setTeamMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendTeamMsg()} />
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
                  <h3>🏬 Department Chat</h3>
                  <select className="dept-selector" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
                    <option value="Sales">Sales Floor</option>
                    <option value="Inventory">Inventory</option>
                    <option value="Management">Management</option>
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
                    <input type="text" placeholder="Message to department..." value={deptMsg} onChange={(e) => setDeptMsg(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendDeptMsg()} />
                    <button className="send-btn" onClick={handleSendDeptMsg}>Send</button>
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
                  <h3>👥 Staff Management</h3>
                  <div className="staff-management-list">
                    {allMembers.map(m => (
                      <div key={m.email} className="member-item">
                        {m.name} ({m.email}) - {m.role}
                      </div>
                    ))}
                  </div>
                  <div className="add-staff">
                    <input type="email" placeholder="User email to add" value={newStaffEmail} onChange={(e) => setNewStaffEmail(e.target.value)} />
                    <select value={newStaffRole} onChange={(e) => setNewStaffRole(e.target.value)}>
                      <option value="staff">Sales Staff</option>
                      <option value="manager">Manager</option>
                    </select>
                    <button className="action-btn" onClick={handleAddStaff}>Add Staff Member</button>
                  </div>
                </div>
                <div className="card">
                  <h3>📊 Store Analytics</h3>
                  <div className="store-analytics">
                    <div>Total Sales: ${sales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}</div>
                    <div>Total Orders: {orders.length}</div>
                    <div>Total Products: {products.length}</div>
                    <div>Inventory Value: ${inventory.reduce((sum, i) => {
                      const product = products.find(p => p.id === i.productId);
                      return sum + (i.quantity * (product?.cost || 0));
                    }, 0).toFixed(2)}</div>
                  </div>
                  <button className="action-btn" onClick={handleExportReport}>Export Sales Report</button>
                </div>
                <div className="card">
                  <h3>🏷️ Category Management</h3>
                  <div className="category-list">
                    {categories.map(c => (
                      <div key={c} className="category-item">{c}</div>
                    ))}
                  </div>
                  <div className="add-category">
                    <input type="text" placeholder="New Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                    <button className="action-btn" onClick={handleAddCategory}>Add Category</button>
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

export default RetailCollab;