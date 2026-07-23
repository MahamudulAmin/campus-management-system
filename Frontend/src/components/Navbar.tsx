import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    // clear user data if you store any
    localStorage.removeItem("user");

    // go to login page
    navigate("/login");
  };


  return (
    <nav className="navbar">

      <h2>
        Campus Management System
      </h2>


      <button onClick={handleLogout}>
        Logout
      </button>


    </nav>
  );
};

export default Navbar;