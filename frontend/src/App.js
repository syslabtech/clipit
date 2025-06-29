import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'create', 'join', 'clipboard'
  const [roomId, setRoomId] = useState('');
  const [password, setPassword] = useState('');
  const [clipboardText, setClipboardText] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const resetForm = () => {
    setPassword('');
    setRoomId('');
  };

  const createRoom = async () => {
    if (!password.trim()) {
      showMessage('Please enter a password', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setRoomId(data.room_id);
        setCurrentView('clipboard');
        showMessage('Room created successfully!', 'success');
      } else {
        showMessage(data.detail || 'Failed to create room', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loginRoom = async () => {
    if (!roomId.trim() || !password.trim()) {
      showMessage('Please enter both Room ID and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/rooms/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room_id: roomId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setClipboardText(data.clipboard_text || '');
        setCurrentView('clipboard');
        showMessage('Login successful!', 'success');
      } else {
        showMessage(data.detail || 'Login failed', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveClipboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/rooms/clipboard/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room_id: roomId, text: clipboardText }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Clipboard saved successfully!', 'success');
      } else {
        showMessage(data.detail || 'Failed to save clipboard', 'error');
      }
    } catch (error) {
      showMessage('Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearClipboard = () => {
    setClipboardText('');
    showMessage('Clipboard cleared (not saved yet)', 'info');
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      showMessage('Room ID copied to clipboard!', 'success');
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = roomId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showMessage('Room ID copied to clipboard!', 'success');
    }
  };

  const exitRoom = () => {
    setCurrentView('welcome');
    setRoomId('');
    setPassword('');
    setClipboardText('');
    showMessage('Exited room', 'info');
  };

  const WelcomeView = () => (
    <div className="view-container">
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Clipboard App</h1>
            <p className="text-gray-300 mb-8">Secure room-based clipboard with modern glass design</p>
          </div>

          {message && (
            <div className={`message ${message.includes('success') ? 'message-success' : message.includes('error') ? 'message-error' : 'message-info'}`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={() => {
                resetForm();
                setCurrentView('create');
              }}
              className="glass-button w-full p-4 rounded-lg font-semibold flex items-center justify-center space-x-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create New Room</span>
            </button>

            <button
              onClick={() => {
                resetForm();
                setCurrentView('join');
              }}
              className="glass-button-secondary w-full p-4 rounded-lg font-semibold flex items-center justify-center space-x-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Join Existing Room</span>
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              Unlimited text • Encrypted passwords • Mobile optimized
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const CreateRoomView = () => (
    <div className="view-container">
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Create New Room</h1>
            <p className="text-gray-300">Set up your secure clipboard room</p>
          </div>

          {message && (
            <div className={`message ${message.includes('success') ? 'message-success' : message.includes('error') ? 'message-error' : 'message-info'}`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full p-3 rounded-lg"
                placeholder="Enter a secure password"
                onKeyDown={(e) => { if (e.key === 'Enter') createRoom(); }}
                autoComplete="off"
                autoFocus
              />
            </div>

            <button
              onClick={createRoom}
              disabled={loading}
              className="glass-button w-full p-3 rounded-lg font-semibold"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>

            <button
              onClick={() => {
                resetForm();
                setCurrentView('join');
              }}
              className="glass-button-secondary w-full p-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Join Existing Room Instead</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const JoinRoomView = () => (
    <div className="view-container">
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Join Room</h1>
            <p className="text-gray-300">Enter your room credentials</p>
          </div>

          {message && (
            <div className={`message ${message.includes('success') ? 'message-success' : message.includes('error') ? 'message-error' : 'message-info'}`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="glass-input w-full p-3 rounded-lg"
                placeholder="Enter room ID"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full p-3 rounded-lg"
                placeholder="Enter room password"
                onKeyDown={(e) => { if (e.key === 'Enter') loginRoom(); }}
                autoComplete="off"
              />
            </div>

            <button
              onClick={loginRoom}
              disabled={loading}
              className="glass-button w-full p-3 rounded-lg font-semibold"
            >
              {loading ? 'Joining...' : 'Join Room'}
            </button>

            <button
              onClick={() => {
                resetForm();
                setCurrentView('create');
              }}
              className="glass-button-secondary w-full p-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create New Room Instead</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ClipboardView = () => (
    <div className="view-container">
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="glass-card w-full max-w-md p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Clipboard</h1>
            <div className="flex items-center justify-center gap-2">
              <p className="text-gray-300">Room ID: {roomId.substring(0, 8)}...</p>
              <button
                onClick={copyRoomId}
                className="glass-button-secondary p-2 rounded-lg"
                title="Copy Room ID"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {message && (
            <div className={`message ${message.includes('success') ? 'message-success' : message.includes('error') ? 'message-error' : 'message-info'}`}>
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Clipboard Content
              </label>
              <textarea
                value={clipboardText}
                onChange={(e) => setClipboardText(e.target.value)}
                className="glass-input w-full p-3 rounded-lg h-48"
                placeholder="Enter text to share..."
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={saveClipboard}
                disabled={loading}
                className="glass-button flex-1 p-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>

              <button
                onClick={clearClipboard}
                className="glass-button-secondary flex-1 p-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear</span>
              </button>
            </div>

            <button
              onClick={exitRoom}
              className="glass-button-danger w-full p-3 rounded-lg font-semibold flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Exit Room</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      {currentView === 'welcome' && <WelcomeView />}
      {currentView === 'create' && <CreateRoomView />}
      {currentView === 'join' && <JoinRoomView />}
      {currentView === 'clipboard' && <ClipboardView />}
    </div>
  );
};

export default App;