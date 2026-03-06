const CLIENT_ID="259423355709-81s2fclv800ps73gqm8vb7t4vkcvct81.apps.googleusercontent.com";

let accessToken=null;
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
scope:"https://www.googleapis.com/auth/calendar.readonly",
include_granted_scopes:"true"
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
const token=params.get("access_token");

if(token){
localStorage.setItem("token",token);
window.location.hash="";
}

accessToken=localStorage.getItem("token");

if(accessToken){
init();
}

}


/* INIT */

async function init(){

weekStart=startOfWeek(new Date());

await loadCalendars();

renderFilters();

await loadEvents();

render();

}


/* CALENDARS */

async function loadCalendars(){

const res=await fetch(
"https://www.googleapis.com/calendar/v3/users/me/calendarList",
{headers:{Authorization:"Bearer "+accessToken}}
);

const data=await res.json();

calendars=data.items.filter(c=>

!c.summary.includes("Weeknummers") &&
!c.summary.includes("Weather") &&
!c.summary.includes("agenda website") &&
!c.summary.includes("Agenda")

);

}


/* EVENTS */

async function loadEvents(){

events=[];

const start=weekStart;
const end=new Date(start);
end.setDate(end.getDate()+7);

for(const cal of calendars){

let pageToken=null;

do{

const res=await fetch(
`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?singleEvents=true&orderBy=startTime&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&maxResults=250${pageToken?"&pageToken="+pageToken:""}`,
{headers:{Authorization:"Bearer "+accessToken}}
);

const data=await res.json();

if(data.items){

data.items.forEach(e=>{
e.color=cal.backgroundColor;
e.calendar=cal.summary;
events.push(e);
});

}

pageToken=data.nextPageToken;

}while(pageToken);

}

}


/* FILTERS */

function renderFilters(){

const div=document.getElementById("filters");
div.innerHTML="";

calendars.forEach(c=>{

const id="c"+btoa(c.id);

div.innerHTML+=`
<label>
<input type="checkbox" id="${id}" value="${c.id}" checked onchange="render()">
${c.summary}
</label>
`;

});

div.innerHTML+=`
<button onclick="selectAll()">Alles</button>
<button onclick="selectNone()">Geen</button>
`;

}

function getActive(){

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


/* RENDER */

function render(){

if(view==="week") renderWeek();
else renderDay();

}


function renderWeek(){

const container=document.getElementById("agenda");

container.className="weekgrid";

container.innerHTML="";

const active=getActive();

for(let i=0;i<7;i++){

const day=new Date(weekStart);
day.setDate(day.getDate()+i);

const col=document.createElement("div");
col.className="day";

col.innerHTML=`<div class="daytitle">${day.toLocaleDateString("nl-BE",{weekday:"long"})} ${day.getDate()}/${day.getMonth()+1}</div>`;

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
.filter(e=>active.includes(e.organizer?.email||e.calendar))
.filter(e=>{

const d=new Date(e.start.dateTime||e.start.date);
return d.toDateString()===day.toDateString();

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

block.innerHTML=`
<img src="https://api.iconify.design/mdi/calendar.svg">
${e.summary}
`;

timeline.appendChild(block);

});

col.appendChild(timeline);

container.appendChild(col);

}

}


/* DAGWEERGAVE */

function renderDay(){

const container=document.getElementById("agenda");

container.className="dayview";

container.innerHTML="";

const day=weekStart;

const div=document.createElement("div");
div.className="day";

div.innerHTML=`<div class="daytitle">${day.toLocaleDateString("nl-BE",{weekday:"long"})}</div>`;

container.appendChild(div);

}


/* WEEK NAVIGATIE */

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

function weekView(){
view="week";
render();
}

function dayView(){
view="day";
render();
}


/* BIG MODE */

function toggleBig(){
big=!big;
document.body.classList.toggle("big");
}


/* START */

parseToken();
