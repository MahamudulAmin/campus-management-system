import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import { useState } from "react";

const AdminOffices = () => {
  const [offices] = useState([
    {
      id: 1,
      name: "Accounts Office",
      head: "Dr. Muhammad Ali",
      email: "accounts@university.edu",
      phone: "+92-42-1234567",
      status: "Active",
      staff: 8,
    },
    {
      id: 2,
      name: "Registration Office",
      head: "Ms. Ayesha Khan",
      email: "registration@university.edu",
      phone: "+92-42-1234568",
      status: "Active",
      staff: 12,
    },
    {
      id: 3,
      name: "CITS (Center for IT Services)",
      head: "Eng. Hassan Ahmed",
      email: "cits@university.edu",
      phone: "+92-42-1234569",
      status: "Active",
      staff: 15,
    },
    {
      id: 4,
      name: "Financial Aid Office",
      head: "Mr. Ibrahim Hassan",
      email: "finaid@university.edu",
      phone: "+92-42-1234570",
      status: "Active",
      staff: 6,
    },
    {
      id: 5,
      name: "Student Affairs",
      head: "Dr. Fatima Zahra",
      email: "studentaffairs@university.edu",
      phone: "+92-42-1234571",
      status: "Active",
      staff: 10,
    },
  ]);

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <AdminNavbar />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: "30px" }}>
          <h1>Offices</h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>Manage university offices</p>

          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#2563EB",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              Add New Office
            </button>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {offices.map((office) => (
                <div
                  key={office.id}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "20px",
                    backgroundColor: "#fafafa",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0", color: "#1f2937" }}>{office.name}</h3>
                  <div style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
                    <p style={{ margin: "5px 0" }}>
                      <strong>Head:</strong> {office.head}
                    </p>
                    <p style={{ margin: "5px 0" }}>
                      <strong>Email:</strong> {office.email}
                    </p>
                    <p style={{ margin: "5px 0" }}>
                      <strong>Phone:</strong> {office.phone}
                    </p>
                    <p style={{ margin: "5px 0" }}>
                      <strong>Staff:</strong> {office.staff} members
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#dbeafe",
                        color: "#0369a1",
                        border: "1px solid #bfdbfe",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        border: "1px solid #fecaca",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOffices;
