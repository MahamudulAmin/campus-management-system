import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import { useState } from "react";

const AdminUsers = () => {
  const [users] = useState([
    { id: 1, name: "Ahmed Hassan", email: "ahmed@university.edu", role: "Student", status: "Active", joinDate: "2024-01-15" },
    { id: 2, name: "Fatima Khan", email: "fatima@university.edu", role: "Student", status: "Active", joinDate: "2024-02-20" },
    { id: 3, name: "Ali Mohammed", email: "ali@university.edu", role: "Staff", status: "Active", joinDate: "2023-11-10" },
    { id: 4, name: "Zainab Ibrahim", email: "zainab@university.edu", role: "Student", status: "Inactive", joinDate: "2024-01-05" },
    { id: 5, name: "Hassan Ali", email: "hassan@university.edu", role: "Admin", status: "Active", joinDate: "2023-09-01" },
    { id: 6, name: "Sarah Johnson", email: "sarah@university.edu", role: "Staff", status: "Active", joinDate: "2023-10-15" },
  ]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return { bg: "#fee2e2", color: "#991b1b" };
      case "Staff":
        return { bg: "#dbeafe", color: "#0369a1" };
      default:
        return { bg: "#dcfce7", color: "#166534" };
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active" ? { bg: "#dcfce7", color: "#166534" } : { bg: "#f3f4f6", color: "#666" };
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <AdminNavbar />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: "30px" }}>
          <h1>Total Users</h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>Manage all users in the system</p>

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
                placeholder="Search users..."
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
                Add User
              </button>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Name</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Email</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Role</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Status</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Join Date</th>
                  <th style={{ textAlign: "left", padding: "12px", color: "#666" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const roleBadge = getRoleBadgeColor(user.role);
                  const statusBadge = getStatusColor(user.status);
                  return (
                    <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px" }}>{user.name}</td>
                      <td style={{ padding: "12px", color: "#666" }}>{user.email}</td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            backgroundColor: roleBadge.bg,
                            color: roleBadge.color,
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
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
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px", color: "#666" }}>{user.joinDate}</td>
                      <td style={{ padding: "12px" }}>
                        <button
                          style={{
                            padding: "4px 12px",
                            backgroundColor: "#f3f4f6",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            cursor: "pointer",
                            marginRight: "5px",
                            fontSize: "12px",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          style={{
                            padding: "4px 12px",
                            backgroundColor: "#fee2e2",
                            border: "1px solid #fecaca",
                            color: "#991b1b",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          Delete
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

export default AdminUsers;
