const API="http://127.0.0.1:8000";


export async function getOffices(){

const res =
await fetch(`${API}/offices/`);

return res.json();

}



export async function addOffice(data:any){

const res =
await fetch(
`${API}/offices/`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
);

return res.json();

}



export async function updateOffice(
id:number,
data:any
){

const res =
await fetch(
`${API}/offices/${id}`,
{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
);

return res.json();

}



export async function deleteOffice(
id:number
){

return fetch(
`${API}/offices/${id}`,
{
method:"DELETE"
}
);

}