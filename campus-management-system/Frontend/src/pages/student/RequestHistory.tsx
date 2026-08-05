import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useEffect, useState } from "react";
import { getRequests } from "../../utils/requestStorage";
import type { RequestData } from "../../utils/requestStorage";

const RequestHistory = () => {


  const [requests, setRequests] = useState<RequestData[]>([]);



  useEffect(() => {

    const loadData = () => {

      const data = getRequests();

      setRequests(data);

    };


    loadData();


  }, []);





  const getStatusColor = (status: string) => {

    if (status === "Approved") {
      return "#27ae60";
    }

    if (status === "Pending") {
      return "#f39c12";
    }

    if (status === "Processing") {
      return "#3498db";
    }

    if (status === "Rejected") {
      return "#e74c3c";
    }

    return "#95a5a6";

  };






  const handleCancel = (id: string) => {


    const updated = requests.filter(
      (item) => item.id !== id
    );


    localStorage.setItem(
      "requests",
      JSON.stringify(updated)
    );


    setRequests(updated);


  };






  return (

    <div
      style={{
        minHeight:"100vh",
        background:"#f4f6f9"
      }}
    >


      <Navbar />


      <div
        style={{
          display:"flex"
        }}
      >


        <Sidebar />



        <main
          style={{
            flex:1,
            padding:"30px"
          }}
        >


          <h1>
            Request History
          </h1>



          <div
            style={{
              background:"#fff",
              padding:"20px",
              borderRadius:"10px",
              boxShadow:"0 2px 8px rgba(0,0,0,.1)",
              overflowX:"auto"
            }}
          >


          {
            requests.length === 0 ? (


              <h3
                style={{
                  textAlign:"center",
                  color:"#777"
                }}
              >
                No requests submitted yet.
              </h3>


            ) : (


              <table
                style={{
                  width:"100%",
                  borderCollapse:"collapse"
                }}
              >


                <thead>

                  <tr
                    style={{
                      background:"#eee"
                    }}
                  >

                    <th>ID</th>
                    <th>Office</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>

                  </tr>

                </thead>



                <tbody>


                {
                  requests.map((request)=>(


                    <tr
                      key={request.id}
                      style={{
                        borderBottom:"1px solid #ddd"
                      }}
                    >


                      <td>
                        {request.id}
                      </td>


                      <td>
                        {request.office}
                      </td>


                      <td>
                        {request.requestType}
                      </td>


                      <td>
                        {request.description}
                      </td>


                      <td>
                        {request.date}
                      </td>



                      <td>

                        <span
                          style={{
                            background:getStatusColor(request.status),
                            color:"#fff",
                            padding:"5px 12px",
                            borderRadius:"20px"
                          }}
                        >

                          {request.status}

                        </span>

                      </td>



                      <td>


                      {
                        request.status === "Pending" && (

                          <button
                            onClick={() =>
                              handleCancel(request.id)
                            }
                            style={{
                              background:"#e74c3c",
                              color:"white",
                              border:"none",
                              padding:"6px 12px",
                              borderRadius:"5px",
                              cursor:"pointer"
                            }}
                          >

                            Cancel

                          </button>

                        )
                      }


                      </td>


                    </tr>


                  ))
                }


                </tbody>


              </table>


            )
          }


          </div>


        </main>


      </div>


    </div>

  );

};


export default RequestHistory;