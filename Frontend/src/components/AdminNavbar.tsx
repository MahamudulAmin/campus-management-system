import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header
      style={{
        width: "100%",
        height: "75px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        boxSizing: "border-box",
      }}
    >
      {/* Left */}
      <div>
        <h2
          style={{
            margin: 0,
            color: "#1e293b",
            fontSize: "24px",
          }}
        >
          Admin Dashboard
        </h2>

        <p
          style={{
            margin: "5px 0 0",
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          {today}
        </p>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#2563EB",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            A
          </div>

          <div>
            <div
              style={{
                fontWeight: "bold",
                color: "#1e293b",
              }}
            >
              Administrator
            </div>

            <div
              style={{
                color: "#64748b",
                fontSize: "13px",
              }}
            >
              System Admin
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.3s",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;