const CLIENT_ID="259423355709-81s2fclv800ps73gqm8vb7t4vkcvct81.apps.googleusercontent.com";

let token=null;
let calendars=[];
let events=[];
let weekStart=null;
let view="week";
let big=false;

/* LOGIN */

function login(){

const url="https://accounts.google.com/o/oauth2/v2/auth";

const params={
client_id:CLIENT_ID,
redirect_uri:window.location.origin,
response_type:"token",
scope:"https://www.googleapis.com/auth/calendar.readonly"
};

window.location=url+"?"+new URLSearchParams(params);

}

function logout(){

localStorage.removeItem("token");
location.reload();

}

function parseToken(){

const hash=window.location.hash.substring(1);
const params=new URLSearchParams(hash);
const t=params.get("access_token");

if(t){
localStorage.setItem("token",t);
window.location.hash="";
}

token=localStorage.getItem("token");

if(token) init();

}

/* INIT */

async function init(){

weekStart=startOfWeek(new Date());

await loadCalendars();

renderFilters();

await loadEvents();

render();

}

/* LOAD CALENDARS */

async function loadCalendars(){

const res=await fetch(
"https://www.googleapis.com/calendar/v3/users/me/calendarList",
{headers:{Authorization:"Bearer "+token}}
);

const data=await res.json();

calendars=data.items.filter(c=>

!c.summary.includes("Weeknummers") &&
!c.summary.includes("Weather") &&
!c.summary.includes("agenda website") &&
!c.summary.includes("Agenda")

);

}

/* LOAD EVENTS */

async function loadEvents(){

events=[];

const start=weekStart;
const end=new Date(start);
end.setDate(end.getDate()+7);

for(const cal of calendars){

let page=null;

do{

const res=await fetch(
`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?singleEvents=true&orderBy=startTime&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&maxResults=250${page?"&pageToken="+page:""}`,
{headers:{Authorization:"Bearer "+token}}
);

const data=await res.json();

if(data.items){

data.items.forEach(e=>{

e.color=cal.backgroundColor;
e.calendar=cal.summary;

events.push(e);

});

}

page=data.nextPageToken;

}while(page);

}

}

/* FILTERS */

function renderFilters(){

const div=document.getElementById("filters");
div.innerHTML="";

calendars.forEach(c=>{

const id="f"+btoa(c.id);

div.innerHTML+=`
<label>
<input type="checkbox" id="${id}" value="${c.summary}" checked onchange="render()">
${c.summary}
</label>
`;

});

div.innerHTML+=`
<button onclick="selectAll()">Alles</button>
<button onclick="selectNone()">Geen</button>
`;

}

function activeCalendars(){

return [...document.querySelectorAll("#filters input:checked")]
.map(e=>e.value);

}

function selectAll(){
document.querySelectorAll("#filters input").forEach(e=>e.checked=true);
render();
}

function selectNone(){
document.querySelectorAll("#filters input").forEach(e=>e.checked=false);
render();
}

/* ICON ENGINE PRO X */

function iconFor(event){

const text=(event.summary||"").toLowerCase();
const location=(event.location||"").toLowerCase();

if(location.includes("orelia puthof")) return "nurse";

if(location.includes("kapelstraat 73")) return "medical-bag";

if(text.includes("bus")) return "bus";

if(text.includes("slapen")) return "sleep";

if(text.includes("rijden")) return "car";

if(text.includes("voetbal")) return "soccer";

if(text.includes("zwem")) return "swim";

if(text.includes("dokter")) return "stethoscope";

if(text.includes("tandarts")) return "tooth";

if(text.includes("school")) return "school";

if(text.includes("werk")) return "briefcase";

if(text.includes("verjaardag")) return "cake";

if(text.includes("muziek")) return "music";

if(text.includes("eten")) return "silverware";

if(text.includes("beugel")) return "emoticon-excited";

if(text.includes("rita oppas thuis")) return "home-heart";

if(text.includes("loriana")) return "home-heart";

if(text.includes("rita oppas bij haar")) return "home-export-outline";

return "calendar";

}

/* RENDER */

function render(){

if(view==="week") renderWeek();
else renderDay();

}

function renderWeek(){

const active=activeCalendars();

const container=document.getElementById("agenda");

container.className="week";

container.innerHTML="";

for(let i=0;i<7;i++){

const d=new Date(weekStart);
d.setDate(d.getDate()+i);

const col=document.createElement("div");
col.className="day";

col.innerHTML=`<div class="daytitle">
${d.toLocaleDateString("nl-BE",{weekday:"long"})}
${d.getDate()}/${d.getMonth()+1}
</div>`;

const timeline=document.createElement("div");
timeline.className="timeline";

for(let h=7;h<=23;h++){

const hr=document.createElement("div");
hr.className="hour";
hr.style.top=((h-7)*60)+"px";
hr.innerText=h+":00";

timeline.appendChild(hr);

}

const dayEvents=events
.filter(e=>active.includes(e.calendar))
.filter(e=>{
const date=new Date(e.start.dateTime||e.start.date);
return date.toDateString()===d.toDateString();
})
.sort((a,b)=>new Date(a.start.dateTime)-new Date(b.start.dateTime));

dayEvents.forEach(e=>{

const start=new Date(e.start.dateTime||e.start.date);
const end=new Date(e.end.dateTime||e.end.date);

const block=document.createElement("div");
block.className="event";

block.style.background=e.color;

const top=((start.getHours()-7)*60)+start.getMinutes();
const height=((end-start)/60000);

block.style.top=top+"px";
block.style.height=height+"px";

const icon=iconFor(e);

block.innerHTML=`
<img src="https://api.iconify.design/mdi/${icon}.svg?color=white">
${e.summary}
`;

timeline.appendChild(block);

});

col.appendChild(timeline);
container.appendChild(col);

}

}

/* WEEK NAV */

function startOfWeek(d){

const date=new Date(d);

const day=date.getDay();
const diff=date.getDate()-day+1;

return new Date(date.setDate(diff));

}

function nextWeek(){

weekStart.setDate(weekStart.getDate()+7);
loadEvents().then(render);

}

function previousWeek(){

weekStart.setDate(weekStart.getDate()-7);
loadEvents().then(render);

}

/* VIEW */

function weekView(){view="week";render();}
function dayView(){view="day";render();}

/* BIG */

function toggleBig(){

big=!big;
document.body.classList.toggle("big");

}

parseToken();
