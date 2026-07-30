import React, { useState, useEffect } from 'react';
import LoginPage from './Login';
import  Navigation  from './components/Navigation';
import Updates from './components/Updates';
import Communications from './components/Communications';
import Requests from './components/Requests';

interface User {
  name: string;
  user_id: string;
  department: string;
}

export const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'updates' | 'messages' | 'requests'>('updates');
  const [messages, setMessages] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, activeTab]);

  const fetchData = async () => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (activeTab === 'messages') {
        const res = await fetch('http://localhost:5000/api/messages', { headers });
        if (res.ok) setMessages(await res.json());
      } else if (activeTab === 'requests') {
        const res = await fetch('http://localhost:5000/api/requests', { headers });
        if (res.ok) setRequests(await res.json());
      } else if (activeTab === 'updates') {
        const res = await fetch('http://localhost:5000/api/updates', { headers });
        if (res.ok) setUpdates(await res.json());
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLoginSuccess = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  const handleSendMessage = async (office: string, messageText: string) => {
    try {
      await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ office, message: messageText }),
      });
      fetchData();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleSubmitRequest = async (title: string, category: string) => {
    try {
      await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, category }),
      });
      fetchData();
    } catch (err) {
      console.error('Failed to submit request:', err);
    }
  };

  if (!token || !user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        <Navigation
          teacherName={user?.name || 'Faculty Member'}
          department={user?.department || 'Department'}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />

        <div style={{ marginTop: '20px' }}>
          {activeTab === 'updates' && <Updates updatesList={updates} />}
          {activeTab === 'messages' && <Communications messagesList={messages} onSendMessage={handleSendMessage} />}
          {activeTab === 'requests' && <Requests requestsList={requests} onSubmitRequest={handleSubmitRequest} />}
        </div>

      </div>
    </div>
  );
};

export default App;