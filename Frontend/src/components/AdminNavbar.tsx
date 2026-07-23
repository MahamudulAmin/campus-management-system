const AdminNavbar = () => {
  return (
    <div
      style={{
        backgroundColor: "#1E293B",
        color: "white",
        padding: "0 30px",
        height: "70px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
          🏫 Campus Management System - Admin
        </h1>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <button
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          🔔 Alerts
        </button>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          👤
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
