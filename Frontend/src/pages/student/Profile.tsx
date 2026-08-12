import { useEffect, useState } from "react";
import Navbar from "../../components/StudentNavbar";
import Sidebar from "../../components/StudentSidebar";
import API_URL from "../../config";


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
  semester?: string;
  gpa?: string;
  address?: string;
}


interface ProfileData {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  gpa: string;
  address: string;
}


const Profile = () => {

  // =====================================================
  // STATE
  // =====================================================

  const [isEditing, setIsEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  const [profile, setProfile] =
    useState<ProfileData>({
      name: "",
      studentId: "",
      email: "",
      phone: "",
      department: "",
      semester: "",
      gpa: "",
      address: "",
    });


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  useEffect(() => {

    const loadProfile = async () => {

      const storedUser =
        localStorage.getItem("user");


      if (!storedUser) {

        setError(
          "No student is currently logged in."
        );

        setLoading(false);

        return;
      }


      try {

        const user: User =
          JSON.parse(storedUser);


        // =================================================
        // FIRST LOAD FROM LOCAL STORAGE
        // =================================================

        setProfile({
          name: user.name || "",
          studentId: user.id || "",
          email: user.email || "",
          phone: user.phone || "",
          department:
            user.department || "",
          semester:
            user.semester || "",
          gpa: user.gpa || "",
          address:
            user.address || "",
        });


        // =================================================
        // THEN GET FRESH DATA FROM BACKEND
        // =================================================

        if (user.id) {

          const response =
            await fetch(
              `${API_URL}/login/${user.id}`
            );


          if (response.ok) {

            const data =
              await response.json();


            const freshUser: User =
              data;


            setProfile({
              name:
                freshUser.name || "",

              studentId:
                freshUser.id || "",

              email:
                freshUser.email || "",

              phone:
                freshUser.phone || "",

              department:
                freshUser.department || "",

              semester:
                freshUser.semester || "",

              gpa:
                freshUser.gpa || "",

              address:
                freshUser.address || "",
            });


            // Update localStorage with
            // latest backend information

            localStorage.setItem(
              "user",
              JSON.stringify(
                freshUser
              )
            );
          }
        }

      } catch (err) {

        console.error(
          "Profile loading error:",
          err
        );

        setError(
          "Unable to load profile information."
        );

      } finally {

        setLoading(false);
      }
    };


    loadProfile();

  }, []);


  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const {
      name,
      value
    } = e.target;


    setProfile(
      (previousProfile) => ({
        ...previousProfile,
        [name]: value,
      })
    );


    setError("");
    setMessage("");
  };


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = async () => {

    setError("");
    setMessage("");


    // -----------------------------------------------------
    // VALIDATION
    // -----------------------------------------------------

    if (
      profile.name.trim() === ""
    ) {

      setError(
        "Name cannot be empty."
      );

      return;
    }


    if (
      profile.studentId.trim() === ""
    ) {

      setError(
        "Student ID is missing."
      );

      return;
    }


    try {

      setSaving(true);


      // =================================================
      // SEND UPDATE TO BACKEND
      // =================================================

      const response =
        await fetch(
          `${API_URL}/login/${profile.studentId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                profile.name.trim(),

              phone:
                profile.phone.trim(),

              department:
                profile.department.trim(),

              semester:
                profile.semester.trim(),

              gpa:
                profile.gpa.trim(),

              address:
                profile.address.trim(),
            }),
          }
        );


      const data =
        await response.json();


      // =================================================
      // ERROR
      // =================================================

      if (!response.ok) {

        setError(
          data.detail ||
            "Unable to update profile."
        );

        return;
      }


      // =================================================
      // GET UPDATED USER
      // =================================================

      const updatedUser: User =
        data.user;


      // =================================================
      // UPDATE LOCAL PROFILE
      // =================================================

      setProfile({
        name:
          updatedUser.name || "",

        studentId:
          updatedUser.id || "",

        email:
          updatedUser.email || "",

        phone:
          updatedUser.phone || "",

        department:
          updatedUser.department || "",

        semester:
          updatedUser.semester || "",

        gpa:
          updatedUser.gpa || "",

        address:
          updatedUser.address || "",
      });


      // =================================================
      // UPDATE LOCAL STORAGE
      // =================================================

      localStorage.setItem(
        "user",
        JSON.stringify(
          updatedUser
        )
      );


      // Also make sure userId remains correct

      localStorage.setItem(
        "userId",
        updatedUser.id
      );


      // =================================================
      // FINISH
      // =================================================

      setIsEditing(false);

      setMessage(
        "Profile updated successfully!"
      );


    } catch (err) {

      console.error(
        "Profile update error:",
        err
      );

      setError(
        "Unable to connect to the server."
      );

    } finally {

      setSaving(false);
    }
  };


  // =====================================================
  // CANCEL EDITING
  // =====================================================

  const handleCancel = async () => {

    setIsEditing(false);

    setError("");
    setMessage("");


    // Reload original backend information

    const storedUser =
      localStorage.getItem("user");


    if (!storedUser) {
      return;
    }


    try {

      const user: User =
        JSON.parse(storedUser);


      const response =
        await fetch(
          `${API_URL}/login/${user.id}`
        );


      if (!response.ok) {
        return;
      }


      const data =
        await response.json();


      setProfile({
        name:
          data.name || "",

        studentId:
          data.id || "",

        email:
          data.email || "",

        phone:
          data.phone || "",

        department:
          data.department || "",

        semester:
          data.semester || "",

        gpa:
          data.gpa || "",

        address:
          data.address || "",
      });


    } catch (err) {

      console.error(
        "Cancel reload error:",
        err
      );
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div
        style={{
          backgroundColor:
            "#f4f6f9",
          minHeight: "100vh",
        }}
      >

        <Navbar />

        <div
          style={{
            display: "flex",
          }}
        >

          <Sidebar />

          <div
            style={{
              flex: 1,
              padding: "40px",
              textAlign: "center",
            }}
          >

            <h2>
              Loading profile...
            </h2>

          </div>

        </div>

      </div>
    );
  }


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div
      style={{
        backgroundColor:
          "#f4f6f9",
        minHeight: "100vh",
      }}
    >

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Navbar />


      {/* =================================================
          MAIN LAYOUT
      ================================================= */}

      <div
        style={{
          display: "flex",
          minHeight:
            "calc(100vh - 70px)",
        }}
      >

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <Sidebar />


        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          style={{
            flex: 1,
            padding: "30px",
          }}
        >

          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div
            style={{
              marginBottom: "25px",
            }}
          >

            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                color: "#1e293b",
              }}
            >
              Student Profile
            </h1>

            <p
              style={{
                marginTop: "8px",
                color: "#64748b",
              }}
            >
              View and manage your personal information
            </p>

          </div>


          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <div
            style={{
              backgroundColor:
                "#ffffff",

              padding: "30px",

              borderRadius: "10px",

              boxShadow:
                "0 2px 8px rgba(0,0,0,0.1)",

              maxWidth: "900px",
            }}
          >

            {/* =================================================
                CARD HEADER
            ================================================= */}

            <div
              style={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                marginBottom: "25px",

                borderBottom:
                  "1px solid #e5e7eb",

                paddingBottom: "20px",
              }}
            >

              <div>

                <h2
                  style={{
                    margin: 0,
                    color: "#1e293b",
                  }}
                >
                  Personal Information
                </h2>

                <p
                  style={{
                    marginTop: "5px",
                    color: "#64748b",
                  }}
                >
                  Your student account information
                </p>

              </div>


              {!isEditing && (

                <button
                  onClick={() => {

                    setIsEditing(true);

                    setError("");
                    setMessage("");

                  }}
                  style={{
                    padding:
                      "10px 20px",

                    backgroundColor:
                      "#2563EB",

                    color: "white",

                    border: "none",

                    borderRadius: "6px",

                    cursor: "pointer",

                    fontSize: "14px",

                    fontWeight: "600",
                  }}
                >
                  Edit Profile
                </button>

              )}

            </div>


            {/* =================================================
                MESSAGE
            ================================================= */}

            {message && (

              <div
                style={{
                  padding:
                    "12px 15px",

                  marginBottom:
                    "20px",

                  backgroundColor:
                    "#ecfdf5",

                  color:
                    "#166534",

                  borderRadius:
                    "6px",

                  border:
                    "1px solid #bbf7d0",
                }}
              >
                {message}
              </div>

            )}


            {error && (

              <div
                style={{
                  padding:
                    "12px 15px",

                  marginBottom:
                    "20px",

                  backgroundColor:
                    "#fef2f2",

                  color:
                    "#b91c1c",

                  borderRadius:
                    "6px",

                  border:
                    "1px solid #fecaca",
                }}
              >
                {error}
              </div>

            )}


            {/* =================================================
                FIELDS
            ================================================= */}

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",

                gap: "20px",
              }}
            >

              {/* =================================================
                  NAME
              ================================================= */}

              <div>

                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  Full Name
                </label>

                {isEditing ? (

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    style={{
                      width: "100%",
                      padding: "11px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                ) : (

                  <p
                    style={{
                      margin: 0,
                      padding:
                        "11px 0",
                      color:
                        profile.name
                          ? "#475569"
                          : "#94a3b8",
                    }}
                  >
                    {profile.name ||
                      "Not provided"}
                  </p>

                )}

              </div>


              {/* =================================================
                  STUDENT ID
              ================================================= */}

              <div>

                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  Student ID
                </label>

                <input
                  type="text"
                  value={profile.studentId}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "11px",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "6px",
                    boxSizing:
                      "border-box",
                    backgroundColor:
                      "#f8fafc",
                    color:
                      "#64748b",
                  }}
                />

              </div>


              {/* =================================================
                  EMAIL
              ================================================= */}

              <div>

                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  Email
                </label>

                <input
                  type="text"
                  value={profile.email}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "11px",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "6px",
                    boxSizing:
                      "border-box",
                    backgroundColor:
                      "#f8fafc",
                    color:
                      "#64748b",
                  }}
                />

              </div>


              {/* =================================================
                  PHONE
              ================================================= */}

              <div>

                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  Phone
                </label>

                {isEditing ? (

                  <input
                    type="text"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    style={{
                      width: "100%",
                      padding: "11px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                ) : (

                  <p
                    style={{
                      margin: 0,
                      padding:
                        "11px 0",
                      color:
                        profile.phone
                          ? "#475569"
                          : "#94a3b8",
                    }}
                  >
                    {profile.phone ||
                      "Not provided"}
                  </p>

                )}

              </div>


              {/* =================================================
                  DEPARTMENT
              ================================================= */}

              <div>

                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  Department
                </label>

                {isEditing ? (

                  <input
                    type="text"
                    name="department"
                    value={
                      profile.department
                    }
                    onChange={handleChange}
                    placeholder="Enter department"
                    style={{
                      width: "100%",
                      padding: "11px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                ) : (

                  <p
                    style={{
                      margin: 0,
                      padding:
                        "11px 0",
                      color:
                        profile.department
                          ? "#475569"
                          : "#94a3b8",
                    }}
                  >
                    {profile.department ||
                      "Not provided"}
                  </p>

                )}

              </div>


              {/* =================================================
                  SEMESTER
              ================================================= */}

              <div>

                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  Semester
                </label>

                {isEditing ? (

                  <input
                    type="text"
                    name="semester"
                    value={
                      profile.semester
                    }
                    onChange={handleChange}
                    placeholder="Example: Spring 2026"
                    style={{
                      width: "100%",
                      padding: "11px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                ) : (

                  <p
                    style={{
                      margin: 0,
                      padding:
                        "11px 0",
                      color:
                        profile.semester
                          ? "#475569"
                          : "#94a3b8",
                    }}
                  >
                    {profile.semester ||
                      "Not provided"}
                  </p>

                )}

              </div>


              {/* =================================================
                  GPA
              ================================================= */}

              <div>

                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  GPA
                </label>

                {isEditing ? (

                  <input
                    type="text"
                    name="gpa"
                    value={profile.gpa}
                    onChange={handleChange}
                    placeholder="Example: 3.85"
                    style={{
                      width: "100%",
                      padding: "11px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                ) : (

                  <p
                    style={{
                      margin: 0,
                      padding:
                        "11px 0",
                      color:
                        profile.gpa
                          ? "#475569"
                          : "#94a3b8",
                    }}
                  >
                    {profile.gpa ||
                      "Not provided"}
                  </p>

                )}

              </div>


              {/* =================================================
                  ADDRESS
              ================================================= */}

              <div
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >

                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontWeight: "600",
                    color: "#334155",
                  }}
                >
                  Address
                </label>

                {isEditing ? (

                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    style={{
                      width: "100%",
                      padding: "11px",
                      border:
                        "1px solid #d1d5db",
                      borderRadius: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                ) : (

                  <p
                    style={{
                      margin: 0,
                      padding:
                        "11px 0",
                      color:
                        profile.address
                          ? "#475569"
                          : "#94a3b8",
                    }}
                  >
                    {profile.address ||
                      "Not provided"}
                  </p>

                )}

              </div>

            </div>


            {/* =================================================
                SAVE / CANCEL
            ================================================= */}

            {isEditing && (

              <div
                style={{
                  marginTop: "25px",
                  paddingTop: "20px",
                  borderTop:
                    "1px solid #e5e7eb",

                  display: "flex",
                  gap: "10px",
                }}
              >

                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding:
                      "11px 25px",

                    backgroundColor:
                      saving
                        ? "#86efac"
                        : "#16a34a",

                    color: "white",

                    border: "none",

                    borderRadius: "6px",

                    cursor: saving
                      ? "not-allowed"
                      : "pointer",

                    fontSize: "14px",

                    fontWeight: "600",
                  }}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>


                <button
                  onClick={handleCancel}
                  disabled={saving}
                  style={{
                    padding:
                      "11px 25px",

                    backgroundColor:
                      "#64748b",

                    color: "white",

                    border: "none",

                    borderRadius: "6px",

                    cursor: "pointer",

                    fontSize: "14px",

                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
};


export default Profile;