import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Profile", path: "/profile" },
    { label: "University Offices", path: "/offices" },
    { label: "Submit Request", path: "/submit-request" },
    { label: "Request History", path: "/request-history" },
    { label: "Complaint", path: "/complaint" },
    { label: "Notice Board", path: "/notice-board" },
    { label: "Notifications", path: "/notifications" },
    { label: "Logout", path: "#logout" },
  ];

  const handleClick = (item: { label: string; path: string }) => {
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
        backgroundColor: "#1E293B",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "40px",
          borderBottom: "1px solid gray",
          paddingBottom: "15px",
        }}
      >
        Student Panel
      </h2>

      {menuItems.map((item, index) => (
        <div
          key={index}
          style={{
            padding: "14px 16px",
            marginBottom: "10px",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor:
              activeItem === item.label ? "#2563EB" : "transparent",
            transition: "0.3s",
          }}
          onClick={() => handleClick(item)}
          onMouseEnter={(e) => {
            if (activeItem !== item.label) {
              e.currentTarget.style.backgroundColor = "#334155";
            }
          }}
          onMouseLeave={(e) => {
            if (activeItem !== item.label) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;