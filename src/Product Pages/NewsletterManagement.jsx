import React, { useState, useEffect } from 'react';
import './NewsletterManager.css';

const NewsletterManager = () => {
  const [activeTab, setActiveTab] = useState('subscribe');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  // Newsletter States
  const [subscribers, setSubscribers] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [currentSubscriber, setCurrentSubscriber] = useState({
    email: '',
    name: '',
    subscribedAt: ''
  });
  
  // Newsletter Post States
  const [newsletterPost, setNewsletterPost] = useState({
    title: '',
    content: '',
    category: 'General',
    imageUrl: '',
    important: false
  });
  
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Load data from localStorage
  useEffect(() => {
    loadData();
    checkAdminSession();
  }, []);
  
  const loadData = () => {
    const savedSubscribers = localStorage.getItem('newsletter_subscribers');
    const savedNewsletters = localStorage.getItem('newsletters');
    
    if (savedSubscribers) {
      setSubscribers(JSON.parse(savedSubscribers));
    } else {
      const sampleSubscribers = [
        { email: 'john@example.com', name: 'John Doe', subscribedAt: '2024-01-15', status: 'active' },
        { email: 'jane@example.com', name: 'Jane Smith', subscribedAt: '2024-01-20', status: 'active' }
      ];
      setSubscribers(sampleSubscribers);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(sampleSubscribers));
    }
    
    if (savedNewsletters) {
      setNewsletters(JSON.parse(savedNewsletters));
    } else {
      const sampleNewsletters = [
        {
          id: 1,
          title: 'Welcome to Our Newsletter!',
          content: 'Thank you for subscribing to our newsletter. You will receive the latest updates about our products and services.',
          category: 'Welcome',
          imageUrl: '',
          important: true,
          sentAt: '2024-01-10',
          sentBy: 'Admin'
        },
        {
          id: 2,
          title: 'New Features Released',
          content: 'We are excited to announce the release of new features including AI-powered analytics and real-time reporting.',
          category: 'Product Update',
          imageUrl: '',
          important: false,
          sentAt: '2024-01-20',
          sentBy: 'Admin'
        }
      ];
      setNewsletters(sampleNewsletters);
      localStorage.setItem('newsletters', JSON.stringify(sampleNewsletters));
    }
  };
  
  const checkAdminSession = () => {
    const adminLoggedIn = localStorage.getItem('newsletter_admin');
    if (adminLoggedIn === 'true') {
      setIsAdmin(true);
    }
  };
  
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };
  
  // Subscribe to newsletter
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!currentSubscriber.email) {
      showNotification('Please enter your email address', 'error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentSubscriber.email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    const existingSubscriber = subscribers.find(s => s.email === currentSubscriber.email);
    if (existingSubscriber) {
      showNotification('This email is already subscribed!', 'error');
      return;
    }
    
    const newSubscriber = {
      ...currentSubscriber,
      subscribedAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    
    const updatedSubscribers = [...subscribers, newSubscriber];
    setSubscribers(updatedSubscribers);
    localStorage.setItem('newsletter_subscribers', JSON.stringify(updatedSubscribers));
    
    // Send welcome email simulation
    sendWelcomeEmail(newSubscriber);
    
    setCurrentSubscriber({ email: '', name: '', subscribedAt: '' });
    showNotification('Successfully subscribed to newsletter!', 'success');
  };
  
  const sendWelcomeEmail = (subscriber) => {
    console.log(`Sending welcome email to ${subscriber.email}`);
  };
  
  // Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('newsletter_admin', 'true');
      setShowAdminLogin(false);
      setAdminPassword('');
      showNotification('Admin login successful!', 'success');
    } else {
      showNotification('Invalid password!', 'error');
    }
  };
  
  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('newsletter_admin');
    showNotification('Logged out successfully', 'success');
  };
  
  // Post Newsletter
  const handlePostNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterPost.title || !newsletterPost.content) {
      showNotification('Please fill in title and content', 'error');
      return;
    }
    
    const newNewsletter = {
      id: Date.now(),
      ...newsletterPost,
      sentAt: new Date().toISOString().split('T')[0],
      sentBy: 'Admin'
    };
    
    const updatedNewsletters = [newNewsletter, ...newsletters];
    setNewsletters(updatedNewsletters);
    localStorage.setItem('newsletters', JSON.stringify(updatedNewsletters));
    
    // Send email to all subscribers
    sendNewsletterToSubscribers(newNewsletter);
    
    setNewsletterPost({
      title: '',
      content: '',
      category: 'General',
      imageUrl: '',
      important: false
    });
    
    showNotification('Newsletter posted and sent to all subscribers!', 'success');
  };
  
  const sendNewsletterToSubscribers = (newsletter) => {
    console.log(`Sending newsletter "${newsletter.title}" to ${subscribers.length} subscribers`);
    subscribers.forEach(subscriber => {
      console.log(`Sending to: ${subscriber.email}`);
    });
  };
  
  // Unsubscribe
  const handleUnsubscribe = (email) => {
    if (window.confirm(`Remove ${email} from subscribers?`)) {
      const updatedSubscribers = subscribers.filter(s => s.email !== email);
      setSubscribers(updatedSubscribers);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(updatedSubscribers));
      showNotification('Subscriber removed successfully!', 'success');
    }
  };
  
  // Delete Newsletter
  const handleDeleteNewsletter = (id) => {
    if (window.confirm('Delete this newsletter?')) {
      const updatedNewsletters = newsletters.filter(n => n.id !== id);
      setNewsletters(updatedNewsletters);
      localStorage.setItem('newsletters', JSON.stringify(updatedNewsletters));
      showNotification('Newsletter deleted!', 'success');
    }
  };
  
  // Export subscribers
  const exportSubscribers = () => {
    const data = subscribers.map(s => `${s.email},${s.name},${s.subscribedAt}`).join('\n');
    const blob = new Blob([`Email,Name,Subscribed Date\n${data}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Subscribers exported!', 'success');
  };
  
  // Send test email
  const sendTestEmail = () => {
    const testEmail = prompt('Enter email address to send test newsletter:');
    if (testEmail && newsletterPost.title && newsletterPost.content) {
      console.log(`Sending test email to ${testEmail}`);
      showNotification(`Test email sent to ${testEmail}`, 'success');
    } else {
      showNotification('Please create newsletter content first', 'error');
    }
  };
  
  // Preview Newsletter
  const previewNewsletter = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setShowPreview(true);
  };
  
  return (
    <div className="newsletter-app">
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <i className={`fas ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          <span>{notification.message}</span>
        </div>
      )}
      
      {/* Header */}
      <header className="newsletter-header">
        <div className="logo">
          <i className="fas fa-envelope-open-text"></i>
          <h1>Newsletter Manager</h1>
        </div>
        <div className="header-actions">
          {!isAdmin ? (
            <button className="btn-admin" onClick={() => setShowAdminLogin(true)}>
              <i className="fas fa-lock"></i> Admin Login
            </button>
          ) : (
            <div className="admin-info">
              <i className="fas fa-user-shield"></i>
              <span>Admin Mode</span>
              <button className="btn-logout" onClick={handleAdminLogout}>
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="modal" onClick={() => setShowAdminLogin(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Admin Login</h3>
              <button className="close" onClick={() => setShowAdminLogin(false)}>&times;</button>
            </div>
            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoFocus
                />
                <small>Default password: admin123</small>
              </div>
              <button type="submit" className="btn-primary">Login</button>
            </form>
          </div>
        </div>
      )}
      
      <div className="newsletter-container">
        {/* Tabs */}
        <div className="newsletter-tabs">
          <button className={`tab-btn ${activeTab === 'subscribe' ? 'active' : ''}`} onClick={() => setActiveTab('subscribe')}>
            <i className="fas fa-envelope"></i> Subscribe
          </button>
          <button className={`tab-btn ${activeTab === 'latest' ? 'active' : ''}`} onClick={() => setActiveTab('latest')}>
            <i className="fas fa-newspaper"></i> Latest Updates
          </button>
          {isAdmin && (
            <>
              <button className={`tab-btn ${activeTab === 'post' ? 'active' : ''}`} onClick={() => setActiveTab('post')}>
                <i className="fas fa-edit"></i> Post Newsletter
              </button>
              <button className={`tab-btn ${activeTab === 'subscribers' ? 'active' : ''}`} onClick={() => setActiveTab('subscribers')}>
                <i className="fas fa-users"></i> Subscribers ({subscribers.length})
              </button>
            </>
          )}
        </div>
        
        {/* Subscribe Tab */}
        {activeTab === 'subscribe' && (
          <div className="subscribe-tab">
            <div className="subscribe-hero">
              <i className="fas fa-envelope-open-text"></i>
              <h2>Stay Updated!</h2>
              <p>Subscribe to our newsletter for the latest updates, features, and announcements.</p>
            </div>
            
            <div className="subscribe-form-container">
              <form onSubmit={handleSubscribe} className="subscribe-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={currentSubscriber.name}
                    onChange={(e) => setCurrentSubscriber({ ...currentSubscriber, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={currentSubscriber.email}
                    onChange={(e) => setCurrentSubscriber({ ...currentSubscriber, email: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-subscribe">
                  <i className="fas fa-bell"></i> Subscribe Now
                </button>
              </form>
            </div>
            
            <div className="features">
              <div className="feature">
                <i className="fas fa-chart-line"></i>
                <h4>Latest Updates</h4>
                <p>Get real-time updates about new features</p>
              </div>
              <div className="feature">
                <i className="fas fa-gift"></i>
                <h4>Exclusive Offers</h4>
                <p>Receive special discounts and offers</p>
              </div>
              <div className="feature">
                <i className="fas fa-newspaper"></i>
                <h4>Weekly Newsletter</h4>
                <p>Curated content delivered to your inbox</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Latest Updates Tab */}
        {activeTab === 'latest' && (
          <div className="latest-tab">
            <h2><i className="fas fa-newspaper"></i> Latest Newsletters</h2>
            <div className="newsletters-grid">
              {newsletters.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>No newsletters yet. Check back soon!</p>
                </div>
              ) : (
                newsletters.map(newsletter => (
                  <div key={newsletter.id} className={`newsletter-card ${newsletter.important ? 'important' : ''}`}>
                    {newsletter.important && <div className="important-badge"><i className="fas fa-star"></i> Important</div>}
                    <div className="newsletter-category">{newsletter.category}</div>
                    <h3>{newsletter.title}</h3>
                    <p className="newsletter-content-preview">{newsletter.content.substring(0, 150)}...</p>
                    {newsletter.imageUrl && <img src={newsletter.imageUrl} alt="Newsletter" className="newsletter-image" />}
                    <div className="newsletter-meta">
                      <span><i className="fas fa-calendar"></i> {newsletter.sentAt}</span>
                      <button className="btn-read" onClick={() => previewNewsletter(newsletter)}>Read More</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Post Newsletter Tab (Admin Only) */}
        {activeTab === 'post' && isAdmin && (
          <div className="post-tab">
            <h2><i className="fas fa-edit"></i> Create Newsletter</h2>
            <div className="post-form-container">
              <form onSubmit={handlePostNewsletter}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      value={newsletterPost.title}
                      onChange={(e) => setNewsletterPost({ ...newsletterPost, title: e.target.value })}
                      placeholder="Enter newsletter title"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newsletterPost.category}
                      onChange={(e) => setNewsletterPost({ ...newsletterPost, category: e.target.value })}
                    >
                      <option value="General">General</option>
                      <option value="Product Update">Product Update</option>
                      <option value="Feature Release">Feature Release</option>
                      <option value="Announcement">Announcement</option>
                      <option value="Tips & Tricks">Tips & Tricks</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Image URL (optional)</label>
                  <input
                    type="text"
                    value={newsletterPost.imageUrl}
                    onChange={(e) => setNewsletterPost({ ...newsletterPost, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="form-group">
                  <label>Content *</label>
                  <textarea
                    rows="10"
                    value={newsletterPost.content}
                    onChange={(e) => setNewsletterPost({ ...newsletterPost, content: e.target.value })}
                    placeholder="Write your newsletter content here... Supports HTML formatting"
                    required
                  />
                </div>
                
                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={newsletterPost.important}
                      onChange={(e) => setNewsletterPost({ ...newsletterPost, important: e.target.checked })}
                    />
                    Mark as Important
                  </label>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={sendTestEmail}>
                    <i className="fas fa-paper-plane"></i> Send Test Email
                  </button>
                  <button type="submit" className="btn-primary">
                    <i className="fas fa-send"></i> Post & Send to {subscribers.length} Subscribers
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Subscribers Tab (Admin Only) */}
        {activeTab === 'subscribers' && isAdmin && (
          <div className="subscribers-tab">
            <div className="subscribers-header">
              <h2><i className="fas fa-users"></i> Subscribers List</h2>
              <button className="btn-secondary" onClick={exportSubscribers}>
                <i className="fas fa-download"></i> Export CSV
              </button>
            </div>
            
            <div className="subscribers-stats">
              <div className="stat-card">
                <i className="fas fa-envelope"></i>
                <div>
                  <h4>Total Subscribers</h4>
                  <p>{subscribers.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-newspaper"></i>
                <div>
                  <h4>Newsletters Sent</h4>
                  <p>{newsletters.length}</p>
                </div>
              </div>
            </div>
            
            <div className="table-responsive">
              <table className="subscribers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subscribed Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(subscriber => (
                    <tr key={subscriber.email}>
                      <td>{subscriber.name || '-'}</td>
                      <td>{subscriber.email}</td>
                      <td>{subscriber.subscribedAt}</td>
                      <td><span className="status-active">Active</span></td>
                      <td>
                        <button className="btn-icon" onClick={() => handleUnsubscribe(subscriber.email)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-state">No subscribers yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Preview Modal */}
      {showPreview && selectedNewsletter && (
        <div className="modal" onClick={() => setShowPreview(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedNewsletter.title}</h3>
              <button className="close" onClick={() => setShowPreview(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="preview-newsletter">
                <div className="preview-meta">
                  <span className="category-badge">{selectedNewsletter.category}</span>
                  <span><i className="fas fa-calendar"></i> {selectedNewsletter.sentAt}</span>
                </div>
                {selectedNewsletter.imageUrl && (
                  <img src={selectedNewsletter.imageUrl} alt="Newsletter" className="preview-image" />
                )}
                <div className="preview-content">
                  {selectedNewsletter.content.split('\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                {isAdmin && (
                  <div className="preview-actions">
                    <button className="btn-danger" onClick={() => {
                      handleDeleteNewsletter(selectedNewsletter.id);
                      setShowPreview(false);
                    }}>
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowPreview(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterManager;

// Separate BlogIntegration Component
export const BlogIntegration = () => {
  const [blogs, setBlogs] = useState([]);
  
  useEffect(() => {
    // Sync newsletters with blogs
    const newsletters = JSON.parse(localStorage.getItem('newsletters') || '[]');
    const blogPosts = newsletters.map(nl => ({
      id: nl.id,
      title: nl.title,
      excerpt: nl.content.substring(0, 150) + '...',
      content: nl.content,
      date: nl.sentAt,
      category: nl.category,
      important: nl.important
    }));
    setBlogs(blogPosts);
  }, []);

  return (
    <div className="blog-integration">
      <h2><i className="fas fa-blog"></i> Latest Newsletter Blogs</h2>
      <div className="blog-list">
        {blogs.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>No blog posts yet. Newsletters will appear here.</p>
          </div>
        ) : (
          blogs.map(blog => (
            <div key={blog.id} className="blog-card">
              {blog.important && <div className="important-badge"><i className="fas fa-star"></i> Important</div>}
              <div className="blog-category">{blog.category}</div>
              <h3>{blog.title}</h3>
              <p>{blog.excerpt}</p>
              <div className="blog-meta">
                <span><i className="fas fa-calendar"></i> {blog.date}</span>
                <button className="btn-read">Read More</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};