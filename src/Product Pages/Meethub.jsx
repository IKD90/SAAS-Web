import React, { useState, useEffect, useRef, useCallback } from 'react';
import './MeetHub.css';

const MeetHub = () => {
  const [currentTenant, setCurrentTenant] = useState('acme');
  const [inMeeting, setInMeeting] = useState(false);
  const [currentMeetingId, setCurrentMeetingId] = useState(null);
  const [userName, setUserName] = useState('Guest User');
  const [meetingIdInput, setMeetingIdInput] = useState('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [chatVisible, setChatVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [remoteParticipants, setRemoteParticipants] = useState([]);
  
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  
  const tenants = {
    acme: { name: 'Acme Corp', color: '#3b82f6' },
    techstar: { name: 'TechStar GmbH', color: '#10b981' },
    finwise: { name: 'FinWise Solutions', color: '#f59e0b' }
  };
  
  // Add system message
  const addSystemMessage = useCallback((text, isError = false) => {
    const message = {
      id: Date.now(),
      sender: 'System',
      text,
      time: new Date().toLocaleTimeString(),
      isError,
      isLocal: false
    };
    setChatMessages(prev => [...prev, message]);
  }, []);
  
  // Initialize local media stream
  const initLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      localStreamRef.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return true;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      addSystemMessage('Unable to access camera or microphone. Please check permissions.', true);
      return false;
    }
  };
  
  // Create meeting
  const createMeeting = async () => {
    if (!userName.trim()) {
      addSystemMessage('Please enter your name', true);
      return;
    }
    
    setIsConnecting(true);
    
    const streamSuccess = await initLocalStream();
    if (!streamSuccess) {
      setIsConnecting(false);
      return;
    }
    
    const meetingId = `meeting_${Math.random().toString(36).substring(2, 10)}`;
    setCurrentMeetingId(meetingId);
    setInMeeting(true);
    setParticipantCount(1);
    addSystemMessage(`Meeting created: ${meetingId}`);
    
    // Simulate participants joining
    setTimeout(() => {
      addSimulatedParticipant('Sarah Johnson');
      setTimeout(() => {
        addSimulatedParticipant('Mike Chen');
      }, 2000);
    }, 1000);
    
    setIsConnecting(false);
  };
  
  // Join meeting
  const joinMeeting = async () => {
    if (!meetingIdInput.trim()) {
      addSystemMessage('Please enter a meeting ID', true);
      return;
    }
    
    if (!userName.trim()) {
      addSystemMessage('Please enter your name', true);
      return;
    }
    
    setIsConnecting(true);
    
    const streamSuccess = await initLocalStream();
    if (!streamSuccess) {
      setIsConnecting(false);
      return;
    }
    
    setCurrentMeetingId(meetingIdInput);
    setInMeeting(true);
    setParticipantCount(3);
    addSystemMessage(`Joined meeting: ${meetingIdInput}`);
    
    // Add simulated participants
    setRemoteParticipants([
      { id: 'remote1', name: 'Alice Wong' },
      { id: 'remote2', name: 'David Kim' }
    ]);
    setParticipantCount(3);
    
    setIsConnecting(false);
  };
  
  // Add simulated participant
  const addSimulatedParticipant = (name) => {
    const newParticipant = {
      id: `remote_${Date.now()}_${Math.random()}`,
      name: name
    };
    setRemoteParticipants(prev => [...prev, newParticipant]);
    setParticipantCount(prev => prev + 1);
    addSystemMessage(`${name} joined the meeting`);
  };
  
  // Leave meeting
  const leaveMeeting = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    setInMeeting(false);
    setCurrentMeetingId(null);
    setIsVideoOff(false);
    setIsAudioMuted(false);
    setChatVisible(false);
    setChatMessages([]);
    setRemoteParticipants([]);
    setParticipantCount(0);
    addSystemMessage('You left the meeting');
  };
  
  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length) {
        const newMuteState = !isAudioMuted;
        audioTracks[0].enabled = !newMuteState;
        setIsAudioMuted(newMuteState);
      }
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length) {
        const newVideoState = !isVideoOff;
        videoTracks[0].enabled = !newVideoState;
        setIsVideoOff(newVideoState);
      }
    }
  };
  
  // Share screen
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = localStreamRef.current.getVideoTracks()[0];
        
        if (localStreamRef.current) {
          localStreamRef.current.removeTrack(sender);
          localStreamRef.current.addTrack(videoTrack);
        }
        
        setIsScreenSharing(true);
        addSystemMessage('Screen sharing started');
        
        videoTrack.onended = () => {
          toggleScreenShare();
        };
      } catch (err) {
        console.log('Screen share cancelled:', err);
      }
    } else {
      // Stop screen sharing
      if (localStreamRef.current) {
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          const oldVideo = localStreamRef.current.getVideoTracks()[0];
          if (oldVideo) localStreamRef.current.removeTrack(oldVideo);
          const newVideo = newStream.getVideoTracks()[0];
          localStreamRef.current.addTrack(newVideo);
          setIsScreenSharing(false);
          addSystemMessage('Screen sharing stopped');
        } catch (e) {
          console.warn('Failed to restore camera:', e);
        }
      }
    }
  };
  
  // Send chat message
  const sendChatMessage = () => {
    if (chatInput.trim()) {
      const message = {
        id: Date.now(),
        sender: userName,
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString(),
        isLocal: true
      };
      setChatMessages(prev => [...prev, message]);
      setChatInput('');
    }
  };
  
  // Copy meeting link
  const copyMeetingLink = () => {
    const link = `${window.location.origin}/products/video-conference?meeting=${currentMeetingId}`;
    navigator.clipboard.writeText(link);
    addSystemMessage('Meeting link copied to clipboard!');
  };
  
  // Handle tenant change
  const handleTenantChange = (tenantId) => {
    if (inMeeting) {
      addSystemMessage('Please leave current meeting before switching tenant.', true);
      return;
    }
    setCurrentTenant(tenantId);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  return (
    <div className="meet-container">
      {!inMeeting ? (
        // Lobby View
        <div className="lobby-container">
          <div className="lobby-card">
            <div className="lobby-header">
              <div className="lobby-icon">
                <i className="fas fa-video"></i>
              </div>
              <h1>Video Conference</h1>
              <p>Connect with your team securely</p>
            </div>
            
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name" 
              />
            </div>
            
            <div className="form-group">
              <label>Meeting ID</label>
              <input 
                type="text" 
                value={meetingIdInput}
                onChange={(e) => setMeetingIdInput(e.target.value)}
                placeholder="Enter meeting ID or create new" 
              />
            </div>
            
            <div className="button-group">
              <button 
                className="btn-create" 
                onClick={createMeeting}
                disabled={isConnecting}
              >
                <i className="fas fa-plus-circle"></i>
                {isConnecting ? 'Creating...' : 'Create Meeting'}
              </button>
              <button 
                className="btn-join" 
                onClick={joinMeeting}
                disabled={isConnecting}
              >
                <i className="fas fa-sign-in-alt"></i>
                Join Meeting
              </button>
            </div>
            
            <div className="tenant-selector">
              <i className="fas fa-building"></i>
              <select value={currentTenant} onChange={(e) => handleTenantChange(e.target.value)}>
                <option value="acme">Acme Corp</option>
                <option value="techstar">TechStar GmbH</option>
                <option value="finwise">FinWise Solutions</option>
              </select>
              <span className="tenant-badge">{tenants[currentTenant]?.name}</span>
            </div>
            
            <div className="security-note">
              <i className="fas fa-shield-alt"></i>
              <span>Secure end-to-end encrypted rooms</span>
            </div>
          </div>
        </div>
      ) : (
        // Meeting Room
        <div className="meeting-container">
          {/* Meeting Header */}
          <div className="meeting-header">
            <div className="meeting-info">
              <i className="fas fa-hashtag"></i>
              <span>Meeting ID: <strong>{currentMeetingId}</strong></span>
            </div>
            <div className="meeting-stats">
              <i className="fas fa-users"></i>
              <span>{participantCount} participants</span>
            </div>
            <button className="btn-copy" onClick={copyMeetingLink}>
              <i className="fas fa-copy"></i> Copy Invite
            </button>
          </div>
          
          {/* Video Grid */}
          <div className="video-grid">
            {/* Local Video */}
            <div className="video-tile local">
              <video 
                ref={localVideoRef}
                autoPlay 
                playsInline
                muted
                className={isVideoOff ? 'video-hidden' : ''}
              />
              {isVideoOff && (
                <div className="video-placeholder">
                  <i className="fas fa-user-circle"></i>
                  <span>Camera Off</span>
                </div>
              )}
              <div className="participant-label">
                <span>{userName} (You)</span>
                {isAudioMuted && <i className="fas fa-microphone-slash"></i>}
              </div>
            </div>
            
            {/* Remote Participants */}
            {remoteParticipants.map(participant => (
              <div key={participant.id} className="video-tile remote">
                <div className="video-placeholder">
                  <i className="fas fa-user-circle"></i>
                  <span>{participant.name}</span>
                </div>
                <div className="participant-label">
                  <span>{participant.name}</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Controls Bar */}
          <div className="controls-bar">
            <button 
              className={`control-btn ${isAudioMuted ? 'active' : ''}`}
              onClick={toggleAudio}
            >
              <i className={`fas ${isAudioMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
              <span>{isAudioMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            
            <button 
              className={`control-btn ${isVideoOff ? 'active' : ''}`}
              onClick={toggleVideo}
            >
              <i className={`fas ${isVideoOff ? 'fa-video-slash' : 'fa-video'}`}></i>
              <span>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
            </button>
            
            <button 
              className={`control-btn ${isScreenSharing ? 'active' : ''}`}
              onClick={toggleScreenShare}
            >
              <i className="fas fa-desktop"></i>
              <span>{isScreenSharing ? 'Stop Share' : 'Share Screen'}</span>
            </button>
            
            <button 
              className={`control-btn ${chatVisible ? 'active' : ''}`}
              onClick={() => setChatVisible(!chatVisible)}
            >
              <i className="fas fa-comment"></i>
              <span>Chat</span>
              {chatMessages.length > 0 && (
                <span className="chat-badge">{chatMessages.length}</span>
              )}
            </button>
            
            <button className="control-btn leave" onClick={leaveMeeting}>
              <i className="fas fa-phone-slash"></i>
              <span>Leave</span>
            </button>
          </div>
          
          {/* Chat Panel */}
          <div className={`chat-panel ${chatVisible ? 'open' : ''}`}>
            <div className="chat-header">
              <i className="fas fa-comments"></i>
              <span>Meeting Chat</span>
              <button className="chat-close" onClick={() => setChatVisible(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="chat-messages">
              {chatMessages.length === 0 ? (
                <div className="empty-chat">
                  <i className="fas fa-comment-dots"></i>
                  <p>No messages yet</p>
                </div>
              ) : (
                chatMessages.map(msg => (
                  <div key={msg.id} className={`message ${msg.isLocal ? 'local' : ''} ${msg.isError ? 'error' : ''}`}>
                    <div className="message-sender">{msg.sender}</div>
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">{msg.time}</div>
                  </div>
                ))
              )}
            </div>
            
            <div className="chat-input">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Type a message..." 
              />
              <button onClick={sendChatMessage}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetHub;