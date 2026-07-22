import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import OfficeCard from "../../components/OfficeCard";
import { useState } from "react";

const UniversityOffices = () => {
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

  const offices = [
    { name: "Accounts Office", description: "Manage fees, scholarships, and financial matters" },
    { name: "Registration Office", description: "Course registration and academic records" },
    { name: "CITS", description: "IT services and technical support" },
    { name: "Financial Aid Office", description: "Financial assistance and grants" },
    { name: "Student Affairs", description: "Student activities and welfare" },
    { name: "Admission Office", description: "Admission inquiries and applications" },
  ];

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "30px" }}>
          <h1>University Offices</h1>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
            {offices.map((office) => (
              <div
                key={office.name}
                onClick={() => setSelectedOffice(office.name)}
                style={{ cursor: "pointer" }}
              >
                <OfficeCard
                  officeName={office.name}
                  description={office.description}
                />
              </div>
            ))}
          </div>

          {selectedOffice && (
            <div
              style={{
                marginTop: "40px",
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h2>{selectedOffice}</h2>
              <p>Contact hours: 9 AM - 5 PM (Monday to Friday)</p>
              <p>Email: {selectedOffice.toLowerCase().replace(/ /g, "")}@university.edu</p>
              <p>Phone: +880-1234-567890</p>
              <button
                onClick={() => setSelectedOffice(null)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityOffices;
