import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: "📊" },
    { label: "Total Users", path: "/admin/users", icon: "👥" },
    { label: "Offices", path: "/admin/offices", icon: "🏛️" },
    { label: "Reports", path: "/admin/reports", icon: "📈" },
    { label: "Recent Activities", path: "/admin/activities", icon: "📋" },
    { label: "Settings", path: "/admin/settings", icon: "⚙️" },
    { label: "Back to Student", path: "/", icon: "🎓" },
    { label: "Logout", path: "#logout", icon: "🚪" },
  ];

  const handleClick = (item: { label: string; path: string; icon: string }) => {
    if (item.label === "Logout") {
      alert("Logged out successfully!");
      return;
    }
    setActiveItem(item.label);
    navigate(item.path);
  };

  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        backgroundColor: "#0F172A",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "40px",
          borderBottom: "1px solid #64748b",
          paddingBottom: "15px",
          fontSize: "18px",
        }}
      >
        Admin Panel
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {menuItems.map((item) => (
          <div
            key={item.label}
            onClick={() => handleClick(item)}
            style={{
              padding: "12px 15px",
              cursor: "pointer",
              borderRadius: "6px",
              backgroundColor:
                activeItem === item.label ? "rgba(99, 102, 241, 0.3)" : "transparent",
              borderLeft:
                activeItem === item.label ? "3px solid #6366f1" : "3px solid transparent",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: activeItem === item.label ? "#c7d2fe" : "#cbd5e1",
              fontWeight: activeItem === item.label ? "600" : "400",
            }}
            onMouseEnter={(e) => {
              if (activeItem !== item.label) {
                e.currentTarget.style.backgroundColor = "rgba(51, 65, 85, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeItem !== item.label) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
