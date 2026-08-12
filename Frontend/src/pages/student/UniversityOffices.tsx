import Navbar from "../../components/StudentNavbar";
import Sidebar from "../../components/StudentSidebar";


const UniversityOffices = () => {


  const offices = [
    {
      name: "Accounts Office",
      description:
        "Manage fees, scholarships, and financial matters",
      hours:
        "9 AM - 5 PM (Monday - Friday)",
      email:
        "accounts@university.edu",
      phone:
        "+880-1234-567890",
    },

    {
      name: "Registration Office",
      description:
        "Course registration and academic records",
      hours:
        "9 AM - 5 PM (Monday - Friday)",
      email:
        "registration@university.edu",
      phone:
        "+880-1234-567891",
    },

    {
      name: "CITS",
      description:
        "IT services and technical support",
      hours:
        "9 AM - 5 PM (Monday - Friday)",
      email:
        "cits@university.edu",
      phone:
        "+880-1234-567892",
    },

    {
      name: "Financial Aid Office",
      description:
        "Financial assistance and grants",
      hours:
        "9 AM - 5 PM (Monday - Friday)",
      email:
        "financialaid@university.edu",
      phone:
        "+880-1234-567893",
    },

    {
      name: "Student Affairs",
      description:
        "Student activities and welfare",
      hours:
        "9 AM - 5 PM (Monday - Friday)",
      email:
        "studentaffairs@university.edu",
      phone:
        "+880-1234-567894",
    },

    {
      name: "Admission Office",
      description:
        "Admission inquiries and applications",
      hours:
        "9 AM - 5 PM (Monday - Friday)",
      email:
        "admission@university.edu",
      phone:
        "+880-1234-567895",
    },
  ];



  return (

    <div
      style={{
        backgroundColor:"#f4f6f9",
        minHeight:"100vh",
      }}
    >


      {/* Top Navbar */}

      <Navbar />



      <div
        style={{
          display:"flex",
        }}
      >


        {/* Sidebar */}

        <aside
          style={{
            width:"250px",
          }}
        >

          <Sidebar />

        </aside>




        {/* Main Content */}

        <main
          style={{
            flex:1,
            padding:"30px",
          }}
        >


          <h1
            style={{
              color:"#1e40af",
              marginBottom:"25px",
            }}
          >
            University Offices
          </h1>




          <div
            style={{
              display:"flex",
              flexWrap:"wrap",
              gap:"25px",
            }}
          >


            {offices.map((office)=>(


              <div
                key={office.name}

                style={{
                  backgroundColor:"#ffffff",
                  borderRadius:"18px",
                  padding:"25px",
                  width:"300px",
                  boxShadow:
                  "0 10px 30px rgba(15,23,42,0.08)",
                }}
              >


                <h2
                  style={{
                    color:"#1e40af",
                    marginTop:0,
                  }}
                >
                  {office.name}
                </h2>



                <p
                  style={{
                    color:"#475569",
                  }}
                >
                  {office.description}
                </p>



                <hr />



                <p>
                  <strong>
                    Contact Hours:
                  </strong>
                  <br />
                  {office.hours}
                </p>



                <p>
                  <strong>
                    Email:
                  </strong>
                  <br />
                  {office.email}
                </p>



                <p>
                  <strong>
                    Phone:
                  </strong>
                  <br />
                  {office.phone}
                </p>



              </div>


            ))}


          </div>


        </main>


      </div>


    </div>

  );

};


export default UniversityOffices;