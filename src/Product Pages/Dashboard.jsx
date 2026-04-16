// Dashboard.jsx - Fixed version with error handling
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [customDomain, setCustomDomain] = useState('');
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Get tenant data from localStorage
      const tenantData = JSON.parse(localStorage.getItem('current_tenant'));
      
      if (tenantData && tenantData.id) {
        setTenant(tenantData);
        setSales(tenantData.sales || []);
        setProducts(tenantData.products || []);
        setCustomDomain(tenantData.domain || '');
      } else {
        // No tenant found, redirect to login
        console.error('No tenant data found');
        localStorage.removeItem('tenant_token');
        localStorage.removeItem('current_tenant');
        setIsAuthenticated(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error loading tenant data:', error);
      // Clear invalid data and redirect to login
      localStorage.removeItem('tenant_token');
      localStorage.removeItem('current_tenant');
      setIsAuthenticated(false);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate, setIsAuthenticated]);

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', color: '#667eea' }}></i>
          <h3 style={{ marginTop: '20px' }}>Loading Dashboard...</h3>
        </div>
      </div>
    );
  }

  // Show error if no tenant
  if (!tenant) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#f56565' }}></i>
          <h3 style={{ marginTop: '20px' }}>Session Expired</h3>
          <p>Please login again to continue.</p>
          <button 
            onClick={() => navigate('/login')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const totalSales = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
  const totalOrders = sales.length;
  const totalProducts = products.length;
  
  const recentSales = [...sales].reverse().slice(0, 10);

  // Get last 7 days
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return days;
  };

  // Calculate sales by day
  const getSalesByDay = () => {
    const last7Days = getLast7Days();
    return last7Days.map(day => {
      const daySales = sales.filter(sale => {
        if (!sale.date) return false;
        const saleDate = new Date(sale.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return saleDate === day;
      });
      return daySales.reduce((sum, sale) => sum + (sale.amount || 0), 0);
    });
  };

  const salesByDay = getSalesByDay();
  const maxSale = Math.max(...salesByDay, 1);

  // Calculate product performance
  const getProductPerformance = () => {
    if (!products || products.length === 0) return [];
    return products.map(product => ({
      name: product.title || 'Unnamed Product',
      sales: sales.filter(s => s.productId === product.id).reduce((sum, s) => sum + (s.quantity || 0), 0),
      revenue: sales.filter(s => s.productId === product.id).reduce((sum, s) => sum + (s.amount || 0), 0)
    })).filter(p => p.sales > 0);
  };

  const productPerformance = getProductPerformance();
  const topProducts = [...productPerformance].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  const handleLogout = () => {
    localStorage.removeItem('tenant_token');
    localStorage.removeItem('current_tenant');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleUpdateDomain = () => {
    if (customDomain && customDomain.trim()) {
      const updatedTenant = { ...tenant, domain: customDomain };
      localStorage.setItem('current_tenant', JSON.stringify(updatedTenant));
      
      const tenants = JSON.parse(localStorage.getItem('tenants') || '{}');
      if (tenant.id) {
        tenants[tenant.id] = updatedTenant;
        localStorage.setItem('tenants', JSON.stringify(tenants));
      }
      
      setTenant(updatedTenant);
      setShowDomainModal(false);
      alert(`Domain updated to: ${customDomain}`);
    } else {
      alert('Please enter a valid domain');
    }
  };

  const handleAddSampleSale = () => {
    if (!products || products.length === 0) {
      alert('Please add some products to your store first! Click "Add Sample Product" button.');
      return;
    }

    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const price = parseFloat(randomProduct.price?.replace('$', '') || '49.99');
    const amount = price * quantity;
    
    const newSale = {
      id: Date.now(),
      productId: randomProduct.id,
      productName: randomProduct.title || 'Sample Product',
      amount: amount,
      quantity: quantity,
      date: new Date().toISOString(),
      customerEmail: `customer${Math.floor(Math.random() * 1000)}@example.com`
    };
    
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    
    const updatedTenant = { ...tenant, sales: updatedSales };
    localStorage.setItem('current_tenant', JSON.stringify(updatedTenant));
    
    const tenants = JSON.parse(localStorage.getItem('tenants') || '{}');
    if (tenant.id) {
      tenants[tenant.id] = updatedTenant;
      localStorage.setItem('tenants', JSON.stringify(tenants));
    }
    
    alert('Sample sale added successfully!');
  };

  const handleAddSampleProduct = () => {
    const newProduct = {
      id: Date.now(),
      title: `Product ${(products?.length || 0) + 1}`,
      price: `$${(Math.random() * 100 + 20).toFixed(2)}`,
      icon: 'fa-box',
      description: 'This is a sample product'
    };
    
    const updatedProducts = [...(products || []), newProduct];
    setProducts(updatedProducts);
    
    const updatedTenant = { ...tenant, products: updatedProducts };
    localStorage.setItem('current_tenant', JSON.stringify(updatedTenant));
    
    const tenants = JSON.parse(localStorage.getItem('tenants') || '{}');
    if (tenant.id) {
      tenants[tenant.id] = updatedTenant;
      localStorage.setItem('tenants', JSON.stringify(tenants));
    }
    
    alert('Sample product added! You can now add sales.');
  };

  return (
    <div className="dashboard-container" style={{ padding: '20px', background: '#f7fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div className="dashboard-header" style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h1 style={{ marginBottom: '10px' }}>Welcome back, {tenant?.email?.split('@')[0] || 'User'}!</h1>
            <p><strong>Store:</strong> {tenant?.storeName || 'My Store'}</p>
            <p><strong>Domain:</strong> {tenant?.domain || 'Not set'}</p>
          </div>
          <div>
            <button 
              className="btn-publish" 
              onClick={() => navigate('/builder')}
              style={{ marginRight: '10px', padding: '10px 20px', background: '#9b59b6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              <i className="fas fa-edit"></i> Edit Store
            </button>
            <button className="btn-preview" onClick={() => window.open(`/store/${tenant?.domain}`, '_blank')} style={{ marginRight: '10px', padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              <i className="fas fa-eye"></i> View Store
            </button>
            <button 
              className="btn-crm"
              onClick={() => navigate('/crm')}
              style={{ 
                marginRight: '10px', 
                padding: '10px 20px', 
                background: '#9b59b6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <i className="fas fa-users-cog" style={{ marginRight: '5px' }}></i>
              CRM
            </button>
            <button className="btn-clear" onClick={handleLogout} style={{ padding: '10px 20px', background: '#f56565', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Total Sales</h3>
          <div className="stat-value" style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>${totalSales.toLocaleString()}</div>
        </div>
        <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Total Orders</h3>
          <div className="stat-value" style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{totalOrders}</div>
        </div>
        <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Products</h3>
          <div className="stat-value" style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{totalProducts}</div>
        </div>
        <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Average Order Value</h3>
          <div className="stat-value" style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>
            ${totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Sales Trend Chart */}
        <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '20px' }}>Sales Trend (Last 7 Days)</h3>
          {salesByDay.some(s => s > 0) ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '10px', padding: '20px 10px' }}>
              {salesByDay.map((sale, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    height: `${(sale / maxSale) * 250}px`,
                    width: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '5px 5px 0 0',
                    transition: 'height 0.3s',
                    position: 'relative',
                    cursor: 'pointer'
                  }}>
                    {sale > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#333',
                        color: 'white',
                        padding: '2px 5px',
                        borderRadius: '3px',
                        fontSize: '12px',
                        whiteSpace: 'nowrap'
                      }}>
                        ${sale.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: '10px', fontSize: '12px', textAlign: 'center' }}>
                    {getLast7Days()[index]}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <i className="fas fa-chart-line" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
              <p>No sales data available. Click "Add Sample Sale" to see charts!</p>
            </div>
          )}
        </div>

        {/* Product Performance */}
        <div className="stat-card" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '20px' }}>Top Products</h3>
          {topProducts.length > 0 ? (
            <div>
              {topProducts.map((product, index) => {
                const maxRevenue = Math.max(...topProducts.map(p => p.revenue), 1);
                const percentage = (product.revenue / maxRevenue) * 100;
                return (
                  <div key={index} style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span><strong>{product.name}</strong></span>
                      <span>${product.revenue.toFixed(2)}</span>
                    </div>
                    <div style={{ background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '30px',
                        background: `linear-gradient(135deg, #667eea ${percentage}%, #764ba2 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 10px',
                        color: 'white',
                        fontSize: '14px'
                      }}>
                        {product.sales} units sold
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <i className="fas fa-chart-pie" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
              <p>No product sales data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="sales-table" style={{ background: 'white', borderRadius: '10px', padding: '20px', marginBottom: '30px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <h3>Recent Orders</h3>
          <div>
            <button className="btn-save" onClick={handleAddSampleProduct} style={{ marginRight: '10px', padding: '10px 20px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              <i className="fas fa-plus"></i> Add Sample Product
            </button>
            <button className="btn-save" onClick={handleAddSampleSale} style={{ padding: '10px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              <i className="fas fa-shopping-cart"></i> Add Sample Sale
            </button>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Order ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Quantity</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map(sale => (
                <tr key={sale.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px' }}>#{sale.id}</td>
                  <td style={{ padding: '12px' }}>{sale.productName}</td>
                  <td style={{ padding: '12px' }}>{sale.quantity}</td>
                  <td style={{ padding: '12px' }}>${sale.amount.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>{sale.customerEmail}</td>
                  <td style={{ padding: '12px' }}>{new Date(sale.date).toLocaleDateString()}</td>
                </tr>
              ))}
              {recentSales.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    <i className="fas fa-shopping-cart" style={{ fontSize: '48px', marginBottom: '10px' }}></i>
                    <p>No orders yet. Click "Add Sample Product" then "Add Sample Sale" to see orders!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Domain Settings */}
      <div className="domain-settings" style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginBottom: '10px' }}>Domain Settings</h3>
        <p style={{ marginBottom: '15px' }}>Connect your custom domain to your store</p>
        <div className="domain-input" style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="e.g., mystore.com"
            style={{ flex: 1, padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px' }}
          />
          <button className="btn-save" onClick={() => setShowDomainModal(true)} style={{ padding: '10px 20px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Connect Domain
          </button>
        </div>
        <small style={{ color: '#666', display: 'block', marginTop: '10px' }}>
          Point your domain's A record to: 192.168.1.1 or CNAME to: store.myecommercestore.com
        </small>
      </div>

      {/* Domain Modal */}
      {showDomainModal && (
        <div className="modal" style={{ display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content" style={{ background: 'white', padding: '30px', borderRadius: '10px', maxWidth: '500px', width: '90%' }}>
            <h3 style={{ marginBottom: '15px' }}>Connect Custom Domain</h3>
            <p><strong>Domain:</strong> {customDomain}</p>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              To connect your domain, please add the following DNS records:
            </p>
            <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
              <li>Type: A Record</li>
              <li>Name: @</li>
              <li>Value: 192.168.1.1</li>
              <li>TTL: Automatic</li>
            </ul>
            <div className="modal-buttons" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="save-modal" onClick={handleUpdateDomain} style={{ background: '#48bb78', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Confirm
              </button>
              <button className="cancel-modal" onClick={() => setShowDomainModal(false)} style={{ background: '#a0aec0', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;