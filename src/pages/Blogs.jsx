import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./../App.css"; // use App.css styles

const Blogs = () => {
  // State for selected blog (for modal or detailed view)
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Sample blog data
  const blogs = [
    {
      id: 1,
      title: "Understanding Multi-Tenant Architecture: A Complete Guide",
      excerpt: "Learn the fundamentals of multi-tenant SaaS architecture and how it can transform your business operations with better scalability and cost efficiency.",
      content: "Multi-tenant architecture is a software architecture where a single instance of software runs on a server and serves multiple tenants...",
      author: "Rajesh Kumar",
      authorRole: "Lead Architect",
      date: "March 15, 2026",
      readTime: "8 min read",
      category: "Architecture",
      image: "fas fa-cloud",
      tags: ["Multi-Tenant", "SaaS", "Cloud Computing"]
    },
    {
      id: 2,
      title: "Top 10 Security Best Practices for SaaS Platforms",
      excerpt: "Protect your tenant data with these enterprise-grade security measures that every SaaS platform should implement.",
      content: "Security is paramount in any SaaS platform. Here are the top 10 security best practices you need to implement...",
      author: "Priya Sharma",
      authorRole: "Security Expert",
      date: "March 10, 2026",
      readTime: "6 min read",
      category: "Security",
      image: "fas fa-shield-alt",
      tags: ["Security", "Best Practices", "Data Protection"]
    },
    {
      id: 3,
      title: "AI Integration in Modern SaaS Applications",
      excerpt: "Discover how artificial intelligence is revolutionizing SaaS platforms and creating smarter, more intuitive user experiences.",
      content: "Artificial Intelligence is no longer a luxury but a necessity in modern SaaS applications. From predictive analytics to automated customer support...",
      author: "Ankit Verma",
      authorRole: "AI Specialist",
      date: "March 5, 2026",
      readTime: "10 min read",
      category: "AI & ML",
      image: "fas fa-robot",
      tags: ["AI", "Machine Learning", "Innovation"]
    },
    {
      id: 4,
      title: "Scaling Your SaaS: From Startup to Enterprise",
      excerpt: "Practical strategies and architectural patterns to scale your SaaS platform from handling hundreds to millions of users.",
      content: "Scaling a SaaS platform requires careful planning and the right architectural decisions. This guide will walk you through the journey...",
      author: "Neha Gupta",
      authorRole: "CTO",
      date: "February 28, 2026",
      readTime: "12 min read",
      category: "Scaling",
      image: "fas fa-chart-line",
      tags: ["Scaling", "Performance", "Enterprise"]
    },
    {
      id: 5,
      title: "Database Strategies for Multi-Tenant Applications",
      excerpt: "Compare different database approaches for tenant isolation including shared database, shared schema, and separate databases.",
      content: "Choosing the right database strategy is crucial for your multi-tenant application. Let's explore the pros and cons of each approach...",
      author: "Vikram Singh",
      authorRole: "Database Expert",
      date: "February 20, 2026",
      readTime: "9 min read",
      category: "Database",
      image: "fas fa-database",
      tags: ["Database", "Data Isolation", "Performance"]
    },
    {
      id: 6,
      title: "Building Real-time Analytics Dashboards",
      excerpt: "Learn how to implement real-time analytics and reporting features that provide instant insights to your tenants.",
      content: "Real-time analytics give your tenants immediate visibility into their data. Here's how to build scalable analytics dashboards...",
      author: "Rajesh Kumar",
      authorRole: "Lead Architect",
      date: "February 15, 2026",
      readTime: "7 min read",
      category: "Analytics",
      image: "fas fa-chart-pie",
      tags: ["Analytics", "Real-time", "Dashboards"]
    }
  ];

  // Categories for filtering
  const categories = ["All", "Architecture", "Security", "AI & ML", "Scaling", "Database", "Analytics"];
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter blogs based on category
  const filteredBlogs = activeCategory === "All" 
    ? blogs 
    : blogs.filter(blog => blog.category === activeCategory);

  // Handle blog click to open modal
  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Insights & Knowledge Hub</h1>
        <p>Expert articles, tutorials, and insights on SaaS development, multi-tenant architecture, and cloud technologies</p>
        
        <div className="hero-buttons">
          <Link to="/subscribe" className="btn-signup">Subscribe to Newsletter</Link>
        </div>
      </div>

      {/* Featured Blog Section */}
      <div className="trusted-section" style={{ marginTop: "2rem" }}>
        <h3>Featured Article</h3>
        <div className="card" style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          cursor: "pointer"
        }} onClick={() => handleBlogClick(blogs[0])}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.9rem" }}>
              {blogs[0].category}
            </span>
            <span>{blogs[0].readTime}</span>
          </div>
          <i className={blogs[0].image} style={{ fontSize: "3rem", marginBottom: "1rem" }}></i>
          <h2 style={{ color: "white", marginBottom: "0.5rem" }}>{blogs[0].title}</h2>
          <p style={{ color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>{blogs[0].excerpt}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div>
              <strong>{blogs[0].author}</strong>
              <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>{blogs[0].authorRole}</div>
            </div>
            <span style={{ marginLeft: "auto" }}>{blogs[0].date}</span>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="stats" style={{ marginTop: "3rem", marginBottom: "2rem" }}>
        {categories.map((category, index) => (
          <div 
            key={index} 
            onClick={() => setActiveCategory(category)}
            style={{ 
              cursor: "pointer",
              background: activeCategory === category ? "#667eea" : "transparent",
              color: activeCategory === category ? "white" : "#333",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              transition: "all 0.3s ease"
            }}
          >
            <p style={{ margin: 0, fontWeight: "bold" }}>{category}</p>
          </div>
        ))}
      </div>

      {/* Blog Grid */}
      <div className="features" style={{ marginTop: "1rem" }}>
        <h3 style={{ textAlign: "center", width: "100%", marginBottom: "2rem" }}>
          Latest Articles ({filteredBlogs.length})
        </h3>
        
        {filteredBlogs.map((blog) => (
          <div 
            key={blog.id} 
            className="card" 
            style={{ cursor: "pointer", transition: "transform 0.3s ease" }}
            onClick={() => handleBlogClick(blog)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ 
                background: "#667eea", 
                color: "white", 
                padding: "0.3rem 0.8rem", 
                borderRadius: "20px", 
                fontSize: "0.8rem" 
              }}>
                {blog.category}
              </span>
              <span style={{ color: "#666", fontSize: "0.9rem" }}>{blog.readTime}</span>
            </div>
            
            <i className={blog.image} style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#667eea" }}></i>
            <h3 style={{ marginBottom: "0.5rem" }}>{blog.title}</h3>
            <p style={{ color: "#666", marginBottom: "1rem", lineHeight: "1.6" }}>{blog.excerpt}</p>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "auto" }}>
              <div>
                <strong style={{ fontSize: "0.9rem" }}>{blog.author}</strong>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>{blog.authorRole}</div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "#666" }}>{blog.date}</span>
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {blog.tags.map((tag, idx) => (
                <span key={idx} style={{ 
                  background: "#f0f0f0", 
                  padding: "0.2rem 0.6rem", 
                  borderRadius: "15px", 
                  fontSize: "0.7rem",
                  color: "#666"
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Section */}
      <div className="trusted-section" style={{ marginTop: "3rem", background: "#f8f9fa", padding: "3rem", borderRadius: "10px" }}>
        <h3>Never Miss an Update</h3>
        <p style={{ marginBottom: "2rem" }}>Subscribe to our newsletter and get the latest insights delivered straight to your inbox</p>
        
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            style={{ 
              padding: "0.8rem 1.5rem", 
              width: "300px", 
              borderRadius: "5px", 
              border: "1px solid #ddd",
              fontSize: "1rem"
            }}
          />
          <button className="btn-signup" style={{ border: "none", cursor: "pointer" }}>
            Subscribe Now
          </button>
        </div>
      </div>

      {/* Blog Modal for Reading Full Content */}
      {showModal && selectedBlog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
          padding: "2rem"
        }} onClick={closeModal}>
          <div style={{
            background: "white",
            maxWidth: "800px",
            width: "100%",
            borderRadius: "10px",
            padding: "2rem",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative"
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#666"
            }}>×</button>

            <div style={{ marginBottom: "1rem" }}>
              <span style={{ 
                background: "#667eea", 
                color: "white", 
                padding: "0.3rem 0.8rem", 
                borderRadius: "20px", 
                fontSize: "0.8rem",
                display: "inline-block"
              }}>
                {selectedBlog.category}
              </span>
              <span style={{ marginLeft: "1rem", color: "#666", fontSize: "0.9rem" }}>
                {selectedBlog.readTime}
              </span>
            </div>

            <i className={selectedBlog.image} style={{ fontSize: "3rem", marginBottom: "1rem", color: "#667eea" }}></i>
            
            <h1 style={{ marginBottom: "1rem", fontSize: "2rem" }}>{selectedBlog.title}</h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid #eee" }}>
              <div>
                <strong>{selectedBlog.author}</strong>
                <div style={{ color: "#666", fontSize: "0.9rem" }}>{selectedBlog.authorRole}</div>
              </div>
              <span style={{ marginLeft: "auto", color: "#666" }}>{selectedBlog.date}</span>
            </div>

            <div style={{ lineHeight: "1.8", fontSize: "1.1rem", marginBottom: "2rem" }}>
              <p>{selectedBlog.content}</p>
              <p style={{ marginTop: "1rem" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p style={{ marginTop: "1rem" }}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>

            <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}>
              <h4>Tags:</h4>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {selectedBlog.tags.map((tag, idx) => (
                  <span key={idx} style={{ 
                    background: "#f0f0f0", 
                    padding: "0.3rem 0.8rem", 
                    borderRadius: "20px", 
                    fontSize: "0.9rem"
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <button className="btn-signup" onClick={closeModal} style={{ cursor: "pointer" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="hero" style={{ marginTop: "3rem" }}>
        <h2>Want to Contribute?</h2>
        <p>Share your expertise with our community. We're always looking for guest authors and industry experts</p>
        <div className="hero-buttons">
          <Link to="/write-for-us" className="btn-signup">Become a Contributor</Link>
        </div>
      </div>
    </div>
  );
};

export default Blogs;