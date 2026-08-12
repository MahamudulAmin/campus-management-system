import Navbar from "../../components/StudentNavbar";
import Sidebar from "../../components/StudentSidebar";
import { useEffect, useState } from "react";
import API_URL from "../../config";

interface RequestData {
  id: string;
  office: string;
  requestType: string;
  description: string;
  date: string;
  status: string;
}

const RequestHistory = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      // const response = await fetch("http://127.0.0.1:8000/requests");
const response = await fetch(`${API_URL}/requests`);

      if (!response.ok) {
        throw new Error("Failed to load requests");
      }

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "Approved") return "#27ae60";
    if (status === "Pending") return "#f39c12";
    if (status === "Processing") return "#3498db";
    if (status === "Rejected") return "#e74c3c";
    return "#95a5a6";
  };

  const handleCancel = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to cancel this request?"
    );

    if (!confirmDelete) return;

    try {
      // const response = await fetch(
      //   `http://127.0.0.1:8000/requests/${id}`,
      //   {
      //     method: "DELETE",
      //   }
      // );
      const response = await fetch(
  `${API_URL}/requests/${id}`,
  {
    method: "DELETE",
  }
);

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setRequests((prev) =>
        prev.filter((request) => request.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete request.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
      }}
    >
      <Navbar />

      <div
        style={{
          display: "flex",
        }}
      >
        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "30px",
          }}
        >
          <h1>Request History</h1>

          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,.1)",
              overflowX: "auto",
            }}
          >
            {loading ? (
              <h3
                style={{
                  textAlign: "center",
                }}
              >
                Loading...
              </h3>
            ) : requests.length === 0 ? (
              <h3
                style={{
                  textAlign: "center",
                  color: "#777",
                }}
              >
                No requests submitted yet.
              </h3>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#eee",
                    }}
                  >
                    <th>ID</th>
                    <th>Office</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request) => (
                    <tr
                      key={request.id}
                      style={{
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <td>{request.id}</td>

                      <td>{request.office}</td>

                      <td>{request.requestType}</td>

                      <td>{request.description}</td>

                      <td>{request.date}</td>

                      <td>
                        <span
                          style={{
                            background: getStatusColor(request.status),
                            color: "#fff",
                            padding: "5px 12px",
                            borderRadius: "20px",
                          }}
                        >
                          {request.status}
                        </span>
                      </td>

                      <td>
                        {request.status === "Pending" && (
                          <button
                            onClick={() => handleCancel(request.id)}
                            style={{
                              background: "#e74c3c",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "5px",
                              cursor: "pointer",
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
        </main>
      </div>
    </div>
  );
};

export default RequestHistory;