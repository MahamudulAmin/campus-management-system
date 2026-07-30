import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import { useEffect, useState } from "react";
// import API_URL from "../../config"; 

interface Office {

  id:number;
  name:string;
  email:string;
  phone:string;
  status:string;
  description:string;
  head:string;
  staff_count:number;

}



const AdminOffices = () => {


const [offices,setOffices]=useState<Office[]>([]);

const [showForm,setShowForm]=useState(false);

const [editId,setEditId]=useState<number|null>(null);



const [form,setForm]=useState({

name:"",
email:"",
phone:"",
status:"Active",
description:""

});



const inputStyle={

width:"100%",
padding:"12px",
marginBottom:"12px",
border:"1px solid #ddd",
borderRadius:"8px",
fontSize:"15px"

};



// =========================
// GET OFFICES
// =========================

const fetchOffices=async()=>{

try{

const res=await fetch(
"http://localhost:8000/offices"
);
// const res = await fetch(
//   `${API_URL}/offices`
// );

const data=await res.json();


setOffices(data);


}
catch(err){

console.log(err);

}

};



useEffect(()=>{

fetchOffices();

},[]);





// =========================
// ADD + UPDATE
// =========================

const saveOffice=async()=>{


try{


if(editId!==null){


// UPDATE

await fetch(
`http://localhost:8000/offices/${editId}`,
{
// await fetch(
//   `${API_URL}/offices/${editId}`,
//   {
method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(form)

}

);



}
else{


// ADD

await fetch(
"http://localhost:8000/offices",
{
// await fetch(
//   `${API_URL}/offices`,
//   {

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(form)

}

);


}




setForm({

name:"",
email:"",
phone:"",
status:"Active",
description:""

});


setEditId(null);

setShowForm(false);


fetchOffices();



}
catch(err){

console.log(err);

}


};






// =========================
// DELETE
// =========================

const deleteOffice=async(id:number)=>{


if(!window.confirm("Delete this office?"))
return;



await fetch(
`http://localhost:8000/offices/${id}`,
{
// await fetch(
//   `${API_URL}/offices/${id}`,
//   {

method:"DELETE"

}

);


fetchOffices();


};







return (

<div
style={{
background:"#f4f6f9",
minHeight:"100vh"
}}
>


<AdminNavbar/>


<div
style={{
display:"flex"
}}
>


<AdminSidebar/>




<div
style={{
flex:1,
padding:"30px"
}}
>



<h1>
Office Management
</h1>


<p>
Add, edit and manage university offices
</p>




<button

onClick={()=>{

setEditId(null);

setForm({

name:"",
email:"",
phone:"",
status:"Active",
description:""

});

setShowForm(true);

}}

style={{

background:"#2563eb",
color:"white",
border:"none",
padding:"12px 20px",
borderRadius:"8px",
cursor:"pointer",
marginBottom:"20px"

}}

>

+ Add New Office

</button>






{/* FORM */}

{

showForm &&


<div

style={{

background:"white",
padding:"25px",
borderRadius:"12px",
marginBottom:"25px",
boxShadow:"0 2px 10px #ddd",
maxWidth:"500px"

}}

>



<h2>

{
editId ? "Edit Office" : "Add Office"

}

</h2>



<input

style={inputStyle}

placeholder="Office Name"

value={form.name}

onChange={
e=>setForm({
...form,
name:e.target.value
})
}

/>



<input

style={inputStyle}

placeholder="Email"

value={form.email}

onChange={
e=>setForm({
...form,
email:e.target.value
})
}

/>



<input

style={inputStyle}

placeholder="Phone"

value={form.phone}

onChange={
e=>setForm({
...form,
phone:e.target.value
})
}

/>




<textarea

style={inputStyle}

placeholder="Description"

value={form.description}

onChange={
e=>setForm({
...form,
description:e.target.value
})
}

/>




<button

onClick={saveOffice}

style={{

background:"#16a34a",
color:"white",
padding:"12px 25px",
border:"none",
borderRadius:"8px",
marginRight:"10px"

}}

>

Save

</button>




<button

onClick={()=>setShowForm(false)}

style={{

padding:"12px 25px",
borderRadius:"8px"

}}

>

Cancel

</button>



</div>


}








{/* OFFICE CARDS */}



<div

style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fill,minmax(320px,1fr))",

gap:"20px"

}}

>



{

offices.map(office=>(


<div

key={office.id}

style={{

background:"white",

padding:"20px",

borderRadius:"12px",

boxShadow:"0 2px 8px #ddd"

}}

>



<h2>

{office.name}

</h2>



<p>
<b>Head:</b> {office.head || "Not Assigned"}
</p>


<p>
<b>Email:</b> {office.email}
</p>


<p>
<b>Phone:</b> {office.phone}
</p>


<p>
<b>Staff:</b> {office.staff_count || 0}
</p>


<p>
<b>Status:</b> {office.status}
</p>




<div

style={{

display:"flex",
gap:"10px",
marginTop:"20px"

}}

>



<button

onClick={()=>{


setEditId(office.id);


setForm({

name:office.name,

email:office.email,

phone:office.phone,

status:office.status,

description:office.description

});


setShowForm(true);


window.scrollTo({

top:0,

behavior:"smooth"

});


}}


style={{

flex:1,
background:"#fbbf24",
border:"none",
padding:"10px",
borderRadius:"8px"

}}

>

Edit

</button>





<button

onClick={()=>deleteOffice(office.id)}

style={{

flex:1,

background:"#ef4444",

color:"white",

border:"none",

padding:"10px",

borderRadius:"8px"

}}

>

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


);


};


export default AdminOffices;