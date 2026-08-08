import { NavLink, useNavigate } from "react-router-dom";


const Sidebar = () => {

  const navigate = useNavigate();


  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? "#1d4ed8" : "#334155",
    textDecoration: "none",
    fontWeight: isActive ? 700 : 500,
    padding: "10px 0",
    cursor: "pointer",
  });



  return (

    <aside

      style={{

        width: "240px",

        minHeight: "100vh",

        backgroundColor: "#f8fafc",

        borderRight: "1px solid #e2e8f0",

        padding: "24px 20px",

      }}

    >


      <div style={{ marginBottom: "32px" }}>


        <h2
          style={{
            margin: 0,
            color: "#0f172a",
            marginBottom: "25px",
          }}
        >
          Student Menu
        </h2>



        <nav

          style={{

            display: "flex",

            flexDirection: "column",

            gap: "14px",

          }}

        >


          <NavLink
            to="/student-dashboard"
            style={linkStyle}
          >
            🏠 Dashboard
          </NavLink>



          <NavLink
            to="/profile"
            style={linkStyle}
          >
            👤 Profile
          </NavLink>



          <NavLink
            to="/submit-request"
            style={linkStyle}
          >
            📝 Submit Request
          </NavLink>



          <NavLink
            to="/request-history"
            style={linkStyle}
          >
            📋 Request History
          </NavLink>



          <NavLink
            to="/complaint"
            style={linkStyle}
          >
            ⚠️ Complaint
          </NavLink>



          <NavLink
            to="/notifications"
            style={linkStyle}
          >
            🔔 Notifications
          </NavLink>



          <NavLink
            to="/offices"
            style={linkStyle}
          >
            🏢 University Offices
          </NavLink>



          <button

            onClick={() => navigate("/")}

            style={{

              marginTop: "25px",

              padding: "10px",

              backgroundColor: "#ef4444",

              color: "white",

              border: "none",

              borderRadius: "8px",

              cursor: "pointer",

              fontWeight: 600,

            }}

          >

            Logout

          </button>



        </nav>


      </div>


    </aside>

  );

};


export default Sidebar;