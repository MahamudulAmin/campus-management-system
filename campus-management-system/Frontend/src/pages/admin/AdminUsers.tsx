import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";


interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  joinDate: string;
}


const API_URL = "http://127.0.0.1:8000";


const AdminUsers = () => {


  const [users, setUsers] = useState<User[]>([]);


  const [search, setSearch] = useState("");


  const [showAddModal, setShowAddModal] = useState(false);


  const [showEditModal, setShowEditModal] = useState(false);



  const [newUser, setNewUser] = useState({

    name: "",

    email: "",

    role: "Office Staff",

    department: "Finance Office",

    status: "Active",

  });



  const [selectedUser, setSelectedUser] = useState<User>({

    id: 0,

    name: "",

    email: "",

    role: "",

    department: "",

    status: "",

    joinDate: "",

  });



  // =========================
  // GET USERS FROM BACKEND
  // =========================

  const fetchUsers = async () => {

    try {

      const response = await fetch(
        `${API_URL}/users`
      );


      const data = await response.json();


      setUsers(data);


    } catch(error){

      console.log(
        "Cannot load users",
        error
      );

    }

  };



  useEffect(()=>{

    fetchUsers();

  },[]);





  // =========================
  // ADD USER
  // =========================

  const addUser = async()=>{


    if(!newUser.name || !newUser.email){

      alert("Please fill all fields");

      return;

    }



    try{


      await fetch(
        `${API_URL}/users`,
        {

          method:"POST",

          headers:{

            "Content-Type":"application/json"

          },


          body:JSON.stringify(newUser)

        }
      );



      fetchUsers();



      setShowAddModal(false);



      setNewUser({

        name:"",

        email:"",

        role:"Office Staff",

        department:"Finance Office",

        status:"Active",

      });



    }catch(error){

      console.log(error);

    }

  };





  // =========================
  // DELETE USER
  // =========================

  const deleteUser = async(id:number)=>{


    if(!window.confirm("Delete this user?")){

      return;

    }



    try{


      await fetch(
        `${API_URL}/users/${id}`,
        {

          method:"DELETE"

        }
      );



      fetchUsers();



    }catch(error){

      console.log(error);

    }


  };





  // =========================
  // EDIT USER OPEN
  // =========================


  const editUser = (user:User)=>{


    setSelectedUser(user);

    setShowEditModal(true);


  };





  // =========================
  // UPDATE USER
  // =========================


  const saveEditedUser = async()=>{


    try{


      await fetch(
        `${API_URL}/users/${selectedUser.id}`,
        {

          method:"PUT",

          headers:{

            "Content-Type":"application/json"

          },


          body:JSON.stringify(selectedUser)

        }
      );



      fetchUsers();


      setShowEditModal(false);



    }catch(error){

      console.log(error);

    }


  };





  const filteredUsers = users.filter(

    (user)=>

      user.name
      .toLowerCase()
      .includes(search.toLowerCase())

      ||

      user.email
      .toLowerCase()
      .includes(search.toLowerCase())

  );





  const getRoleColor=(role:string)=>{

    switch(role){

      case "Admin":

        return {
          bg:"#FEE2E2",
          color:"#B91C1C"
        };


      case "Office Staff":

        return {
          bg:"#DBEAFE",
          color:"#1D4ED8"
        };


      default:

        return {
          bg:"#DCFCE7",
          color:"#15803D"
        };

    }

  };





  const getStatusColor=(status:string)=>{


    return status==="Active"

      ? {
          bg:"#DCFCE7",
          color:"#15803D"
        }

      : {
          bg:"#F3F4F6",
          color:"#6B7280"
        };


  };





  return (

    <div
      style={{
        display:"flex",
        minHeight:"100vh",
        background:"#F1F5F9"
      }}
    >

      <AdminSidebar/>


      <div
        style={{
          flex:1,
          display:"flex",
          flexDirection:"column"
        }}
      >

        <AdminNavbar/>


        <div style={{padding:"30px"}}>


          <div
            style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center",
              marginBottom:"25px"
            }}
          >

            <div>

              <h1>
                User Management
              </h1>


              <p
                style={{
                  color:"#64748B"
                }}
              >
                Manage administrators and office staff
              </p>

            </div>


            <button
              onClick={()=>setShowAddModal(true)}
              style={{
                background:"#2563EB",
                color:"#fff",
                border:"none",
                padding:"12px 20px",
                borderRadius:"8px",
                cursor:"pointer"
              }}
            >
              + Add User
            </button>


          </div>          <div
            style={{
              background:"#fff",
              padding:"25px",
              borderRadius:"12px",
              boxShadow:"0 5px 15px rgba(0,0,0,.08)"
            }}
          >

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              style={inputSearchStyle}
            />


            <table
              style={{
                width:"100%",
                borderCollapse:"collapse"
              }}
            >

              <thead>

                <tr
                  style={{
                    background:"#F8FAFC"
                  }}
                >

                  <th style={headStyle}>Name</th>
                  <th style={headStyle}>Email</th>
                  <th style={headStyle}>Role</th>
                  <th style={headStyle}>Department</th>
                  <th style={headStyle}>Status</th>
                  <th style={headStyle}>Join Date</th>
                  <th style={headStyle}>Actions</th>

                </tr>

              </thead>


              <tbody>


              {filteredUsers.map((user)=>(

                <tr
                  key={user.id}
                  style={{
                    borderBottom:"1px solid #E2E8F0"
                  }}
                >


                  <td style={cellStyle}>
                    {user.name}
                  </td>


                  <td style={cellStyle}>
                    {user.email}
                  </td>


                  <td style={cellStyle}>

                    <span
                      style={{
                        padding:"6px 12px",
                        borderRadius:"20px",
                        background:getRoleColor(user.role).bg,
                        color:getRoleColor(user.role).color
                      }}
                    >
                      {user.role}
                    </span>

                  </td>


                  <td style={cellStyle}>
                    {user.department}
                  </td>


                  <td style={cellStyle}>

                    <span
                      style={{
                        padding:"6px 12px",
                        borderRadius:"20px",
                        background:getStatusColor(user.status).bg,
                        color:getStatusColor(user.status).color
                      }}
                    >
                      {user.status}
                    </span>

                  </td>


                  <td style={cellStyle}>
                    {user.joinDate}
                  </td>


                  <td style={cellStyle}>

                    <button
                      onClick={()=>editUser(user)}
                      style={editButton}
                    >
                      Edit
                    </button>


                    <button
                      onClick={()=>deleteUser(user.id)}
                      style={deleteButton}
                    >
                      Delete
                    </button>

                  </td>


                </tr>


              ))}


              </tbody>


            </table>


          </div>





          {/* ADD USER MODAL */}


          {showAddModal && (

            <div style={modalOverlay}>

              <div style={modalBox}>


                <h2>
                  Add New User
                </h2>


                <input
                  placeholder="Full Name"
                  style={inputStyle}
                  value={newUser.name}
                  onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      name:e.target.value
                    })
                  }
                />



                <input
                  placeholder="Email"
                  style={inputStyle}
                  value={newUser.email}
                  onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      email:e.target.value
                    })
                  }
                />



                <select
                  style={inputStyle}
                  value={newUser.role}
                  onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      role:e.target.value
                    })
                  }
                >

                  <option>
                    SOD
                  </option>

                  <option>
                    Office Staff
                  </option>

                  <option>
                    Officer
                  </option>

                   <option>
                    Department Head
                  </option>


                </select>



                <select
                  style={inputStyle}
                  value={newUser.department}
                  onChange={(e)=>
                    setNewUser({
                      ...newUser,
                      department:e.target.value
                    })
                  }
                >

                  <option>
                    Finance Office
                  </option>

                  <option>
                    Admission Office
                  </option>

                  <option>
                    Registrar Office
                  </option>

                  <option>
                    IT Department
                  </option>


                </select>



                <div style={modalButtons}>


                  <button
                    onClick={()=>
                      setShowAddModal(false)
                    }
                    style={cancelButton}
                  >
                    Cancel
                  </button>



                  <button
                    onClick={addUser}
                    style={saveButton}
                  >
                    Add User
                  </button>


                </div>


              </div>

            </div>

          )}






          {/* EDIT MODAL */}


          {showEditModal && (

            <div style={modalOverlay}>


              <div style={modalBox}>


                <h2>
                  Edit User
                </h2>



                <input
                  style={inputStyle}
                  value={selectedUser.name}
                  onChange={(e)=>
                    setSelectedUser({
                      ...selectedUser,
                      name:e.target.value
                    })
                  }
                />



                <input
                  style={inputStyle}
                  value={selectedUser.email}
                  onChange={(e)=>
                    setSelectedUser({
                      ...selectedUser,
                      email:e.target.value
                    })
                  }
                />



                <input
                  style={inputStyle}
                  value={selectedUser.department}
                  onChange={(e)=>
                    setSelectedUser({
                      ...selectedUser,
                      department:e.target.value
                    })
                  }
                />



                <div style={modalButtons}>


                  <button
                    onClick={()=>
                      setShowEditModal(false)
                    }
                    style={cancelButton}
                  >
                    Cancel
                  </button>


                  <button
                    onClick={saveEditedUser}
                    style={saveButton}
                  >
                    Save Changes
                  </button>


                </div>


              </div>


            </div>

          )}



        </div>

      </div>

    </div>

  );

};



const headStyle={
  padding:"12px",
  textAlign:"left" as const,
  color:"#475569"
};


const cellStyle={
  padding:"14px",
  color:"#334155"
};


const inputSearchStyle={
  width:"320px",
  padding:"10px",
  marginBottom:"20px",
  border:"1px solid #CBD5E1",
  borderRadius:"8px"
};


const inputStyle={
  width:"100%",
  padding:"10px",
  marginBottom:"12px",
  border:"1px solid #CBD5E1",
  borderRadius:"8px",
  boxSizing:"border-box" as const
};


const modalOverlay={
  position:"fixed" as const,
  top:0,
  left:0,
  width:"100%",
  height:"100%",
  background:"rgba(0,0,0,.4)",
  display:"flex",
  justifyContent:"center",
  alignItems:"center"
};


const modalBox={
  background:"#fff",
  width:"420px",
  padding:"25px",
  borderRadius:"12px"
};


const modalButtons={
  display:"flex",
  justifyContent:"flex-end",
  gap:"10px"
};


const editButton={
  background:"#2563EB",
  color:"#fff",
  border:"none",
  padding:"7px 12px",
  borderRadius:"6px",
  cursor:"pointer",
  marginRight:"8px"
};


const deleteButton={
  background:"#DC2626",
  color:"#fff",
  border:"none",
  padding:"7px 12px",
  borderRadius:"6px",
  cursor:"pointer"
};


const saveButton={
  background:"#2563EB",
  color:"#fff",
  border:"none",
  padding:"10px 18px",
  borderRadius:"8px",
  cursor:"pointer"
};


const cancelButton={
  background:"#E5E7EB",
  color:"#111827",
  border:"none",
  padding:"10px 18px",
  borderRadius:"8px",
  cursor:"pointer"
};


export default AdminUsers;