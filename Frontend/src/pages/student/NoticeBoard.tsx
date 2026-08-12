import Navbar from "../../components/StudentNavbar";
import Sidebar from "../../components/StudentSidebar";
import NoticeBoard from "../../components/StudentNoticeBoard";

const NoticeBoardPage = () => {
  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "30px" }}>
          <h1>Notice Board</h1>

          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <NoticeBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoardPage;
