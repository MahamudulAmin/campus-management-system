const Navbar = () => {
  return (
    <nav
      style={{
        height: "70px",
        backgroundColor: "#1E3A8A",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>Campus Management System</h2>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <span style={{ cursor: "pointer", fontSize: "22px" }}>🔔</span>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              color: "#1E3A8A",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            M
          </div>

          <div>
            <h4 style={{ margin: 0 }}>Mahamudul Amin</h4>
            <small>Student</small>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;