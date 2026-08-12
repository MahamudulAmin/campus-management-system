import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";

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

    // ==============================
    // EMPTY ID CHECK
    // ==============================

    if (id === "") {
      setError("Please enter your ID.");
      return;
    }

    // ==============================
    // ONLY NUMBERS
    // ==============================

    if (!/^\d+$/.test(id)) {
      setError("ID must contain only numbers.");
      return;
    }

    // ==============================
    // EMPTY PASSWORD
    // ==============================

    if (pass === "") {
      setError("Please enter your password.");
      return;
    }

    // ==============================
    // ADMIN LOGIN
    // 4 DIGITS
    // ==============================

    if (id.length === 4) {
      localStorage.setItem("role", "admin");
      localStorage.setItem("userId", id);
      localStorage.setItem("user", JSON.stringify({
        id: id,
        role: "admin"
      }));

      navigate("/admin-dashboard");
      return;
    }

    // ==============================
    // TEACHER LOGIN
    // 5 DIGITS
    // ==============================

    if (id.length === 5) {
      localStorage.setItem("role", "teacher");
      localStorage.setItem("userId", id);
      localStorage.setItem("user", JSON.stringify({
        id: id,
        role: "teacher"
      }));

      navigate("/teacher-dashboard");
      return;
    }

    // ==============================
    // OFFICE STAFF LOGIN
    // 6 DIGITS
    // ==============================

    if (id.length === 6) {
      localStorage.setItem("role", "office_staff");
      localStorage.setItem("userId", id);
      localStorage.setItem("user", JSON.stringify({
        id: id,
        role: "office_staff"
      }));

      navigate("/staff-dashboard");
      return;
    }

    // ==============================
    // STUDENT LOGIN
    // 7 DIGITS
    // ==============================

    if (id.length !== 7) {
      setError("Invalid ID. Please enter a valid ID.");
      return;
    }

    // ==============================
    // STUDENT LOGIN API
    // ==============================

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/login/",
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

      // ==============================
      // LOGIN FAILED
      // ==============================

      if (!response.ok) {
        setError(
          data.detail || "Invalid Student ID or password."
        );
        return;
      }

      // ==============================
      // USER DATA
      // ==============================

      const user = data.user;

      if (!user) {
        setError(
          "Login successful, but user information was not returned."
        );
        return;
      }

      // ==============================
      // SAVE USER
      // ==============================

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "role",
        user.role || "student"
      );

      localStorage.setItem(
        "userId",
        String(user.id || id)
      );

      // ==============================
      // STUDENT DASHBOARD
      // ==============================

      navigate("/student-dashboard");

    } catch (err) {
      console.error("Login error:", err);

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

        {/* HEADER */}

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

        {/* USER ID */}

        <div className="form-group">

          <label>
            User ID
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => {
              const value = e.target.value.replace(
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

        {/* PASSWORD */}

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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
          />

        </div>

        {/* ERROR */}

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

        {/* LOGIN BUTTON */}

        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        {/* FOOTER */}

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