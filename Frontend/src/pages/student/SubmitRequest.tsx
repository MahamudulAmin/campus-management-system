import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";

const SubmitRequest = () => {
  const [formData, setFormData] = useState({
    office: "",
    requestType: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const offices = [
    "Accounts Office",
    "Registration Office",
    "CITS",
    "Financial Aid Office",
    "Student Affairs",
  ];

  const requestTypes = ["Certificate", "Transcript", "Duplicate ID", "Leave Request", "Other"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.office && formData.requestType && formData.description) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ office: "", requestType: "", description: "" });
      }, 3000);
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "30px" }}>
          <h1>Submit Request</h1>

          {submitted && (
            <div
              style={{
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                color: "#155724",
                padding: "15px",
                borderRadius: "6px",
                marginBottom: "20px",
              }}
            >
              ✓ Request submitted successfully! Your request ID is REQ-{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </div>
          )}

          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              maxWidth: "600px",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Select Office
                </label>
                <select
                  name="office"
                  value={formData.office}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">-- Choose an office --</option>
                  {offices.map((office) => (
                    <option key={office} value={office}>
                      {office}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Request Type
                </label>
                <select
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">-- Choose request type --</option>
                  {requestTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your request in detail..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    boxSizing: "border-box",
                    minHeight: "150px",
                    fontFamily: "Arial",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "10px 30px",
                  backgroundColor: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitRequest;
