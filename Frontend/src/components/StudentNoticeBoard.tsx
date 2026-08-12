const NoticeBoard = () => {
  const notices = [
    {
      title: "Mid-Term Exam Routine Published",
      date: "10 July 2026",
    },
    {
      title: "Scholarship Application Deadline",
      date: "15 July 2026",
    },
    {
      title: "Course Registration Starts Next Week",
      date: "20 July 2026",
    },
    {
      title: "Campus Closed on Friday",
      date: "22 July 2026",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
        marginTop: "20px",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "#1E3A8A",
        }}
      >
        📢 Latest Notices
      </h2>

      {notices.map((notice, index) => (
        <div
          key={index}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "12px 0",
          }}
        >
          <h4
            style={{
              margin: 0,
              color: "#2563EB",
            }}
          >
            {notice.title}
          </h4>

          <small
            style={{
              color: "#666",
            }}
          >
            {notice.date}
          </small>
        </div>
      ))}
    </div>
  );
};

export default NoticeBoard;