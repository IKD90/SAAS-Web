import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Builder = () => {
  const navigate = useNavigate();
  const [elements, setElements] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditElement, setCurrentEditElement] = useState(null);
  const [editData, setEditData] = useState({});
  const canvasRef = useRef(null);

  useEffect(() => {
    loadSavedWebsite();
  }, []);

  const loadSavedWebsite = () => {
    const tenant = JSON.parse(localStorage.getItem('current_tenant') || '{}');
    if (tenant?.websiteData) {
      setElements(tenant.websiteData);
    }
  };

  const saveWebsite = () => {
    const tenant = JSON.parse(localStorage.getItem('current_tenant') || '{}');
    if (tenant.id) {
      tenant.websiteData = elements;
      localStorage.setItem('current_tenant', JSON.stringify(tenant));
      
      const tenants = JSON.parse(localStorage.getItem('tenants') || '{}');
      tenants[tenant.id] = tenant;
      localStorage.setItem('tenants', JSON.stringify(tenants));
      
      alert('Website saved successfully!');
    }
  };

  const clearCanvas = () => {
    if (confirm('Are you sure you want to clear everything?')) {
      setElements([]);
      saveWebsite();
    }
  };

  const exportWebsite = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${JSON.parse(localStorage.getItem('current_tenant') || '{}').storeName || 'store'}-ecommerce.html`;
    link.click();
  };

  const publishWebsite = () => {
    saveWebsite();
    const tenant = JSON.parse(localStorage.getItem('current_tenant') || '{}');
    alert(`Website published! View at: ${window.location.origin}/store/${tenant.domain}`);
  };

  const generateHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${JSON.parse(localStorage.getItem('current_tenant') || '{}').storeName || 'My Store'}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; }
        .product-card { border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; transition: transform 0.3s; background: white; }
        .product-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .product-image { width: 100%; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 48px; }
        .product-info { padding: 15px; }
        .product-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .product-price { color: #667eea; font-size: 20px; font-weight: bold; margin: 10px 0; }
        .add-to-cart { background: #667eea; color: white; border: none; padding: 10px; width: 100%; border-radius: 5px; cursor: pointer; transition: background 0.3s; }
        .add-to-cart:hover { background: #5a67d8; }
        .hero-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 20px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
        .hero-section h1 { font-size: 3rem; margin-bottom: 20px; }
        .hero-section button { background: white; color: #667eea; border: none; padding: 12px 30px; border-radius: 5px; font-size: 16px; cursor: pointer; }
        .feature-box { text-align: center; padding: 30px; border: 1px solid #e2e8f0; border-radius: 10px; }
        .feature-box i { font-size: 48px; color: #667eea; margin-bottom: 15px; }
        .testimonial-section { background: #f7fafc; padding: 30px; border-radius: 10px; text-align: center; }
        .testimonial-section i { font-size: 36px; color: #667eea; opacity: 0.5; margin-bottom: 15px; }
        .newsletter-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 10px; text-align: center; }
        .newsletter-section input { padding: 12px; border-radius: 5px; border: none; width: 250px; margin-right: 10px; }
        .newsletter-section button { background: white; color: #667eea; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; }
        .footer-section { background: #2d3748; color: white; padding: 40px 20px; text-align: center; border-radius: 10px; }
        button { cursor: pointer; transition: all 0.3s; }
        @media (max-width: 768px) { .product-grid { grid-template-columns: 1fr; } .hero-section h1 { font-size: 2rem; } }
    </style>
</head>
<body>
    <div class="container">
        ${elements.map(element => renderElementForExport(element)).join('')}
    </div>
    <script>
        function addToCart(productId, productName, price) {
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.push({ id: productId, name: productName, price: price, timestamp: new Date().toISOString() });
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Added to cart!');
        }
    </script>
</body>
</html>`;
  };

  const renderElementForExport = (element) => {
    // Same logic as renderElement but returns HTML string
    switch (element.type) {
      case 'header':
        return `<div style="margin-bottom: 30px; text-align: center;"><h1 style="font-size: 2.5rem; margin-bottom: 10px;">${element.title || 'Our Store'}</h1><p style="font-size: 1.2rem; color: #666;">${element.subtitle || 'Welcome'}</p></div>`;
      case 'hero':
        return `<div class="hero-section"><h1>${element.title || 'Special Offer!'}</h1><p style="margin: 20px 0; font-size: 1.2rem;">${element.subtitle || 'Great prices'}</p><button onclick="scrollToProducts()">Shop Now</button></div><script>function scrollToProducts(){document.getElementById('products-section').scrollIntoView({behavior: 'smooth'});}</script>`;
      case 'products':
        return `<h2 style="margin-bottom: 30px; font-size: 2rem; text-align: center;">${element.title || 'Products'}</h2><div class="product-grid" id="products-section">${element.products?.map(p => `<div class="product-card"><div class="product-image"><i class="fas ${p.icon}"></i></div><div class="product-info"><h3 class="product-title">${p.title}</h3><div class="product-price">${p.price}</div><button class="add-to-cart" onclick="addToCart('${p.id}', '${p.title}', '${p.price}')">Add to Cart</button></div></div>`).join('') || ''}</div>`;
      case 'feature':
        return `<div class="feature-box"><i class="fas ${element.icon || 'fa-truck'}"></i><h3>${element.title || 'Free Shipping'}</h3><p>${element.description || 'On orders over $50'}</p></div>`;
      case 'testimonial':
        return `<div class="testimonial-section"><i class="fas fa-quote-left"></i><p style="font-size: 18px; margin: 20px 0;">"${element.quote || 'Great service!'}"</p><h4>- ${element.author || 'Customer'}</h4></div>`;
      case 'newsletter':
        return `<div class="newsletter-section"><h3>${element.title || 'Newsletter'}</h3><p style="margin: 15px 0;">${element.subtitle || 'Get updates'}</p><div style="display: flex; justify-content: center; gap: 10px;"><input type="email" placeholder="Your email"><button>Subscribe</button></div></div>`;
      case 'footer':
        return `<div class="footer-section"><p>© ${new Date().getFullYear()} ${element.storeName || 'Store'}. All rights reserved.</p><div><i class="fab fa-facebook" style="margin: 0 10px; cursor: pointer;"></i><i class="fab fa-twitter" style="margin: 0 10px; cursor: pointer;"></i><i class="fab fa-instagram" style="margin: 0 10px; cursor: pointer;"></i></div></div>`;
      default:
        return '';
    }
  };

  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('text/plain', type);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    addElement(type);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const addElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      ...getDefaultData(type)
    };
    setElements(prev => [...prev, newElement]);
  };

  const getDefaultData = (type) => {
    const defaults = {
      header: { title: 'My Awesome Store', subtitle: 'Your one-stop shop for amazing products' },
      hero: { title: 'Big Summer Sale!', subtitle: 'Up to 50% off on selected items' },
      products: {
        title: 'Featured Products',
        products: [
          { id: Date.now() + 1, title: 'Premium Product', price: '$49.99', icon: 'fa-box' },
          { id: Date.now() + 2, title: 'Deluxe Item', price: '$79.99', icon: 'fa-gem' },
          { id: Date.now() + 3, title: 'Standard Package', price: '$29.99', icon: 'fa-tag' }
        ]
      },
      feature: { title: 'Free Shipping', description: 'On orders over $50', icon: 'fa-truck' },
      testimonial: { quote: 'Amazing products and great service!', author: 'Happy Customer' },
      newsletter: { title: 'Subscribe to Our Newsletter', subtitle: 'Get the latest updates and offers' },
      footer: { storeName: 'My Store' }
    };
    return defaults[type] || {};
  };

  const editElement = (element) => {
    setCurrentEditElement(element);
    setEditData({ ...element });
    setShowEditModal(true);
  };

  const deleteElement = (id) => {
    if (confirm('Delete this element?')) {
      setElements(prev => prev.filter(el => el.id !== id));
      saveWebsite();
    }
  };

  const saveElementEdit = () => {
    setElements(prev => prev.map(el => el.id === currentEditElement.id ? { ...editData } : el));
    setShowEditModal(false);
    setCurrentEditElement(null);
    setEditData({});
    saveWebsite();
  };

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...(editData.products || [])];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setEditData({ ...editData, products: updatedProducts });
  };

  const addProduct = () => {
    const updatedProducts = [...(editData.products || []), { id: Date.now(), title: 'New Product', price: '$19.99', icon: 'fa-box' }];
    setEditData({ ...editData, products: updatedProducts });
  };

  const removeProduct = (index) => {
    const updatedProducts = (editData.products || []).filter((_, i) => i !== index);
    setEditData({ ...editData, products: updatedProducts });
  };

  const dragItems = [
    { type: 'header', icon: 'fa-heading', label: 'Header Section' },
    { type: 'hero', icon: 'fa-image', label: 'Hero Banner' },
    { type: 'products', icon: 'fa-boxes', label: 'Products Grid' },
    { type: 'feature', icon: 'fa-star', label: 'Feature Box' },
    { type: 'testimonial', icon: 'fa-quote-left', label: 'Testimonial' },
    { type: 'newsletter', icon: 'fa-envelope', label: 'Newsletter Signup' },
    { type: 'footer', icon: 'fa-footer', label: 'Footer' }
  ];

  const renderElement = (element) => {
    switch (element.type) {
      case 'header':
        return (
          <div className="header-content">
            <h1>{element.title}</h1>
            <p>{element.subtitle}</p>
          </div>
        );
      case 'hero':
        return (
          <div className="hero-section">
            <h1>{element.title}</h1>
            <p>{element.subtitle}</p>
            <button className="add-to-cart">Shop Now</button>
          </div>
        );
      case 'products':
        return (
          <div>
            <h2>{element.title}</h2>
            <div className="product-grid">
              {element.products?.map((product, idx) => (
                <div key={product.id || idx} className="product-card">
                  <div className="product-image">
                    <i className={`fas ${product.icon}`}></i>
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <div className="product-price">{product.price}</div>
                    <button className="add-to-cart">Add to Cart</button>
                  </div>
                </div>
              )) || null}
            </div>
          </div>
        );
      case 'feature':
        return (
          <div className="feature-box">
            <i className={`fas ${element.icon}`}></i>
            <h3>{element.title}</h3>
            <p>{element.description}</p>
          </div>
        );
      case 'testimonial':
        return (
          <div className="testimonial-section">
            <i className="fas fa-quote-left"></i>
            <p>"{element.quote}"</p>
            <h4>- {element.author}</h4>
          </div>
        );
      case 'newsletter':
        return (
          <div className="newsletter-section">
            <h3>{element.title}</h3>
            <p>{element.subtitle}</p>
            <div>
              <input type="email" placeholder="Enter your email" />
              <button>Subscribe</button>
            </div>
          </div>
        );
      case 'footer':
        return (
          <div className="footer-section">
            <p>© {new Date().getFullYear()} {element.storeName}. All rights reserved.</p>
            <div>
              <i className="fab fa-facebook"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-instagram"></i>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="builder-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3><i className="fas fa-drag-drop"></i> Drag & Drop Elements</h3>
        {dragItems.map((item, index) => (
          <div
            key={index}
            className="drag-item"
            draggable
            onDragStart={(e) => handleDragStart(e, item.type)}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="toolbar">
          <div>
            <i className="fas fa-palette"></i> E-Commerce Builder
          </div>
          <div>
            <button className="btn-preview" onClick={() => {
              const tenant = JSON.parse(localStorage.getItem('current_tenant') || '{}');
              window.open(`/store/${tenant.domain}`, '_blank');
            }}>
              <i className="fas fa-eye"></i> Preview
            </button>
            <button className="btn-save" onClick={saveWebsite}>
              <i className="fas fa-save"></i> Save
            </button>
            <button className="btn-export" onClick={exportWebsite}>
              <i className="fas fa-code"></i> Export HTML
            </button>
            <button className="btn-publish" onClick={publishWebsite}>
              <i className="fas fa-globe"></i> Publish
            </button>
            <button className="btn-clear" onClick={clearCanvas}>
              <i className="fas fa-trash"></i> Clear All
            </button>
            <button className="btn-preview" onClick={() => navigate('/dashboard')}>
              <i className="fas fa-chart-line"></i> Dashboard
            </button>
          </div>
        </div>

        <div className="canvas" onDrop={handleDrop} onDragOver={handleDragOver}>
          <div id="website-canvas">
            {elements.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-drag-drop"></i>
                <h3>Drag and drop elements here to build your e-commerce website</h3>
                <p>Start by dragging elements from the left sidebar</p>
              </div>
            ) : (
              elements.map((element) => (
                <div key={element.id} className="dropped-element" data-type={element.type}>
                  <div className="element-controls">
                    <button className="btn-edit" onClick={() => editElement(element)} title="Edit">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn-delete" onClick={() => deleteElement(element.id)} title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  {renderElement(element)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && currentEditElement && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <h3>Edit {currentEditElement.type}</h3>
            <div id="modal-fields">
              {currentEditElement.type === 'header' && (
                <>
                  <label>Title:</label>
                  <input type="text" value={editData.title || ''} onChange={(e) => setEditData({...editData, title: e.target.value})} />
                  <label>Subtitle:</label>
                  <input type="text" value={editData.subtitle || ''} onChange={(e) => setEditData({...editData, subtitle: e.target.value})} />
                </>
              )}
              {currentEditElement.type === 'hero' && (
                <>
                  <label>Title:</label>
                  <input type="text" value={editData.title || ''} onChange={(e) => setEditData({...editData, title: e.target.value})} />
                  <label>Subtitle:</label>
                  <input type="text" value={editData.subtitle || ''} onChange={(e) => setEditData({...editData, subtitle: e.target.value})} />
                </>
              )}
              {currentEditElement.type === 'products' && (
                <>
                  <label>Section Title:</label>
                  <input type="text" value={editData.title || ''} onChange={(e) => setEditData({...editData, title: e.target.value})} />
                  <h4>Products</h4>
                  {(editData.products || []).map((product, idx) => (
                    <div key={idx} style={{ border: '1px solid #e2e8f0', padding: '15px', marginBottom: '15px', borderRadius: '5px' }}>
                      <input type="text" placeholder="Title" value={product.title || ''} onChange={(e) => updateProduct(idx, 'title', e.target.value)} style={{width: '100%', marginBottom: '8px'}} />
                      <input type="text" placeholder="Price" value={product.price || ''} onChange={(e) => updateProduct(idx, 'price', e.target.value)} style={{width: '100%', marginBottom: '8px'}} />
                      <input type="text" placeholder="Icon (fa-box)" value={product.icon || ''} onChange={(e) => updateProduct(idx, 'icon', e.target.value)} style={{width: '100%', marginBottom: '8px'}} />
                      <button type="button" onClick={() => removeProduct(idx)} style={{background: '#f56565', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer'}}>Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={addProduct} style={{background: '#48bb78', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px'}}>Add Product</button>
                </>
              )}
              {currentEditElement.type === 'feature' && (
                <>
                  <label>Title:</label>
                  <input type="text" value={editData.title || ''} onChange={(e) => setEditData({...editData, title: e.target.value})} />
                  <label>Description:</label>
                  <input type="text" value={editData.description || ''} onChange={(e) => setEditData({...editData, description: e.target.value})} />
                  <label>Icon:</label>
                  <input type="text" placeholder="fa-truck" value={editData.icon || ''} onChange={(e) => setEditData({...editData, icon: e.target.value})} />
                </>
              )}
              {currentEditElement.type === 'testimonial' && (
                <>
                  <label>Quote:</label>
                  <textarea value={editData.quote || ''} onChange={(e) => setEditData({...editData, quote: e.target.value})} rows="3" />
                  <label>Author:</label>
                  <input type="text" value={editData.author || ''} onChange={(e) => setEditData({...editData, author: e.target.value})} />
                </>
              )}
              {currentEditElement.type === 'newsletter' && (
                <>
                  <label>Title:</label>
                  <input type="text" value={editData.title || ''} onChange={(e) => setEditData({...editData, title: e.target.value})} />
                  <label>Subtitle:</label>
                  <input type="text" value={editData.subtitle || ''} onChange={(e) => setEditData({...editData, subtitle: e.target.value})} />
                </>
              )}
              {currentEditElement.type === 'footer' && (
                <>
                  <label>Store Name:</label>
                  <input type="text" value={editData.storeName || ''} onChange={(e) => setEditData({...editData, storeName: e.target.value})} />
                </>
              )}
            </div>
            <div className="modal-buttons">
              <button className="cancel-modal" onClick={() => {setShowEditModal(false); setCurrentEditElement(null); setEditData({});}}>Cancel</button>
              <button className="save-modal" onClick={saveElementEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Builder;

