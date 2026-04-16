// components/Storefront.js - Fixed version
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Storefront = () => {
  const { domain } = useParams();
  const [tenant, setTenant] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    try {
      // Find tenant by domain
      const tenants = JSON.parse(localStorage.getItem('tenants') || '{}');
      const foundTenant = Object.values(tenants).find(t => t.domain === domain);
      
      if (foundTenant) {
        setTenant(foundTenant);
      }
      
      // Load cart for this domain
      const savedCart = JSON.parse(localStorage.getItem(`cart_${domain}`) || '[]');
      setCart(savedCart);
    } catch (error) {
      console.error('Error loading store:', error);
    } finally {
      setLoading(false);
    }
  }, [domain]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (domain) {
      localStorage.setItem(`cart_${domain}`, JSON.stringify(cart));
    }
  }, [cart, domain]);

  const addToCart = (product) => {
    try {
      // Create a unique ID using timestamp + random number
      const cartItem = {
        ...product,
        cartId: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addedAt: new Date().toISOString(),
        quantity: 1
      };
      
      const newCart = [...cart, cartItem];
      setCart(newCart);
      
      // Show success message
      const toast = document.createElement('div');
      toast.textContent = `${product.title} added to cart!`;
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const removeFromCart = (cartId) => {
    try {
      const newCart = cart.filter(item => item.cartId !== cartId);
      setCart(newCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item from cart.');
    }
  };

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartId);
      return;
    }
    
    const updatedCart = cart.map(item =>
      item.cartId === cartId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const checkout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    try {
      // Calculate total
      const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price?.replace('$', '') || 0);
        return sum + (price * (item.quantity || 1));
      }, 0);
      
      // Create sale record
      const sale = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.title,
          price: item.price,
          quantity: item.quantity || 1,
          subtotal: parseFloat(item.price?.replace('$', '') || 0) * (item.quantity || 1)
        })),
        total: total,
        date: new Date().toISOString(),
        customerEmail: 'customer@example.com',
        status: 'completed'
      };
      
      // Update tenant sales in localStorage
      const tenants = JSON.parse(localStorage.getItem('tenants') || '{}');
      if (tenant && tenant.id && tenants[tenant.id]) {
        const currentTenant = tenants[tenant.id];
        currentTenant.sales = [...(currentTenant.sales || []), sale];
        
        // Update product sales data
        cart.forEach(item => {
          const productExists = currentTenant.products?.find(p => p.id === item.id);
          if (productExists) {
            // Update product sales count if needed
            productExists.salesCount = (productExists.salesCount || 0) + (item.quantity || 1);
          }
        });
        
        tenants[tenant.id] = currentTenant;
        localStorage.setItem('tenants', JSON.stringify(tenants));
        
        // Update current tenant state
        setTenant(currentTenant);
      }
      
      // Clear cart
      setCart([]);
      localStorage.setItem(`cart_${domain}`, JSON.stringify([]));
      setShowCart(false);
      setOrderPlaced(true);
      
      // Show success message
      alert(`Order placed successfully! Total: $${total.toFixed(2)}\nThank you for your purchase!`);
      
      // Reset order placed message after 5 seconds
      setTimeout(() => setOrderPlaced(false), 5000);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to process checkout. Please try again.');
    }
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price?.replace('$', '') || 0);
      return sum + (price * (item.quantity || 1));
    }, 0);
  };

  const renderElement = (element) => {
    if (!element) return null;
    
    switch (element.type) {
      case 'header':
        return (
          <div style={{ marginBottom: '30px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{element.title || 'Our Store'}</h1>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>{element.subtitle || 'Welcome to our store'}</p>
          </div>
        );
        
      case 'hero':
        return (
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '80px 20px',
            textAlign: 'center',
            borderRadius: '10px',
            marginBottom: '30px'
          }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{element.title || 'Special Offer!'}</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>{element.subtitle || 'Amazing products at great prices'}</p>
            <button 
              onClick={() => {
                const productsSection = document.getElementById('products-section');
                if (productsSection) {
                  productsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              style={{
                background: 'white',
                color: '#667eea',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Shop Now
            </button>
          </div>
        );
        
      case 'products':
        if (!element.products || element.products.length === 0) {
          return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No products available yet.</p>
            </div>
          );
        }
        
        return (
          <div id="products-section">
            <h2 style={{ marginBottom: '30px', fontSize: '2rem', textAlign: 'center' }}>
              {element.title || 'Our Products'}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px',
              marginTop: '20px'
            }}>
              {element.products.map((product, idx) => (
                <div 
                  key={product.id || idx} 
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    background: 'white',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    height: '200px',
                    background: `linear-gradient(135deg, #667eea ${(idx % 4) * 20}%, #764ba2 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '64px'
                  }}>
                    <i className={`fas ${product.icon || 'fa-box'}`}></i>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{product.title || 'Product'}</h3>
                    <p style={{ color: '#666', marginBottom: '10px', fontSize: '0.9rem' }}>
                      {product.description || 'High quality product for your needs'}
                    </p>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea', marginBottom: '15px' }}>
                      {product.price || '$49.99'}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        width: '100%',
                        fontSize: '1rem',
                        transition: 'opacity 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <i className="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

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
          <h3 style={{ marginTop: '20px' }}>Loading Store...</h3>
        </div>
      </div>
    );
  }

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
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <i className="fas fa-store-slash" style={{ fontSize: '64px', color: '#f56565', marginBottom: '20px' }}></i>
          <h1 style={{ marginBottom: '10px' }}>Store Not Found</h1>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            The store at <strong>{domain}</strong> does not exist or has been removed.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Order Placed Notification */}
      {orderPlaced && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#48bb78',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          zIndex: 2000,
          animation: 'slideIn 0.3s ease',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <i className="fas fa-check-circle"></i> Order placed successfully!
        </div>
      )}

      {/* Cart Button */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowCart(!showCart)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '15px 25px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'transform 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <i className="fas fa-shopping-cart"></i>
          <span>Cart ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)})</span>
          <span style={{ fontSize: '14px', opacity: 0.9 }}>
            ${getCartTotal().toFixed(2)}
          </span>
        </button>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
              cursor: 'pointer'
            }}
            onClick={() => setShowCart(false)}
          />
          
          {/* Cart Panel */}
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '450px',
            maxWidth: '90vw',
            height: '100vh',
            background: 'white',
            boxShadow: '-2px 0 20px rgba(0,0,0,0.1)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h2 style={{ margin: 0 }}>Your Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#666',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  <i className="fas fa-shopping-cart" style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.3 }}></i>
                  <p>Your cart is empty</p>
                  <button
                    onClick={() => setShowCart(false)}
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
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.cartId} style={{
                    borderBottom: '1px solid #e2e8f0',
                    padding: '15px 0',
                    display: 'flex',
                    gap: '15px'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px'
                    }}>
                      <i className={`fas ${item.icon || 'fa-box'}`}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>{item.title}</h4>
                      <p style={{ color: '#667eea', fontWeight: 'bold', margin: '5px 0' }}>{item.price}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                        <button
                          onClick={() => updateQuantity(item.cartId, (item.quantity || 1) - 1)}
                          style={{
                            width: '25px',
                            height: '25px',
                            background: '#e2e8f0',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          -
                        </button>
                        <span>{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.cartId, (item.quantity || 1) + 1)}
                          style={{
                            width: '25px',
                            height: '25px',
                            background: '#e2e8f0',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer'
                          }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.cartId)}
                          style={{
                            marginLeft: 'auto',
                            background: '#f56565',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cart.length > 0 && (
              <div style={{
                borderTop: '2px solid #e2e8f0',
                padding: '20px',
                background: '#f7fafc'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <strong>Subtotal:</strong>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <strong>Shipping:</strong>
                  <span>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1.2rem' }}>
                  <strong>Total:</strong>
                  <strong style={{ color: '#667eea' }}>${getCartTotal().toFixed(2)}</strong>
                </div>
                <button
                  onClick={checkout}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    transition: 'opacity 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Store Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        {/* Store Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '10px',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>{tenant.storeName || 'Our Store'}</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.95 }}>Welcome to our store! Discover amazing products at great prices.</p>
        </div>
        
        {/* Dynamic Elements */}
        {tenant.websiteData && tenant.websiteData.length > 0 ? (
          tenant.websiteData.map(element => (
            <div key={element.id || Math.random()} style={{ marginBottom: '40px' }}>
              {renderElement(element)}
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: '#f7fafc',
            borderRadius: '10px'
          }}>
            <i className="fas fa-store" style={{ fontSize: '64px', color: '#cbd5e0', marginBottom: '20px' }}></i>
            <h2 style={{ marginBottom: '10px' }}>Store Under Construction</h2>
            <p style={{ color: '#666' }}>The owner is building this store. Check back soon for amazing products!</p>
          </div>
        )}
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Storefront;