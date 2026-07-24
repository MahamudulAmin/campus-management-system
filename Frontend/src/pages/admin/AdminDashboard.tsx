import { useNavigate } from "react-router-dom";
import { useState } from "react";

import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import SummaryCard from "../../components/SummaryCard";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats] = useState({
    users: 25,
    offices: 6,
    requests: 48,
    completed: 39,
    pending: 9,
  });

  const activities = [
    {
      id: 1,
      time: "09:30 AM",
      activity: "New student account created",
      type: "User",
    },
    {
      id: 2,
      time: "10:15 AM",
      activity: "Finance Office updated",
      type: "Office",
    },
    {
      id: 3,
      time: "11:20 AM",
      activity: "Request approved",
      type: "Request",
    },
    {
      id: 4,
      time: "12:05 PM",
      activity: "Monthly report generated",
      type: "Report",
    },
    {
      id: 5,
      time: "01:10 PM",
      activity: "Registrar Office modified",
      type: "Office",
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      color: "#2563EB",
      path: "/admin/users",
      icon: "👥",
    },
    {
      title: "Manage Offices",
      color: "#10B981",
      path: "/admin/offices",
      icon: "🏢",
    },
    {
      title: "Activities",
      color: "#F59E0B",
      path: "/admin/activities",
      icon: "📋",
    },
    {
      title: "Reports",
      color: "#8B5CF6",
      path: "/admin/reports",
      icon: "📈",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#EEF2F7",
      }}
    >
      <AdminSidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AdminNavbar />

        <main
          style={{
            padding: "30px",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {/* Header */}

          <div
            style={{
              marginBottom: "30px",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "34px",
                color: "#1E293B",
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                color: "#64748B",
                marginTop: "8px",
                fontSize: "15px",
              }}
            >
              Welcome back Administrator 👋
            </p>
          </div>

          {/* Summary */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <SummaryCard
              title="Total Users"
              value={stats.users}
              color="#2563EB"
            />

            <SummaryCard
              title="Offices"
              value={stats.offices}
              color="#10B981"
            />

            <SummaryCard
              title="Requests"
              value={stats.requests}
              color="#F59E0B"
            />

            <SummaryCard
              title="Completed"
              value={stats.completed}
              color="#22C55E"
            />

            <SummaryCard
              title="Pending"
              value={stats.pending}
              color="#EF4444"
            />
          </div>

          {/* Dashboard Grid */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "25px",
            }}
          >
            {/* Left */}

            <div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow:
                    "0 5px 15px rgba(0,0,0,.08)",
                  padding: "25px",
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                    color: "#1E293B",
                  }}
                >
                  Recent Activities
                </h2>

                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#F8FAFC",
                      }}
                    >
                      <th style={tableHead}>Time</th>
                      <th style={tableHead}>Activity</th>
                      <th style={tableHead}>Type</th>
                    </tr>
                  </thead>

                  <tbody>
                    {activities.map((item) => (
                      <tr key={item.id}>
                        <td style={tableCell}>
                          {item.time}
                        </td>

                        <td style={tableCell}>
                          {item.activity}
                        </td>

                        <td style={tableCell}>
                          {item.type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
                        {/* Right Side */}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",
              }}
            >
              {/* Quick Actions */}

              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 5px 15px rgba(0,0,0,.08)",
                  padding: "25px",
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: "20px",
                    color: "#1E293B",
                  }}
                >
                  Quick Actions
                </h2>

                {quickActions.map((action) => (
                  <button
                    key={action.title}
                    style={{
                      ...actionButton,
                      background: action.color,
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    <span>{action.icon}</span>
                    <span>{action.title}</span>
                  </button>
                ))}
              </div>

              {/* System Overview */}

              <div
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 5px 15px rgba(0,0,0,.08)",
                  padding: "25px",
                }}
              >
                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: "20px",
                    color: "#1E293B",
                  }}
                >
                  System Overview
                </h2>

                <div style={overviewItem}>
                  <span>👥 Users</span>
                  <strong>{stats.users}</strong>
                </div>

                <div style={overviewItem}>
                  <span>🏢 Offices</span>
                  <strong>{stats.offices}</strong>
                </div>

                <div style={overviewItem}>
                  <span>📄 Requests</span>
                  <strong>{stats.requests}</strong>
                </div>

                <div style={overviewItem}>
                  <span>✅ Completed</span>
                  <strong>{stats.completed}</strong>
                </div>

                <div style={overviewItem}>
                  <span>⏳ Pending</span>
                  <strong>{stats.pending}</strong>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const tableHead: React.CSSProperties = {
  padding: "14px",
  textAlign: "left",
  fontSize: "14px",
  color: "#475569",
  borderBottom: "2px solid #E2E8F0",
};

const tableCell: React.CSSProperties = {
  padding: "14px",
  borderBottom: "1px solid #E2E8F0",
  color: "#334155",
};

const actionButton: React.CSSProperties = {
  width: "100%",
  border: "none",
  color: "#fff",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: 600,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const overviewItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #E2E8F0",
  color: "#334155",
};

export default AdminDashboard;