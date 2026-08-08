import { useEffect, useState } from "react";

import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";

import API_URL from "../../config";


interface User {

    id:number;
    name:string;
    email:string;
    role:string;
    department:string;
    status:string;
    joinDate:string;

}



const AdminUsers = () => {


const emptyUser = {

    name:"",
    email:"",
    role:"Office Staff",
    department:"Finance Office",
    status:"Active"

};



const [users,setUsers] = useState<User[]>([]);


const [search,setSearch] = useState("");


const [showAddModal,setShowAddModal] = useState(false);


const [showEditModal,setShowEditModal] = useState(false);


const [saving,setSaving] = useState(false);



const [newUser,setNewUser] = useState(emptyUser);



const [selectedUser,setSelectedUser] = useState<User>({

    id:0,
    name:"",
    email:"",
    role:"",
    department:"",
    status:"",
    joinDate:""

});





// =============================
// LOAD USERS
// =============================


const fetchUsers = async()=>{


try{


const res = await fetch(
`${API_URL}/users`
);



const data = await res.json();


setUsers(data);



}

catch(error){

console.log(error);

}


};





useEffect(()=>{


fetchUsers();


},[]);






// =============================
// ADD USER
// =============================


const addUser = async()=>{


if(saving)
return;



if(
!newUser.name ||
!newUser.email
){

alert("Fill required fields");

return;

}



try{


setSaving(true);



const response = await fetch(

`${API_URL}/users`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(newUser)

}

);



if(!response.ok){

throw new Error(
"Add failed"
);

}



await fetchUsers();



setNewUser(emptyUser);


setShowAddModal(false);



}

catch(error){

console.log(error);

}

finally{


setSaving(false);


}


};







// =============================
// OPEN EDIT
// =============================


const openEdit = (user:User)=>{


setSelectedUser({

...user

});



setShowEditModal(true);


};









// =============================
// UPDATE USER
// =============================


const updateUser = async()=>{


try{


setSaving(true);



const response = await fetch(

`${API_URL}/users/${selectedUser.id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(selectedUser)

}

);



if(!response.ok){

throw new Error(
"Update failed"
);

}



await fetchUsers();



setShowEditModal(false);



}

catch(error){

console.log(error);

}

finally{


setSaving(false);


}


};







// =============================
// DELETE USER
// =============================


const deleteUser = async(id:number)=>{


if(
!window.confirm(
"Delete this user?"
)

)

return;



await fetch(

`${API_URL}/users/${id}`,

{

method:"DELETE"

}

);



fetchUsers();


};








const filteredUsers = users.filter(

(user)=>

user.name
.toLowerCase()
.includes(
search.toLowerCase()
)

||

user.email
.toLowerCase()
.includes(
search.toLowerCase()
)

);





return (

<div style={layoutStyle}>


<AdminSidebar/>




<div style={contentStyle}>


<AdminNavbar/>




<div style={pageStyle}>


<div style={headerStyle}>


<div>

<h1>
User Management
</h1>


<p>
Manage administrators and office staff
</p>


</div>



<button

style={addButton}

onClick={()=>setShowAddModal(true)}

>

+ Add User

</button>



</div>





<div style={cardStyle}>


<input

style={searchStyle}

placeholder="Search name or email"

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

/>




<table style={tableStyle}>


<thead>

<tr>


<th style={thStyle}>
Name
</th>


<th style={thStyle}>
Email
</th>


<th style={thStyle}>
Role
</th>


<th style={thStyle}>
Department
</th>


<th style={thStyle}>
Actions
</th>


</tr>

</thead>

<tbody>
  {

filteredUsers.map(user=>(

<tr key={user.id}>


<td style={tdStyle}>
{user.name}
</td>


<td style={tdStyle}>
{user.email}
</td>


<td style={tdStyle}>
{user.role}
</td>


<td style={tdStyle}>
{user.department}
</td>


<td style={tdStyle}>


<button

style={editButton}

onClick={()=>openEdit(user)}

>

Edit

</button>



<button

style={deleteButton}

onClick={()=>deleteUser(user.id)}

>

Delete

</button>


</td>


</tr>

))


}


</tbody>


</table>


</div>







{/* ===========================
ADD USER MODAL
=========================== */}



{

showAddModal &&

(


<div style={modalOverlay}>


<div style={modalBox}>


<h2>
Add User
</h2>



<input

style={inputStyle}

placeholder="Name"

value={newUser.name}

onChange={(e)=>

setNewUser({

...newUser,

name:e.target.value

})

}

/>



<input

style={inputStyle}

placeholder="Email"

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
Office Staff
</option>

<option>
Officer
</option>

<option>
Department Head
</option>

<option>
Admin
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

style={cancelButton}

onClick={()=>setShowAddModal(false)}

>

Cancel

</button>



<button

style={saveButton}

disabled={saving}

onClick={addUser}

>

{

saving

?

"Adding..."

:

"Add User"

}


</button>


</div>



</div>


</div>


)

}









{/* ===========================
EDIT USER MODAL
=========================== */}



{

showEditModal &&

(


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





<select

style={inputStyle}

value={selectedUser.role}

onChange={(e)=>

setSelectedUser({

...selectedUser,

role:e.target.value

})

}

>


<option>
Office Staff
</option>

<option>
Officer
</option>

<option>
Department Head
</option>

<option>
Admin
</option>


</select>







<select

style={inputStyle}

value={selectedUser.department}

onChange={(e)=>

setSelectedUser({

...selectedUser,

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






<select

style={inputStyle}

value={selectedUser.status}

onChange={(e)=>

setSelectedUser({

...selectedUser,

status:e.target.value

})

}

>


<option>
Active
</option>


<option>
Inactive
</option>


</select>






<div style={modalButtons}>


<button

style={cancelButton}

onClick={()=>setShowEditModal(false)}

>

Cancel

</button>



<button

style={saveButton}

disabled={saving}

onClick={updateUser}

>

{

saving

?

"Saving..."

:

"Save Changes"

}


</button>


</div>



</div>


</div>


)

}



</div>


</div>


</div>


);

};






// =============================
// STYLES
// =============================



const layoutStyle={

display:"flex",

minHeight:"100vh",

background:"#F1F5F9"

};



const contentStyle={

flex:1

};



const pageStyle={

padding:"30px"

};



const headerStyle={

display:"flex",

justifyContent:"space-between",

alignItems:"center",

marginBottom:"25px"

};



const cardStyle={

background:"#fff",

padding:"25px",

borderRadius:"12px",

boxShadow:
"0 5px 15px rgba(0,0,0,.08)"

};



const tableStyle={

width:"100%",

borderCollapse:"collapse" as const

};



const thStyle={

padding:"12px",

textAlign:"left" as const

};



const tdStyle={

padding:"14px",

borderBottom:"1px solid #ddd"

};



const searchStyle={

width:"320px",

padding:"10px",

marginBottom:"20px"

};



const inputStyle={

width:"100%",

padding:"10px",

marginBottom:"12px"

};



const addButton={

background:"#2563EB",

color:"white",

border:"none",

padding:"12px 20px",

borderRadius:"8px",

cursor:"pointer"

};



const editButton={

background:"#2563EB",

color:"white",

border:"none",

padding:"7px 12px",

borderRadius:"6px",

marginRight:"8px"

};



const deleteButton={

background:"#DC2626",

color:"white",

border:"none",

padding:"7px 12px",

borderRadius:"6px"

};



const saveButton={

background:"#2563EB",

color:"white",

border:"none",

padding:"10px 18px",

borderRadius:"8px"

};



const cancelButton={

background:"#E5E7EB",

border:"none",

padding:"10px 18px",

borderRadius:"8px"

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

alignItems:"center",

zIndex:1000

};



const modalBox={

background:"white",

width:"420px",

padding:"25px",

borderRadius:"12px"

};



const modalButtons={

display:"flex",

justifyContent:"flex-end",

gap:"10px"

};




export default AdminUsers;