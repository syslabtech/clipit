import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import './App.css';

const API_BASE = `http://${process.env.REACT_APP_BACKEND_URL || 'localhost:8001'}`;

const WelcomeView = () => (
    <div className="view-container">
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Clipboard App</h1>
                    <p className="text-gray-300 mb-8">Secure room-based clipboard with modern glass design</p>
                </div>
                <div className="space-y-4">
                    <Link to="/create" className="glass-button w-full p-4 rounded-lg font-semibold flex items-center justify-center space-x-3">
                        <span>Create New Room</span>
                    </Link>
                    <Link to="/join" className="glass-button-secondary w-full p-4 rounded-lg font-semibold flex items-center justify-center space-x-3">
                       <span>Join Existing Room</span>
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

const CreateRoomView = ({ showMessage }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateRoom = async () => {
        if (!password.trim()) {
            showMessage('Please enter a password');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/rooms/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (response.ok) {
                showMessage('Room created successfully!');
                navigate(`/clipboard/${data.room_id}`);
            } else {
                showMessage(data.detail || 'Failed to create room');
            }
        } catch (error) {
            console.error("Create room failed:", error);
            showMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
         <div className="view-container">
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="glass-card w-full max-w-md p-8 space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Create New Room</h1>
                        <p className="text-gray-300">Set up your secure clipboard room</p>
                    </div>
                    <div className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="glass-input w-full p-3 rounded-lg"
                            placeholder="Enter a secure password"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleCreateRoom(); }}
                            autoComplete="new-password"
                        />
                        <button onClick={handleCreateRoom} disabled={loading} className="glass-button w-full p-3 rounded-lg font-semibold">
                            {loading ? 'Creating...' : 'Create Room'}
                        </button>
                        <Link to="/join" className="glass-button-secondary w-full p-3 rounded-lg font-semibold block text-center">
                            Join Existing Room Instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const JoinRoomView = ({ showMessage }) => {
    const [roomId, setRoomId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!roomId.trim() || !password.trim()) {
            showMessage('Please enter both Room ID and password');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/rooms/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_id: roomId, password }),
            });
            const data = await response.json();
            if (response.ok) {
                showMessage('Login successful!');
                navigate(`/clipboard/${roomId}`, { state: { clipboardText: data.clipboard_text || '' } });
            } else {
                showMessage(data.detail || 'Login failed');
            }
        } catch (error) {
            console.error("Login failed:", error);
            showMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="view-container">
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="glass-card w-full max-w-md p-8 space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Join Room</h1>
                        <p className="text-gray-300">Enter your room credentials</p>
                    </div>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="glass-input w-full p-3 rounded-lg"
                            placeholder="Enter room ID"
                            autoComplete="off"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="glass-input w-full p-3 rounded-lg"
                            placeholder="Enter room password"
                            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                            autoComplete="current-password"
                        />
                        <button onClick={handleLogin} disabled={loading} className="glass-button w-full p-3 rounded-lg font-semibold">
                            {loading ? 'Joining...' : 'Join Room'}
                        </button>
                        <Link to="/create" className="glass-button-secondary w-full p-3 rounded-lg font-semibold block text-center">
                            Create New Room Instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClipboardView = ({ showMessage }) => {
    const { roomId } = useParams();
    const [clipboardText, setClipboardText] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClipboard = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/rooms/${roomId}/clipboard`);
                const data = await response.json();
                if (response.ok) {
                    setClipboardText(data.clipboard_text || '');
                } else {
                    showMessage(data.detail || 'Failed to fetch clipboard');
                    navigate('/join');
                }
            } catch (error) {
                console.error("Fetch clipboard failed:", error);
                showMessage('Network error. Cannot fetch clipboard.');
                navigate('/join');
            }
        };
        fetchClipboard();
    }, [roomId, navigate, showMessage]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/rooms/clipboard/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_id: roomId, text: clipboardText }),
            });
            const data = await response.json();
            if (response.ok) {
                showMessage('Clipboard saved successfully!');
            } else {
                showMessage(data.detail || 'Failed to save clipboard');
            }
        } catch (error) {
            console.error("Save clipboard failed:", error);
            showMessage('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleClear = () => {
        setClipboardText('');
        showMessage('Clipboard cleared locally. Hit "Save" to sync.');
    };

    const handleCopyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            showMessage('Room ID copied to clipboard!');
        } catch (err) {
            showMessage('Failed to copy Room ID.');
        }
    };
    
    return (
        <div className="view-container">
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <div className="glass-card w-full max-w-md p-8 space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Clipboard</h1>
                        <div className="flex items-center justify-center gap-2">
                            <p className="text-gray-300">Room ID: {roomId.substring(0, 8)}...</p>
                            <button onClick={handleCopyRoomId} className="glass-button-secondary p-2 rounded-lg" title="Copy Room ID">Copy</button>
                        </div>
                    </div>
                    <textarea
                        value={clipboardText}
                        onChange={(e) => setClipboardText(e.target.value)}
                        className="glass-input w-full p-3 rounded-lg h-48"
                        placeholder="Enter text to share..."
                        spellCheck={false}
                    />
                    <div className="flex flex-wrap gap-4">
                        <button onClick={handleSave} disabled={loading} className="glass-button flex-1 p-3 rounded-lg font-semibold">
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={handleClear} className="glass-button-secondary flex-1 p-3 rounded-lg font-semibold">Clear</button>
                    </div>
                    <button onClick={() => navigate('/')} className="glass-button-danger w-full p-3 rounded-lg font-semibold">Exit Room</button>
                </div>
            </div>
        </div>
    );
};

const App = () => {
  const [message, setMessage] = useState('');

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="App">
      {message && (
        <div className={`message-toast ${message.includes('success') ? 'message-success' : 'message-error'}`}>
          {message}
        </div>
      )}
      <Routes>
        <Route path="/" element={<WelcomeView />} />
        <Route path="/create" element={<CreateRoomView showMessage={showMessage} />} />
        <Route path="/join" element={<JoinRoomView showMessage={showMessage} />} />
        <Route path="/clipboard/:roomId" element={<ClipboardView showMessage={showMessage} />} />
      </Routes>
    </div>
  );
};

export default App;
