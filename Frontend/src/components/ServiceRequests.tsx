import React, { useEffect, useState } from "react";


// =========================================================
// API
// =========================================================

const API_URL = "http://127.0.0.1:8000";


// =========================================================
// TYPES
// =========================================================

export interface RequestItem {
  id?: string;
  teacher_id?: string;
  teacher_name?: string;

  title?: string;

  category: string;

  description?: string;

  priority?: "Low" | "Medium" | "High" | string;

  status?: "Pending" | "In Progress" | "Resolved" | string;

  submitted_at?: string;

  submittedAt?: string;
}


interface ServiceRequestsProps {
  requestsList?: RequestItem[];

  onSubmitRequest?: (
    title: string,
    category: string
  ) => Promise<void> | void;
}


// =========================================================
// COMPONENT
// =========================================================

export const ServiceRequests: React.FC<
  ServiceRequestsProps
> = ({
  requestsList = [],
}) => {

  // =======================================================
  // STATE
  // =======================================================

  const [requests, setRequests] =
    useState<RequestItem[]>([]);

  const [category, setCategory] =
    useState("IT Support");

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState<
      "Low" | "Medium" | "High"
    >("Medium");

  const [loading, setLoading] =
    useState(false);

  const [loadingRequests, setLoadingRequests] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // =======================================================
  // GET TEACHER ID
  // =======================================================

  const getTeacherId = (): string | null => {

    return (
      localStorage.getItem("teacherId") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("user")
    );
  };


  // =======================================================
  // LOAD REQUESTS
  // =======================================================

  const loadRequests = async () => {

    const teacherId = getTeacherId();

    if (!teacherId) {

      setError(
        "Teacher ID not found. Please login again."
      );

      setLoadingRequests(false);

      return;
    }

    try {

      setLoadingRequests(true);

      setError("");

      const response = await fetch(
        `${API_URL}/api/teacher/requests?user_id=${encodeURIComponent(
          teacherId
        )}`
      );

      if (!response.ok) {

        throw new Error(
          "Failed to load service requests."
        );
      }

      const data = await response.json();

      if (Array.isArray(data)) {

        setRequests(data);

      } else {

        setRequests([]);
      }

    } catch (error) {

      console.error(
        "Load teacher requests error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load service requests."
      );

    } finally {

      setLoadingRequests(false);
    }
  };


  // =======================================================
  // LOAD ON PAGE OPEN
  // =======================================================

  useEffect(() => {

    loadRequests();

  }, []);


  // =======================================================
  // SUBMIT REQUEST
  // =======================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setMessage("");

    setError("");

    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!title.trim()) {

      setError(
        "Please enter a request title."
      );

      return;
    }

    if (!description.trim()) {

      setError(
        "Please describe the issue."
      );

      return;
    }

    const teacherId = getTeacherId();

    if (!teacherId) {

      setError(
        "Teacher ID not found. Please login again."
      );

      return;
    }


    // -------------------------------------------------------
    // SEND TO BACKEND
    // -------------------------------------------------------

    try {

      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/teacher/requests?user_id=${encodeURIComponent(
          teacherId
        )}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            title:
              title.trim(),

            category:
              category,

            description:
              description.trim(),

            priority:
              priority

          })
        }
      );


      // -----------------------------------------------------
      // READ RESPONSE
      // -----------------------------------------------------

      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data?.detail ||
          "Failed to submit service request."
        );
      }


      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      setMessage(
        "Service request submitted successfully."
      );

      setTitle("");

      setDescription("");

      setCategory(
        "IT Support"
      );

      setPriority(
        "Medium"
      );


      // -----------------------------------------------------
      // RELOAD FROM JSON/BACKEND
      // -----------------------------------------------------

      await loadRequests();

    } catch (error) {

      console.error(
        "Submit service request error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit service request."
      );

    } finally {

      setLoading(false);
    }
  };


  // =======================================================
  // DISPLAY REQUESTS
  // =======================================================

  const displayRequests =
    requestsList.length > 0
      ? requestsList
      : requests;


  // =======================================================
  // FORMAT DATE
  // =======================================================

  const formatDate = (
    request: RequestItem
  ) => {

    const date =
      request.submitted_at ||
      request.submittedAt;

    if (!date) {
      return "-";
    }

    try {

      return new Date(
        date
      ).toLocaleDateString();

    } catch {

      return date;
    }
  };


  // =======================================================
  // UI
  // =======================================================

  return (

    <div className="max-w-5xl mx-auto p-6 space-y-8">


      {/* ===================================================
          SUBMISSION FORM
      =================================================== */}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

        <h2 className="text-xl font-bold text-slate-800 mb-1">

          Submit New Service Request

        </h2>

        <p className="text-slate-500 text-sm mb-6">

          Request maintenance, IT support,
          laboratory supplies, or classroom support.

        </p>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >


          {/* TITLE + CATEGORY */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            {/* TITLE */}

            <div>

              <label className="block text-xs font-semibold text-slate-700 mb-1">

                Request Title

              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="e.g. Broken Projector in Room 204"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
              />

            </div>


            {/* CATEGORY */}

            <div>

              <label className="block text-xs font-semibold text-slate-700 mb-1">

                Category

              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
              >

                <option value="IT Support">
                  IT Support
                </option>

                <option value="Classroom Maintenance">
                  Classroom Maintenance
                </option>

                <option value="Lab Supplies">
                  Lab Supplies
                </option>

                <option value="Facilities & Cleaning">
                  Facilities & Cleaning
                </option>

              </select>

            </div>

          </div>


          {/* PRIORITY */}

          <div>

            <label className="block text-xs font-semibold text-slate-700 mb-1">

              Priority

            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value as
                    | "Low"
                    | "Medium"
                    | "High"
                )
              }
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            >

              <option value="Low">
                Low Priority
              </option>

              <option value="Medium">
                Medium Priority
              </option>

              <option value="High">
                High Priority
              </option>

            </select>

          </div>


          {/* DESCRIPTION */}

          <div>

            <label className="block text-xs font-semibold text-slate-700 mb-1">

              Issue Description

            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Describe the issue or requested items in detail..."
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            />

          </div>


          {/* SUCCESS MESSAGE */}

          {message && (

            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">

              {message}

            </div>

          )}


          {/* ERROR MESSAGE */}

          {error && (

            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">

              {error}

            </div>

          )}


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : ""
            }`}
          >

            {loading
              ? "Submitting..."
              : "Submit Request"}

          </button>

        </form>

      </div>


      {/* ===================================================
          REQUEST TABLE
      =================================================== */}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">

        <div className="flex items-center justify-between mb-4">

          <div>

            <h3 className="text-lg font-bold text-slate-800">

              Your Recent Requests

            </h3>

            <p className="text-sm text-slate-500">

              Requests saved to your teacher account.

            </p>

          </div>

          <button
            type="button"
            onClick={loadRequests}
            disabled={loadingRequests}
            className="text-sm px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          >

            {loadingRequests
              ? "Loading..."
              : "Refresh"}

          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm text-slate-600">

            <thead className="bg-slate-50 text-slate-700 text-xs uppercase border-b border-slate-200">

              <tr>

                <th className="py-3 px-4">
                  Request ID
                </th>

                <th className="py-3 px-4">
                  Title / Category
                </th>

                <th className="py-3 px-4">
                  Priority
                </th>

                <th className="py-3 px-4">
                  Status
                </th>

                <th className="py-3 px-4">
                  Date
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {loadingRequests ? (

                <tr>

                  <td
                    colSpan={5}
                    className="py-8 text-center text-slate-400"
                  >

                    Loading requests...

                  </td>

                </tr>

              ) : displayRequests.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="py-8 text-center text-slate-400"
                  >

                    No service requests found.

                  </td>

                </tr>

              ) : (

                displayRequests.map(
                  (req, idx) => (

                    <tr
                      key={
                        req.id ||
                        idx
                      }
                    >

                      {/* REQUEST ID */}

                      <td className="py-3.5 px-4 font-mono text-xs font-medium text-slate-900">

                        {req.id ||
                          `REQ-${idx + 1}`}

                      </td>


                      {/* TITLE */}

                      <td className="py-3.5 px-4 font-medium">

                        <div>

                          {req.title ||
                            req.category}

                        </div>

                        <div className="text-xs text-slate-400 font-normal">

                          {req.category}

                        </div>

                      </td>


                      {/* PRIORITY */}

                      <td className="py-3.5 px-4">

                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            req.priority ===
                            "High"

                              ? "bg-red-100 text-red-700"

                              : req.priority ===
                                "Medium"

                              ? "bg-amber-100 text-amber-700"

                              : "bg-slate-100 text-slate-600"
                          }`}
                        >

                          {req.priority ||
                            "Medium"}

                        </span>

                      </td>


                      {/* STATUS */}

                      <td className="py-3.5 px-4">

                        <span
                          className={`text-xs px-2 py-0.5 rounded font-medium ${
                            req.status ===
                            "Resolved"

                              ? "bg-emerald-100 text-emerald-700"

                              : req.status ===
                                "In Progress"

                              ? "bg-blue-100 text-blue-700"

                              : req.status ===
                                "Rejected"

                              ? "bg-red-100 text-red-700"

                              : "bg-slate-100 text-slate-600"
                          }`}
                        >

                          {req.status ||
                            "Pending"}

                        </span>

                      </td>


                      {/* DATE */}

                      <td className="py-3.5 px-4 text-xs text-slate-500">

                        {formatDate(
                          req
                        )}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};


export default ServiceRequests;