import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";
import "../../styles/SubmitRequest.css";
// import API_URL from "../../config";

const SubmitRequest = () => {
  const [formData, setFormData] = useState({
    office: "",
    requestType: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);

  const offices = [
    "Accounts Office",
    "Registration Office",
    "CITS",
    "Financial Aid Office",
    "Student Affairs",
  ];

  const requestTypes = [
    "Certificate",
    "Transcript",
    "Duplicate ID",
    "Leave Request",
    "Other",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.office ||
      !formData.requestType ||
      !formData.description
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const id =
      "REQ-" +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    const requestData = {
      id,
      office: formData.office,
      requestType: formData.requestType,
      description: formData.description,
      date: new Date().toLocaleDateString(),
      status: "Pending",
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/requests/", {
      // const response = await fetch(`${API_URL}/requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
  const errorText = await response.text();
  console.log(errorText);

  throw new Error(errorText);
}
window.dispatchEvent(new Event("requestUpdated"));
      setRequestId(id);
      setSubmitted(true);

      setFormData({
        office: "",
        requestType: "",
        description: "",
      });

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };
    return (
    <div className="page-container">
      <Navbar />

      <div className="layout">
        <Sidebar />

        <main className="content">
          <h1>Submit Request</h1>

          {submitted && (
            <div className="success-box">
              ✓ Request submitted successfully
              <br />
              Request ID: <b>{requestId}</b>
            </div>
          )}

          <div className="request-card">
            <form onSubmit={handleSubmit}>
              <label>Select Office</label>

              <select
                name="office"
                value={formData.office}
                onChange={handleChange}
              >
                <option value="">-- Choose Office --</option>

                {offices.map((office) => (
                  <option key={office} value={office}>
                    {office}
                  </option>
                ))}
              </select>

              <label>Request Type</label>

              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleChange}
              >
                <option value="">-- Choose Type --</option>

                {requestTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your request..."
              />

              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubmitRequest;