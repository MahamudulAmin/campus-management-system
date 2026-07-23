import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import { useState } from "react";

const AdminReports = () => {
  const [reports] = useState([
    {
      id: 1,
      title: "User Registration Report",
      description: "Monthly statistics on new user registrations",
      date: "2024-07-20",
      status: "Completed",
      users: 450,
    },
    {
      id: 2,
      title: "Request Processing Analysis",
      description: "Analysis of request submission and completion times",
      date: "2024-07-19",
      status: "Completed",
      requests: 1250,
    },
    {
      id: 3,
      title: "Office Performance Report",
      description: "Performance metrics for each university office",
      date: "2024-07-18",
      status: "Completed",
      offices: 5,
    },
    {
      id: 4,
      title: "Complaint Analysis",
      description: "Complaints filed and resolution status",
      date: "2024-07-17",
      status: "In Progress",
      complaints: 89,
    },
    {
      id: 5,
      title: "System Usage Report",
      description: "System activity and usage statistics",
      date: "2024-07-16",
      status: "Pending",
      activities: 5230,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return { bg: "#dcfce7", color: "#166534" };
      case "In Progress":
        return { bg: "#fef3c7", color: "#b45309" };
      default:
        return { bg: "#f3f4f6", color: "#666" };
    }
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <AdminNavbar />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: "30px" }}>
          <h1>Reports</h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>View and manage system reports</p>

          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Search reports..."
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  width: "300px",
                }}
              />
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Generate Report
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Report Title</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Description</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Date</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => {
                  const statusBadge = getStatusColor(report.status);
                  return (
                    <tr key={report.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>{report.title}</td>
                      <td style={{ padding: "12px", color: "#666" }}>{report.description}</td>
                      <td style={{ padding: "12px", color: "#666" }}>{report.date}</td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            backgroundColor: statusBadge.bg,
                            color: statusBadge.color,
                          }}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <button
                          style={{
                            padding: "4px 12px",
                            backgroundColor: "#dbeafe",
                            color: "#0369a1",
                            border: "1px solid #bfdbfe",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "5px",
                            fontSize: "12px",
                          }}
                        >
                          View
                        </button>
                        <button
                          style={{
                            padding: "4px 12px",
                            backgroundColor: "#dcfce7",
                            color: "#166534",
                            border: "1px solid #bbf7d0",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
