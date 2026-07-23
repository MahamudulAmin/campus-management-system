import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import { useState } from "react";

const AdminActivities = () => {
  const [activities] = useState([
    { id: 1, user: "Ahmed Hassan", action: "New user registration", details: "Student enrolled", timestamp: "2024-07-22 14:30", icon: "👤" },
    { id: 2, user: "Fatima Khan", action: "Request submitted", details: "Transcript request to Registration Office", timestamp: "2024-07-22 13:15", icon: "📄" },
    { id: 3, user: "Ali Mohammed", action: "Complaint filed", details: "Academic issue complaint", timestamp: "2024-07-22 11:45", icon: "⚠️" },
    { id: 4, user: "Admin Panel", action: "Office updated", details: "Registration Office contact updated", timestamp: "2024-07-22 10:20", icon: "🏛️" },
    { id: 5, user: "Zainab Ibrahim", action: "Profile updated", details: "Student changed email address", timestamp: "2024-07-22 09:05", icon: "✏️" },
    { id: 6, user: "Hassan Ali", action: "Report generated", details: "Monthly user statistics report", timestamp: "2024-07-21 16:40", icon: "📊" },
    { id: 7, user: "Sarah Johnson", action: "Request approved", details: "Certificate request approved", timestamp: "2024-07-21 14:10", icon: "✅" },
    { id: 8, user: "System", action: "Backup completed", details: "Database backup executed successfully", timestamp: "2024-07-21 12:00", icon: "💾" },
    { id: 9, user: "Admin Panel", action: "Notice posted", details: "Campus closure notice published", timestamp: "2024-07-21 10:30", icon: "📢" },
    { id: 10, user: "Muhammad Usman", action: "New office added", details: "Health & Wellness Center added", timestamp: "2024-07-20 15:45", icon: "🏥" },
  ]);

  const getActivityColor = (action: string) => {
    if (action.includes("registration")) return "#3498db";
    if (action.includes("submitted")) return "#2ecc71";
    if (action.includes("filed")) return "#e74c3c";
    if (action.includes("updated")) return "#f39c12";
    if (action.includes("approved")) return "#27ae60";
    if (action.includes("Backup")) return "#9b59b6";
    return "#95a5a6";
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <AdminNavbar />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: "30px" }}>
          <h1>Recent Activities</h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>View all system activities and user actions</p>

          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
              <select
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  width: "200px",
                }}
              >
                <option>All Activities</option>
                <option>Registration</option>
                <option>Requests</option>
                <option>Complaints</option>
                <option>Office Updates</option>
              </select>
              <input
                type="text"
                placeholder="Search activities..."
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  flex: 1,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  style={{
                    padding: "16px",
                    borderBottom: index !== activities.length - 1 ? "1px solid #eee" : "none",
                    display: "flex",
                    gap: "15px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      minWidth: "40px",
                    }}
                  >
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <p style={{ margin: "0 0 4px 0", fontWeight: "bold", color: "#1f2937" }}>
                          {activity.user}
                        </p>
                        <p
                          style={{
                            margin: "0 0 4px 0",
                            color: getActivityColor(activity.action),
                            fontWeight: "600",
                          }}
                        >
                          {activity.action}
                        </p>
                        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
                          {activity.details}
                        </p>
                      </div>
                      <span style={{ color: "#999", fontSize: "12px", whiteSpace: "nowrap" }}>
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                style={{
                  padding: "10px 30px",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#666",
                }}
              >
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminActivities;
