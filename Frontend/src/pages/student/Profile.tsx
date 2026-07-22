import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useState } from "react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Mahamudul Amin",
    studentId: "221-115-XXX",
    email: "mahamudul@university.edu",
    phone: "+880-1234-567890",
    department: "Computer Science & Engineering",
    semester: "Spring 2026",
    gpa: "3.85",
    address: "123 Street, Dhaka, Bangladesh",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  return (
    <div style={{ backgroundColor: "#f4f6f9", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "30px" }}>
          <h1>Student Profile</h1>

          <div
            style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2563EB",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {Object.entries(profile).map(([key, value]) => (
              <div key={key} style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      boxSizing: "border-box",
                    }}
                  />
                ) : (
                  <p style={{ margin: 0, color: "#555" }}>{value}</p>
                )}
              </div>
            ))}

            {isEditing && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  alert("Profile updated successfully!");
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#27ae60",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
