/* =====================================================
AGENDA PICTO PRO – SMART ENGINE
Google Calendar + Smart Icons
===================================================== */

const CLIENT_ID =
"259423355709-81s2fclv800ps73gqm8vb7t4vkcvct81.apps.googleusercontent.com";

const SCOPES =
"https://www.googleapis.com/auth/calendar.readonly";

let token = null;
let calendars = [];
let events = [];

let viewMode = "week";
let bigIcons = false;

let currentDate = new Date();

/* =====================================================
LOGIN
===================================================== */

function login(){

const oauth =
"https://accounts.google.com/o/oauth2/v2/auth";

const params = {
client_id: CLIENT_ID,
redirect_uri: window.location.origin,
response_type: "token",
scope: SCOPES
};

location.href =
oauth + "?" + new URLSearchParams(params);

}

function logout(){

token = null;
location.hash = "";
location.reload();

}

function parseToken(){

const hash = location.hash.substring(1);
const params = new URLSearchParams(hash);

token = params.get("access_token");

if(token){
init();
}

}

/* =====================================================
INIT
===================================================== */

async function init(){

await loadCalendars();

createFilters();

await loadEvents();

render();

}

/* =====================================================
LOAD CALENDARS
===================================================== */

async function loadCalendars(){

const res = await fetch(
"https://www.googleapis.com/calendar/v3/users/me/calendarList",
{
headers:{
Authorization:"Bearer "+token
}
}
);

const data = await res.json();

calendars =
data.items.filter(c=>!skipCalendar(c.summary));

}

/* =====================================================
SKIP USELESS CALENDARS
===================================================== */

function skipCalendar(name){

name = name.toLowerCase();

return(
name.includes("weeknummers") ||
name.includes("agenda website") ||
name.includes("borgloon weather") ||
name==="agenda"
);

}

/* =====================================================
LOAD EVENTS
===================================================== */

async function loadEvents(){

events=[];

let start = getWeekStart(currentDate);
let end = new Date(start);

end.setDate(end.getDate()+7);

for(const cal of calendars){

const res = await fetch(

`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events
?timeMin=${start.toISOString()}
&timeMax=${end.toISOString()}
&singleEvents=true
&orderBy=startTime
&maxResults=2500`

,{
headers:{
Authorization:"Bearer "+token
}
}

);

const data = await res.json();

if(data.items){

data.items.forEach(e=>{

e.calendarColor =
cal.backgroundColor || "#4285F4";

e.calendarName =
renameCalendar(cal.summary);

events.push(e);

});

}

}

}

/* =====================================================
RENAME CALENDARS
===================================================== */

function renameCalendar(name){

if(
name.includes("Belgie Feestdagen")
){
return "feestdagen";
}

return name;

}

/* =====================================================
DATE HELPERS
===================================================== */

function getWeekStart(d){

const date = new Date(d);

const day = (date.getDay()+6)%7;

date.setDate(date.getDate()-day);

date.setHours(0,0,0,0);

return date;

}

/* =====================================================
FILTERS
===================================================== */

function createFilters(){

const box = document.getElementById("filters");

box.innerHTML="";

calendars.forEach(c=>{

const id =
"f_"+c.id.replace(/[^a-z0-9]/gi,"");

const label =
document.createElement("label");

label.innerHTML=

`<input type="checkbox" id="${id}" checked>
${renameCalendar(c.summary)}`;

box.appendChild(label);

});

}

/* =====================================================
SELECTED CALENDARS
===================================================== */

function selectedCalendars(){

return calendars.filter(c=>{

const id =
"f_"+c.id.replace(/[^a-z0-9]/gi,"");

return document.getElementById(id)?.checked;

}).map(c=>renameCalendar(c.summary));

}

/* =====================================================
RENDER
===================================================== */

function render(){

if(viewMode==="week"){
renderWeek();
}else{
renderDay();
}

}

/* =====================================================
WEEK VIEW
===================================================== */

function renderWeek(){

const container =
document.getElementById("calendar");

container.innerHTML="";

const selected = selectedCalendars();

const start = getWeekStart(currentDate);

const days =
["maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag","zondag"];

for(let i=0;i<7;i++){

const d = new Date(start);
d.setDate(start.getDate()+i);

const col = document.createElement("div");
col.className="day";

col.innerHTML =

`<h3>${days[i]} ${formatDate(d)}</h3>
<div class="timeline"></div>`;

container.appendChild(col);

}

renderEventsWeek(selected);

}

/* =====================================================
RENDER EVENTS WEEK
===================================================== */

function renderEventsWeek(selected){

const dayColumns =
document.querySelectorAll(".timeline");

const sorted =
events
.filter(e=>selected.includes(e.calendarName))
.sort((a,b)=>
new Date(a.start.dateTime||a.start.date) -
new Date(b.start.dateTime||b.start.date)
);

sorted.forEach(ev=>{

const date =
new Date(ev.start.dateTime||ev.start.date);

const dayIndex = (date.getDay()+6)%7;

const hour = date.getHours();

if(hour<7 || hour>23) return;

const block =
createEventBlock(ev);

dayColumns[dayIndex].appendChild(block);

});

}

/* =====================================================
DAY VIEW
===================================================== */

function renderDay(){

const container =
document.getElementById("calendar");

container.innerHTML="";

const day =
document.createElement("div");

day.className="dayFull";

day.innerHTML=
`<h2>${currentDate.toLocaleDateString()}</h2>
<div class="timeline"></div>`;

container.appendChild(day);

const timeline =
day.querySelector(".timeline");

const selected = selectedCalendars();

events
.filter(e=>selected.includes(e.calendarName))
.forEach(ev=>{

const d =
new Date(ev.start.dateTime||ev.start.date);

if(d.toDateString()!==currentDate.toDateString())
return;

timeline.appendChild(
createEventBlock(ev)
);

});

}

/* =====================================================
EVENT BLOCK
===================================================== */

function createEventBlock(ev){

const div = document.createElement("div");

div.className="event";

div.style.background =
ev.calendarColor;

const icon =
getSmartIcon(ev);

div.innerHTML=

`
<img src="icons/${icon}.svg">
<div>
<strong>${ev.summary}</strong>
<br>
${formatTime(ev)}
<br>
<small>${ev.calendarName}</small>
</div>
`;

if(bigIcons){

div.classList.add("big");

}

return div;

}

/* =====================================================
TIME FORMAT
===================================================== */

function formatTime(ev){

const d =
new Date(ev.start.dateTime||ev.start.date);

if(!ev.start.dateTime){
return "Hele dag";
}

return d.toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
});

}

/* =====================================================
DATE FORMAT
===================================================== */

function formatDate(d){

return d.toLocaleDateString("nl-BE",{
day:"2-digit",
month:"2-digit"
});

}

/* =====================================================
SMART ICON ENGINE
===================================================== */

function getSmartIcon(ev){

const text =
(ev.summary+" "+(ev.location||""))
.toLowerCase();

if(text.includes("bus"))
return "bus";

if(text.includes("slapen"))
return "sleep";

if(text.includes("rijden"))
return "car";

if(text.includes("beugel"))
return "teeth";

if(text.includes("voetbal"))
return "soccer";

if(text.includes("zwem"))
return "swim";

if(text.includes("school"))
return "school";

if(text.includes("dokter"))
return "doctor";

if(text.includes("tandarts"))
return "dentist";

if(text.includes("verjaardag"))
return "birthday";

if(text.includes("werk"))
return "work";

if(text.includes("film"))
return "movie";

if(text.includes("muziek"))
return "music";

if(text.includes("eten"))
return "food";

if(text.includes("slapen"))
return "sleep";

if(text.includes("rita oppas thuis"))
return "babysitter_home";

if(text.includes("oppas door loriana"))
return "babysitter_home";

if(text.includes("rita oppas bij haar"))
return "babysitter_away";

if(text.includes("orelia puthof"))
return "nurse";

if(text.includes("kapelstraat"))
return "redcross";

return "calendar";

}

/* =====================================================
VIEW BUTTONS
===================================================== */

function toggleView(){

viewMode =
viewMode==="week" ? "day":"week";

render();

}

function toggleIcons(){

bigIcons = !bigIcons;

render();

}

/* =====================================================
NAVIGATION
===================================================== */

function next(){

if(viewMode==="week"){
currentDate.setDate(currentDate.getDate()+7);
}else{
currentDate.setDate(currentDate.getDate()+1);
}

loadEvents().then(render);

}

function prev(){

if(viewMode==="week"){
currentDate.setDate(currentDate.getDate()-7);
}else{
currentDate.setDate(currentDate.getDate()-1);
}

loadEvents().then(render);

}

/* =====================================================
START
===================================================== */

parseToken();
