import "../styles/AdminDashboard.css";
import { NavLink, useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  isOpen?: boolean;
}

const AdminSidebar = ({ isOpen = true }: AdminSidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
    },
    {
      name: "User Management",
      path: "/admin-users",
    },
    {
      name: "Office Management",
      path: "/admin-offices",
    },
    {
      name: "Complaints",
      path: "/admin-complaints",
    },
    {
      name: "Reports",
      path: "/admin-reports",
    },
    {
      name: "Activities",
      path: "/admin-activities",
    },
  ];

  return (
    <aside
      className={`admin-sidebar ${
        isOpen ? "open" : "closed"
      }`}
    >
      <div className="admin-sidebar-title">
        Admin Panel
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active-link"
                : "sidebar-link"
            }
          >
            {item.name}
          </NavLink>
        ))}

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default AdminSidebar;