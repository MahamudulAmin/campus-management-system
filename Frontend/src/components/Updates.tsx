import React, { useState } from 'react';

interface UpdateItem {
  title: string;
  body: string;
  date: string;
  category?: string;
}

interface UpdatesProps {
  updatesList: UpdateItem[];
}

export const Updates: React.FC<UpdatesProps> = ({ updatesList }) => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<UpdateItem | null>(null);

  // Fallback sample data with body text if database is empty
  const defaultList: UpdateItem[] = updatesList.length > 0 ? updatesList : [
    {
      title: "New Campus Navigation Map Released",
      body: "We have updated the floor maps for Building C and the Science Complex. Interactive kiosks are now live near the main elevator lobby. Teachers can view updated lab route shortcuts.",
      date: "2026-07-29",
      category: "Navigation System"
    },
    {
      title: "Faculty Lounge Renovations in Block B",
      body: "Block B faculty lounge will remain closed for maintenance this Friday. Alternative working spaces have been allocated on the 3rd floor of the Library.",
      date: "2026-07-28",
      category: "Facility Notice"
    }
  ];

  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>📢 Important Campus Announcements</h3>
      <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
        Click on any announcement card to read the complete details.
      </p>

      {/* Announcements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {defaultList.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedAnnouncement(item)}
            style={{
              background: '#ffffff',
              padding: '18px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              borderLeft: '5px solid #2563eb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <h4 style={{ margin: 0, color: '#1e293b', fontSize: '16px' }}>{item.title}</h4>
              <span style={{ fontSize: '12px', color: '#64748b', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>
                {item.date}
              </span>
            </div>
            <p style={{ margin: 0, color: '#475569', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.body}
            </p>
            <span style={{ color: '#2563eb', fontSize: '13px', fontWeight: 'bold', display: 'inline-block', marginTop: '8px' }}>
              Read full body →
            </span>
          </div>
        ))}
      </div>

      {/* Clickable Modal Popup */}
      {selectedAnnouncement && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#ffffff', width: '90%', maxWidth: '520px', padding: '28px',
            borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '20px' }}>{selectedAnnouncement.title}</h3>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold', marginBottom: '16px' }}>
              Published on: {selectedAnnouncement.date}
            </p>
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', color: '#334155', lineHeight: '1.6', fontSize: '15px' }}>
              {selectedAnnouncement.body}
            </div>
            <button
              onClick={() => setSelectedAnnouncement(null)}
              style={{
                marginTop: '24px', width: '100%', padding: '10px',
                background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px',
                fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Updates;