import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: "📊",
    },
    {
      title: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      title: "Offices",
      path: "/admin/offices",
      icon: "🏢",
    },
    {
      title: "Activities",
      path: "/admin/activities",
      icon: "📋",
    },
    {
      title: "Reports",
      path: "/admin/reports",
      icon: "📈",
    },
  ];

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        boxShadow: "3px 0 10px rgba(0,0,0,.15)",
      }}
    >
      {/* Logo */}

      <div
        style={{
          padding: "25px 20px",
          borderBottom: "1px solid #334155",
        }}
      >
        <h2
          style={{
            margin: 0,
            textAlign: "center",
          }}
        >
          🎓 CMS Admin
        </h2>

        <p
          style={{
            marginTop: "8px",
            textAlign: "center",
            color: "#94A3B8",
            fontSize: "13px",
          }}
        >
          Campus Management System
        </p>
      </div>

      {/* Menu */}

      <div
        style={{
          flex: 1,
          paddingTop: "20px",
        }}
      >
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <div
              key={item.title}
              onClick={() => navigate(item.path)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                margin: "8px 15px",
                padding: "14px 18px",
                cursor: "pointer",
                borderRadius: "10px",
                background: active ? "#2563EB" : "transparent",
                color: active ? "#fff" : "#CBD5E1",
                transition: ".3s",
                fontWeight: active ? "bold" : "normal",
              }}
              onMouseEnter={(e) => {
                if (!active)
                  e.currentTarget.style.background = "#1E293B";
              }}
              onMouseLeave={(e) => {
                if (!active)
                  e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: "22px" }}>{item.icon}</span>

              <span>{item.title}</span>
            </div>
          );
        })}
      </div>

      {/* Logout */}

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #334155",
        }}
      >
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "14px",
            background: "#DC2626",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
            fontWeight: "bold",
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;