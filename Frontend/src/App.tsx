import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";

// ================= STUDENT PAGES =================
import StudentDashboard from "./pages/student/StudentDashboard";
import Profile from "./pages/student/Profile";
import SubmitRequest from "./pages/student/SubmitRequest";
import RequestHistory from "./pages/student/RequestHistory";
import Complaint from "./pages/student/Complaint";
import NoticeBoard from "./pages/student/NoticeBoard";
import NotificationsPage from "./pages/student/NotificationsPage";
import UniversityOffices from "./pages/student/UniversityOffices";

// ================= ADMIN PAGES =================
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOffices from "./pages/admin/AdminOffices";
import AdminReports from "./pages/admin/AdminReports";
import AdminActivities from "./pages/admin/AdminActivities";
import AdminComplaints from "./pages/admin/AdminComplaints";

// ================= TEACHER PAGES =================
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

// ================= OFFICE STAFF PAGES =================
import StaffDashboard from "./pages/staff/StaffDashboard";

const App: React.FC = () => {
  return (
    <Routes>

      {/* ================= LOGIN ================= */}

      <Route
        path="/"
        element={<Login />}
      />

      {/* ================= STUDENT ROUTES ================= */}

      <Route
        path="/student-dashboard"
        element={<StudentDashboard />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/submit-request"
        element={<SubmitRequest />}
      />

      <Route
        path="/request-history"
        element={<RequestHistory />}
      />

      <Route
        path="/complaint"
        element={<Complaint />}
      />

      <Route
        path="/notice-board"
        element={<NoticeBoard />}
      />

      <Route
        path="/notifications"
        element={<NotificationsPage />}
      />

      <Route
        path="/offices"
        element={<UniversityOffices />}
      />

      {/* ================= ADMIN ROUTES ================= */}

      <Route
        path="/admin-dashboard"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin-users"
        element={<AdminUsers />}
      />

      <Route
        path="/admin-offices"
        element={<AdminOffices />}
      />

      <Route
        path="/admin-complaints"
        element={<AdminComplaints />}
      />

      <Route
        path="/admin-reports"
        element={<AdminReports />}
      />

      <Route
        path="/admin-activities"
        element={<AdminActivities />}
      />

      {/* ================= TEACHER ROUTES ================= */}

      <Route
        path="/teacher-dashboard"
        element={<TeacherDashboard />}
      />

      {/* ================= OFFICE STAFF ROUTES ================= */}

      <Route
        path="/staff-dashboard"
        element={<StaffDashboard />}
      />

      {/* ================= DEFAULT ================= */}

      <Route
        path="*"
        element={<Login />}
      />

    </Routes>
  );
};

export default App;