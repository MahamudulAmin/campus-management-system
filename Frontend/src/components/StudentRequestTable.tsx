interface RequestTableProps {
  requests: { id: string; office: string; requestType: string; date: string; status: string }[];
}

const RequestTable = ({ requests }: RequestTableProps) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        marginTop: "24px",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#0f172a" }}>Recent Requests</h2>

      {requests.length === 0 ? (
        <p style={{ color: "#64748b" }}>No requests yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px", color: "#475569" }}>ID</th>
                <th style={{ textAlign: "left", padding: "10px", color: "#475569" }}>Office</th>
                <th style={{ textAlign: "left", padding: "10px", color: "#475569" }}>Type</th>
                <th style={{ textAlign: "left", padding: "10px", color: "#475569" }}>Date</th>
                <th style={{ textAlign: "left", padding: "10px", color: "#475569" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td style={{ padding: "10px", borderTop: "1px solid #e2e8f0" }}>{request.id}</td>
                  <td style={{ padding: "10px", borderTop: "1px solid #e2e8f0" }}>{request.office}</td>
                  <td style={{ padding: "10px", borderTop: "1px solid #e2e8f0" }}>{request.requestType}</td>
                  <td style={{ padding: "10px", borderTop: "1px solid #e2e8f0" }}>{request.date}</td>
                  <td style={{ padding: "10px", borderTop: "1px solid #e2e8f0" }}>{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RequestTable;
