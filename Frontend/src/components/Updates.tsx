import React, { useCallback, useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000";

interface Announcement {
  id?: string;
  announcement_id?: string;
  teacher_id?: string;
  teacher_name?: string;
  title: string;
  body: string;
  category: string;
  created_at?: string;
}

const Updates: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/announcements`
      );

      if (!response.ok) {
        throw new Error("Failed to load announcements.");
      }

      const data = await response.json();

      setAnnouncements(
        Array.isArray(data)
          ? [...data].reverse()
          : []
      );
    } catch (error) {
      console.error("Load announcements error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load announcements."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load once when component is mounted
    loadAnnouncements();

    // Reload only when a new announcement is created
    const handleAnnouncementCreated = () => {
      loadAnnouncements();
    };

    window.addEventListener(
      "announcementCreated",
      handleAnnouncementCreated
    );

    return () => {
      window.removeEventListener(
        "announcementCreated",
        handleAnnouncementCreated
      );
    };
  }, [loadAnnouncements]);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        Loading announcements...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "16px",
          borderRadius: "10px",
          background: "#fef2f2",
          color: "#b91c1c"
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div>
      {announcements.length === 0 ? (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
            color: "#6b7280"
          }}
        >
          No announcements available.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px"
          }}
        >
          {announcements.map((announcement, index) => (
            <article
              key={
                announcement.id ||
                announcement.announcement_id ||
                `${announcement.title}-${index}`
              }
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "20px"
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "10px"
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px"
                  }}
                >
                  {announcement.title}
                </h3>

                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "999px",
                    background: "#f3e8ff",
                    color: "#7e22ce",
                    fontSize: "12px",
                    fontWeight: 600
                  }}
                >
                  {announcement.category}
                </span>
              </div>

              <p
                style={{
                  margin: "0 0 12px",
                  color: "#4b5563",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap"
                }}
              >
                {announcement.body}
              </p>

              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280"
                }}
              >
                {announcement.teacher_name && (
                  <span>
                    By {announcement.teacher_name}
                  </span>
                )}

                {announcement.created_at && (
                  <span>
                    {" • "}
                    {new Date(
                      announcement.created_at
                    ).toLocaleString()}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Updates;