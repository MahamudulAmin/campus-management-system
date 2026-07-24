import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import { useEffect, useState } from "react";


interface Office {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  description: string;
  head: string;
  staff: number;
}


const AdminOffices = () => {

  const [offices, setOffices] = useState<Office[]>([]);


  // Load offices from FastAPI
  const fetchOffices = async () => {

    try {

      const response = await fetch(
        "http://localhost:8000/offices"
      );

      const data = await response.json();

      setOffices(data);

    } catch(error){

      console.log("Error loading offices",error);

    }

  };


  useEffect(()=>{

    fetchOffices();

  },[]);



  // Delete office
  const deleteOffice = async(id:number)=>{

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this office?"
    );


    if(!confirmDelete) return;


    await fetch(
      `http://localhost:8000/offices/${id}`,
      {
        method:"DELETE"
      }
    );


    fetchOffices();

  };




  return (

    <div 
    style={{
      backgroundColor:"#f4f6f9",
      minHeight:"100vh"
    }}>

      <AdminNavbar/>


      <div style={{display:"flex"}}>

        <AdminSidebar/>


        <div 
        style={{
          flex:1,
          padding:"30px"
        }}>


          <h1>
            Offices
          </h1>


          <p 
          style={{
            color:"#666",
            marginBottom:"20px"
          }}>
            Manage university offices
          </p>



          <div
          style={{
            backgroundColor:"#fff",
            padding:"20px",
            borderRadius:"10px",
            boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
          }}>



            <button
            style={{
              padding:"10px 20px",
              backgroundColor:"#2563EB",
              color:"white",
              border:"none",
              borderRadius:"6px",
              cursor:"pointer",
              fontWeight:"bold",
              marginBottom:"20px"
            }}>

              Add New Office

            </button>




            <div
            style={{
              display:"grid",
              gridTemplateColumns:
              "repeat(auto-fill,minmax(300px,1fr))",
              gap:"20px"
            }}>



            {
              offices.map((office)=>(


              <div
              key={office.id}
              style={{
                border:"1px solid #e5e7eb",
                borderRadius:"8px",
                padding:"20px",
                backgroundColor:"#fafafa"
              }}>


                <h3>
                  {office.name}
                </h3>



                <div
                style={{
                  fontSize:"14px",
                  color:"#666"
                }}>


                  <p>
                    <b>Head:</b> 
                    {
                      office.head 
                      ? office.head 
                      : "Not Assigned"
                    }
                  </p>


                  <p>
                    <b>Email:</b>
                    {office.email}
                  </p>


                  <p>
                    <b>Phone:</b>
                    {office.phone}
                  </p>


                  <p>
                    <b>Staff:</b>
                    {office.staff} Members
                  </p>


                  <p>
                    <b>Status:</b>
                    {office.status}
                  </p>


                </div>




                <div
                style={{
                  display:"flex",
                  gap:"10px"
                }}>


                  <button
                  style={{
                    flex:1,
                    padding:"8px",
                    backgroundColor:"#dbeafe",
                    color:"#0369a1",
                    border:"1px solid #bfdbfe",
                    borderRadius:"4px"
                  }}>

                    Edit

                  </button>



                  <button
                  onClick={()=>deleteOffice(office.id)}
                  style={{
                    flex:1,
                    padding:"8px",
                    backgroundColor:"#fee2e2",
                    color:"#991b1b",
                    border:"1px solid #fecaca",
                    borderRadius:"4px"
                  }}>

                    Delete

                  </button>



                </div>


              </div>


              ))
            }



            </div>


          </div>


        </div>


      </div>


    </div>

  );

};


export default AdminOffices;