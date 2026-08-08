import React, { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import SummaryCard from "../../components/SummaryCard";
import OfficeCard from "../../components/OfficeCard";
import RequestTable from "../../components/RequestTable";
import NoticeBoard from "../../components/NoticeBoard";
import NotificationPanel from "../../components/NotificationPanel";

import API_URL from "../../config";

import "../../styles/StudentDashboard.css";


// =========================================================
// USER TYPE
// =========================================================

interface Student {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  semester?: string;
  gpa?: string;
  address?: string;
}


// =========================================================
// REQUEST TYPE
// =========================================================

interface Request {
  id: string;
  office: string;
  requestType: string;
  date: string;
  status: string;
}

// =========================================================
// STUDENT DASHBOARD
// =========================================================

const StudentDashboard = () => {

  const navigate = useNavigate();


  // =======================================================
  // REQUESTS
  // =======================================================

  const [requests, setRequests] =
    useState<Request[]>([]);


  // =======================================================
  // STUDENT INFORMATION
  // =======================================================

  const [student, setStudent] =
    useState<Student | null>(null);


  const [profileLoading, setProfileLoading] =
    useState(true);


  // =======================================================
  // PROFILE LOADING
  // =======================================================

  const loadStudentProfile = async () => {

    try {

      // ---------------------------------------------------
      // Get logged-in user
      // ---------------------------------------------------

      const storedUser =
        localStorage.getItem("user");


      if (!storedUser) {

        console.error(
          "No logged-in student found."
        );

        setProfileLoading(false);

        return;
      }


      const localUser: Student =
        JSON.parse(storedUser);


      // ---------------------------------------------------
      // Show local information immediately
      // ---------------------------------------------------

      setStudent(localUser);


      // ---------------------------------------------------
      // Student ID
      // ---------------------------------------------------

      const studentId =
        localUser.id ||
        localStorage.getItem("userId");


      if (!studentId) {

        console.error(
          "Student ID not found."
        );

        setProfileLoading(false);

        return;
      }


      // ---------------------------------------------------
      // Get latest information from backend
      // ---------------------------------------------------

      const response =
        await fetch(
          `${API_URL}/login/${studentId}`
        );


      if (!response.ok) {

        console.error(
          "Failed to load student profile."
        );

        setProfileLoading(false);

        return;
      }


      const data =
        await response.json();


      // ---------------------------------------------------
      // Backend returns student directly
      // ---------------------------------------------------

      const updatedStudent: Student =
        data;


      setStudent(updatedStudent);


      // ---------------------------------------------------
      // Keep localStorage synchronized
      // ---------------------------------------------------

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedStudent
        )
      );


      localStorage.setItem(
        "userId",
        updatedStudent.id
      );

    } catch (error) {

      console.error(
        "Failed to load student profile:",
        error
      );

    } finally {

      setProfileLoading(false);
    }
  };


  // =======================================================
  // REQUESTS LOADING
  // =======================================================

  const refreshDashboard = async () => {

    try {

      const response =
        await fetch(
          `${API_URL}/requests/`
        );


      if (!response.ok) {

        throw new Error(
          "Failed to load requests"
        );
      }


      const data =
        await response.json();


      setRequests(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load requests",
        error
      );
    }
  };


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {

    // Always scroll to top
    // when dashboard loads

    window.scrollTo(
      0,
      0
    );


    // Load student information

    loadStudentProfile();


    // Load requests

    refreshDashboard();


    // Listen for new requests

    window.addEventListener(
      "requestUpdated",
      refreshDashboard
    );


    // Cleanup

    return () => {

      window.removeEventListener(
        "requestUpdated",
        refreshDashboard
      );

    };

  }, []);


  // =======================================================
  // DASHBOARD METRICS
  // =======================================================

  const metrics = useMemo(() => {

    const total =
      requests.length;


    let pending = 0;

    let approved = 0;

    let rejected = 0;


    requests.forEach((req) => {

      switch (req.status) {

        case "Pending":

          pending++;

          break;


        case "Approved":

          approved++;

          break;


        case "Rejected":

          rejected++;

          break;


        default:

          break;
      }

    });


    return {
      total,
      pending,
      approved,
      rejected,
    };

  }, [requests]);


  // =======================================================
  // SUMMARY CARDS
  // =======================================================

  const summaryCardsData = [
  {
    title: "Total Requests",
    value: metrics.total,
    color: "#2563eb",
  },
  {
    title: "Pending",
    value: metrics.pending,
    color: "#f59e0b",
  },
  {
    title: "Approved",
    value: metrics.approved,
    color: "#10b981",
  },
  {
    title: "Rejected",
    value: metrics.rejected,
    color: "#ef4444",
  },
];


  // =======================================================
  // UNIVERSITY OFFICES
  // =======================================================

  const officesData = [

    {
      officeName:
        "Admission Office",

      description:
        "Admission related services.",
    },

    {
      officeName:
        "Registration Office",

      description:
        "Course registration and academic records.",
    },

    {
      officeName:
        "Accounts Office",

      description:
        "Tuition fees and payment services.",
    },

    {
      officeName:
        "Financial Aid Office",

      description:
        "Scholarships and financial support.",
    },

    {
      officeName:
        "CITS",

      description:
        "Technical support and IT services.",
    },

    {
      officeName:
        "Student Affairs",

      description:
        "Campus activities and student welfare.",
    },

  ];


  // =======================================================
  // CARD CLICK
  // =======================================================

  const handleCardClick = () => {

    navigate(
      "/request-history"
    );

  };


  // =======================================================
  // KEYBOARD
  // =======================================================

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {

    if (
      e.key === "Enter" ||
      e.key === " "
    ) {

      e.preventDefault();

      handleCardClick();

    }

  };


  // =======================================================
  // DISPLAY VALUES
  // =======================================================

  const studentName =
    student?.name ||
    "Student";


  const studentId =
    student?.id ||
    "Not available";


  const department =
    student?.department ||
    "Not provided";


  const semester =
    student?.semester ||
    "Not provided";


  // =======================================================
  // PAGE
  // =======================================================

  return (

    <div
      className="dashboard-layout"
    >

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className="dashboard-sidebar"
      >

        <Sidebar />

      </aside>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main
        className="dashboard-content"
      >

        {/* =================================================
            HERO SECTION
        ================================================= */}

        <section
          className="hero-section"
        >

          <div
            className="hero-left"
          >

            <h1>
              👋 Welcome Back,{" "}
              {profileLoading
                ? "..."
                : studentName}
            </h1>


            <p>
              Campus Management System
            </p>


            {/* =================================================
                REAL STUDENT INFORMATION
            ================================================= */}

            <div
              className="student-info"
            >

              <span>
                🎓 Student ID :{" "}
                {profileLoading
                  ? "..."
                  : studentId}
              </span>


              <span>
                💻 Department :{" "}
                {profileLoading
                  ? "..."
                  : department}
              </span>


              <span>
                📚 Semester :{" "}
                {profileLoading
                  ? "..."
                  : semester}
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            DASHBOARD SUMMARY
        ================================================= */}

        <section
          className="dashboard-section"
        >

          <h2>
            Dashboard Summary
          </h2>


          <div
            className="summary-container"
          >

            {summaryCardsData.map(
              (card, index) => (

                <div
                  key={index}
                  className="summary-wrapper"
                  role="button"
                  tabIndex={0}
                  onClick={
                    handleCardClick
                  }
                  onKeyDown={
                    handleKeyDown
                  }
                >

                  <SummaryCard
                    title={
                      card.title
                    }
                    value={
                      card.value
                    }
                    color={
                      card.color
                    }
                  />

                </div>

              )
            )}

          </div>

        </section>


        {/* =================================================
            UNIVERSITY OFFICES
        ================================================= */}

        <section
          className="dashboard-section"
        >

          <h2>
            University Offices
          </h2>


          <div
            className="office-container"
          >

            {officesData.map(
              (office, index) => (

                <OfficeCard
                  key={index}
                  officeName={
                    office.officeName
                  }
                  description={
                    office.description
                  }
                />

              )
            )}

          </div>

        </section>


        {/* =================================================
            RECENT REQUESTS
        ================================================= */}

        <section
          className="dashboard-section"
        >

          <RequestTable
            requests={requests}
          />

        </section>


        {/* =================================================
            NOTICE + NOTIFICATIONS
        ================================================= */}

        <section
          className="bottom-grid"
        >

          <NoticeBoard />

          <NotificationPanel />

        </section>

      </main>

    </div>
  );
};


export default StudentDashboard;