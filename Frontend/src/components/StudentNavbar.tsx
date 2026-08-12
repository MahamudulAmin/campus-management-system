import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        backgroundColor: "#1e40af",
        color: "#ffffff",
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div>
        <Link
          to="/student-dashboard"
          style={{
            color: "#fff",
            textDecoration: "none",
            fontSize: "1.2rem",
            fontWeight: 700,
          }}
        >
          Campus Management
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "center",
          fontSize: "0.95rem",
        }}
      >
        <span style={{ opacity: 0.85 }}>Student Portal</span>
        <span
          style={{
            backgroundColor: "rgba(255,255,255,0.18)",
            padding: "8px 14px",
            borderRadius: "999px",
          }}
        >
          Mahamudul
        </span>
      </div>
    </header>
  );
};

export default Navbar;
