import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";

const AdminDashboard = () => {
  const stats = [
    { label: "Total Users", value: 1250, color: "#3498db", icon: "👥" },
    { label: "Active Offices", value: 12, color: "#2ecc71", icon: "🏛️" },
    { label: "Pending Reports", value: 45, color: "#e74c3c", icon: "📊" },
    { label: "Recent Activities", value: 328, color: "#f39c12", icon: "📈" },
  ];

  const recentActivities = [
    { id: 1, activity: "New user registration", timestamp: "2 hours ago", type: "user" },
    { id: 2, activity: "Request submitted - Transcript", timestamp: "4 hours ago", type: "request" },
    { id: 3, activity: "Complaint filed - Academic", timestamp: "6 hours ago", type: "complaint" },
    { id: 4, activity: "Office updated - Registration", timestamp: "1 day ago", type: "office" },
    { id: 5, activity: "System maintenance completed", timestamp: "2 days ago", type: "system" },
  ];

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <AdminNavbar />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: "30px" }}>
          <h1>Admin Dashboard</h1>
          <p style={{ color: "#666", marginBottom: "30px" }}>Welcome to the Campus Management System Admin Panel</p>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  borderLeft: `4px solid ${stat.color}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ color: "#999", margin: "0 0 8px 0", fontSize: "14px" }}>{stat.label}</p>
                    <h2 style={{ margin: 0, color: stat.color, fontSize: "32px" }}>{stat.value}</h2>
                  </div>
                  <div style={{ fontSize: "40px" }}>{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activities */}
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2>Recent Activities</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Activity</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Type</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity) => (
                  <tr key={activity.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>{activity.activity}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor:
                            activity.type === "user"
                              ? "#dbeafe"
                              : activity.type === "request"
                              ? "#dcfce7"
                              : activity.type === "complaint"
                              ? "#fee2e2"
                              : "#fef3c7",
                          color:
                            activity.type === "user"
                              ? "#0369a1"
                              : activity.type === "request"
                              ? "#166534"
                              : activity.type === "complaint"
                              ? "#991b1b"
                              : "#b45309",
                        }}
                      >
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: "12px", color: "#999" }}>{activity.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
