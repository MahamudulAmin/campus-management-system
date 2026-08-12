import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface RequestItem {
  id: string;
  teacher_id: string;
  teacher_name: string;
  title: string;
  category: string;
  description?: string;
  status: string;
  admin_remark?: string;
  submitted_at: string;
}

interface MessageItem {
  teacher_id?: string;
  teacher_name?: string;
  message?: string;
  timestamp?: string;
}

interface CampusInfoItem {
  id: string;
  title: string;
  category: string;
  content: string;
  location?: string;
  contact?: string;
  created_by?: string;
  created_at: string;
}

type TabType =
  | "review_requests"
  | "inbox"
  | "manage_info";

const API_URL = "http://127.0.0.1:8000";

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();

  // =====================================================
  // ACTIVE TAB
  // =====================================================

  const [activeTab, setActiveTab] =
    useState<TabType>("review_requests");

  // =====================================================
  // SERVICE REQUESTS
  // =====================================================

  const [requests, setRequests] =
    useState<RequestItem[]>([]);

  // =====================================================
  // MESSAGES
  // =====================================================

  const [messages, setMessages] =
    useState<MessageItem[]>([]);

  // =====================================================
  // CAMPUS INFORMATION
  // =====================================================

  const [campusInfo, setCampusInfo] =
    useState<CampusInfoItem[]>([]);

  // =====================================================
  // CAMPUS INFORMATION FORM
  // =====================================================

  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] =
    useState("General");
  const [newContent, setNewContent] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newContact, setNewContact] = useState("");

  // =====================================================
  // REQUEST REMARKS
  // =====================================================

  const [statusRemark, setStatusRemark] =
    useState<{ [key: string]: string }>({});

  // =====================================================
  // LOADING
  // =====================================================

  const [loadingRequests, setLoadingRequests] =
    useState(false);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [loadingCampusInfo, setLoadingCampusInfo] =
    useState(false);

  const [savingCampusInfo, setSavingCampusInfo] =
    useState(false);

  // =====================================================
  // MESSAGES
  // =====================================================

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // STAFF ID
  // =====================================================

  const staffId =
    localStorage.getItem("userId") || "";

  // =====================================================
  // TOKEN
  // =====================================================

  const token =
    localStorage.getItem("token") || "";

  // =====================================================
  // HEADERS
  // =====================================================

  const getHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] =
        `Bearer ${token}`;
    }

    return headers;
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    sessionStorage.clear();

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // NORMALIZE TEACHER REQUEST
  // =====================================================

  const normalizeRequest = (
    item: any,
    index: number
  ): RequestItem => {
    return {
      id: String(
        item?.id ??
          item?.request_id ??
          item?.requestId ??
          `request-${index}`
      ),

      teacher_id: String(
        item?.teacher_id ??
          item?.teacherId ??
          item?.user_id ??
          item?.userId ??
          ""
      ),

      teacher_name: String(
        item?.teacher_name ??
          item?.teacherName ??
          item?.name ??
          item?.full_name ??
          "Unknown Teacher"
      ),

      title: String(
        item?.title ??
          item?.subject ??
          "Service Request"
      ),

      category: String(
        item?.category ??
          "General"
      ),

      description: String(
        item?.description ??
          item?.details ??
          item?.message ??
          ""
      ),

      status: String(
        item?.status ??
          "Pending"
      ),

      admin_remark: String(
        item?.admin_remark ??
          item?.staff_remark ??
          item?.remark ??
          ""
      ),

      submitted_at: String(
        item?.submitted_at ??
          item?.submittedAt ??
          item?.created_at ??
          item?.createdAt ??
          ""
      ),
    };
  };

  // =====================================================
  // FETCH TEACHER SERVICE REQUESTS
  // =====================================================

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      setError("");

      console.log(
        "Loading teacher requests from:",
        `${API_URL}/staff/requests`
      );

      const response = await fetch(
        `${API_URL}/staff/requests`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      console.log(
        "Staff request response status:",
        response.status
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Staff request API error:",
          errorText
        );

        throw new Error(
          `Failed to fetch requests (${response.status})`
        );
      }

      const data = await response.json();

      console.log(
        "Teacher requests received:",
        data
      );

      // ---------------------------------------------------
      // Support different response structures
      // ---------------------------------------------------

      let requestList: any[] = [];

      if (Array.isArray(data)) {
        requestList = data;
      } else if (
        Array.isArray(data?.requests)
      ) {
        requestList = data.requests;
      } else if (
        Array.isArray(data?.teacher_requests)
      ) {
        requestList = data.teacher_requests;
      } else if (
        Array.isArray(data?.data)
      ) {
        requestList = data.data;
      }

      const normalized =
        requestList.map(
          (item, index) =>
            normalizeRequest(item, index)
        );

      console.log(
        "Normalized teacher requests:",
        normalized
      );

      setRequests(normalized);

      if (normalized.length === 0) {
        setError(
          "No teacher requests were returned by the backend."
        );
      }
    } catch (err) {
      console.error(
        "Fetch teacher requests error:",
        err
      );

      setRequests([]);

      setError(
        "Unable to load teacher service requests. Check /staff/requests in the backend."
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  // =====================================================
  // FETCH MESSAGES
  // =====================================================

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);

      const response = await fetch(
        `${API_URL}/api/messages`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch messages (${response.status})`
        );
      }

      const data = await response.json();

      setMessages(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.messages)
          ? data.messages
          : []
      );
    } catch (err) {
      console.error(
        "Fetch messages error:",
        err
      );

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // =====================================================
  // FETCH CAMPUS INFORMATION
  // =====================================================

  const fetchCampusInfo = async () => {
    try {
      setLoadingCampusInfo(true);

      const response = await fetch(
        `${API_URL}/staff/campus-info`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch campus information (${response.status})`
        );
      }

      const data = await response.json();

      setCampusInfo(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : []
      );
    } catch (err) {
      console.error(
        "Fetch campus information error:",
        err
      );

      setCampusInfo([]);

      setError(
        "Unable to load campus information."
      );
    } finally {
      setLoadingCampusInfo(false);
    }
  };

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchRequests();
    fetchMessages();
    fetchCampusInfo();
  }, []);

  // =====================================================
  // UPDATE SERVICE REQUEST STATUS
  // =====================================================

  const handleUpdateStatus = async (
    requestId: string,
    newStatus: string
  ) => {
    try {
      setMessage("");
      setError("");

      const remark =
        statusRemark[requestId] || "";

      const response = await fetch(
        `${API_URL}/staff/requests/status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({
            request_id: requestId,
            status: newStatus,
            admin_remark: remark,
          }),
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(
            () => null
          );

        throw new Error(
          errorData?.detail ||
            `Failed to update status (${response.status})`
        );
      }

      setMessage(
        `Request status updated to "${newStatus}".`
      );

      setStatusRemark((previous) => ({
        ...previous,
        [requestId]: "",
      }));

      await fetchRequests();
    } catch (err) {
      console.error(
        "Update status error:",
        err
      );

      setError(
        "Unable to update request status."
      );
    }
  };

  // =====================================================
  // ADD CAMPUS INFORMATION
  // =====================================================

  const handleAddCampusInfo = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setSavingCampusInfo(true);

      const response = await fetch(
        `${API_URL}/staff/campus-info`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            title: newTitle,
            category: newCategory,
            content: newContent,
            location: newLocation,
            contact: newContact,
            created_by: staffId,
          }),
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(
            () => null
          );

        throw new Error(
          errorData?.detail ||
            `Failed to save campus information (${response.status})`
        );
      }

      setMessage(
        "Campus information added successfully."
      );

      setNewTitle("");
      setNewCategory("General");
      setNewContent("");
      setNewLocation("");
      setNewContact("");

      await fetchCampusInfo();
    } catch (err) {
      console.error(
        "Add campus information error:",
        err
      );

      setError(
        "Unable to save campus information."
      );
    } finally {
      setSavingCampusInfo(false);
    }
  };

  // =====================================================
  // DELETE CAMPUS INFORMATION
  // =====================================================

  const handleDeleteCampusInfo = async (
    infoId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this campus information?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/staff/campus-info/${infoId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(
            () => null
          );

        throw new Error(
          errorData?.detail ||
            `Failed to delete information (${response.status})`
        );
      }

      setMessage(
        "Campus information deleted successfully."
      );

      await fetchCampusInfo();
    } catch (err) {
      console.error(
        "Delete campus information error:",
        err
      );

      setError(
        "Unable to delete campus information."
      );
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusStyle = (
    status: string
  ): React.CSSProperties => {
    const normalized =
      status.toLowerCase();

    if (
      normalized === "approved" ||
      normalized === "resolved"
    ) {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (
      normalized === "rejected"
    ) {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    if (
      normalized === "in progress"
    ) {
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    return {
      background: "#fef3c7",
      color: "#92400e",
    };
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto 25px auto",
          background: "#ffffff",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 8px 0",
              color: "#0f172a",
            }}
          >
            Office Staff Dashboard
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
            }}
          >
            Manage teacher service requests,
            communications and campus information.
          </p>

          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "13px",
              color: "#94a3b8",
            }}
          >
            Staff ID: {staffId || "Unknown"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            padding: "11px 20px",
            background: "#dc2626",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          ↪ Logout
        </button>
      </div>

      {/* =================================================
          MESSAGES
      ================================================= */}

      {message && (
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto 15px auto",
            padding: "12px 16px",
            background: "#dcfce7",
            color: "#166534",
            borderRadius: "8px",
            border: "1px solid #bbf7d0",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto 15px auto",
            padding: "12px 16px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {/* =================================================
          TABS
      ================================================= */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto 20px auto",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() =>
            setActiveTab("review_requests")
          }
          style={{
            padding: "11px 18px",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
            background:
              activeTab === "review_requests"
                ? "#2563eb"
                : "#e2e8f0",
            color:
              activeTab === "review_requests"
                ? "#ffffff"
                : "#334155",
            fontWeight: 600,
          }}
        >
          📋 Service Requests
          {requests.length > 0 && (
            <span
              style={{
                marginLeft: "8px",
                background: "#ffffff",
                color: "#2563eb",
                borderRadius: "20px",
                padding: "2px 7px",
                fontSize: "11px",
              }}
            >
              {requests.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("inbox")
          }
          style={{
            padding: "11px 18px",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
            background:
              activeTab === "inbox"
                ? "#2563eb"
                : "#e2e8f0",
            color:
              activeTab === "inbox"
                ? "#ffffff"
                : "#334155",
            fontWeight: 600,
          }}
        >
          📥 Messages
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("manage_info")
          }
          style={{
            padding: "11px 18px",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
            background:
              activeTab === "manage_info"
                ? "#2563eb"
                : "#e2e8f0",
            color:
              activeTab === "manage_info"
                ? "#ffffff"
                : "#334155",
            fontWeight: 600,
          }}
        >
          ⚙️ Campus Information
        </button>

        {/* REFRESH BUTTON */}

        <button
          type="button"
          onClick={fetchRequests}
          disabled={loadingRequests}
          style={{
            padding: "11px 18px",
            border: "1px solid #cbd5e1",
            borderRadius: "7px",
            cursor: loadingRequests
              ? "not-allowed"
              : "pointer",
            background: "#ffffff",
            color: "#334155",
            fontWeight: 600,
          }}
        >
          🔄{" "}
          {loadingRequests
            ? "Loading..."
            : "Refresh Requests"}
        </button>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* =================================================
            SERVICE REQUESTS
        ================================================= */}

        {activeTab === "review_requests" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#1e293b",
                }}
              >
                📋 Teacher Service Requests
              </h3>

              <span
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                {requests.length} request
                {requests.length !== 1
                  ? "s"
                  : ""}
              </span>
            </div>

            {loadingRequests ? (
              <div
                style={{
                  background: "#ffffff",
                  padding: "30px",
                  borderRadius: "10px",
                  textAlign: "center",
                  color: "#64748b",
                  border:
                    "1px solid #e2e8f0",
                }}
              >
                Loading teacher requests...
              </div>
            ) : requests.length === 0 ? (
              <div
                style={{
                  background: "#ffffff",
                  padding: "35px",
                  borderRadius: "10px",
                  textAlign: "center",
                  color: "#64748b",
                  border:
                    "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    fontSize: "40px",
                    marginBottom: "10px",
                  }}
                >
                  📭
                </div>

                <h4
                  style={{
                    margin:
                      "0 0 8px 0",
                    color: "#334155",
                  }}
                >
                  No Teacher Requests
                </h4>

                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#94a3b8",
                  }}
                >
                  Teacher service requests will
                  appear here automatically.
                </p>

                <button
                  type="button"
                  onClick={fetchRequests}
                  style={{
                    marginTop: "15px",
                    padding:
                      "9px 16px",
                    background:
                      "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  🔄 Check Again
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {requests.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      background: "#ffffff",
                      border:
                        "1px solid #e2e8f0",
                      padding: "20px",
                      borderRadius: "10px",
                      boxShadow:
                        "0 1px 2px rgba(0,0,0,0.03)",
                    }}
                  >
                    {/* HEADER */}

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "flex-start",
                        gap: "15px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth:
                            "250px",
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: "17px",
                            color:
                              "#0f172a",
                          }}
                        >
                          {req.title}
                        </h4>

                        <p
                          style={{
                            margin:
                              "7px 0 0 0",
                            fontSize:
                              "13px",
                            color:
                              "#64748b",
                          }}
                        >
                          Requested by:{" "}
                          <strong>
                            {req.teacher_name ||
                              "Unknown Teacher"}
                          </strong>
                        </p>

                        <p
                          style={{
                            margin:
                              "4px 0 0 0",
                            fontSize:
                              "13px",
                            color:
                              "#64748b",
                          }}
                        >
                          Teacher ID:{" "}
                          <strong>
                            {req.teacher_id ||
                              "Not available"}
                          </strong>
                        </p>

                        <p
                          style={{
                            margin:
                              "4px 0 0 0",
                            fontSize:
                              "13px",
                            color:
                              "#64748b",
                          }}
                        >
                          Category:{" "}
                          <strong>
                            {req.category}
                          </strong>
                        </p>

                        {req.submitted_at && (
                          <p
                            style={{
                              margin:
                                "4px 0 0 0",
                              fontSize:
                                "12px",
                              color:
                                "#94a3b8",
                            }}
                          >
                            Submitted:{" "}
                            {new Date(
                              req.submitted_at
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>

                      <span
                        style={{
                          ...getStatusStyle(
                            req.status
                          ),
                          padding:
                            "6px 11px",
                          borderRadius:
                            "20px",
                          fontSize:
                            "12px",
                          fontWeight: 700,
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {req.status}
                      </span>
                    </div>

                    {/* DESCRIPTION */}

                    {req.description && (
                      <div
                        style={{
                          marginTop: "15px",
                          padding: "13px",
                          background:
                            "#f8fafc",
                          borderRadius:
                            "7px",
                          color:
                            "#475569",
                          fontSize:
                            "13px",
                          border:
                            "1px solid #f1f5f9",
                        }}
                      >
                        <strong>
                          Description
                        </strong>

                        <div
                          style={{
                            marginTop:
                              "6px",
                            whiteSpace:
                              "pre-wrap",
                            lineHeight:
                              "1.5",
                          }}
                        >
                          {req.description}
                        </div>
                      </div>
                    )}

                    {/* STAFF REMARK */}

                    {req.admin_remark && (
                      <div
                        style={{
                          marginTop: "10px",
                          padding:
                            "10px 12px",
                          background:
                            "#eff6ff",
                          borderRadius:
                            "7px",
                          color:
                            "#1e40af",
                          fontSize:
                            "13px",
                        }}
                      >
                        <strong>
                          Staff Remark:
                        </strong>{" "}
                        {req.admin_remark}
                      </div>
                    )}

                    {/* ACTIONS */}

                    <div
                      style={{
                        marginTop: "16px",
                        paddingTop:
                          "14px",
                        borderTop:
                          "1px solid #f1f5f9",
                        display: "flex",
                        gap: "8px",
                        alignItems:
                          "center",
                        flexWrap:
                          "wrap",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Staff remark / notes..."
                        value={
                          statusRemark[
                            req.id
                          ] || ""
                        }
                        onChange={(e) =>
                          setStatusRemark(
                            (
                              previous
                            ) => ({
                              ...previous,
                              [req.id]:
                                e.target
                                  .value,
                            })
                          )
                        }
                        style={{
                          flex: 1,
                          minWidth:
                            "220px",
                          padding:
                            "9px 12px",
                          border:
                            "1px solid #cbd5e1",
                          borderRadius:
                            "6px",
                          fontSize:
                            "13px",
                          outline:
                            "none",
                          boxSizing:
                            "border-box",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(
                            req.id,
                            "In Progress"
                          )
                        }
                        style={{
                          padding:
                            "9px 13px",
                          background:
                            "#0284c7",
                          color:
                            "#ffffff",
                          border: "none",
                          borderRadius:
                            "6px",
                          cursor:
                            "pointer",
                          fontSize:
                            "12px",
                          fontWeight:
                            600,
                        }}
                      >
                        In Progress
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(
                            req.id,
                            "Approved"
                          )
                        }
                        style={{
                          padding:
                            "9px 13px",
                          background:
                            "#16a34a",
                          color:
                            "#ffffff",
                          border: "none",
                          borderRadius:
                            "6px",
                          cursor:
                            "pointer",
                          fontSize:
                            "12px",
                          fontWeight:
                            600,
                        }}
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateStatus(
                            req.id,
                            "Rejected"
                          )
                        }
                        style={{
                          padding:
                            "9px 13px",
                          background:
                            "#dc2626",
                          color:
                            "#ffffff",
                          border: "none",
                          borderRadius:
                            "6px",
                          cursor:
                            "pointer",
                          fontSize:
                            "12px",
                          fontWeight:
                            600,
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =================================================
            MESSAGES
        ================================================= */}

        {activeTab === "inbox" && (
          <div>
            <h3
              style={{
                margin:
                  "0 0 16px 0",
                color: "#1e293b",
              }}
            >
              📥 Incoming Communications
            </h3>

            {loadingMessages ? (
              <div
                style={{
                  background: "#ffffff",
                  padding: "25px",
                  borderRadius: "10px",
                  textAlign:
                    "center",
                  color: "#64748b",
                  border:
                    "1px solid #e2e8f0",
                }}
              >
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div
                style={{
                  background: "#ffffff",
                  padding: "25px",
                  borderRadius: "10px",
                  color: "#94a3b8",
                  border:
                    "1px solid #e2e8f0",
                }}
              >
                No messages sent to your
                office yet.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "12px",
                }}
              >
                {messages.map(
                  (msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        background:
                          "#ffffff",
                        padding: "16px",
                        borderRadius:
                          "8px",
                        border:
                          "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap: "10px",
                          flexWrap:
                            "wrap",
                          marginBottom:
                            "8px",
                        }}
                      >
                        <strong
                          style={{
                            fontSize:
                              "14px",
                            color:
                              "#0f172a",
                          }}
                        >
                          From:{" "}
                          {msg.teacher_name ||
                            "Unknown Teacher"}

                          {msg.teacher_id
                            ? ` (ID: ${msg.teacher_id})`
                            : ""}
                        </strong>

                        <span
                          style={{
                            fontSize:
                              "12px",
                            color:
                              "#94a3b8",
                          }}
                        >
                          {msg.timestamp ||
                            ""}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: 0,
                          color:
                            "#334155",
                          fontSize:
                            "14px",
                          lineHeight:
                            "1.6",
                        }}
                      >
                        {msg.message ||
                          "No message content."}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* =================================================
            CAMPUS INFORMATION
        ================================================= */}

        {activeTab === "manage_info" && (
          <div>
            <h3
              style={{
                margin:
                  "0 0 6px 0",
                color: "#1e293b",
              }}
            >
              ⚙️ Campus Information
            </h3>

            <p
              style={{
                margin:
                  "0 0 18px 0",
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              Add useful campus information.
              The information will be saved in
              the backend JSON file.
            </p>

            <form
              onSubmit={
                handleAddCampusInfo
              }
              style={{
                background:
                  "#ffffff",
                padding: "24px",
                borderRadius:
                  "10px",
                border:
                  "1px solid #e2e8f0",
                marginBottom:
                  "25px",
              }}
            >
              <div
                style={{
                  marginBottom:
                    "14px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "13px",
                    fontWeight:
                      600,
                    marginBottom:
                      "6px",
                    color:
                      "#334155",
                  }}
                >
                  Information Title
                </label>

                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) =>
                    setNewTitle(
                      e.target.value
                    )
                  }
                  placeholder="Example: Registrar Office Hours"
                  required
                  style={{
                    width:
                      "100%",
                    padding:
                      "10px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius:
                      "6px",
                    boxSizing:
                      "border-box",
                    fontSize:
                      "14px",
                  }}
                />
              </div>

              <div
                style={{
                  marginBottom:
                    "14px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "13px",
                    fontWeight:
                      600,
                    marginBottom:
                      "6px",
                    color:
                      "#334155",
                  }}
                >
                  Category
                </label>

                <select
                  value={
                    newCategory
                  }
                  onChange={(e) =>
                    setNewCategory(
                      e.target.value
                    )
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "10px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius:
                      "6px",
                    boxSizing:
                      "border-box",
                    fontSize:
                      "14px",
                    background:
                      "#ffffff",
                  }}
                >
                  <option value="General">
                    General
                  </option>
                  <option value="Office">
                    Office
                  </option>
                  <option value="Academic">
                    Academic
                  </option>
                  <option value="Admission">
                    Admission
                  </option>
                  <option value="Registration">
                    Registration
                  </option>
                  <option value="Finance">
                    Finance
                  </option>
                  <option value="IT">
                    IT / CITS
                  </option>
                  <option value="Facilities">
                    Facilities
                  </option>
                  <option value="Emergency">
                    Emergency
                  </option>
                </select>
              </div>

              <div
                style={{
                  marginBottom:
                    "14px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "13px",
                    fontWeight:
                      600,
                    marginBottom:
                      "6px",
                    color:
                      "#334155",
                  }}
                >
                  Information
                </label>

                <textarea
                  rows={5}
                  value={
                    newContent
                  }
                  onChange={(e) =>
                    setNewContent(
                      e.target.value
                    )
                  }
                  placeholder="Write the campus information here..."
                  required
                  style={{
                    width:
                      "100%",
                    padding:
                      "10px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius:
                      "6px",
                    boxSizing:
                      "border-box",
                    resize:
                      "vertical",
                    fontSize:
                      "14px",
                  }}
                />
              </div>

              <div
                style={{
                  marginBottom:
                    "14px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "13px",
                    fontWeight:
                      600,
                    marginBottom:
                      "6px",
                    color:
                      "#334155",
                  }}
                >
                  Location
                </label>

                <input
                  type="text"
                  value={
                    newLocation
                  }
                  onChange={(e) =>
                    setNewLocation(
                      e.target.value
                    )
                  }
                  placeholder="Example: Main Campus, Room 204"
                  style={{
                    width:
                      "100%",
                    padding:
                      "10px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius:
                      "6px",
                    boxSizing:
                      "border-box",
                    fontSize:
                      "14px",
                  }}
                />
              </div>

              <div
                style={{
                  marginBottom:
                    "18px",
                }}
              >
                <label
                  style={{
                    display:
                      "block",
                    fontSize:
                      "13px",
                    fontWeight:
                      600,
                    marginBottom:
                      "6px",
                    color:
                      "#334155",
                  }}
                >
                  Contact
                </label>

                <input
                  type="text"
                  value={
                    newContact
                  }
                  onChange={(e) =>
                    setNewContact(
                      e.target.value
                    )
                  }
                  placeholder="Example: 02-1234567 / office@university.edu"
                  style={{
                    width:
                      "100%",
                    padding:
                      "10px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius:
                      "6px",
                    boxSizing:
                      "border-box",
                    fontSize:
                      "14px",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={
                  savingCampusInfo
                }
                style={{
                  padding:
                    "10px 20px",
                  background:
                    savingCampusInfo
                      ? "#93c5fd"
                      : "#2563eb",
                  color:
                    "#ffffff",
                  border: "none",
                  borderRadius:
                    "6px",
                  fontWeight:
                    600,
                  cursor:
                    savingCampusInfo
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {savingCampusInfo
                  ? "Saving..."
                  : "Add Campus Information"}
              </button>
            </form>

            <h3
              style={{
                margin:
                  "0 0 14px 0",
                color:
                  "#1e293b",
              }}
            >
              Saved Campus Information
            </h3>

            {loadingCampusInfo ? (
              <div
                style={{
                  background:
                    "#ffffff",
                  padding:
                    "25px",
                  borderRadius:
                    "10px",
                  textAlign:
                    "center",
                  color:
                    "#64748b",
                  border:
                    "1px solid #e2e8f0",
                }}
              >
                Loading campus
                information...
              </div>
            ) : campusInfo.length ===
              0 ? (
              <div
                style={{
                  background:
                    "#ffffff",
                  padding:
                    "25px",
                  borderRadius:
                    "10px",
                  textAlign:
                    "center",
                  color:
                    "#94a3b8",
                  border:
                    "1px solid #e2e8f0",
                }}
              >
                No campus information
                has been added yet.
              </div>
            ) : (
              <div
                style={{
                  display:
                    "flex",
                  flexDirection:
                    "column",
                  gap:
                    "14px",
                }}
              >
                {campusInfo.map(
                  (info) => (
                    <div
                      key={info.id}
                      style={{
                        background:
                          "#ffffff",
                        padding:
                          "18px",
                        borderRadius:
                          "10px",
                        border:
                          "1px solid #e2e8f0",
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
                            "15px",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                          }}
                        >
                          <h4
                            style={{
                              margin:
                                0,
                              color:
                                "#0f172a",
                              fontSize:
                                "16px",
                            }}
                          >
                            {info.title}
                          </h4>

                          <span
                            style={{
                              display:
                                "inline-block",
                              marginTop:
                                "6px",
                              padding:
                                "4px 9px",
                              background:
                                "#eff6ff",
                              color:
                                "#1d4ed8",
                              borderRadius:
                                "20px",
                              fontSize:
                                "11px",
                              fontWeight:
                                600,
                            }}
                          >
                            {info.category}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteCampusInfo(
                              info.id
                            )
                          }
                          style={{
                            padding:
                              "7px 12px",
                            background:
                              "#fee2e2",
                            color:
                              "#b91c1c",
                            border:
                              "1px solid #fecaca",
                            borderRadius:
                              "6px",
                            cursor:
                              "pointer",
                            fontSize:
                              "12px",
                            fontWeight:
                              600,
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      <p
                        style={{
                          margin:
                            "14px 0 0 0",
                          color:
                            "#475569",
                          fontSize:
                            "14px",
                          lineHeight:
                            "1.6",
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        {info.content}
                      </p>

                      {info.location && (
                        <p
                          style={{
                            margin:
                              "12px 0 0 0",
                            fontSize:
                              "13px",
                            color:
                              "#64748b",
                          }}
                        >
                          📍{" "}
                          <strong>
                            Location:
                          </strong>{" "}
                          {
                            info.location
                          }
                        </p>
                      )}

                      {info.contact && (
                        <p
                          style={{
                            margin:
                              "5px 0 0 0",
                            fontSize:
                              "13px",
                            color:
                              "#64748b",
                          }}
                        >
                          ☎️{" "}
                          <strong>
                            Contact:
                          </strong>{" "}
                          {
                            info.contact
                          }
                        </p>
                      )}

                      <p
                        style={{
                          margin:
                            "10px 0 0 0",
                          paddingTop:
                            "10px",
                          borderTop:
                            "1px solid #f1f5f9",
                          fontSize:
                            "11px",
                          color:
                            "#94a3b8",
                        }}
                      >
                        Added by:{" "}
                        {info.created_by ||
                          "Staff"}
                        {" | "}
                        {info.created_at
                          ? new Date(
                              info.created_at
                            ).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;