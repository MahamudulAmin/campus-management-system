
import { useEffect, useMemo, useState } from "react";

import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import "../../styles/AdminReports.css";

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

const AdminReports = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  const [downloading, setDownloading] =
    useState(false);

  /* =====================================================
     FETCH COMPLAINTS
  ===================================================== */

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/complaints/"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load complaints"
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setComplaints(data);
      } else if (
        Array.isArray(data.complaints)
      ) {
        setComplaints(data.complaints);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load complaint data from the server."
      );

      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  /* =====================================================
     HELPERS
  ===================================================== */

  const getComplaintId = (
    complaint: Complaint,
    index?: number
  ) => {
    if (
      complaint.complaint_id !== undefined
    ) {
      return String(
        complaint.complaint_id
      );
    }

    if (complaint.id !== undefined) {
      return String(complaint.id);
    }

    return `COMP-${String(
      (index ?? 0) + 1
    ).padStart(4, "0")}`;
  };

  const getStudentName = (
    complaint: Complaint
  ) => {
    return (
      complaint.student_name ||
      "Unknown Student"
    );
  };

  const getCategory = (
    complaint: Complaint
  ) => {
    return (
      complaint.complaintType ||
      complaint.category ||
      "General"
    );
  };

  const getTitle = (
    complaint: Complaint
  ) => {
    return (
      complaint.title ||
      getCategory(complaint)
    );
  };

  const getStatus = (
    complaint: Complaint
  ) => {
    return (
      complaint.status ||
      "Pending"
    );
  };

  const normalizeStatus = (
    status: string
  ) => {
    return status
      .toLowerCase()
      .trim()
      .replace(/-/g, " ");
  };

  const getDate = (
    complaint: Complaint
  ) => {
    const value =
      complaint.created_at ||
      complaint.date;

    if (!value) {
      return "N/A";
    }

    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString();
  };

  /* =====================================================
     CATEGORY LIST
  ===================================================== */

  const categories = useMemo(() => {
    const values = complaints.map(
      (complaint) =>
        getCategory(complaint)
    );

    return Array.from(
      new Set(values)
    ).sort();
  }, [complaints]);

  /* =====================================================
     FILTER COMPLAINTS
  ===================================================== */

  const filteredComplaints = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return complaints.filter(
      (complaint) => {
        const matchesSearch =
          !searchValue ||
          getComplaintId(complaint)
            .toLowerCase()
            .includes(searchValue) ||
          getStudentName(complaint)
            .toLowerCase()
            .includes(searchValue) ||
          getTitle(complaint)
            .toLowerCase()
            .includes(searchValue) ||
          getCategory(complaint)
            .toLowerCase()
            .includes(searchValue) ||
          (
            complaint.description ||
            ""
          )
            .toLowerCase()
            .includes(searchValue);

        const matchesStatus =
          statusFilter === "All Status" ||
          normalizeStatus(
            getStatus(complaint)
          ) ===
            normalizeStatus(
              statusFilter
            );

        const matchesCategory =
          selectedCategory ===
            "All Categories" ||
          getCategory(complaint) ===
            selectedCategory;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
        );
      }
    );
  }, [
    complaints,
    search,
    statusFilter,
    selectedCategory,
  ]);

  /* =====================================================
     BASIC STATISTICS
  ===================================================== */

  const total =
    filteredComplaints.length;

  const pending =
    filteredComplaints.filter(
      (complaint) =>
        normalizeStatus(
          getStatus(complaint)
        ) === "pending"
    ).length;

  const inProgress =
    filteredComplaints.filter(
      (complaint) =>
        normalizeStatus(
          getStatus(complaint)
        ) === "in progress"
    ).length;

  const resolved =
    filteredComplaints.filter(
      (complaint) =>
        normalizeStatus(
          getStatus(complaint)
        ) === "resolved"
    ).length;

  const rejected =
    filteredComplaints.filter(
      (complaint) =>
        normalizeStatus(
          getStatus(complaint)
        ) === "rejected"
    ).length;

  /* =====================================================
     PERCENTAGES
  ===================================================== */

  const resolutionRate =
    total > 0
      ? Math.round(
          (resolved / total) * 100
        )
      : 0;

  const pendingRate =
    total > 0
      ? Math.round(
          (pending / total) * 100
        )
      : 0;

  const rejectedRate =
    total > 0
      ? Math.round(
          (rejected / total) * 100
        )
      : 0;

  /* =====================================================
     CATEGORY ANALYSIS
  ===================================================== */

  const categoryAnalysis = useMemo(() => {
    const map: Record<
      string,
      number
    > = {};

    filteredComplaints.forEach(
      (complaint) => {
        const category =
          getCategory(complaint);

        map[category] =
          (map[category] || 0) + 1;
      }
    );

    return Object.entries(map)
      .map(
        ([category, count]) => ({
          category,
          count,
          percentage:
            total > 0
              ? Math.round(
                  (count / total) *
                    100
                )
              : 0,
        })
      )
      .sort(
        (a, b) =>
          b.count - a.count
      );
  }, [filteredComplaints, total]);

  /* =====================================================
     TOP CATEGORY
  ===================================================== */

  const topCategory =
    categoryAnalysis.length > 0
      ? categoryAnalysis[0]
      : null;

  /* =====================================================
     PERFORMANCE MESSAGE
  ===================================================== */

  const performanceMessage = useMemo(() => {
    if (total === 0) {
      return "No complaint data is available for the selected filters.";
    }

    if (resolutionRate >= 80) {
      return "Complaint resolution performance is excellent. Most complaints have been successfully resolved.";
    }

    if (resolutionRate >= 60) {
      return "Complaint resolution performance is good, but there is still room to improve response and resolution time.";
    }

    if (resolutionRate >= 40) {
      return "Complaint resolution performance is moderate. More attention should be given to pending and in-progress complaints.";
    }

    return "Complaint resolution performance needs improvement. A large proportion of complaints remain unresolved.";
  }, [resolutionRate, total]);

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All Status");
    setSelectedCategory(
      "All Categories"
    );
  };

  /* =====================================================
     DOWNLOAD PDF
  ===================================================== */

  const downloadPDF = () => {
    if (filteredComplaints.length === 0) {
      alert(
        "There are no complaints to include in the report."
      );
      return;
    }

    try {
      setDownloading(true);

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const generatedAt =
        new Date().toLocaleString();

      /* HEADER */

      doc.setFontSize(20);
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        "Campus Management System",
        14,
        18
      );

      doc.setFontSize(15);

      doc.text(
        "Complaint Performance & Analysis Report",
        14,
        27
      );

      doc.setFontSize(9);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        `Generated: ${generatedAt}`,
        14,
        34
      );

      /* SUMMARY */

      doc.setFontSize(11);
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        `Total: ${total}`,
        14,
        44
      );

      doc.text(
        `Pending: ${pending}`,
        50,
        44
      );

      doc.text(
        `In Progress: ${inProgress}`,
        88,
        44
      );

      doc.text(
        `Resolved: ${resolved}`,
        137,
        44
      );

      doc.text(
        `Rejected: ${rejected}`,
        180,
        44
      );

      doc.text(
        `Resolution Rate: ${resolutionRate}%`,
        225,
        44
      );

      /* PERFORMANCE */

      doc.setFontSize(10);
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        "Performance Analysis:",
        14,
        53
      );

      const performanceLines =
        doc.splitTextToSize(
          performanceMessage,
          260
        );

      doc.text(
        performanceLines,
        14,
        59
      );

      /* CATEGORY TABLE */

      const categoryRows =
        categoryAnalysis.map(
          (item) => [
            item.category,
            item.count,
            `${item.percentage}%`,
          ]
        );

      autoTable(doc, {
        startY: 72,

        head: [
          [
            "Complaint Category",
            "Total Complaints",
            "Percentage",
          ],
        ],

        body: categoryRows,

        theme: "grid",

        styles: {
          fontSize: 9,
          cellPadding: 3,
        },

        headStyles: {
          fontStyle: "bold",
        },

        margin: {
          left: 14,
          right: 14,
        },
      });

      /* COMPLAINT TABLE */

      const tableRows =
        filteredComplaints.map(
          (complaint, index) => [
            getComplaintId(
              complaint,
              index
            ),
            getTitle(complaint),
            getStudentName(
              complaint
            ),
            getCategory(
              complaint
            ),
            getDate(complaint),
            getStatus(
              complaint
            ),
          ]
        );

      const lastTableY =
        (doc as any).lastAutoTable
          ?.finalY || 90;

      autoTable(doc, {
        startY:
          lastTableY + 10,

        head: [
          [
            "Complaint ID",
            "Complaint",
            "Student",
            "Category",
            "Date",
            "Status",
          ],
        ],

        body: tableRows,

        theme: "grid",

        styles: {
          fontSize: 7,
          cellPadding: 2.5,
        },

        headStyles: {
          fontSize: 7,
          fontStyle: "bold",
        },

        margin: {
          left: 10,
          right: 10,
        },
      });

      /* FOOTER */

      const pageCount =
        doc.getNumberOfPages();

      for (
        let page = 1;
        page <= pageCount;
        page++
      ) {
        doc.setPage(page);

        doc.setFontSize(8);

        doc.text(
          "Campus Management System - Complaint Analysis",
          10,
          202
        );

        doc.text(
          `Page ${page} of ${pageCount}`,
          280,
          202,
          {
            align: "right",
          }
        );
      }

      const date =
        new Date()
          .toISOString()
          .split("T")[0];

      doc.save(
        `complaint-performance-${date}.pdf`
      );
    } catch (error) {
      console.error(
        "PDF generation error:",
        error
      );

      alert(
        "Unable to generate the PDF."
      );
    } finally {
      setDownloading(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminNavbar />

        <main className="reports-page">
          {/* HEADER */}

          <div className="reports-header">
            <div>
              <h1>
                Complaint Performance
              </h1>

              <p>
                Analyze complaint trends,
                resolution performance and
                complaint categories.
              </p>
            </div>

            <button
              className="report-refresh-btn"
              onClick={fetchComplaints}
              disabled={loading}
            >
              ↻ Refresh Data
            </button>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="reports-loading">
              <div className="loading-spinner" />

              <p>
                Loading complaint analysis...
              </p>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="report-error">
              <h3>
                Unable to load complaints
              </h3>

              <p>{error}</p>

              <button
                onClick={fetchComplaints}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* FILTERS */}

              <section className="reports-card">
                <div className="analysis-filter-header">
                  <div>
                    <h2>
                      Complaint Analysis
                    </h2>

                    <p>
                      Filter the complaint data
                      to analyze a specific
                      group.
                    </p>
                  </div>

                  <span className="analysis-count">
                    {filteredComplaints.length}{" "}
                    complaints
                  </span>
                </div>

                <div className="analysis-filters">
                  <div className="analysis-search">
                    🔍

                    <input
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                      placeholder="Search complaints, students or IDs..."
                    />
                  </div>

                  <select
                    value={statusFilter}
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

                  <select
                    value={
                      selectedCategory
                    }
                    onChange={(e) =>
                      setSelectedCategory(
                        e.target.value
                      )
                    }
                  >
                    <option>
                      All Categories
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category}
                        >
                          {category}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    className="clear-analysis-btn"
                    onClick={clearFilters}
                  >
                    Clear
                  </button>
                </div>
              </section>

              {/* MAIN KPI CARDS */}

              <section className="analysis-kpi-grid">
                <div className="analysis-kpi total">
                  <span>
                    Total Complaints
                  </span>

                  <strong>
                    {total}
                  </strong>

                  <small>
                    Complaints matching filters
                  </small>
                </div>

                <div className="analysis-kpi pending">
                  <span>
                    Pending
                  </span>

                  <strong>
                    {pending}
                  </strong>

                  <small>
                    {pendingRate}% of complaints
                  </small>
                </div>

                <div className="analysis-kpi progress">
                  <span>
                    In Progress
                  </span>

                  <strong>
                    {inProgress}
                  </strong>

                  <small>
                    Currently being handled
                  </small>
                </div>

                <div className="analysis-kpi resolved">
                  <span>
                    Resolved
                  </span>

                  <strong>
                    {resolved}
                  </strong>

                  <small>
                    {resolutionRate}% resolution rate
                  </small>
                </div>

                <div className="analysis-kpi rejected">
                  <span>
                    Rejected
                  </span>

                  <strong>
                    {rejected}
                  </strong>

                  <small>
                    {rejectedRate}% of complaints
                  </small>
                </div>
              </section>

              {/* PERFORMANCE + CATEGORY */}

              <section className="analysis-grid">
                {/* PERFORMANCE */}

                <div className="analysis-panel performance-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>
                        Resolution Performance
                      </h2>

                      <p>
                        Overall complaint
                        resolution effectiveness
                      </p>
                    </div>

                    <strong className="performance-number">
                      {resolutionRate}%
                    </strong>
                  </div>

                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${resolutionRate}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="performance-stats">
                    <div>
                      <span>
                        Resolved
                      </span>

                      <strong>
                        {resolved}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Remaining
                      </span>

                      <strong>
                        {total -
                          resolved}
                      </strong>
                    </div>
                  </div>

                  <div className="performance-message">
                    <strong>
                      Performance Assessment
                    </strong>

                    <p>
                      {performanceMessage}
                    </p>
                  </div>
                </div>

                {/* CATEGORY ANALYSIS */}

                <div className="analysis-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>
                        Complaint Categories
                      </h2>

                      <p>
                        Distribution by complaint
                        type
                      </p>
                    </div>
                  </div>

                  {categoryAnalysis.length >
                  0 ? (
                    <div className="category-list">
                      {categoryAnalysis.map(
                        (item) => (
                          <div
                            className="category-row"
                            key={
                              item.category
                            }
                          >
                            <div className="category-row-top">
                              <span>
                                {
                                  item.category
                                }
                              </span>

                              <strong>
                                {
                                  item.count
                                }{" "}
                                (
                                {
                                  item.percentage
                                }
                                %)
                              </strong>
                            </div>

                            <div className="category-progress">
                              <div
                                style={{
                                  width: `${item.percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div className="no-analysis-data">
                      No category data available.
                    </div>
                  )}
                </div>
              </section>

              {/* KEY INSIGHT */}

              <section className="insight-card">
                <div className="insight-icon">
                  💡
                </div>

                <div>
                  <span>
                    KEY INSIGHT
                  </span>

                  {topCategory ? (
                    <p>
                      <strong>
                        {topCategory.category}
                      </strong>{" "}
                      is currently the most
                      common complaint category
                      with{" "}
                      <strong>
                        {topCategory.count}
                      </strong>{" "}
                      complaints (
                      {
                        topCategory.percentage
                      }
                      % of total complaints).
                      The current resolution rate
                      is{" "}
                      <strong>
                        {resolutionRate}%
                      </strong>
                      .
                    </p>
                  ) : (
                    <p>
                      There is not enough data
                      to generate insights.
                    </p>
                  )}
                </div>
              </section>

              {/* REPORT TABLE */}

              <section className="reports-card complaint-analysis-table-card">
                <div className="analysis-table-header">
                  <div>
                    <h2>
                      Complaint Details
                    </h2>

                    <p>
                      Detailed complaints included
                      in this analysis.
                    </p>
                  </div>

                  <button
                    className="download-analysis-btn"
                    onClick={downloadPDF}
                    disabled={
                      downloading ||
                      filteredComplaints.length ===
                        0
                    }
                  >
                    ↓{" "}
                    {downloading
                      ? "Generating..."
                      : "Download Analysis"}
                  </button>
                </div>

                {filteredComplaints.length >
                0 ? (
                  <div className="analysis-table-wrapper">
                    <table className="analysis-table">
                      <thead>
                        <tr>
                          <th>
                            Complaint ID
                          </th>

                          <th>
                            Complaint
                          </th>

                          <th>
                            Student
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
                          ) => (
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
                                  className={`analysis-status ${normalizeStatus(
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
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="no-analysis-data">
                    No complaints match the
                    selected filters.
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminReports;

