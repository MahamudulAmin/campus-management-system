const NotificationPanel = () => {
  const notifications = [
    {
      title: "Office hours changed for CITS",
      description: "CITS will be available from 10:00 AM to 4:00 PM today.",
      time: "5 mins ago",
    },
    {
      title: "New transcript update",
      description: "Your transcript request is now under review.",
      time: "20 mins ago",
    },
    {
      title: "Campus event reminder",
      description: "The campus fair is scheduled for Saturday at 11:00 AM.",
      time: "1 hour ago",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        marginTop: "24px",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#0f172a" }}>Notifications</h2>
      <div style={{ display: "grid", gap: "14px" }}>
        {notifications.map((notification, index) => (
          <div
            key={index}
            style={{
              padding: "18px",
              borderRadius: "16px",
              backgroundColor: "#f8fafc",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0", color: "#1f2937" }}>{notification.title}</h3>
            <p style={{ margin: 0, color: "#475569" }}>{notification.description}</p>
            <small style={{ color: "#64748b" }}>{notification.time}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
