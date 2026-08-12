import React from 'react';

interface NavigationProps {
  user: {
    name: string;
    role: string;
    department?: string;
    office?: string;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ user, activeTab, setActiveTab, onLogout }) => {
  const isStaff = user.role === 'office_staff';

  const teacherTabs = [
    { id: 'updates', label: '📢 Announcements' },
    { id: 'messages', label: '💬 Communications' },
    { id: 'requests', label: '📝 Service Requests' },
  ];

  const staffTabs = [
    { id: 'review_requests', label: '📋 Review Requests' },
    { id: 'inbox', label: '📥 Office Messages' },
    { id: 'manage_info', label: '⚙️ Manage Campus Info' },
  ];

  const tabs = isStaff ? staffTabs : teacherTabs;

  return (
    <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px', fontWeight: '700' }}>Welcome, {user.name}</h2>
            <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '12px', background: isStaff ? '#dcfce7' : '#dbeafe', color: isStaff ? '#166534' : '#1e40af', textTransform: 'uppercase' }}>
              {isStaff ? 'Office Staff' : 'Faculty Member'}
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            {isStaff ? `Office: ${user.office || 'General'}` : `Department: ${user.department}`}
          </p>
        </div>
        <button onClick={onLogout} style={{ padding: '8px 14px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
          Sign Out
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? '#2563eb' : '#f1f5f9',
              color: activeTab === tab.id ? '#ffffff' : '#475569',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;