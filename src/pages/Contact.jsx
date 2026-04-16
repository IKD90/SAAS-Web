import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '', location: 'silicon' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent to ' + formData.location + '! (mock)');
  };

  const locations = [
    { id: 'silicon', name: 'Silicon Valley HQ', phone: '+1-234-567-8900', email: 'hello@rksdev.com', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.6394339999996!2d-122.084249!3d37.421999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425dad8f%3A0x35ef4c2b2c0cc16a!2sGoogleplex!5e0!3m2!1sen!2sus!4v1690000000000' },
    { id: 'nyc', name: 'New York Office', phone: '+1-555-123-4567', email: 'ny@rksdev.com', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.0!2d-74.0060!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a4b48d3b1d%3A0x2d4d6c5d5e6f7b8c!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1690000000000' },
    // { id: 'london', name: 'London Branch', phone: '+44-20-1234-5678', email: 'uk@rksdev.com', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2481.0!2d-0.1276!3d51.5074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604c6b0f4b4b9%3A0x2d4d6c5d5e6f7b8c!2sLondon%2C%20UK!5e0!3m2!1sen!2sus!4v1690000000000' },
    // { id: 'dubai', name: 'Dubai Hub', phone: '+971-4-567-8901', email: 'me@rksdev.com', mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7215.0!2d55.2708!3d25.2048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f84d1f7b4b5d1%3A0x2d4d6c5d5e6f7b8c!2sDubai%2C%20UAE!5e0!3m2!1sen!2sus!4v1690000000000' },
  ];

  // eslint-disable-next-line no-unused-vars
  const currentLoc = locations.find(l => l.id === formData.location);

  return (
    <div className="container">
      <h1>Contact Us</h1>
      <p>Get in touch with our global team.</p>
      
        <div className="features" style={{flexDirection: 'row', gap: '40px'}}>
          <div className="contact-locations" style={{flex: 1}}>
            <h3>Our Locations</h3>
            {locations.map(loc => (
              <div key={loc.id} className="location-card" style={{marginBottom: '20px', cursor: 'pointer'}} onClick={() => setFormData({...formData, location: loc.id})}>
                <h4>{loc.name}</h4>
                <p>{loc.email}</p>
                <p>{loc.phone}</p>
                <iframe 
                  className="location-map"
                  src={loc.mapUrl}
                  width="100%" 
                  height="120" 
                  style={{border: 0, borderRadius: '8px', marginTop: '10px'}}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={loc.name}
                ></iframe>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="contact-form" style={{flex: 1}}>
          <div className="input-group">
            <label>Name *</label>
            <input className="input-field" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Email *</label>
            <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="input-group">
            <label>Phone</label>
            <input type="tel" className="input-field" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Subject</label>
            <input className="input-field" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Message *</label>
            <textarea rows="6" className="input-field" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required />
          </div>
          <button type="submit" className="btn-signup">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;

