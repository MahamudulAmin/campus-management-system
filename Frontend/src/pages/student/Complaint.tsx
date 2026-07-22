import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";

const Complaint = () => {
  const [formData, setFormData] = useState({
    complaintType: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const complaintTypes = [
    "Academic Issue",
    "Harassment",
    "Facilities",
    "Staff Behavior",
    "Administrative",
    "Other",
  ];

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
    if (formData.complaintType && formData.description) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ complaintType: "", description: "" });
      }, 3000);
    }
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "30px" }}>
          <h1>File a Complaint</h1>

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
              ✓ Complaint submitted successfully! Reference ID: COMP-{Math.random().toString(36).substr(2, 6).toUpperCase()}
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
                  Complaint Type
                </label>
                <select
                  name="complaintType"
                  value={formData.complaintType}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">-- Select complaint type --</option>
                  {complaintTypes.map((type) => (
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
                  placeholder="Describe your complaint in detail..."
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
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Submit Complaint
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaint;
