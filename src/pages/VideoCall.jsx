import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RequireAuth from '../Components/RequireAuth';

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const myVideoRef = useRef(null);
  const partnerVideoRef = useRef(null);
  const peerRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenShare, setIsScreenShare] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [otherUserId] = useState('');

  useEffect(() => {
    const tenant = JSON.parse(localStorage.getItem('current_tenant') || '{}');
    if (!tenant.id) {
      navigate('/login');
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      myVideoRef.current.srcObject = stream;
      myVideoRef.current.play();

      peerRef.current = new window.Peer(undefined, {
        host: 'peerjs-server.herokuapp.com',
        secure: true,
        port: 443
      });

      peerRef.current.on('open', (id) => {
        console.log('My peer ID is: ' + id);
      });

      peerRef.current.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          partnerVideoRef.current.srcObject = remoteStream;
          partnerVideoRef.current.play();
          setParticipants(2);
        });
      });

      // Listen for other users
      window.socket = window.io.connect('https://prokat.herokuapp.com'); // Free signaling server
      window.socket.emit('join-room', roomId, peerRef.current.id);

      window.socket.on('user-connected', (userId) => {
        setOtherUserId(userId);
        const call = peerRef.current.call(userId, stream);
        call.on('stream', (remoteStream) => {
          partnerVideoRef.current.srcObject = remoteStream;
          partnerVideoRef.current.play();
          setParticipants(2);
        });
      });

      window.socket.on('user-disconnected', () => {
        setParticipants(1);
        partnerVideoRef.current.srcObject = null;
      });
    });

    return () => {
      if (peerRef.current) peerRef.current.destroy();
      if (window.socket) window.socket.disconnect();
    };
  }, [roomId, navigate]);

  const toggleMute = () => {
    const stream = myVideoRef.current.srcObject;
    const audioTrack = stream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsMuted(!isMuted);
  };

  const toggleScreenShare = async () => {
    const stream = myVideoRef.current.srcObject;
    if (isScreenShare) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((camStream) => {
        myVideoRef.current.srcObject = camStream;
        stream.getTracks().forEach(track => track.stop());
        setIsScreenShare(false);
      });
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        myVideoRef.current.srcObject = screenStream;
        stream.getTracks().forEach(track => track.stop());
        setIsScreenShare(true);
      } catch (err) {
        console.error('Screen share error:', err);
      }
    }
  };

  const leaveCall = () => {
    navigate('/video-conferencing');
  };

  return (
    <RequireAuth>
      <div style={{ height: '100vh', background: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', background: '#2d3748', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>
            <i className="fas fa-video" style={{ marginRight: '10px' }}></i>
            Room: {roomId}
          </h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>Participants: {participants}</span>
            <button onClick={toggleMute} style={{ padding: '10px 20px', background: isMuted ? '#f56565' : '#48bb78', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              {isMuted ? <i className="fas fa-microphone-slash"></i> : <i className="fas fa-microphone"></i>}
            </button>
            <button onClick={toggleScreenShare} style={{ padding: '10px 20px', background: isScreenShare ? '#ed8936' : '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              <i className="fas fa-desktop"></i>
            </button>
            <button onClick={leaveCall} style={{ padding: '10px 20px', background: '#f56565', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Leave
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', gap: '20px', padding: '20px', overflow: 'hidden' }}>
          <video ref={myVideoRef} style={{ width: '30%', background: '#000', borderRadius: '10px' }} muted />
          <video ref={partnerVideoRef} style={{ width: '70%', background: '#000', borderRadius: '10px' }} autoPlay />

          {participants === 1 && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#666' }}>
              <i className="fas fa-user-plus" style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.5 }}></i>
              <p>Share room link to invite others</p>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
};

export default VideoCall;

