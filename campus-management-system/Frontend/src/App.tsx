import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Login
import Login from "./pages/Login";

// ================= Student Pages =================
import StudentDashboard from "./pages/student/StudentDashboard";
import Profile from "./pages/student/Profile";
import UniversityOffices from "./pages/student/UniversityOffices";
import SubmitRequest from "./pages/student/SubmitRequest";
import RequestHistory from "./pages/student/RequestHistory";
import Complaint from "./pages/student/Complaint";
import NoticeBoard from "./pages/student/NoticeBoard";
import NotificationsPage from "./pages/student/NotificationsPage";

// ================= Admin Pages =================
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOffices from "./pages/admin/AdminOffices";
import AdminActivities from "./pages/admin/AdminActivities";
import AdminReports from "./pages/admin/AdminReports";

// Uncomment after creating the page
// import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* =========================
             Student Routes
        ========================== */}

        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/offices" element={<UniversityOffices />} />
        <Route path="/submit-request" element={<SubmitRequest />} />
        <Route path="/request-history" element={<RequestHistory />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/notice-board" element={<NoticeBoard />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* =========================
             Admin Routes
        ========================== */}

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/offices" element={<AdminOffices />} />
        <Route path="/admin/activities" element={<AdminActivities />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        {/* Uncomment after creating AdminSettings.tsx */}
        {/* <Route path="/admin/settings" element={<AdminSettings />} /> */}

        {/* Page Not Found */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;