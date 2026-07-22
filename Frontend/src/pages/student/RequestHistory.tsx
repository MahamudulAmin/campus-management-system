import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";

const RequestHistory = () => {
  const [requests, setRequests] = useState([
    {
      id: "REQ-001",
      office: "Accounts Office",
      status: "Pending",
      date: "2026-07-20",
      type: "Transcript",
    },
    {
      id: "REQ-002",
      office: "Registration Office",
      status: "Approved",
      date: "2026-07-18",
      type: "Certificate",
    },
    {
      id: "REQ-003",
      office: "CITS",
      status: "Processing",
      date: "2026-07-19",
      type: "ID Card",
    },
    {
      id: "REQ-004",
      office: "Financial Aid Office",
      status: "Rejected",
      date: "2026-07-15",
      type: "Scholarship",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "#27ae60";
      case "Pending":
        return "#f39c12";
      case "Processing":
        return "#3498db";
      case "Rejected":
        return "#e74c3c";
      default:
        return "#95a5a6";
    }
  };

  const handleCancel = (id: string) => {
    setRequests(requests.filter(r => r.id !== id));
    alert(`Request ${id} cancelled!`);
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "30px" }}>
          <h1>Request History</h1>

          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              overflowX: "auto",
            }}
          >
            {requests.length === 0 ? (
              <p style={{ textAlign: "center", color: "#777" }}>No requests yet.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #ddd", backgroundColor: "#f8f9fa" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>Request ID</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Office</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px", fontWeight: "bold" }}>{request.id}</td>
                      <td style={{ padding: "12px" }}>{request.office}</td>
                      <td style={{ padding: "12px" }}>{request.type}</td>
                      <td style={{ padding: "12px" }}>{request.date}</td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            backgroundColor: getStatusColor(request.status),
                            color: "white",
                            padding: "5px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        {request.status === "Pending" && (
                          <button
                            onClick={() => handleCancel(request.id)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "#e74c3c",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHistory;
