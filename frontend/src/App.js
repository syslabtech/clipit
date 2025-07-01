import React, { useState } from 'react';
import './App.css';

// View components are now defined outside of the main App component.
// This prevents them from being re-created on every render, solving the focus issue.

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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span>Create New Room</span>
          </button>
          <button onClick={() => onNavigate('join')} className="glass-button-secondary w-full p-4 rounded-lg font-semibold flex items-center justify-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
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
            autoComplete="off"
          />
          <button onClick={onCreateRoom} disabled={loading} className="glass-button w-full p-3 rounded-lg font-semibold">
            {loading ? 'Creating...' : 'Create Room'}
          </button>
          <button onClick={() => onNavigate('join')} className="glass-button-secondary w-full p-3 rounded-lg font-semibold">
            Join Existing Room Instead
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
            autoComplete="off"
          />
          <button onClick={onLogin} disabled={loading} className="glass-button w-full p-3 rounded-lg font-semibold">
            {loading ? 'Joining...' : 'Join Room'}
          </button>
          <button onClick={() => onNavigate('create')} className="glass-button-secondary w-full p-3 rounded-lg font-semibold">
            Create New Room Instead
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
          <p className="text-gray-300">Room ID: {roomId.substring(0, 8)}...</p>
          <button onClick={onCopy} className="glass-button-secondary p-2 rounded-lg" title="Copy Room ID">Copy</button>
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

const App = () => {
  const [currentView, setCurrentView] = useState('welcome');
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

  const handleNavigation = (view) => {
    setPassword('');
    setRoomId('');
    setCurrentView(view);
  }

  const createRoom = async () => {
    // ... (rest of the functions remain the same)
  };

  // ... (loginRoom, saveClipboard, etc.)

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
