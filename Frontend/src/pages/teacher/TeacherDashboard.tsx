import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import { Communications } from "../../components/Communications";
import ServiceRequests from "../../components/ServiceRequests";

import "../../styles/TeacherDashboard.css";


type TeacherTab =
  | "updates"
  | "communications"
  | "services";


interface TeacherAnnouncement {
  id: string;
  teacher_id: string;
  teacher_name: string;
  title: string;
  body: string;
  category: string;
  status: string;
  created_at: string;
}


const API_URL =
  "http://127.0.0.1:8000";


const TeacherDashboard: React.FC = () => {

  const navigate = useNavigate();


  // ========================================================
  // TAB
  // ========================================================

  const [
    activeTab,
    setActiveTab
  ] = useState<TeacherTab>("updates");


  // ========================================================
  // ANNOUNCEMENT FORM
  // ========================================================

  const [
    announcementTitle,
    setAnnouncementTitle
  ] = useState("");

  const [
    announcementBody,
    setAnnouncementBody
  ] = useState("");

  const [
    announcementCategory,
    setAnnouncementCategory
  ] = useState("General");


  // ========================================================
  // ANNOUNCEMENT STATE
  // ========================================================

  const [
    announcements,
    setAnnouncements
  ] = useState<TeacherAnnouncement[]>([]);

  const [
    announcementLoading,
    setAnnouncementLoading
  ] = useState(false);

  const [
    announcementListLoading,
    setAnnouncementListLoading
  ] = useState(false);

  const [
    announcementMessage,
    setAnnouncementMessage
  ] = useState("");


  // ========================================================
  // CHANGE TAB
  // ========================================================

  const changeTab = (
    tab: TeacherTab
  ) => {

    setActiveTab(tab);
  };


  // ========================================================
  // GET TEACHER ID
  // ========================================================

  const getTeacherId = (): string | null => {

    return (
      localStorage.getItem("teacherId") ||
      localStorage.getItem("userId")
    );
  };


  // ========================================================
  // LOAD TEACHER ANNOUNCEMENTS
  // ========================================================

  const loadAnnouncements = useCallback(
    async () => {

      const teacherId =
        getTeacherId();

      if (!teacherId) {
        return;
      }

      try {

        setAnnouncementListLoading(
          true
        );

        const response =
          await fetch(
            `${API_URL}/api/teacher/announcements?user_id=${encodeURIComponent(
              teacherId
            )}`
          );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data?.detail ||
              "Failed to load announcements."
          );
        }

        if (Array.isArray(data)) {

          setAnnouncements(data);
        } else {

          setAnnouncements([]);
        }

      } catch (error) {

        console.error(
          "Load teacher announcements error:",
          error
        );

        setAnnouncements([]);

      } finally {

        setAnnouncementListLoading(
          false
        );
      }

    },
    []
  );


  // ========================================================
  // LOAD ANNOUNCEMENTS WHEN PAGE OPENS
  // ========================================================

  useEffect(() => {

    loadAnnouncements();

  }, [loadAnnouncements]);


  // ========================================================
  // LOGOUT
  // ========================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "userId"
    );

    localStorage.removeItem(
      "studentId"
    );

    localStorage.removeItem(
      "teacherId"
    );

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "isLoggedIn"
    );

    sessionStorage.clear();

    navigate(
      "/login",
      {
        replace: true
      }
    );
  };


  // ========================================================
  // CREATE ANNOUNCEMENT
  // ========================================================

  const handleCreateAnnouncement =
    async (
      event: React.FormEvent
    ) => {

      event.preventDefault();

      setAnnouncementMessage("");


      // ------------------------------------------------------
      // VALIDATION
      // ------------------------------------------------------

      if (
        !announcementTitle.trim() ||
        !announcementBody.trim()
      ) {

        setAnnouncementMessage(
          "Please enter both a title and announcement."
        );

        return;
      }


      // ------------------------------------------------------
      // TEACHER ID
      // ------------------------------------------------------

      const teacherId =
        getTeacherId();

      if (!teacherId) {

        setAnnouncementMessage(
          "Teacher ID not found. Please login again."
        );

        return;
      }


      // ------------------------------------------------------
      // CREATE
      // ------------------------------------------------------

      try {

        setAnnouncementLoading(
          true
        );

        const response =
          await fetch(
            `${API_URL}/api/teacher/announcements?user_id=${encodeURIComponent(
              teacherId
            )}`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                title:
                  announcementTitle.trim(),

                body:
                  announcementBody.trim(),

                category:
                  announcementCategory
              })
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data?.detail ||
              "Failed to create announcement."
          );
        }


        // ----------------------------------------------------
        // CLEAR FORM
        // ----------------------------------------------------

        setAnnouncementTitle("");

        setAnnouncementBody("");

        setAnnouncementCategory(
          "General"
        );


        // ----------------------------------------------------
        // SUCCESS MESSAGE
        // ----------------------------------------------------

        setAnnouncementMessage(
          "Announcement created successfully!"
        );


        // ----------------------------------------------------
        // ADD NEW ANNOUNCEMENT IMMEDIATELY
        // ----------------------------------------------------

        if (
          data?.announcement
        ) {

          setAnnouncements(
            previous => [
              data.announcement,
              ...previous
            ]
          );

        } else {

          // Fallback: reload from backend
          await loadAnnouncements();
        }


      } catch (error) {

        console.error(
          "Create announcement error:",
          error
        );

        setAnnouncementMessage(
          error instanceof Error
            ? error.message
            : "Failed to create announcement."
        );

      } finally {

        setAnnouncementLoading(
          false
        );
      }
    };


  // ========================================================
  // FORMAT DATE
  // ========================================================

  const formatDate = (
    dateString: string
  ) => {

    if (!dateString) {
      return "";
    }

    const date =
      new Date(dateString);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return dateString;
    }

    return date.toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };


  // ========================================================
  // RENDER
  // ========================================================

  return (

    <main className="teacher-dashboard">


      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="teacher-topbar">

        <div className="teacher-brand">

          <div className="teacher-brand-icon">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >

              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />

              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />

            </svg>

          </div>


          <div>

            <span className="teacher-brand-small">
              CAMPUS MANAGEMENT
            </span>

            <strong>
              Teacher Portal
            </strong>

          </div>

        </div>


        <button
          type="button"
          className="teacher-logout-btn"
          onClick={handleLogout}
          aria-label="Logout"
        >

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >

            <path d="M10 17l5-5-5-5" />

            <path d="M15 12H3" />

            <path d="M21 19V5a2 2 0 00-2-2h-6" />

          </svg>

          <span>
            Logout
          </span>

        </button>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="teacher-hero">

        <div
          className="hero-background hero-background-one"
          aria-hidden="true"
        />

        <div
          className="hero-background hero-background-two"
          aria-hidden="true"
        />


        <div className="teacher-hero-content">

          <div className="teacher-hero-text">

            <div className="teacher-badges">

              <span className="faculty-badge">
                Faculty Workspace
              </span>

              <span className="live-badge">

                <span className="live-dot" />

                Live System

              </span>

            </div>


            <h1>
              Teacher Portal
            </h1>


            <p>
              Create announcements, submit service
              requests, check campus updates, and
              communicate directly with university offices.
            </p>

          </div>


          <button
            type="button"
            className="create-request-btn"
            onClick={() =>
              changeTab("services")
            }
          >

            <span className="plus-icon">
              +
            </span>

            <span className="create-request-text">

              <span>
                Create
              </span>

              <span>
                Request
              </span>

            </span>

          </button>

        </div>

      </section>


      {/* =====================================================
          QUICK NAVIGATION
      ===================================================== */}

      <section
        className="teacher-quick-cards"
        aria-label="Faculty services"
      >


        {/* ANNOUNCEMENTS */}

        <button
          type="button"
          className={`teacher-quick-card announcements-card ${
            activeTab === "updates"
              ? "active"
              : ""
          }`}
          onClick={() =>
            changeTab("updates")
          }
          aria-pressed={
            activeTab === "updates"
          }
        >

          <div className="quick-card-top">

            <div className="quick-card-icon announcement-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >

                <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15" />

                <path d="M18 13a3 3 0 100-6" />

                <path d="M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />

              </svg>

            </div>


            <span className="quick-card-label">
              Live Feed
            </span>

          </div>


          <div className="quick-card-title">
            Announcements
          </div>


          <p>
            Create and view campus announcements
          </p>

        </button>


        {/* SERVICE REQUESTS */}

        <button
          type="button"
          className={`teacher-quick-card services-card ${
            activeTab === "services"
              ? "active"
              : ""
          }`}
          onClick={() =>
            changeTab("services")
          }
          aria-pressed={
            activeTab === "services"
          }
        >

          <div className="quick-card-top">

            <div className="quick-card-icon service-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >

                <rect
                  x="5"
                  y="4"
                  width="14"
                  height="17"
                  rx="2"
                />

                <path d="M9 4a3 3 0 006 0" />

                <path d="M9 10h6" />

                <path d="M9 14h6" />

                <path d="M9 18h4" />

              </svg>

            </div>


            <span className="quick-card-label">
              Support
            </span>

          </div>


          <div className="quick-card-title">
            Service Requests
          </div>


          <p>
            Track IT, lab supplies & maintenance
          </p>

        </button>


        {/* COMMUNICATION */}

        <button
          type="button"
          className={`teacher-quick-card communication-card ${
            activeTab === "communications"
              ? "active"
              : ""
          }`}
          onClick={() =>
            changeTab("communications")
          }
          aria-pressed={
            activeTab === "communications"
          }
        >

          <div className="quick-card-top">

            <div className="quick-card-icon communication-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >

                <path d="M8 10h.01" />

                <path d="M12 10h.01" />

                <path d="M16 10h.01" />

                <path d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />

              </svg>

            </div>


            <span className="quick-card-label">
              Office Line
            </span>

          </div>


          <div className="quick-card-title">
            Direct Messaging
          </div>


          <p>
            Real-time chat with administration
          </p>

        </button>

      </section>


      {/* =====================================================
          MAIN WORKSPACE
      ===================================================== */}

      <section className="teacher-workspace">


        {/* WORKSPACE HEADER */}

        <div className="workspace-header">

          <div className="workspace-header-info">

            <span className="workspace-eyebrow">
              FACULTY SERVICES
            </span>

            <h2>
              Faculty Workspace
            </h2>

            <p>
              Create announcements, manage service
              requests and communicate with offices.
            </p>

          </div>


          <div className="workspace-status">

            <span className="status-dot" />

            <span>
              System Online
            </span>

          </div>

        </div>


        {/* ===================================================
            TABS
        =================================================== */}

        <nav
          className="teacher-tabs"
          aria-label="Faculty workspace navigation"
        >


          {/* ANNOUNCEMENTS TAB */}

          <button
            type="button"
            className={`teacher-tab ${
              activeTab === "updates"
                ? "active updates-tab"
                : ""
            }`}
            onClick={() =>
              changeTab("updates")
            }
          >

            <svg
              className="tab-svg-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >

              <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15" />

              <path d="M18 13a3 3 0 100-6" />

              <path d="M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />

            </svg>

            <span>
              Announcements
            </span>

          </button>


          {/* SERVICE REQUESTS TAB */}

          <button
            type="button"
            className={`teacher-tab ${
              activeTab === "services"
                ? "active services-tab"
                : ""
            }`}
            onClick={() =>
              changeTab("services")
            }
          >

            <svg
              className="tab-svg-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >

              <rect
                x="5"
                y="4"
                width="14"
                height="17"
                rx="2"
              />

              <path d="M9 4a3 3 0 006 0" />

              <path d="M9 10h6" />

              <path d="M9 14h6" />

              <path d="M9 18h4" />

            </svg>

            <span>
              Service Requests
            </span>

          </button>


          {/* COMMUNICATION TAB */}

          <button
            type="button"
            className={`teacher-tab ${
              activeTab === "communications"
                ? "active communication-tab"
                : ""
            }`}
            onClick={() =>
              changeTab("communications")
            }
          >

            <svg
              className="tab-svg-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >

              <path d="M8 10h.01" />

              <path d="M12 10h.01" />

              <path d="M16 10h.01" />

              <path d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />

            </svg>

            <span>
              Direct Chat
            </span>

          </button>

        </nav>


        {/* ===================================================
            CONTENT
        =================================================== */}

        <div className="teacher-content">


          {/* =================================================
              ANNOUNCEMENTS
          ================================================= */}

          {activeTab === "updates" && (

            <div className="teacher-panel announcements-panel">


              {/* HEADER */}

              <div className="panel-section-header">

                <div>

                  <span className="panel-eyebrow">
                    CAMPUS UPDATES
                  </span>

                  <h1>
                    Campus Announcements
                  </h1>

                  <p>
                    Create announcements and view
                    your published announcements.
                  </p>

                </div>


                <div className="panel-status purple-status">

                  <span className="panel-status-dot" />

                  Live Feed

                </div>

              </div>


              {/* =================================================
                  CREATE ANNOUNCEMENT
              ================================================= */}

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "24px"
                }}
              >

                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: "8px"
                  }}
                >
                  Create Announcement
                </h2>


                <p
                  style={{
                    color: "#6b7280",
                    marginBottom: "20px"
                  }}
                >
                  Create a campus announcement.
                  Your teacher name will be added
                  automatically.
                </p>


                <form
                  onSubmit={
                    handleCreateAnnouncement
                  }
                >

                  <div
                    style={{
                      display: "grid",
                      gap: "16px"
                    }}
                  >


                    {/* TITLE */}

                    <div>

                      <label
                        htmlFor="announcement-title"
                      >
                        Title
                      </label>

                      <input
                        id="announcement-title"
                        type="text"
                        value={
                          announcementTitle
                        }
                        onChange={
                          event =>
                            setAnnouncementTitle(
                              event.target.value
                            )
                        }
                        placeholder="Announcement title"
                        required
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginTop: "6px",
                          border:
                            "1px solid #d1d5db",
                          borderRadius: "8px",
                          boxSizing:
                            "border-box"
                        }}
                      />

                    </div>


                    {/* CATEGORY */}

                    <div>

                      <label
                        htmlFor="announcement-category"
                      >
                        Category
                      </label>

                      <select
                        id="announcement-category"
                        value={
                          announcementCategory
                        }
                        onChange={
                          event =>
                            setAnnouncementCategory(
                              event.target.value
                            )
                        }
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginTop: "6px",
                          border:
                            "1px solid #d1d5db",
                          borderRadius: "8px",
                          boxSizing:
                            "border-box"
                        }}
                      >

                        <option value="General">
                          General
                        </option>

                        <option value="Academic">
                          Academic
                        </option>

                        <option value="Event">
                          Event
                        </option>

                        <option value="Important">
                          Important
                        </option>

                        <option value="Notice">
                          Notice
                        </option>

                      </select>

                    </div>


                    {/* BODY */}

                    <div>

                      <label
                        htmlFor="announcement-body"
                      >
                        Announcement
                      </label>

                      <textarea
                        id="announcement-body"
                        value={
                          announcementBody
                        }
                        onChange={
                          event =>
                            setAnnouncementBody(
                              event.target.value
                            )
                        }
                        placeholder="Write your announcement..."
                        rows={5}
                        required
                        style={{
                          width: "100%",
                          padding: "12px",
                          marginTop: "6px",
                          border:
                            "1px solid #d1d5db",
                          borderRadius: "8px",
                          resize: "vertical",
                          boxSizing:
                            "border-box"
                        }}
                      />

                    </div>


                    {/* MESSAGE */}

                    {announcementMessage && (

                      <div
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          background:
                            announcementMessage.includes(
                              "successfully"
                            )
                              ? "#ecfdf5"
                              : "#fef2f2",
                          color:
                            announcementMessage.includes(
                              "successfully"
                            )
                              ? "#047857"
                              : "#b91c1c"
                        }}
                      >
                        {
                          announcementMessage
                        }
                      </div>

                    )}


                    {/* SUBMIT */}

                    <button
                      type="submit"
                      disabled={
                        announcementLoading
                      }
                      style={{
                        padding:
                          "12px 20px",
                        border: "none",
                        borderRadius: "8px",
                        cursor:
                          announcementLoading
                            ? "not-allowed"
                            : "pointer",
                        fontWeight: 600,
                        opacity:
                          announcementLoading
                            ? 0.7
                            : 1
                      }}
                    >

                      {announcementLoading
                        ? "Creating..."
                        : "Create Announcement"}

                    </button>

                  </div>

                </form>

              </div>


              {/* =================================================
                  TEACHER ANNOUNCEMENT LIST
              ================================================= */}

              <div className="panel-content">

                <div
                  style={{
                    background: "#ffffff",
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "24px"
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      marginBottom: "20px",
                      gap: "12px",
                      flexWrap: "wrap"
                    }}
                  >

                    <div>

                      <h2
                        style={{
                          margin: 0
                        }}
                      >
                        My Announcements
                      </h2>

                      <p
                        style={{
                          margin:
                            "6px 0 0",
                          color:
                            "#6b7280"
                        }}
                      >
                        Announcements created by you.
                      </p>

                    </div>


                    <button
                      type="button"
                      onClick={
                        loadAnnouncements
                      }
                      disabled={
                        announcementListLoading
                      }
                      style={{
                        padding:
                          "9px 14px",
                        border:
                          "1px solid #d1d5db",
                        borderRadius: "8px",
                        background:
                          "#ffffff",
                        cursor:
                          announcementListLoading
                            ? "not-allowed"
                            : "pointer",
                        fontWeight: 600
                      }}
                    >
                      {announcementListLoading
                        ? "Loading..."
                        : "Refresh"}
                    </button>

                  </div>


                  {/* LOADING */}

                  {announcementListLoading &&
                    announcements.length === 0 && (

                      <div
                        style={{
                          padding: "30px",
                          textAlign: "center",
                          color: "#6b7280"
                        }}
                      >
                        Loading announcements...
                      </div>

                    )}


                  {/* EMPTY */}

                  {!announcementListLoading &&
                    announcements.length === 0 && (

                      <div
                        style={{
                          padding: "30px",
                          textAlign: "center",
                          color: "#6b7280",
                          background:
                            "#f9fafb",
                          borderRadius:
                            "12px"
                        }}
                      >
                        You have not created any
                        announcements yet.
                      </div>

                    )}


                  {/* LIST */}

                  {announcements.length > 0 && (

                    <div
                      style={{
                        display: "grid",
                        gap: "16px"
                      }}
                    >

                      {announcements.map(
                        announcement => (

                          <article
                            key={
                              announcement.id
                            }
                            style={{
                              border:
                                "1px solid #e5e7eb",
                              borderRadius:
                                "12px",
                              padding:
                                "18px",
                              background:
                                "#ffffff"
                            }}
                          >

                            <div
                              style={{
                                display:
                                  "flex",
                                justifyContent:
                                  "space-between",
                                alignItems:
                                  "flex-start",
                                gap:
                                  "12px",
                                marginBottom:
                                  "10px"
                              }}
                            >

                              <div>

                                <h3
                                  style={{
                                    margin:
                                      "0 0 6px",
                                    fontSize:
                                      "18px"
                                  }}
                                >
                                  {
                                    announcement.title
                                  }
                                </h3>

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    gap:
                                      "8px",
                                    flexWrap:
                                      "wrap",
                                    alignItems:
                                      "center"
                                  }}
                                >

                                  <span
                                    style={{
                                      padding:
                                        "4px 9px",
                                      borderRadius:
                                        "999px",
                                      background:
                                        "#f3e8ff",
                                      color:
                                        "#7e22ce",
                                      fontSize:
                                        "12px",
                                      fontWeight:
                                        600
                                    }}
                                  >
                                    {
                                      announcement.category
                                    }
                                  </span>


                                  <span
                                    style={{
                                      padding:
                                        "4px 9px",
                                      borderRadius:
                                        "999px",
                                      background:
                                        "#ecfdf5",
                                      color:
                                        "#047857",
                                      fontSize:
                                        "12px",
                                      fontWeight:
                                        600
                                    }}
                                  >
                                    {
                                      announcement.status
                                    }
                                  </span>

                                </div>

                              </div>

                            </div>


                            <p
                              style={{
                                margin:
                                  "0 0 12px",
                                lineHeight:
                                  1.6,
                                color:
                                  "#374151",
                                whiteSpace:
                                  "pre-wrap"
                              }}
                            >
                              {
                                announcement.body
                              }
                            </p>


                            <div
                              style={{
                                fontSize:
                                  "13px",
                                color:
                                  "#6b7280"
                              }}
                            >

                              Posted by{" "}
                              <strong>
                                {
                                  announcement.teacher_name
                                }
                              </strong>

                              {" • "}

                              {
                                formatDate(
                                  announcement.created_at
                                )
                              }

                            </div>

                          </article>

                        )
                      )}

                    </div>

                  )}

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              SERVICE REQUESTS
          ================================================= */}

          {activeTab === "services" && (

            <div className="teacher-panel service-request-panel">

              <div className="panel-section-header">

                <div>

                  <span className="panel-eyebrow orange-eyebrow">
                    CAMPUS SUPPORT
                  </span>

                  <h1>
                    Service Requests
                  </h1>

                  <p>
                    Submit and track requests for
                    IT support, laboratory equipment,
                    maintenance and other campus services.
                  </p>

                </div>


                <div className="panel-status orange-status">

                  <span className="panel-status-dot" />

                  Support

                </div>

              </div>


              <div className="panel-content">

                <ServiceRequests />

              </div>

            </div>

          )}


          {/* =================================================
              COMMUNICATIONS
          ================================================= */}

          {activeTab === "communications" && (

            <div className="teacher-panel communications-panel">

              <div className="panel-section-header">

                <div>

                  <span className="panel-eyebrow green-eyebrow">
                    OFFICE COMMUNICATION
                  </span>

                  <h1>
                    Direct Office Channel
                  </h1>

                  <p>
                    Communicate directly with
                    university offices and administration.
                  </p>

                </div>


                <div className="panel-status green-status">

                  <span className="panel-status-dot" />

                  Online

                </div>

              </div>


              <div className="panel-content">

                <Communications />

              </div>

            </div>

          )}

        </div>

      </section>

    </main>
  );
};


export default TeacherDashboard;