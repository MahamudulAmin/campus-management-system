const NotificationPanel = () => {
  const notifications = [
    {
      message: "Your request has been submitted successfully.",
      time: "10 minutes ago",
    },
    {
      message: "Registration request has been approved.",
      time: "1 hour ago",
    },
    {
      message: "New notice has been published.",
      time: "Yesterday",
    },
    {
      message: "Your complaint is under review.",
      time: "2 days ago",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        marginTop: "20px",
      }}
    >
      <h2
        style={{
          color: "#1E3A8A",
          marginBottom: "20px",
        }}
      >
        🔔 Notifications
      </h2>

      {notifications.map((notification, index) => (
        <div
          key={index}
          style={{
            padding: "12px 0",
            borderBottom:
              index !== notifications.length - 1 ? "1px solid #ddd" : "none",
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: "500",
            }}
          >
            {notification.message}
          </p>

          <small
            style={{
              color: "#777",
            }}
          >
            {notification.time}
          </small>
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;