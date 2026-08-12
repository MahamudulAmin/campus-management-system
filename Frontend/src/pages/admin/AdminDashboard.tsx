import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/AdminDashboard.css";

import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import SummaryCard from "../../components/ASSummaryCard";

import API_URL from "../../config";


const AdminDashboard = () => {


  const navigate = useNavigate();


  const [stats, setStats] = useState({

    users: 0,
    offices: 0,
    requests: 0,
    complaints: 0,
    completed: 0,
    pending: 0,

  });



  useEffect(() => {


    const loadDashboard = async () => {


      try {


        const usersResponse =
          await fetch(`${API_URL}/users/`);


        const officesResponse =
          await fetch(`${API_URL}/offices/`);


        const complaintsResponse =
          await fetch(`${API_URL}/complaints/`);



        const users =
          await usersResponse.json();


        const offices =
          await officesResponse.json();


        const complaints =
          await complaintsResponse.json();



        const completed =
          complaints.filter(
            (item:any)=>
              item.status === "Completed"
          ).length;



        const pending =
          complaints.filter(
            (item:any)=>
              item.status === "Pending"
          ).length;



        setStats({

          users: users.length,

          offices: offices.length,

          requests: 0,

          complaints: complaints.length,

          completed,

          pending,

        });



      }
      catch(error){

        console.log(
          "Dashboard loading error:",
          error
        );

      }


    };


    loadDashboard();


  },[]);




  const activities = [

    {
      id:1,
      time:"09:30 AM",
      activity:"New student account created",
      type:"User"
    },

    {
      id:2,
      time:"10:15 AM",
      activity:"Finance Office updated",
      type:"Office"
    },

    {
      id:3,
      time:"11:20 AM",
      activity:"Request approved",
      type:"Request"
    },

    {
      id:4,
      time:"12:05 PM",
      activity:"Monthly report generated",
      type:"Report"
    },

  ];




  const quickActions=[

    {
      title:"Manage Users",
      color:"#2563EB",
      path:"/admin/users",
      icon:"👥"
    },

    {
      title:"Manage Offices",
      color:"#10B981",
      path:"/admin/offices",
      icon:"🏢"
    },

    {
      title:"Activities",
      color:"#F59E0B",
      path:"/admin/activities",
      icon:"📋"
    },

    {
      title:"Reports",
      color:"#8B5CF6",
      path:"/admin/reports",
      icon:"📈"
    },

  ];



return (

<div

style={{

display:"flex",

minHeight:"100vh",

background:"#EEF2F7"

}}

>


{/* Sidebar */}

<AdminSidebar />




{/* Main Area */}

<div

style={{

flex:1,

display:"flex",

flexDirection:"column"

}}

>



<AdminNavbar />




<main

style={{

padding:"30px",

overflowY:"auto"

}}

>



<h1

style={{

fontSize:"34px",

color:"#1E293B"

}}

>

Dashboard

</h1>



<p

style={{

color:"#64748B"

}}

>

Welcome back Administrator 👋

</p>




{/* Cards */}


<div

style={{

display:"grid",

gridTemplateColumns:
"repeat(auto-fit,minmax(220px,1fr))",

gap:"20px",

marginTop:"30px"

}}

>


<SummaryCard

title="Total Users"

value={stats.users}

color="#2563EB"

/>



<SummaryCard

title="Offices"

value={stats.offices}

color="#10B981"

/>



<SummaryCard

title="Requests"

value={stats.requests}

color="#F59E0B"

/>



<SummaryCard

title="Completed"

value={stats.completed}

color="#22C55E"

/>



<SummaryCard

title="Complaints"

value={stats.complaints}

color="#EF4444"

/>


</div>





<div

style={{

display:"grid",

gridTemplateColumns:"2fr 1fr",

gap:"25px",

marginTop:"30px"

}}

>



{/* Activities */}


<div

style={{

background:"#fff",

padding:"25px",

borderRadius:"12px"

}}

>


<h2>
Recent Activities
</h2>



<table

style={{

width:"100%",

borderCollapse:"collapse"

}}

>


<thead>

<tr>

<th style={tableHead}>
Time
</th>


<th style={tableHead}>
Activity
</th>


<th style={tableHead}>
Type
</th>


</tr>

</thead>



<tbody>


{activities.map(item=>(


<tr key={item.id}>


<td style={tableCell}>
{item.time}
</td>


<td style={tableCell}>
{item.activity}
</td>


<td style={tableCell}>
{item.type}
</td>


</tr>


))}


</tbody>


</table>


</div>






{/* Right Side */}


<div>


<div

style={{

background:"#fff",

padding:"25px",

borderRadius:"12px"

}}

>


<h2>
Quick Actions
</h2>



{

quickActions.map(action=>(


<button

key={action.title}

onClick={()=>navigate(action.path)}

style={{

...actionButton,

background:
action.color

}}

>


<span>
{action.icon}
</span>


<span>
{action.title}
</span>


</button>


))


}



</div>



</div>



</div>



</main>


</div>


</div>


);


};




const tableHead:React.CSSProperties={

padding:"12px",

textAlign:"left",

borderBottom:
"1px solid #ddd"

};



const tableCell:React.CSSProperties={

padding:"12px",

borderBottom:
"1px solid #ddd"

};



const actionButton:React.CSSProperties={

width:"100%",

padding:"14px",

marginBottom:"15px",

border:"none",

borderRadius:"8px",

color:"white",

cursor:"pointer",

display:"flex",

justifyContent:"space-between",

fontWeight:600

};



export default AdminDashboard;