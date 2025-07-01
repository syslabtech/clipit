import React, { useState } from 'react';
import './App.css';

// --- View Components ---
// Defined outside the main App component to prevent re-creation on render, which solves the focus loss issue.

const WelcomeView = ({ message, onNavigate }) => (
  <div className="view-container">
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Clipboard App</h1>
          <p className="text-gray-300 mb-8">Secure room-based clipboard with modern glass design</p>
        </div>
        {message && <div className={`message ${message.includes('success') ? 'message-success' : 'message-error'}`}>{message}</div>}
        <div className="space-y-4">
          <button onClick={() => onNavigate('create')} className="glass-button w-full p-4 rounded-lg font-semibold flex items-center justify-center space-x-3">
            <span>Create New Room</span>
          </button>
          <button onClick={() => onNavigate('join')} className="glass-button-secondary w-full p-4 rounded-lg font-semibold flex items-center justify-center space-x-3">
            <span>Join Existing Room</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CreateRoomView = ({ password, setPassword, onCreateRoom, onNavigate, loading, message }) => (
  <div className="view-container">
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Room</h1>
          <p className="text-gray-300">Set up your secure clipboard room</p>
        </div>
        {message && <div className={`message ${message.includes('success') ? 'message-success' : 'message-error'}`}>{message}</div>}
        <div className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input w-full p-3 rounded-lg"
            placeholder="Enter a secure password"
            onKeyDown={(e) => { if (e.key === 'Enter') onCreateRoom(); }}
            autoComplete="off"
          />
          <button onClick={onCreateRoom} disabled={loading} className="glass-button w-full p-3 rounded-lg font-semibold">
            {loading ? 'Creating...' : 'Create Room'}
          </button>
          <button onClick={() => onNavigate('welcome')} className="glass-button-secondary w-full p-3 rounded-lg font-semibold">
            Back to Welcome
          </button>
        </div>
      </div>
    </div>
  </div>
);

const JoinRoomView = ({ roomId, setRoomId, password, setPassword, onLogin, onNavigate, loading, message }) => (
  <div className="view-container">
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Join Room</h1>
          <p className="text-gray-300">Enter your room credentials</p>
        </div>
        {message && <div className={`message ${message.includes('success') ? 'message-success' : 'message-error'}`}>{message}</div>}
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
            onKeyDown={(e) => { if (e.key === 'Enter') onLogin(); }}
            autoComplete="off"
          />
          <button onClick={onLogin} disabled={loading} className="glass-button w-full p-3 rounded-lg font-semibold">
            {loading ? 'Joining...' : 'Join Room'}
          </button>
          <button onClick={() => onNavigate('welcome')} className="glass-button-secondary w-full p-3 rounded-lg font-semibold">
            Back to Welcome
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ClipboardView = ({ roomId, clipboardText, setClipboardText, onSave, onClear, onCopy, onExit, loading, message }) => (
  <div className="view-container">
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Clipboard</h1>
          <div className="flex items-center justify-center gap-2">
             <p className="text-gray-300">Room ID: {roomId.substring(0, 8)}...</p>
            <button onClick={onCopy} className="glass-button-secondary p-2 rounded-lg" title="Copy Room ID">Copy</button>
          </div>
        </div>
        {message && <div className={`message ${message.includes('success') ? 'message-success' : 'message-error'}`}>{message}</div>}
        <textarea
          value={clipboardText}
          onChange={(e) => setClipboardText(e.target.value)}
          className="glass-input w-full p-3 rounded-lg h-48"
          placeholder="Enter text to share..."
          spellCheck={false}
        />
        <div className="flex flex-wrap gap-4">
          <button onClick={onSave} disabled={loading} className="glass-button flex-1 p-3 rounded-lg font-semibold">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={onClear} className="glass-button-secondary flex-1 p-3 rounded-lg font-semibold">Clear</button>
        </div>
        <button onClick={onExit} className="glass-button-danger w-full p-3 rounded-lg font-semibold">Exit Room</button>
      </div>
    </div>
  </div>
);

// --- Main App Component ---

const App = () => {
  const [currentView, setCurrentView] = useState('welcome');
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [clipboardText, setClipboardText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleNavigation = (view) => {
    setPassword('');
    setRoomId('');
    setMessage('');
    setCurrentView(view);
  }

  const createRoom = async () => {
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
        setRoomId(data.room_id);
        setCurrentView('clipboard');
        showMessage('Room created successfully!');
      } else {
        showMessage(data.detail || 'Failed to create room');
      }
    } catch (error) {
      showMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginRoom = async () => {
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
        setClipboardText(data.clipboard_text || '');
        setCurrentView('clipboard');
        showMessage('Login successful!');
      } else {
        showMessage(data.detail || 'Login failed');
      }
    } catch (error) {
      showMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveClipboard = async () => {
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
      showMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearClipboard = () => {
    setClipboardText('');
    showMessage('Clipboard cleared locally.');
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      showMessage('Room ID copied to clipboard!');
    } catch (err) {
      showMessage('Failed to copy Room ID.');
    }
  };

  const exitRoom = () => {
    handleNavigation('welcome');
    showMessage('Exited room.');
  };

  const renderView = () => {
    switch (currentView) {
      case 'create':
        return <CreateRoomView password={password} setPassword={setPassword} onCreateRoom={createRoom} onNavigate={handleNavigation} loading={loading} message={message} />;
      case 'join':
        return <JoinRoomView roomId={roomId} setRoomId={setRoomId} password={password} setPassword={setPassword} onLogin={loginRoom} onNavigate={handleNavigation} loading={loading} message={message} />;
      case 'clipboard':
        return <ClipboardView roomId={roomId} clipboardText={clipboardText} setClipboardText={setClipboardText} onSave={saveClipboard} onClear={clearClipboard} onCopy={copyRoomId} onExit={exitRoom} loading={loading} message={message} />;
      default:
        return <WelcomeView message={message} onNavigate={handleNavigation} />;
    }
  };

  return <div className="App">{renderView()}</div>;
};

export default App;
