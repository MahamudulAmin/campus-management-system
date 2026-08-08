import { useEffect, useMemo, useState } from "react";

import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import API_URL from "../../config";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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

interface ReportData {
  generatedAt: string;
  complaints: Complaint[];
  search: string;
  status: string;
}

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [report, setReport] = useState<ReportData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

const handleStatusChange = async (
  complaint: Complaint,
  newStatus: string
) => {
  const complaintId = getComplaintId(complaint);

  try {
    setUpdatingStatus(complaintId);

    const response = await fetch(
      `${API_URL}/complaints/${encodeURIComponent(complaintId)}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.detail || "Failed to update complaint status"
      );
    }

    // Update the complaint in the main list
    setComplaints((prev) =>
      prev.map((item) => {
        const itemId = getComplaintId(item);

        if (itemId === complaintId) {
          return {
            ...item,
            status: newStatus,
          };
        }

        return item;
      })
    );

    // Also update generated report if it exists
    setReport((prev) => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        complaints: prev.complaints.map((item) => {
          const itemId = getComplaintId(item);

          if (itemId === complaintId) {
            return {
              ...item,
              status: newStatus,
            };
          }

          return item;
        }),
      };
    });

  } catch (error) {
    console.error("Status update error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Unable to update complaint status."
    );
  } finally {
    setUpdatingStatus(null);
  }
};
  /* =========================================================
     FETCH COMPLAINTS
  ========================================================= */

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/complaints/`);

      if (!response.ok) {
        throw new Error("Failed to load complaints");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setComplaints(data);
      } else if (Array.isArray(data.complaints)) {
        setComplaints(data.complaints);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
      setError("Unable to load complaints from the server.");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  /* =========================================================
     HELPER FUNCTIONS
  ========================================================= */

  const getComplaintId = (
    complaint: Complaint,
    index?: number
  ): string => {
    if (complaint.complaint_id !== undefined) {
      return String(complaint.complaint_id);
    }

    if (complaint.id !== undefined) {
      return String(complaint.id);
    }

    return `COMP-${String((index ?? 0) + 1).padStart(4, "0")}`;
  };

  const getStudentName = (complaint: Complaint): string => {
    return complaint.student_name || "Unknown Student";
  };

  const getStudentId = (complaint: Complaint): string => {
    return complaint.student_id || "N/A";
  };

  const getCategory = (complaint: Complaint): string => {
    return complaint.complaintType || complaint.category || "General";
  };

  const getTitle = (complaint: Complaint): string => {
    return complaint.title || getCategory(complaint);
  };

  const getStatus = (complaint: Complaint): string => {
    return complaint.status || "Pending";
  };

  const getDate = (complaint: Complaint): string => {
    const value = complaint.created_at || complaint.date;

    if (!value) {
      return "N/A";
    }

    try {
      const parsedDate = new Date(value);

      if (Number.isNaN(parsedDate.getTime())) {
        return value;
      }

      return parsedDate.toLocaleDateString();
    } catch {
      return value;
    }
  };

  const normalizeStatus = (status: string): string => {
    return status
      .toLowerCase()
      .trim()
      .replace(/-/g, " ");
  };

  /* =========================================================
     FILTERED COMPLAINTS
  ========================================================= */

  const filteredComplaints = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return complaints.filter((complaint) => {
      const matchesSearch =
        !searchValue ||
        getComplaintId(complaint)
          .toLowerCase()
          .includes(searchValue) ||
        getStudentName(complaint)
          .toLowerCase()
          .includes(searchValue) ||
        getStudentId(complaint)
          .toLowerCase()
          .includes(searchValue) ||
        getTitle(complaint)
          .toLowerCase()
          .includes(searchValue) ||
        getCategory(complaint)
          .toLowerCase()
          .includes(searchValue) ||
        getStatus(complaint)
          .toLowerCase()
          .includes(searchValue) ||
        (complaint.description || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "All Status" ||
        normalizeStatus(getStatus(complaint)) ===
          normalizeStatus(statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const total = filteredComplaints.length;

  const pending = filteredComplaints.filter(
    (complaint) =>
      normalizeStatus(getStatus(complaint)) === "pending"
  ).length;

  const inProgress = filteredComplaints.filter(
    (complaint) =>
      normalizeStatus(getStatus(complaint)) === "in progress"
  ).length;

  const resolved = filteredComplaints.filter(
    (complaint) =>
      normalizeStatus(getStatus(complaint)) === "resolved"
  ).length;

  const rejected = filteredComplaints.filter(
    (complaint) =>
      normalizeStatus(getStatus(complaint)) === "rejected"
  ).length;

  /* =========================================================
     GENERATE REPORT
  ========================================================= */

  const handleGenerateReport = () => {
    if (filteredComplaints.length === 0) {
      alert("There are no complaints matching your search/filter.");
      return;
    }

    const generatedAt = new Date().toLocaleString();

    setReport({
      generatedAt,
      complaints: [...filteredComplaints],
      search,
      status: statusFilter,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     DOWNLOAD PDF
  ========================================================= */

  const handleDownloadPDF = () => {
    if (!report || report.complaints.length === 0) {
      return;
    }

    try {
      setDownloading(true);

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      /* =====================================================
         PDF HEADER
      ===================================================== */

      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");

      doc.text("Campus Management System", 14, 18);

      doc.setFontSize(15);

      doc.text("Student Complaints Report", 14, 27);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      doc.text(
        `Generated: ${report.generatedAt}`,
        14,
        34
      );

      /* =====================================================
         PDF SUMMARY
      ===================================================== */

      const pdfPending = report.complaints.filter(
        (complaint) =>
          normalizeStatus(getStatus(complaint)) === "pending"
      ).length;

      const pdfInProgress = report.complaints.filter(
        (complaint) =>
          normalizeStatus(getStatus(complaint)) === "in progress"
      ).length;

      const pdfResolved = report.complaints.filter(
        (complaint) =>
          normalizeStatus(getStatus(complaint)) === "resolved"
      ).length;

      const pdfRejected = report.complaints.filter(
        (complaint) =>
          normalizeStatus(getStatus(complaint)) === "rejected"
      ).length;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");

      doc.text(
        `Total: ${report.complaints.length}`,
        14,
        43
      );

      doc.text(
        `Pending: ${pdfPending}`,
        50,
        43
      );

      doc.text(
        `In Progress: ${pdfInProgress}`,
        86,
        43
      );

      doc.text(
        `Resolved: ${pdfResolved}`,
        132,
        43
      );

      doc.text(
        `Rejected: ${pdfRejected}`,
        174,
        43
      );

      /* =====================================================
         FILTER INFORMATION
      ===================================================== */

      let filterText = "All complaints";

      if (report.search.trim()) {
        filterText += ` | Search: "${report.search}"`;
      }

      if (report.status !== "All Status") {
        filterText += ` | Status: ${report.status}`;
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      doc.text(filterText, 14, 50);

      /* =====================================================
         TABLE
      ===================================================== */

      const tableRows = report.complaints.map(
        (complaint, index) => [
          getComplaintId(complaint, index),
          getTitle(complaint),
          getStudentName(complaint),
          getStudentId(complaint),
          getCategory(complaint),
          getDate(complaint),
          getStatus(complaint),
          complaint.description || "N/A",
        ]
      );

      autoTable(doc, {
        startY: 56,

        head: [
          [
            "Complaint ID",
            "Complaint",
            "Student",
            "Student ID",
            "Category",
            "Date",
            "Status",
            "Description",
          ],
        ],

        body: tableRows,

        theme: "grid",

        styles: {
          fontSize: 7,
          cellPadding: 2.5,
          valign: "top",
        },

        headStyles: {
          fontSize: 7,
          fontStyle: "bold",
        },

        columnStyles: {
          0: {
            cellWidth: 24,
          },
          1: {
            cellWidth: 30,
          },
          2: {
            cellWidth: 30,
          },
          3: {
            cellWidth: 25,
          },
          4: {
            cellWidth: 25,
          },
          5: {
            cellWidth: 22,
          },
          6: {
            cellWidth: 25,
          },
          7: {
            cellWidth: 65,
          },
        },

        margin: {
          left: 10,
          right: 10,
        },
      });

      /* =====================================================
         PDF FOOTER
      ===================================================== */

      const pageCount = doc.getNumberOfPages();

      for (let page = 1; page <= pageCount; page++) {
        doc.setPage(page);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");

        doc.text(
          "Campus Management System - Complaints Report",
          10,
          202
        );

        doc.text(
          `Page ${page} of ${pageCount}`,
          270,
          202,
          {
            align: "right",
          }
        );
      }

      /* =====================================================
         SAVE
      ===================================================== */

      const date = new Date()
        .toISOString()
        .split("T")[0];

      doc.save(`complaints-report-${date}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);

      alert("Unable to generate the PDF report.");
    } finally {
      setDownloading(false);
    }
  };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminNavbar />

        <main className="admin-complaints-page">
          <div className="report-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="report-page-header">
              <div className="report-header-text">
                <div className="report-title-row">
                  <span className="report-title-icon">
                    📊
                  </span>

                  <div>
                    <h1>Complaints Report</h1>

                    <p>
                      Search, filter and generate reports
                      from student complaints.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <div className="complaints-loading">
                <div className="loading-spinner" />

                <p>Loading complaints...</p>
              </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {!loading && error && (
              <div className="complaints-empty">
                <div className="empty-icon">
                  ⚠️
                </div>

                <h3>
                  Unable to load complaints
                </h3>

                <p>{error}</p>

                <button
                  type="button"
                  className="refresh-btn"
                  onClick={fetchComplaints}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* =================================================
                REPORT FILTER / GENERATION PAGE
            ================================================= */}

            {!loading && !error && !report && (
              <div className="report-document">

                {/* DOCUMENT HEADER */}

                <div className="report-document-header">
                  <div>
                    <span className="report-section-label">
                      REPORT BUILDER
                    </span>

                    <h2>
                      Generate Complaints Report
                    </h2>

                    <p>
                      Use the filters below to select
                      exactly which complaints should
                      appear in your report.
                    </p>
                  </div>

                  <div className="report-generated">
                    <span>
                      Available Complaints
                    </span>

                    <strong>
                      {complaints.length}
                    </strong>
                  </div>
                </div>

                {/* =================================================
                    SEARCH / FILTER CONTROLS
                ================================================= */}

                <div className="report-filter-card">

                  <div className="report-filter-heading">
                    <div>
                      <h3>Find Complaints</h3>

                      <p>
                        Search by complaint, student,
                        ID, category or description.
                      </p>
                    </div>

                    <span className="filter-count">
                      {filteredComplaints.length} results
                    </span>
                  </div>

                  <div className="complaints-controls">

                    {/* SEARCH */}

                    <div className="complaint-search">
                      <span
                        className="search-icon"
                        aria-hidden="true"
                      >
                        🔍
                      </span>

                      <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                        placeholder="Search complaint, student or ID..."
                      />

                      {search && (
                        <button
                          type="button"
                          className="search-clear"
                          onClick={() =>
                            setSearch("")
                          }
                          aria-label="Clear search"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* STATUS */}

                    <div className="status-select-wrapper">
                      <select
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter(
                            e.target.value
                          )
                        }
                        aria-label="Filter by status"
                      >
                        <option value="All Status">
                          All Status
                        </option>

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
                    </div>

                    {/* CLEAR */}

                    <button
                      type="button"
                      className="clear-filter-btn"
                      onClick={handleClearFilters}
                      disabled={
                        !search &&
                        statusFilter === "All Status"
                      }
                    >
                      <span>✕</span>
                      Clear
                    </button>

                    {/* REFRESH */}

                    <button
                      type="button"
                      className="refresh-btn"
                      onClick={fetchComplaints}
                      disabled={loading}
                    >
                      <span>↻</span>
                      Refresh
                    </button>
                  </div>
                </div>

                {/* =================================================
                    SUMMARY CARDS
                ================================================= */}

                <div className="report-summary">

                  <div className="report-summary-card total-card">
                    <span>Total</span>

                    <strong>{total}</strong>

                    <small>
                      Matching complaints
                    </small>
                  </div>

                  <div className="report-summary-card pending-card">
                    <span>Pending</span>

                    <strong>{pending}</strong>

                    <small>
                      Awaiting action
                    </small>
                  </div>

                  <div className="report-summary-card progress-card">
                    <span>In Progress</span>

                    <strong>{inProgress}</strong>

                    <small>
                      Currently processing
                    </small>
                  </div>

                  <div className="report-summary-card resolved-card">
                    <span>Resolved</span>

                    <strong>{resolved}</strong>

                    <small>
                      Successfully resolved
                    </small>
                  </div>

                  <div className="report-summary-card rejected-card">
                    <span>Rejected</span>

                    <strong>{rejected}</strong>

                    <small>
                      Rejected complaints
                    </small>
                  </div>

                </div>

                {/* =================================================
                    FILTER INFO
                ================================================= */}

                <div className="report-filter-info">
                  <div>
                    Showing{" "}
                    <strong>
                      {filteredComplaints.length}
                    </strong>{" "}
                    of{" "}
                    <strong>
                      {complaints.length}
                    </strong>{" "}
                    complaints
                  </div>

                  {(search.trim() ||
                    statusFilter !== "All Status") && (
                    <div className="active-filters">
                      {search.trim() && (
                        <span>
                          Search:{" "}
                          <strong>
                            "{search}"
                          </strong>
                        </span>
                      )}

                      {statusFilter !== "All Status" && (
                        <span>
                          Status:{" "}
                          <strong>
                            {statusFilter}
                          </strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* =================================================
                    EMPTY RESULT
                ================================================= */}

                {filteredComplaints.length === 0 ? (
                  <div className="complaints-empty report-empty">
                    <div className="empty-icon">
                      🔍
                    </div>

                    <h3>
                      No complaints found
                    </h3>

                    <p>
                      Try changing your search or
                      status filter.
                    </p>

                    <button
                      type="button"
                      className="clear-filter-btn empty-clear-btn"
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {/* =================================================
                        PREVIEW TABLE
                    ================================================= */}

                    <div className="report-table-wrapper">
                      <table className="report-table">
                        <thead>
                          <tr>
                            <th>Complaint ID</th>
                            <th>Complaint</th>
                            <th>Student</th>
                            <th>Student ID</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Description</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredComplaints.map(
                            (complaint, index) => (
                              <tr
                                key={`${getComplaintId(
                                  complaint,
                                  index
                                )}-${index}`}
                              >
                                <td>
                                  <span className="complaint-id">
                                    {getComplaintId(
                                      complaint,
                                      index
                                    )}
                                  </span>
                                </td>

                                <td>
                                  <strong>
                                    {getTitle(
                                      complaint
                                    )}
                                  </strong>
                                </td>

                                <td>
                                  {getStudentName(
                                    complaint
                                  )}
                                </td>

                                <td>
                                  {getStudentId(
                                    complaint
                                  )}
                                </td>

                                <td>
                                  <span className="category-badge">
                                    {getCategory(
                                      complaint
                                    )}
                                  </span>
                                </td>

                                <td>
                                  {getDate(
                                    complaint
                                  )}
                                </td>

                                <td>
  <select
    className={`status-badge status-${normalizeStatus(
      getStatus(complaint)
    ).replace(/\s+/g, "-")}`}
    value={getStatus(complaint)}
    disabled={
      updatingStatus === getComplaintId(complaint, index)
    }
    onChange={(e) =>
      handleStatusChange(
        complaint,
        e.target.value
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
</td>

                                <td>
                                  <div className="description-cell">
                                    {complaint.description ||
                                      "N/A"}
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* =================================================
                        GENERATE BUTTON
                    ================================================= */}

                    <div className="generate-report-footer">
                      <div className="generate-info">
                        <span className="generate-info-icon">
                          ✓
                        </span>

                        <div>
                          <strong>
                            Ready to generate
                          </strong>

                          <p>
                            {filteredComplaints.length}{" "}
                            complaint
                            {filteredComplaints.length !==
                            1
                              ? "s"
                              : ""}{" "}
                            will be included.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="generate-report-btn"
                        onClick={
                          handleGenerateReport
                        }
                        disabled={
                          filteredComplaints.length ===
                          0
                        }
                      >
                        <span>📄</span>
                        Generate Report
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* =================================================
                GENERATED REPORT
            ================================================= */}

            {!loading && !error && report && (
              <div className="report-document generated-report">

                {/* GENERATED HEADER */}

                <div className="report-document-header">
                  <div>
                    <span className="report-section-label">
                      GENERATED REPORT
                    </span>

                    <h2>
                      Campus Management System
                    </h2>

                    <p>
                      Student Complaints Report
                    </p>
                  </div>

                  <div className="report-generated">
                    <span>Generated</span>

                    <strong>
                      {report.generatedAt}
                    </strong>
                  </div>
                </div>

                {/* REPORT SUMMARY */}

                <div className="report-summary">

                  <div className="report-summary-card total-card">
                    <span>Total</span>

                    <strong>
                      {report.complaints.length}
                    </strong>
                  </div>

                  <div className="report-summary-card pending-card">
                    <span>Pending</span>

                    <strong>
                      {
                        report.complaints.filter(
                          (complaint) =>
                            normalizeStatus(
                              getStatus(
                                complaint
                              )
                            ) === "pending"
                        ).length
                      }
                    </strong>
                  </div>

                  <div className="report-summary-card progress-card">
                    <span>In Progress</span>

                    <strong>
                      {
                        report.complaints.filter(
                          (complaint) =>
                            normalizeStatus(
                              getStatus(
                                complaint
                              )
                            ) === "in progress"
                        ).length
                      }
                    </strong>
                  </div>

                  <div className="report-summary-card resolved-card">
                    <span>Resolved</span>

                    <strong>
                      {
                        report.complaints.filter(
                          (complaint) =>
                            normalizeStatus(
                              getStatus(
                                complaint
                              )
                            ) === "resolved"
                        ).length
                      }
                    </strong>
                  </div>

                  <div className="report-summary-card rejected-card">
                    <span>Rejected</span>

                    <strong>
                      {
                        report.complaints.filter(
                          (complaint) =>
                            normalizeStatus(
                              getStatus(
                                complaint
                              )
                            ) === "rejected"
                        ).length
                      }
                    </strong>
                  </div>

                </div>

                {/* FILTER INFORMATION */}

                <div className="report-filter-info">
                  <div>
                    Report contains{" "}
                    <strong>
                      {report.complaints.length}
                    </strong>{" "}
                    complaints.
                  </div>

                  {(report.search.trim() ||
                    report.status !== "All Status") && (
                    <div className="active-filters">
                      {report.search.trim() && (
                        <span>
                          Search:{" "}
                          <strong>
                            "{report.search}"
                          </strong>
                        </span>
                      )}

                      {report.status !== "All Status" && (
                        <span>
                          Status:{" "}
                          <strong>
                            {report.status}
                          </strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* REPORT TABLE */}

                <div className="report-table-wrapper">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Complaint ID</th>
                        <th>Complaint</th>
                        <th>Student</th>
                        <th>Student ID</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Description</th>
                      </tr>
                    </thead>

                    <tbody>
                      {report.complaints.map(
                        (complaint, index) => (
                          <tr
                            key={`${getComplaintId(
                              complaint,
                              index
                            )}-${index}`}
                          >
                            <td>
                              <span className="complaint-id">
                                {getComplaintId(
                                  complaint,
                                  index
                                )}
                              </span>
                            </td>

                            <td>
                              <strong>
                                {getTitle(
                                  complaint
                                )}
                              </strong>
                            </td>

                            <td>
                              {getStudentName(
                                complaint
                              )}
                            </td>

                            <td>
                              {getStudentId(
                                complaint
                              )}
                            </td>

                            <td>
                              <span className="category-badge">
                                {getCategory(
                                  complaint
                                )}
                              </span>
                            </td>

                            <td>
                              {getDate(
                                complaint
                              )}
                            </td>

                            <td>
                              <span
                                className={`status-badge status-${normalizeStatus(
                                  getStatus(
                                    complaint
                                  )
                                ).replace(
                                  /\s+/g,
                                  "-"
                                )}`}
                              >
                                {getStatus(
                                  complaint
                                )}
                              </span>
                            </td>

                            <td>
                              <div className="description-cell">
                                {complaint.description ||
                                  "N/A"}
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* =================================================
                    GENERATED REPORT ACTIONS
                ================================================= */}

                <div className="generated-report-actions">

                  <button
                    type="button"
                    className="edit-report-btn"
                    onClick={() =>
                      setReport(null)
                    }
                  >
                    ← Edit Filters
                  </button>

                  <button
                    type="button"
                    className="report-download-btn"
                    onClick={
                      handleDownloadPDF
                    }
                    disabled={downloading}
                  >
                    <span>
                      ↓
                    </span>

                    {downloading
                      ? "Generating PDF..."
                      : "Download PDF"}
                  </button>

                </div>

              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminComplaints;