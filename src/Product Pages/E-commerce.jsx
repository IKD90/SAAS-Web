import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Ecommerce = () => {
  const [demoElements, setDemoElements] = useState([]);
  const [showBuilderDemo, setShowBuilderDemo] = useState(false);

  useEffect(() => {
    // Demo elements for live preview
    setDemoElements([
      {
        id: 1,
        type: 'hero',
        title: 'Build Your Dream E-commerce Store',
        subtitle: 'Drag & drop builder - No coding required. Create professional stores in minutes.'
      },
      {
        id: 2,
        type: 'products',
        title: 'Ready-to-use Product Sections',
        products: [
          { id: 1, title: 'iPhone 15 Pro', price: '$999', icon: 'fa-mobile-alt' },
          { id: 2, title: 'MacBook Pro', price: '$1999', icon: 'fa-laptop' },
          { id: 3, title: 'AirPods Pro', price: '$249', icon: 'fa-headphones' },
          { id: 4, title: 'Apple Watch', price: '$399', icon: 'fa-clock' }
        ]
      }
    ]);
  }, []);

  const toggleBuilderDemo = () => {
    setShowBuilderDemo(!showBuilderDemo);
  };

  const renderDemoElement = (element) => {
    if (element.type === 'hero') {
      return (
        <div className="demo-hero" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
          borderRadius: '15px',
          marginBottom: '40px'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{element.title}</h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '30px' }}>{element.subtitle}</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn-demo" style={{
              background: 'white', color: '#667eea', padding: '15px 30px',
              borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold'
            }}>
              Start Building Free
            </Link>
            <Link to="/login" className="btn-demo" style={{
              background: 'transparent', color: 'white', padding: '15px 30px',
              borderRadius: '30px', textDecoration: 'none', border: '2px solid white', fontWeight: 'bold'
            }}>
              Login
            </Link>
          </div>
        </div>
      );
    }

    if (element.type === 'products') {
      return (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '30px', color: '#333' }}>{element.title}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            {element.products.map((product) => (
              <div key={product.id} className="demo-product" style={{
                border: '1px solid #e2e8f0',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{
                  height: '220px',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  color: 'white'
                }}>
                  <i className={`fas ${product.icon}`} />
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{ marginBottom: '10px', color: '#333' }}>{product.title}</h3>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: '#667eea',
                    marginBottom: '20px'
                  }}>
                    {product.price}
                  </div>
                  <button style={{
                    width: '100%',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '15px',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="ecommerce-page" style={{ padding: '40px 20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', color: '#1a202c', marginBottom: '20px' }}>
          E-Commerce Store Builder
        </h1>
        <p style={{ fontSize: '1.4rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
          Create stunning, fully functional e-commerce websites with our intuitive drag & drop builder.
          No coding skills required. Professional results in minutes.
        </p>
      </div>

      {/* Live Builder Demo */}
      {demoElements.map(renderDemoElement)}

      {/* Interactive Builder Demo Toggle */}
      <div style={{ textAlign: 'center', margin: '60px 0' }}>
        <button
          onClick={toggleBuilderDemo}
          style={{
            background: '#48bb78',
            color: 'white',
            border: 'none',
            padding: '20px 40px',
            borderRadius: '50px',
            fontSize: '1.3rem',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(72,187,120,0.3)'
          }}
        >
          {showBuilderDemo ? 'Hide Builder Demo' : 'Show Live Builder Demo'}
        </button>
      </div>

      {showBuilderDemo && (
        <div style={{
          background: '#f7fafc',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '60px',
          border: '3px dashed #cbd5e0'
        }}>
          <h2 style={{ textAlign: 'center', color: '#2d3748', marginBottom: '30px' }}>
             Drag & Drop Magic in Action
          </h2>
          <div style={{
            display: 'flex',
            gap: '30px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div className="drag-item-demo" style={{
              padding: '20px',
              border: '2px dashed #4299e1',
              borderRadius: '12px',
              background: 'white',
              minWidth: '200px',
              textAlign: 'center',
              cursor: 'grab'
            }}>
              <i className="fas fa-heading" style={{ fontSize: '2rem', color: '#4299e1', marginBottom: '10px' }} />
              <div>Header</div>
            </div>
            <div className="drag-item-demo" style={{
              padding: '20px',
              border: '2px dashed #ed8936',
              borderRadius: '12px',
              background: 'white',
              minWidth: '200px',
              textAlign: 'center',
              cursor: 'grab'
            }}>
              <i className="fas fa-image" style={{ fontSize: '2rem', color: '#ed8936', marginBottom: '10px' }} />
              <div>Hero Banner</div>
            </div>
            <div className="drag-item-demo" style={{
              padding: '20px',
              border: '2px dashed #48bb78',
              borderRadius: '12px',
              background: 'white',
              minWidth: '200px',
              textAlign: 'center',
              cursor: 'grab'
            }}>
              <i className="fas fa-boxes" style={{ fontSize: '2rem', color: '#48bb78', marginBottom: '10px' }} />
              <div>Products Grid</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '1.1rem', color: '#666' }}>
             Drag these to the canvas → Edit content → Export HTML → Launch your store!
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-mouse-pointer" style={{ fontSize: '3rem', color: '#667eea', marginBottom: '20px' }} />
          <h3>Drag & Drop Simple</h3>
          <p>Intuitive interface - just drag elements where you want them. No technical skills needed.</p>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-mobile-alt" style={{ fontSize: '3rem', color: '#48bb78', marginBottom: '20px' }} />
          <h3>Fully Responsive</h3>
          <p>Beautiful on desktop, tablet, and mobile. Professional design that works everywhere.</p>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-shopping-cart" style={{ fontSize: '3rem', color: '#f6ad55', marginBottom: '20px' }} />
          <h3>Real E-commerce</h3>
          <p>Working cart, checkout, payments. Export includes full shopping functionality.</p>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '80px 40px',
        borderRadius: '20px',
        marginBottom: '40px'
      }}>
        <h2 style={{ fontSize: '2.8rem', marginBottom: '20px' }}>Ready to Build Your Store?</h2>
        <p style={{ fontSize: '1.3rem', marginBottom: '40px' }}>
          Join 1000+ businesses creating beautiful e-commerce sites today
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" style={{
            background: 'white', color: '#667eea', padding: '20px 50px',
            borderRadius: '50px', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold'
          }}>
             Start Free Trial
          </Link>
          <Link to="/pricing" style={{
            background: 'transparent', color: 'white', padding: '20px 50px',
            borderRadius: '50px', textDecoration: 'none', border: '2px solid white', fontWeight: 'bold'
          }}>
            View Pricing
          </Link>
          <Link to="/builder" style={{
            background: 'transparent', color: 'white', padding: '20px 50px',
            borderRadius: '50px', textDecoration: 'none', border: '2px solid white', fontWeight: 'bold'
          }}>
            Try Builder Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;
