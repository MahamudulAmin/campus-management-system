import "../styles/AdminDashboard.css";
interface AdminNavbarProps {
  toggleSidebar?: () => void;
}

export default function AdminNavbar({
  toggleSidebar,
}: AdminNavbarProps) {
  return (
    <header className="admin-navbar">
      <div className="navbar-left">
        <button
  className="menu-button"
  onClick={() => toggleSidebar?.()}
>
          ☰
        </button>

        <h2>Campus Management System</h2>
      </div>

      <div className="navbar-right">
        <span>Administrator</span>
      </div>
    </header>
  );
}