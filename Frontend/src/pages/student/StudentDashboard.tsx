import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import SummaryCard from "../../components/SummaryCard";
import OfficeCard from "../../components/OfficeCard";
import RequestTable from "../../components/RequestTable";
import NoticeBoard from "../../components/NoticeBoard";
import NotificationPanel from "../../components/NotificationPanel";

import "../../styles/StudentDashboard.css";


const StudentDashboard = () => {

  const navigate = useNavigate();


  const handleLogout = () => {

    // remove login data if later added
    localStorage.removeItem("user");

    navigate("/login");

  };


  return (

    <div className="dashboard-container">


      <Navbar />


      <div className="dashboard-layout">


        <aside className="dashboard-sidebar">

          <Sidebar />

        </aside>



        <main className="dashboard-content">


          <div className="dashboard-top">

            <div>

              <h1>
                Welcome, Mahamudul Amin 👋
              </h1>


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



            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>


          </div>




          <h2>
            Dashboard Summary
          </h2>


          <div className="summary-container">


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





          <h2>
            University Offices
          </h2>


          <div className="office-container">


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




          <RequestTable />


          <NoticeBoard />


          <NotificationPanel />



        </main>


      </div>


    </div>

  );
};


export default StudentDashboard;