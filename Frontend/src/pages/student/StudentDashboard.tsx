import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import SummaryCard from "../../components/SummaryCard";
import OfficeCard from "../../components/OfficeCard";
import RequestTable from "../../components/RequestTable";
import NoticeBoard from "../../components/NoticeBoard";
import NotificationPanel from "../../components/NotificationPanel";

const StudentDashboard = () => {
  return (
    <div
      style={{
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div
        style={{
          display: "flex",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "30px",
          }}
        >
          {/* Welcome Section */}

          <div
            style={{
              backgroundColor: "#fff",
              padding: "25px",
              borderRadius: "10px",
              marginBottom: "25px",
              boxShadow: "0 2px 8px rgba(0,0,0,.1)",
            }}
          >
            <h1>Welcome, Mahamudul Amin 👋</h1>

            <p>
              Student ID : 221-XXX-XXX
            </p>

            <p>
              Department : Computer Science & Engineering
            </p>

            <p>
              Semester : Spring 2026
            </p>
          </div>

          {/* Dashboard Cards */}

          <h2>Dashboard Summary</h2>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "35px",
            }}
          >
            <SummaryCard
              title="Total Requests"
              value={8}
              color="#3498db"
            />

            <SummaryCard
              title="Pending"
              value={2}
              color="#f39c12"
            />

            <SummaryCard
              title="Approved"
              value={5}
              color="#27ae60"
            />

            <SummaryCard
              title="Rejected"
              value={1}
              color="#e74c3c"
            />
          </div>

          {/* University Offices */}

          <h2>University Offices</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginBottom: "35px",
            }}
          >
            <OfficeCard
              officeName="Admission Office"
              description="Admission related services."
            />

            <OfficeCard
              officeName="Registration Office"
              description="Course registration and records."
            />

            <OfficeCard
              officeName="CITS"
              description="Technical support and IT services."
            />

            <OfficeCard
              officeName="Financial Aid Office"
              description="Scholarships and financial assistance."
            />

            <OfficeCard
              officeName="Accounts Office"
              description="Tuition fee and payment services."
            />

            <OfficeCard
              officeName="Student Affairs Office"
              description="Student welfare and campus activities."
            />
          </div>

          {/* Service Requests */}

          <RequestTable />

          {/* Notices */}

          <NoticeBoard />

          {/* Notifications */}

          <NotificationPanel />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;