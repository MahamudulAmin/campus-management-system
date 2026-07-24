import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import SummaryCard from "../../components/SummaryCard";
import OfficeCard from "../../components/OfficeCard";
import RequestTable from "../../components/RequestTable";
import NoticeBoard from "../../components/NoticeBoard";
import NotificationPanel from "../../components/NotificationPanel";

import { getRequests } from "../../utils/requestStorage";
import "../../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Always scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch requests
  const requests = getRequests() || [];

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const total = requests.length;
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

  const summaryCardsData = [
    { title: "Total Requests", value: metrics.total, color: "#2563eb" },
    { title: "Pending", value: metrics.pending, color: "#f59e0b" },
    { title: "Approved", value: metrics.approved, color: "#10b981" },
    { title: "Rejected", value: metrics.rejected, color: "#ef4444" },
  ];

  const officesData = [
    {
      officeName: "Admission Office",
      description: "Admission related services.",
    },
    {
      officeName: "Registration Office",
      description: "Course registration and academic records.",
    },
    {
      officeName: "Accounts Office",
      description: "Tuition fees and payment services.",
    },
    {
      officeName: "Financial Aid Office",
      description: "Scholarships and financial support.",
    },
    {
      officeName: "CITS",
      description: "Technical support and IT services.",
    },
    {
      officeName: "Student Affairs",
      description: "Campus activities and student welfare.",
    },
  ];

  const handleCardClick = () => {
    navigate("/request-history");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-layout">
        <aside className="dashboard-sidebar">
          <Sidebar />
        </aside>

        <main className="dashboard-content">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-left">
              <h1>👋 Welcome Back, Mahamudul Amin</h1>
              <p>Campus Management System</p>

              <div className="student-info">
                <span>🎓 Student ID : 221-XXX-XXX</span>
                <span>💻 Department : Computer Science & Engineering</span>
                <span>📚 Semester : Spring 2026</span>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="dashboard-section">
            <h2>Dashboard Summary</h2>

            <div className="summary-container">
              {summaryCardsData.map((card, index) => (
                <div
                  key={index}
                  className="summary-wrapper"
                  role="button"
                  tabIndex={0}
                  onClick={handleCardClick}
                  onKeyDown={handleKeyDown}
                >
                  <SummaryCard
                    title={card.title}
                    value={card.value}
                    color={card.color}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* University Offices */}
          <section className="dashboard-section">
            <h2>University Offices</h2>

            <div className="office-container">
              {officesData.map((office, index) => (
                <OfficeCard
                  key={index}
                  officeName={office.officeName}
                  description={office.description}
                />
              ))}
            </div>
          </section>

          {/* Recent Requests */}
          <section className="dashboard-section">
            <RequestTable />
          </section>

          {/* Bottom Section */}
          <section className="bottom-grid">
            <NoticeBoard />
            <NotificationPanel />
          </section>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;