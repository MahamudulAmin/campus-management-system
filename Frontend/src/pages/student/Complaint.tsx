import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import API_URL from "../../config";

const Complaint = () => {

  const [formData, setFormData] = useState({
    complaintType: "",
    description: "",
  });

  const [submitted, setSubmitted] =
    useState(false);

  const [referenceId, setReferenceId] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const complaintTypes = [
    "Academic Issue",
    "Harassment",
    "Facilities",
    "Staff Behavior",
    "Administrative",
    "Other",
  ];

  // =====================================================
  // GET LOGGED-IN STUDENT ID
  // =====================================================

  const getStudentId = () => {

    const userId =
      localStorage.getItem("userId");

    if (
      userId &&
      /^\d{7}$/.test(userId)
    ) {
      return userId;
    }

    return "";
  };

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {

    const {
      name,
      value
    } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setError("");
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError("");

    const studentId =
      getStudentId();

    // Student ID check

    if (!studentId) {

      setError(
        "Student information was not found. Please login again."
      );

      return;
    }

    // Form validation

    if (!formData.complaintType) {

      setError(
        "Please select a complaint type."
      );

      return;
    }

    if (
      !formData.description.trim()
    ) {

      setError(
        "Please enter the complaint description."
      );

      return;
    }

    try {

      setLoading(true);

      const complaint = {

        student_id:
          studentId,

        title:
          formData.complaintType,

        category:
          formData.complaintType,

        description:
          formData.description,

        status:
          "Pending"
      };

      const response =
        await fetch(
          `${API_URL}/complaints/`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                complaint
              ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Failed to submit complaint."
        );
      }

      setReferenceId(
        data.complaint?.id ||
        "Submitted"
      );

      setSubmitted(true);

      setFormData({
        complaintType: "",
        description: ""
      });

      setTimeout(() => {

        setSubmitted(false);

      }, 5000);

    } catch (error) {

      console.error(
        "Complaint submit error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Could not submit complaint."
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div
      style={{
        backgroundColor:
          "#f4f6f9",
        minHeight:
          "100vh"
      }}
    >

      <Navbar />

      <div
        style={{
          display: "flex"
        }}
      >

        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "30px"
          }}
        >

          <h1>
            File a Complaint
          </h1>

          <p
            style={{
              color: "#64748b",
              marginBottom: "25px"
            }}
          >
            Submit a complaint to
            the university administration.
          </p>

          {/* SUCCESS */}

          {submitted && (

            <div
              style={{
                backgroundColor:
                  "#d4edda",

                border:
                  "1px solid #c3e6cb",

                color:
                  "#155724",

                padding:
                  "15px",

                borderRadius:
                  "6px",

                marginBottom:
                  "20px"
              }}
            >

              ✓ Complaint submitted
              successfully!

              <br />

              Reference ID:

              <strong>
                {" "}
                {referenceId}
              </strong>

            </div>
          )}

          {/* ERROR */}

          {error && (

            <div
              style={{
                backgroundColor:
                  "#fee2e2",

                border:
                  "1px solid #fecaca",

                color:
                  "#b91c1c",

                padding:
                  "15px",

                borderRadius:
                  "6px",

                marginBottom:
                  "20px"
              }}
            >
              {error}
            </div>
          )}

          {/* FORM */}

          <div
            style={{
              backgroundColor:
                "#fff",

              padding:
                "30px",

              borderRadius:
                "10px",

              boxShadow:
                "0 2px 8px rgba(0,0,0,0.1)",

              maxWidth:
                "650px"
            }}
          >

            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* COMPLAINT TYPE */}

              <div
                style={{
                  marginBottom:
                    "20px"
                }}
              >

                <label
                  style={{
                    display:
                      "block",

                    marginBottom:
                      "8px",

                    fontWeight:
                      "bold"
                  }}
                >
                  Complaint Type
                </label>

                <select
                  name="complaintType"
                  value={
                    formData.complaintType
                  }
                  onChange={
                    handleChange
                  }
                  style={{
                    width:
                      "100%",

                    padding:
                      "10px",

                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "6px",

                    boxSizing:
                      "border-box"
                  }}
                >

                  <option value="">
                    -- Select complaint
                    type --
                  </option>

                  {complaintTypes.map(
                    (type) => (

                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* DESCRIPTION */}

              <div
                style={{
                  marginBottom:
                    "20px"
                }}
              >

                <label
                  style={{
                    display:
                      "block",

                    marginBottom:
                      "8px",

                    fontWeight:
                      "bold"
                  }}
                >
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Describe your complaint in detail..."
                  style={{
                    width:
                      "100%",

                    padding:
                      "10px",

                    border:
                      "1px solid #ddd",

                    borderRadius:
                      "6px",

                    boxSizing:
                      "border-box",

                    minHeight:
                      "150px",

                    fontFamily:
                      "Arial",

                    resize:
                      "vertical"
                  }}
                />

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding:
                    "11px 30px",

                  backgroundColor:
                    loading
                      ? "#94a3b8"
                      : "#e74c3c",

                  color:
                    "white",

                  border:
                    "none",

                  borderRadius:
                    "6px",

                  cursor:
                    loading
                      ? "not-allowed"
                      : "pointer",

                  fontSize:
                    "16px",

                  fontWeight:
                    "bold"
                }}
              >

                {loading
                  ? "Submitting..."
                  : "Submit Complaint"}

              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Complaint;