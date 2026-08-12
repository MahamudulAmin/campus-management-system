import React from 'react';

interface NavigationProps {
  teacherName: string;
  department: string;
  activeTab: 'updates' | 'messages' | 'requests';
  setActiveTab: (tab: 'updates' | 'messages' | 'requests') => void;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  teacherName,
  department,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  return (
    <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
      {/* Top Banner with Teacher Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '22px', fontWeight: '700' }}>
            Welcome, {teacherName}
          </h2>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
            Department: {department}
          </span>
        </div>
        <button
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            background: '#fecaca',
            color: '#991b1b',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Sign Out
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('updates')}
          style={{
            padding: '10px 18px',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'updates' ? '#2563eb' : '#f1f5f9',
            color: activeTab === 'updates' ? '#ffffff' : '#475569',
          }}
        >
          📢 Announcements
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          style={{
            padding: '10px 18px',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'messages' ? '#2563eb' : '#f1f5f9',
            color: activeTab === 'messages' ? '#ffffff' : '#475569',
          }}
        >
          💬 Communications
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '10px 18px',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: activeTab === 'requests' ? '#2563eb' : '#f1f5f9',
            color: activeTab === 'requests' ? '#ffffff' : '#475569',
          }}
        >
          📝 Service Requests
        </button>
      </div>
    </div>
  );
};

export default Navigation;