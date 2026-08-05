import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div>
        <h3>🎓 Student Panel</h3>

        <button onClick={() => navigate("/student-dashboard")}>
          🏠 Dashboard
        </button>

        <button onClick={() => navigate("/profile")}>
          👤 Profile
        </button>

        <button onClick={() => navigate("/offices")}>
          🏢 University Offices
        </button>

        <button onClick={() => navigate("/submit-request")}>
          📝 Submit Request
        </button>

        <button onClick={() => navigate("/request-history")}>
          📋 Request History
        </button>

        <button onClick={() => navigate("/complaint")}>
          ⚠️ Complaint
        </button>

        <button onClick={() => navigate("/notice-board")}>
          📢 Notice Board
        </button>

        <button onClick={() => navigate("/notifications")}>
          🔔 Notifications
        </button>

        <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>

      </div>
      
    </div>
  );
};

export default Sidebar;