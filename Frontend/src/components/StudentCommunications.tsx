import React, { useState } from 'react';

interface Message {
  office: string;
  message: string;
  timestamp?: string;
}

interface CommunicationsProps {
  messagesList: Message[];
  onSendMessage: (office: string, messageText: string) => void;
}

const Communications: React.FC<CommunicationsProps> = ({ messagesList, onSendMessage }) => {
  const [selectedOffice, setSelectedOffice] = useState('Registrar Office');
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    onSendMessage(selectedOffice, messageText);
    setMessageText('');
  };

  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>✉️ Official Communications</h3>

      {/* Message Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
            Select Office / Department
          </label>
          <select
            value={selectedOffice}
            onChange={(e) => setSelectedOffice(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
          >
            <option value="Registrar Office">Registrar Office</option>
            <option value="IT Support & Helpdesk">IT Support & Helpdesk</option>
            <option value="Dean of Engineering">Dean of Engineering</option>
            <option value="Exam Controller Office">Exam Controller Office</option>
          </select>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
            Message Content
          </label>
          <textarea
            rows={3}
            placeholder="Write your official message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Send Message
        </button>
      </form>

      {/* Message History */}
      <h4 style={{ color: '#334155', marginBottom: '12px' }}>Recent Messages Sent</h4>
      {messagesList.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>No messages sent yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messagesList.map((msg, idx) => (
            <div key={idx} style={{ padding: '14px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <strong style={{ color: '#0f172a', fontSize: '14px' }}>To: {msg.office}</strong>
              </div>
              <p style={{ margin: 0, color: '#475569', fontSize: '14px' }}>{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Communications;