import React, { useState, useEffect } from 'react';

const BlogIntegration = () => {
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
    <div className="newsletter-blogs-section">
      <h2>Latest Newsletter Blogs</h2>
      <div className="blog-list">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            <h3>{blog.title}</h3>
            <p>{blog.excerpt}</p>
            <span>Category: {blog.category} | {blog.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogIntegration;

