import { useNavigate } from "react-router-dom";
import "./Sidebar.css";


const Sidebar = () => {

  const navigate = useNavigate();


  return (
    <div className="sidebar">

      <h3>Student Panel</h3>


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


    </div>
  );
};


export default Sidebar;