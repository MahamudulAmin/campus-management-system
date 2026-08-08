import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";
import API_URL from "../config";

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    const id = username.trim();
    const pass = password.trim();

    // ==========================================
    // EMPTY ID CHECK
    // ==========================================

    if (id === "") {
      setError("Please enter your ID.");
      return;
    }

    // ==========================================
    // ONLY NUMBERS
    // ==========================================

    if (!/^\d+$/.test(id)) {
      setError("ID must contain only numbers.");
      return;
    }

    // ==========================================
    // ADMIN LOGIN
    // ==========================================
    // Admin IDs are 2 digits
    // Example: 12, 99
    // ==========================================

    if (id.length === 2) {
      localStorage.setItem("role", "admin");
      localStorage.setItem("userId", id);

      navigate("/admin-dashboard");
      return;
    }

    // ==========================================
    // STUDENT LOGIN
    // ==========================================
    // Student IDs must be exactly 7 digits
    // Example: 2320132
    // ==========================================

    if (id.length !== 7) {
      setError(
        "Student ID must be exactly 7 digits."
      );
      return;
    }

    // ==========================================
    // PASSWORD CHECK
    // ==========================================

    if (pass === "") {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // SEND LOGIN REQUEST TO FASTAPI
      // ==========================================

      const response = await fetch(
        `${API_URL}/login/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            id: id,
            password: pass,
          }),
        }
      );

      const data = await response.json();

      // ==========================================
      // LOGIN FAILED
      // ==========================================

      if (!response.ok) {
        setError(
          data.detail ||
            "Invalid Student ID or password."
        );

        return;
      }

      // ==========================================
      // SUCCESSFUL LOGIN
      // ==========================================

      const user = data.user;

      // Save complete user information
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // Save role
      localStorage.setItem(
        "role",
        user.role || "student"
      );

      // Save student ID
      localStorage.setItem(
        "userId",
        user.id
      );

      // ==========================================
      // GO TO STUDENT DASHBOARD
      // ==========================================

      navigate("/student-dashboard");

    } catch (err) {
      console.error(
        "Login error:",
        err
      );

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* ======================================
            HEADER
        ======================================= */}

        <div className="login-header">

          <div className="logo">
            🎓
          </div>

          <h1>
            Campus Management
            <br />
            System
          </h1>

          <p>
            Portal Login
          </p>

        </div>


        {/* ======================================
            USER ID
        ======================================= */}

        <div className="form-group">

          <label>
            User ID
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => {

              // Only allow numbers
              const value =
                e.target.value.replace(
                  /\D/g,
                  ""
                );

              setUsername(value);
              setError("");

            }}
            placeholder="Enter your ID"
            maxLength={7}
          />

        </div>


        {/* ======================================
            PASSWORD
        ======================================= */}

        <div className="form-group">

          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Enter your password"
          />

        </div>


        {/* ======================================
            ERROR
        ======================================= */}

        {error && (
          <p
            style={{
              color: "red",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            {error}
          </p>
        )}


        {/* ======================================
            LOGIN BUTTON
        ======================================= */}

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>


        {/* ======================================
            FOOTER
        ======================================= */}

        <div className="login-footer">

          <p>
            © 2026 Campus Management System
          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;