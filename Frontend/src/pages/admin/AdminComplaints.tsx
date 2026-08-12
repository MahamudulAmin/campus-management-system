import { useEffect, useMemo, useState } from "react";

import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";

import "../../styles/AdminComplaints.css";

interface Complaint {
  id?: string | number;
  complaint_id?: string | number;

  student_id?: string;
  student_name?: string;
  student_email?: string;

  title?: string;
  complaintType?: string;
  category?: string;

  description?: string;

  status?: string;

  created_at?: string;
  date?: string;
}

const API_URL = "http://127.0.0.1:8000";

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [updatingId, setUpdatingId] = useState<
    string | number | null
  >(null);

  // =========================================================
  // GET COMPLAINTS
  // =========================================================

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/complaints/`
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setComplaints(data);
      } else if (Array.isArray(data?.complaints)) {
        setComplaints(data.complaints);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error(
        "Error loading complaints:",
        err
      );

      setError(
        "Unable to load complaints from the server."
      );

      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // =========================================================
  // HELPERS
  // =========================================================

  const getComplaintId = (
    complaint: Complaint,
    index = 0
  ): string => {
    if (
      complaint.complaint_id !== undefined &&
      complaint.complaint_id !== null
    ) {
      return String(complaint.complaint_id);
    }

    if (
      complaint.id !== undefined &&
      complaint.id !== null
    ) {
      return String(complaint.id);
    }

    return `COMP-${String(index + 1).padStart(
      4,
      "0"
    )}`;
  };

  const getStudentName = (
    complaint: Complaint
  ): string => {
    return (
      complaint.student_name ||
      "Unknown Student"
    );
  };

  const getCategory = (
    complaint: Complaint
  ): string => {
    return (
      complaint.complaintType ||
      complaint.category ||
      "General"
    );
  };

  const getTitle = (
    complaint: Complaint
  ): string => {
    return (
      complaint.title ||
      getCategory(complaint)
    );
  };

  const getStatus = (
    complaint: Complaint
  ): string => {
    return complaint.status || "Pending";
  };

  const normalizeStatus = (
    status: string
  ): string => {
    return status
      .toLowerCase()
      .trim()
      .replace(/-/g, " ")
      .replace(/\s+/g, " ");
  };

  const getStatusClass = (
    status: string
  ): string => {
    const normalized =
      normalizeStatus(status);

    switch (normalized) {
      case "pending":
        return "status-pending";

      case "in progress":
        return "status-in-progress";

      case "resolved":
        return "status-resolved";

      case "rejected":
        return "status-rejected";

      default:
        return "status-pending";
    }
  };

  const getDate = (
    complaint: Complaint
  ): string => {
    const value =
      complaint.created_at ||
      complaint.date;

    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString();
  };

  // =========================================================
  // SEARCH + STATUS FILTER
  // =========================================================

  const filteredComplaints = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return complaints.filter(
      (complaint) => {
        const complaintId =
          getComplaintId(
            complaint
          ).toLowerCase();

        const studentName =
          getStudentName(
            complaint
          ).toLowerCase();

        const studentId =
          (
            complaint.student_id || ""
          ).toLowerCase();

        const title =
          getTitle(
            complaint
          ).toLowerCase();

        const description =
          (
            complaint.description || ""
          ).toLowerCase();

        const matchesSearch =
          !searchValue ||
          complaintId.includes(
            searchValue
          ) ||
          studentName.includes(
            searchValue
          ) ||
          studentId.includes(
            searchValue
          ) ||
          title.includes(
            searchValue
          ) ||
          description.includes(
            searchValue
          );

        const matchesStatus =
          statusFilter ===
            "All Status" ||
          normalizeStatus(
            getStatus(complaint)
          ) ===
            normalizeStatus(
              statusFilter
            );

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    complaints,
    search,
    statusFilter,
  ]);

  // =========================================================
  // SUMMARY COUNTS
  // IMPORTANT:
  // Counts use ALL complaints, not filtered complaints.
  // Therefore cards always show the actual system totals.
  // =========================================================

  const total = complaints.length;

  const pending = complaints.filter(
    (complaint) =>
      normalizeStatus(
        getStatus(complaint)
      ) === "pending"
  ).length;

  const inProgress =
    complaints.filter(
      (complaint) =>
        normalizeStatus(
          getStatus(complaint)
        ) === "in progress"
    ).length;

  const resolved = complaints.filter(
    (complaint) =>
      normalizeStatus(
        getStatus(complaint)
      ) === "resolved"
  ).length;

  const rejected = complaints.filter(
    (complaint) =>
      normalizeStatus(
        getStatus(complaint)
      ) === "rejected"
  ).length;

  // =========================================================
  // CHANGE COMPLAINT STATUS
  // =========================================================

  const updateComplaintStatus = async (
    complaint: Complaint,
    newStatus: string
  ) => {
    const complaintId =
      complaint.complaint_id ??
      complaint.id;

    if (
      complaintId === undefined ||
      complaintId === null
    ) {
      alert(
        "Complaint ID is missing."
      );
      return;
    }

    const oldStatus =
      getStatus(complaint);

    if (
      normalizeStatus(oldStatus) ===
      normalizeStatus(newStatus)
    ) {
      return;
    }

    try {
      setUpdatingId(complaintId);

      const response = await fetch(
        `${API_URL}/complaints/${encodeURIComponent(
          String(complaintId)
        )}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        let message =
          "Failed to update complaint status.";

        try {
          const errorData =
            await response.json();

          if (errorData?.detail) {
            message =
              errorData.detail;
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }

      // Update UI immediately.
      setComplaints(
        (currentComplaints) =>
          currentComplaints.map(
            (item) => {
              const itemId =
                item.complaint_id ??
                item.id;

              if (
                String(itemId) ===
                String(complaintId)
              ) {
                return {
                  ...item,
                  status: newStatus,
                };
              }

              return item;
            }
          )
      );
    } catch (err) {
      console.error(
        "Status update error:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Unable to update complaint status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter(
      "All Status"
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminNavbar />

        <main className="admin-complaints-page">
          <div className="complaints-page-container">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <header className="complaints-page-header">
              <div>
                <span className="complaints-eyebrow">
                  ADMINISTRATION
                </span>

                <h1>
                  Complaints
                </h1>

                <p>
                  View student complaints
                  and update their status.
                </p>
              </div>

              <button
                type="button"
                className="complaints-refresh-btn"
                onClick={
                  fetchComplaints
                }
                disabled={loading}
              >
                <span>
                  ↻
                </span>

                {loading
                  ? "Refreshing..."
                  : "Refresh"}
              </button>
            </header>

            {/* =================================================
                ERROR
            ================================================= */}

            {!loading && error && (
              <section className="complaints-error">
                <div className="complaints-error-icon">
                  !
                </div>

                <div>
                  <h3>
                    Unable to load complaints
                  </h3>

                  <p>
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={
                      fetchComplaints
                    }
                  >
                    Try Again
                  </button>
                </div>
              </section>
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <section className="complaints-loading">
                <div className="loading-spinner" />

                <h3>
                  Loading complaints
                </h3>

                <p>
                  Please wait...
                </p>
              </section>
            )}

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            {!loading && !error && (
              <>
                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                <section className="complaints-summary">
                  <div className="summary-card total-card">
                    <div className="summary-card-top">
                      <span>
                        Total Complaints
                      </span>

                      <div className="summary-icon">
                        📋
                      </div>
                    </div>

                    <strong>
                      {total}
                    </strong>

                    <small>
                      All complaints
                    </small>
                  </div>

                  <div className="summary-card pending-card">
                    <div className="summary-card-top">
                      <span>
                        Pending
                      </span>

                      <div className="summary-icon">
                        ⏳
                      </div>
                    </div>

                    <strong>
                      {pending}
                    </strong>

                    <small>
                      Waiting for action
                    </small>
                  </div>

                  <div className="summary-card progress-card">
                    <div className="summary-card-top">
                      <span>
                        In Progress
                      </span>

                      <div className="summary-icon">
                        ⚙
                      </div>
                    </div>

                    <strong>
                      {inProgress}
                    </strong>

                    <small>
                      Currently handling
                    </small>
                  </div>

                  <div className="summary-card resolved-card">
                    <div className="summary-card-top">
                      <span>
                        Resolved
                      </span>

                      <div className="summary-icon">
                        ✓
                      </div>
                    </div>

                    <strong>
                      {resolved}
                    </strong>

                    <small>
                      Successfully resolved
                    </small>
                  </div>

                  <div className="summary-card rejected-card">
                    <div className="summary-card-top">
                      <span>
                        Rejected
                      </span>

                      <div className="summary-icon">
                        ×
                      </div>
                    </div>

                    <strong>
                      {rejected}
                    </strong>

                    <small>
                      Rejected complaints
                    </small>
                  </div>
                </section>

                {/* =================================================
                    SEARCH + FILTER
                ================================================= */}

                <section className="complaints-filter-card">
                  <div className="filter-card-heading">
                    <div>
                      <h2>
                        Complaint Records
                      </h2>

                      <p>
                        Search complaints and
                        filter by status.
                      </p>
                    </div>

                    <span className="filter-result-count">
                      {filteredComplaints.length}{" "}
                      shown
                    </span>
                  </div>

                  <div className="complaints-controls">

                    {/* SEARCH */}

                    <div className="complaint-search">
                      <span className="search-icon">
                        🔍
                      </span>

                      <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                          setSearch(
                            e.target.value
                          )
                        }
                        placeholder="Search student, ID, complaint..."
                      />

                      {search && (
                        <button
                          type="button"
                          className="search-clear"
                          onClick={() =>
                            setSearch("")
                          }
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* STATUS */}

                    <select
                      className="status-filter"
                      value={
                        statusFilter
                      }
                      onChange={(e) =>
                        setStatusFilter(
                          e.target.value
                        )
                      }
                    >
                      <option>
                        All Status
                      </option>

                      <option>
                        Pending
                      </option>

                      <option>
                        In Progress
                      </option>

                      <option>
                        Resolved
                      </option>

                      <option>
                        Rejected
                      </option>
                    </select>

                    {/* CLEAR */}

                    <button
                      type="button"
                      className="clear-filter-btn"
                      onClick={
                        clearFilters
                      }
                      disabled={
                        !search &&
                        statusFilter ===
                          "All Status"
                      }
                    >
                      Clear
                    </button>

                    {/* REFRESH */}

                    <button
                      type="button"
                      className="refresh-table-btn"
                      onClick={
                        fetchComplaints
                      }
                      disabled={loading}
                    >
                      ↻ Refresh
                    </button>
                  </div>
                </section>

                {/* =================================================
                    COMPLAINT TABLE
                ================================================= */}

                <section className="complaints-table-card">
                  <div className="table-card-header">
                    <div>
                      <h2>
                        Student Complaints
                      </h2>

                      <p>
                        Change the status directly
                        from this table.
                      </p>
                    </div>

                    <span className="table-count">
                      {filteredComplaints.length}
                    </span>
                  </div>

                  {filteredComplaints.length >
                  0 ? (
                    <div className="complaints-table-wrapper">
                      <table className="complaints-table">
                        <thead>
                          <tr>
                            <th>
                              Complaint ID
                            </th>

                            <th>
                              Student
                            </th>

                            <th>
                              Complaint
                            </th>

                            <th>
                              Category
                            </th>

                            <th>
                              Date
                            </th>

                            <th>
                              Status
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredComplaints.map(
                            (
                              complaint,
                              index
                            ) => {
                              const complaintId =
                                complaint.complaint_id ??
                                complaint.id ??
                                `generated-${index}`;

                              const currentStatus =
                                getStatus(
                                  complaint
                                );

                              const isUpdating =
                                String(
                                  updatingId
                                ) ===
                                String(
                                  complaintId
                                );

                              return (
                                <tr
                                  key={`${complaintId}-${index}`}
                                >
                                  {/* ID */}

                                  <td>
                                    <span className="complaint-id">
                                      {getComplaintId(
                                        complaint,
                                        index
                                      )}
                                    </span>
                                  </td>

                                  {/* STUDENT */}

                                  <td>
                                    <div className="student-info">
                                      <strong>
                                        {getStudentName(
                                          complaint
                                        )}
                                      </strong>

                                      {complaint.student_id && (
                                        <small>
                                          ID:{" "}
                                          {
                                            complaint.student_id
                                          }
                                        </small>
                                      )}

                                      {complaint.student_email && (
                                        <small>
                                          {
                                            complaint.student_email
                                          }
                                        </small>
                                      )}
                                    </div>
                                  </td>

                                  {/* COMPLAINT */}

                                  <td>
                                    <div className="complaint-details">
                                      <strong>
                                        {getTitle(
                                          complaint
                                        )}
                                      </strong>

                                      {complaint.description && (
                                        <p>
                                          {
                                            complaint.description
                                          }
                                        </p>
                                      )}
                                    </div>
                                  </td>

                                  {/* CATEGORY */}

                                  <td>
                                    <span className="category-badge">
                                      {getCategory(
                                        complaint
                                      )}
                                    </span>
                                  </td>

                                  {/* DATE */}

                                  <td>
                                    <span className="complaint-date">
                                      {getDate(
                                        complaint
                                      )}
                                    </span>
                                  </td>

                                  {/* STATUS */}

                                  <td>
                                    <div className="status-control">
                                      <select
                                        value={
                                          currentStatus
                                        }
                                        disabled={
                                          isUpdating
                                        }
                                        className={`status-select ${getStatusClass(
                                          currentStatus
                                        )}`}
                                        onChange={(
                                          e
                                        ) =>
                                          updateComplaintStatus(
                                            complaint,
                                            e.target
                                              .value
                                          )
                                        }
                                      >
                                        <option value="Pending">
                                          Pending
                                        </option>

                                        <option value="In Progress">
                                          In Progress
                                        </option>

                                        <option value="Resolved">
                                          Resolved
                                        </option>

                                        <option value="Rejected">
                                          Rejected
                                        </option>
                                      </select>

                                      {isUpdating && (
                                        <span className="status-saving">
                                          Saving...
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="complaints-empty">
                      <div className="empty-icon">
                        🔍
                      </div>

                      <h3>
                        No complaints found
                      </h3>

                      <p>
                        No complaints match
                        your current search
                        or status filter.
                      </p>

                      <button
                        type="button"
                        onClick={
                          clearFilters
                        }
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminComplaints;