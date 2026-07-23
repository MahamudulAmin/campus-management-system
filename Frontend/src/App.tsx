import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";


// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import Profile from "./pages/student/Profile";
import UniversityOffices from "./pages/student/UniversityOffices";
import SubmitRequest from "./pages/student/SubmitRequest";
import RequestHistory from "./pages/student/RequestHistory";
import Complaint from "./pages/student/Complaint";
import NoticeBoard from "./pages/student/NoticeBoard";
import NotificationsPage from "./pages/student/NotificationsPage";


// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";



function App() {


  return (


    <Router>


      <Routes>



        {/* Login */}

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />


        <Route
          path="/login"
          element={<Login />}
        />





        {/* =====================
             Student Routes
        ====================== */}


        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />



        <Route
          path="/profile"
          element={<Profile />}
        />


        <Route
          path="/offices"
          element={<UniversityOffices />}
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





        {/* =====================
             Admin Routes
        ====================== */}


        <Route
          path="/admin"
          element={<AdminDashboard />}
        />





        {/* Wrong URL */}

        <Route
          path="*"
          element={<Navigate to="/login" />}
        />


      </Routes>


    </Router>


  );


}


export default App;