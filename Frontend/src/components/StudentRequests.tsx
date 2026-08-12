import React, { useState } from 'react';

interface RequestItem {
  title: string;
  category: string;
  status?: string;
  submitted_at?: string;
}

interface RequestsProps {
  requestsList: RequestItem[];
  onSubmitRequest: (title: string, category: string) => void;
}

const Requests: React.FC<RequestsProps> = ({ requestsList, onSubmitRequest }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Classroom Booking');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmitRequest(title, category);
    setTitle('');
  };

  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>📋 Service Requests</h3>

      {/* Submit Request Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
            Request Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
          >
            <option value="Classroom Booking">Classroom Booking</option>
            <option value="Lab Maintenance">Lab Maintenance</option>
            <option value="Course Schedule Adjustment">Course Schedule Adjustment</option>
            <option value="Equipment Requisition">Equipment Requisition</option>
          </select>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>
            Request Description / Title
          </label>
          <input
            type="text"
            placeholder="e.g., Requesting Projector Repair in Room BC6007"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Submit Request
        </button>
      </form>

      {/* Request History */}
      <h4 style={{ color: '#334155', marginBottom: '12px' }}>Submitted Requests</h4>
      {requestsList.length === 0 ? (
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>No requests submitted yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {requestsList.map((req, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: '#fff',
              }}
            >
              <div>
                <strong style={{ color: '#0f172a', fontSize: '15px' }}>{req.title}</strong>
                <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>Category: {req.category}</p>
              </div>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                }}
              >
                {req.status || 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;