import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RequireAuth from '../Components/RequireAuth';

const VideoConferencing = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const generateRoomId = () => {
    const tenant = JSON.parse(localStorage.getItem('current_tenant') || '{}');
    const random = Math.random().toString(36).substr(2, 8);
    return `${tenant.domain || 'tenant'}-${random}`;
  };

  const createRoom = () => {
    const id = generateRoomId();
    setRoomId(id);
    navigator.clipboard.writeText(`${window.location.origin}/video-call/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      navigate(`/video-call/${roomId.trim()}`);
    }
  };

  return (
    <RequireAuth>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#333' }}>
          <i className="fas fa-video" style={{ color: '#667eea', marginRight: '10px' }}></i>
          Video Conferencing
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '40px' }}>
          Create secure tenant video calls with screen sharing and unlimited participants
        </p>

        {!roomId ? (
          <div style={{ background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <button 
              onClick={createRoom}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '50px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 5px 20px rgba(102,126,234,0.4)'
              }}
            >
              <i className="fas fa-plus" style={{ marginRight: '10px' }}></i>
              Create New Meeting
            </button>
          </div>
        ) : (
          <div style={{ background: 'white', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>Your Meeting Link:</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input 
                ref={inputRef}
                value={`${window.location.origin}/video-call/${roomId}`} 
                readOnly 
                style={{
                  padding: '12px 20px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minWidth: '400px',
                  textAlign: 'center'
                }} 
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/video-call/${roomId}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={{
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {copied ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
              </button>
            </div>
            <button 
              onClick={joinRoom}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 5px 20px rgba(102,126,234,0.4)'
              }}
            >
              <i className="fas fa-arrow-right" style={{ marginRight: '10px' }}></i>
              Join Meeting
            </button>
            <button 
              onClick={() => setRoomId('')}
              style={{
                marginLeft: '20px',
                background: '#f56565',
                color: 'white',
                border: 'none',
                padding: '15px 20px',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              New Meeting
            </button>
          </div>
        )}

        <div style={{ marginTop: '60px', padding: '30px', background: '#f8f9ff', borderRadius: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <i className="fas fa-users" style={{ fontSize: '48px', color: '#667eea', marginBottom: '15px' }}></i>
            <h4>Unlimited Participants</h4>
            <p style={{ color: '#666' }}>Add as many people as needed</p>
          </div>
          <div>
            <i className="fas fa-desktop" style={{ fontSize: '48px', color: '#48bb78', marginBottom: '15px' }}></i>
            <h4>Screen Sharing</h4>
            <p style={{ color: '#666' }}>Share your screen easily</p>
          </div>
          <div>
            <i className="fas fa-lock" style={{ fontSize: '48px', color: '#f59e0b', marginBottom: '15px' }}></i>
            <h4>Tenant Secure</h4>
            <p style={{ color: '#666' }}>Private tenant rooms</p>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
};

export default VideoConferencing;

