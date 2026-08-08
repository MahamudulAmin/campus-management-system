import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import { useState } from "react";
import jsPDF from "jspdf";


interface Report {

id:number;
title:string;
description:string;
date:string;
status:string;
count:number;

}



const AdminReports =()=>{


const [search,setSearch]=useState("");

const [selectedReport,setSelectedReport]=useState<Report|null>(null);

const [generatedReport,setGeneratedReport]=useState<Report|null>(null);



const reports:Report[]=[

{
id:1,
title:"User Registration Report",
description:"Monthly statistics on new user registrations",
date:"2026-08-07",
status:"Completed",
count:450
},


{
id:2,
title:"Request Processing Analysis",
description:"Analysis of request submission and completion times",
date:"2026-08-07",
status:"Completed",
count:1250
},


{
id:3,
title:"Office Performance Report",
description:"Performance metrics for university offices",
date:"2026-08-07",
status:"Completed",
count:5
},


{
id:4,
title:"Complaint Analysis",
description:"Complaints filed and resolution status",
date:"2026-08-07",
status:"In Progress",
count:89
}


];



// SEARCH


const filteredReports = reports.filter(

(report)=>

report.title
.toLowerCase()
.includes(search.toLowerCase())

||

report.description
.toLowerCase()
.includes(search.toLowerCase())

);





// GENERATE REPORT


const generateReport=()=>{


if(filteredReports.length===0){

alert("No report found");

return;

}



const report={


id:Date.now(),


title:
search
?
`${search} Generated Report`
:
"All System Reports",


description:
search
?
`Generated report for ${search}`
:
"Complete system report",


date:
new Date()
.toISOString()
.substring(0,10),


status:"Completed",


count:
filteredReports.length



};



setGeneratedReport(report);


};






// DOWNLOAD PDF


const downloadPDF=(report:Report)=>{


const pdf=new jsPDF();



pdf.setFontSize(18);


pdf.text(

"Campus Management System",

20,

20

);



pdf.setFontSize(14);


pdf.text(

report.title,

20,

40

);



pdf.setFontSize(12);


pdf.text(

`Description: ${report.description}`,

20,

60

);


pdf.text(

`Date: ${report.date}`,

20,

80

);



pdf.text(

`Status: ${report.status}`,

20,

100

);



pdf.text(

`Total Records: ${report.count}`,

20,

120

);



pdf.save(

`${report.title}.pdf`

);


};






const statusColor=(status:string)=>{


if(status==="Completed")

return {

background:"#dcfce7",

color:"#166534"

};


return {

background:"#fef3c7",

color:"#92400e"

};


};





return(


<div

style={{

display:"flex",

minHeight:"100vh",

background:"#f4f6f9"

}}

>


<AdminSidebar/>



<div style={{flex:1}}>


<AdminNavbar/>


<div style={{padding:"30px"}}>


<h1>

Reports

</h1>


<p>

View and generate system reports

</p>



<div

style={{

background:"#fff",

padding:"25px",

borderRadius:"12px"

}}

>



<div

style={{

display:"flex",

gap:"10px"

}}

>


<input

placeholder="Search reports..."

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

style={{

padding:"10px",

width:"300px"

}}

/>



<button

onClick={generateReport}

style={buttonBlue}

>

Generate Report

</button>



</div>





<br/>




<table

style={{

width:"100%",

borderCollapse:"collapse"

}}

>


<thead>

<tr>

<th>Title</th>

<th>Description</th>

<th>Date</th>

<th>Status</th>

<th>Action</th>

</tr>


</thead>



<tbody>


{

filteredReports.map(report=>(


<tr key={report.id}>


<td>

{report.title}

</td>


<td>

{report.description}

</td>


<td>

{report.date}

</td>



<td>


<span

style={statusColor(report.status)}

>

{report.status}

</span>


</td>



<td>


<button

onClick={()=>
setSelectedReport(report)
}

>

View

</button>


<button

onClick={()=>
downloadPDF(report)
}

style={{marginLeft:"10px"}}

>

Download

</button>



</td>


</tr>


))


}



</tbody>


</table>



</div>


</div>


</div>






{/* GENERATED REPORT VIEW */}



{

generatedReport &&


<div style={modal}>


<div style={box}>


<h2>

Generated Report

</h2>



<p>

{generatedReport.title}

</p>


<p>

{generatedReport.description}

</p>


<p>

Total:

{generatedReport.count}

</p>



<button

onClick={()=>
downloadPDF(generatedReport)
}

>

Download PDF

</button>



<button

onClick={()=>
setGeneratedReport(null)
}

>

Close

</button>



</div>


</div>


}







{/* VIEW EXISTING REPORT */}



{

selectedReport &&


<div style={modal}>


<div style={box}>


<h2>

{selectedReport.title}

</h2>


<p>

{selectedReport.description}

</p>


<p>

Date:

{selectedReport.date}

</p>


<p>

Status:

{selectedReport.status}

</p>



<button

onClick={()=>
downloadPDF(selectedReport)
}

>

Download PDF

</button>



<button

onClick={()=>
setSelectedReport(null)
}

>

Close

</button>



</div>


</div>


}



</div>


);


};





const buttonBlue={

background:"#2563EB",

color:"#fff",

border:"none",

padding:"10px 20px",

borderRadius:"6px",

cursor:"pointer"

};



const modal={

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


const box={

background:"#fff",

padding:"25px",

borderRadius:"12px",

width:"400px"

};



export default AdminReports;