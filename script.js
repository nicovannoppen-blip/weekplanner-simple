let token=null
let calendars=[]
let events=[]
let currentDate=new Date()
let dayMode=false
let bigIcons=false

// Hernoem lange kalender namen
function rename(name){
    if(name.toLowerCase().includes("belgie feestdagen") || name.toLowerCase().includes("schoolvakanties") || name.toLowerCase().includes("www.feestdagen-belgie.be")){
        return "Feestdagen";
    }
    return name;
}

// SMART PICTO AI
const ICON_AI={
school:["school","klas","les"],
kunstschool:["Beeldatelier"],
bus:["bus"],
zwemmen:["zwem","zwembad"],
dokter:["dokter","arts","ziekenhuis"],
tandarts:["tandarts","beugel"],
fiets:["fiets","fietsen"],
auto:["auto","rijden"],
eten:["eten","lunch","avondeten"],
slapen:["slapen","bedtijd"],
sport:["sport","training"],
winkel:["winkel","boodschappen"],
verjaardag:["verjaardag"],
thuis:["thuis"],
oppas:["oppas","oma","nanny"],
spelen:["spelen","speeltuin"],
muziek:["muziek","piano","gitaar"],
computer:["computer","tablet"],
lezen:["lezen","boek"],
douchen:["douchen","bad"]
}

// LOGIN / LOGOUT
function login(){
const url="https://accounts.google.com/o/oauth2/v2/auth"
const params={
client_id:CLIENT_ID,
redirect_uri:window.location.origin,
response_type:"token",
scope:"https://www.googleapis.com/auth/calendar.readonly"
}
window.location=url+"?"+new URLSearchParams(params)
}

function logout(){
token=null
events=[]
render()
}

// PARSE TOKEN
function parseToken(){
const hash=location.hash.substring(1)
const params=new URLSearchParams(hash)
token=params.get("access_token")
if(token) init()
}

// GOOGLE API
async function init(){
await loadCalendars()
await loadEvents()
render()
}

async function loadCalendars(){
let r=await fetch(
"https://www.googleapis.com/calendar/v3/users/me/calendarList",
{headers:{Authorization:"Bearer "+token}}
)
let data=await r.json()
calendars=data.items.filter(c=>!HIDDEN_CALENDARS.includes(c.summary))
buildFilters()
}

function buildFilters(){
let f=document.getElementById("filters")
f.innerHTML=""
calendars.forEach(c=>{
let label=document.createElement("label")
label.innerHTML=`<input type="checkbox" checked value="${c.id}"> ${rename(c.summary)}`
label.querySelector("input").addEventListener("change",render)
f.appendChild(label)
})
}

// LOAD EVENTS
async function loadEvents(){
events=[]
let start=new Date(currentDate)
start.setDate(start.getDate()-7)
let end=new Date(currentDate)
end.setDate(end.getDate()+7)

for(let cal of calendars){
let url=
`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?`+
`timeMin=${start.toISOString()}&`+
`timeMax=${end.toISOString()}&`+
`singleEvents=true&orderBy=startTime`
let r=await fetch(url,{headers:{Authorization:"Bearer "+token}})
let data=await r.json()
data.items.forEach(e=>{
let s=e.start.dateTime||e.start.date
let en=e.end.dateTime||e.end.date
if(!s)return
events.push({
title:e.summary||"",
start:new Date(s),
end:new Date(en),
calendar:cal.id,
color:cal.backgroundColor,
location:e.location||""
})
})
}
}

// FILTER
function activeCalendars(){
let list=[]
document.querySelectorAll("#filters input").forEach(c=>{
if(c.checked) list.push(c.value)
})
return list
}

// SMART PICTO AI
function iconsForEvent(e){
let text=(e.title+" "+e.location).toLowerCase()
let found=[]
for(let icon in ICON_AI){
ICON_AI[icon].forEach(word=>{
if(text.includes(word)) found.push(icon)
})
}
if(found.length==0) found.push("algemeen")
return found
}

// MEERDAAGSE EVENTS OPSPLITSEN
function eventsForDay(day,active){
let startDay=new Date(day)
startDay.setHours(8,0,0,0)
let endDay=new Date(day)
endDay.setHours(23,0,0,0)
let list=[]
events.forEach(e=>{
if(!active.includes(e.calendar)) return
if(e.end<=startDay) return
if(e.start>=endDay) return
let start=new Date(Math.max(e.start,startDay))
let end=new Date(Math.min(e.end,endDay))
list.push({...e,start:start,end:end})
})
return list
}

// RENDER
function render(){
let agenda=document.getElementById("agenda")
agenda.innerHTML=""
let start=getMonday(currentDate)
let days=dayMode?1:7
let container=document.createElement("div")
container.className="week"
let active=activeCalendars()
for(let i=0;i<days;i++){
let d=new Date(dayMode?currentDate:start)
if(!dayMode)d.setDate(start.getDate()+i)
let col=document.createElement("div")
col.className="day"
let head=document.createElement("div")
head.className="dayHeader"
head.innerText=d.toLocaleDateString("nl-BE",{weekday:"long",day:"2-digit",month:"2-digit"})
col.appendChild(head)
for(let h=7;h<=23;h++){
let line=document.createElement("div")
line.className="hour"
line.style.top=((h-7)*60)+"px"
col.appendChild(line)
}

// Meerdaagse events + overlappende naast elkaar
let dayEvents=eventsForDay(d,active)
layoutEvents(dayEvents,col)

container.appendChild(col)
}
agenda.appendChild(container)
if(bigIcons) agenda.classList.add("large")
else agenda.classList.remove("large")
}

// LAYOUT EVENTS MET OVERLAPPENDE BREEDTE
function layoutEvents(list,col){
list.sort((a,b)=>a.start-b.start)
let columns=[]

list.forEach(e=>{
let placed=false
for(let i=0;i<columns.length;i++){
if(columns[i][columns[i].length-1].end<=e.start){
columns[i].push(e)
placed=true
break
}
}
if(!placed){
columns.push([e])
}
})

// Render events
columns.forEach((colEvents,i)=>{
colEvents.forEach(e=>{
let start=(e.start.getHours()-7)*60+e.start.getMinutes()
let dur=(e.end-e.start)/60000
let div=document.createElement("div")
div.className="event"
div.style.top=start+"px"
div.style.height=dur+"px"

// Breedte en positie afhankelijk van aantal overlappende kolommen
let width=90/columns.length
let left=5 + i*width
div.style.left=left+"%"
div.style.width=(width-2)+"%"
div.style.background=e.color

let icons=iconsForEvent(e)
let html=""
icons.forEach(i=>{html+=`<img src="icons/${i}.png" class="picto">`})
html+=`<div>${time(e.start)} ${e.title}</div>`
div.innerHTML=html
col.appendChild(div)
})
})
}

// HELPERS
function sameDay(a,b){
return a.getFullYear()==b.getFullYear() &&
a.getMonth()==b.getMonth() &&
a.getDate()==b.getDate()
}

function time(d){
return d.getHours().toString().padStart(2,"0")+":"+
d.getMinutes().toString().padStart(2,"0")
}

function getMonday(d){
d=new Date(d)
let day=d.getDay()
let diff=d.getDate()-day+(day==0?-6:1)
return new Date(d.setDate(diff))
}

// NAVIGATION
function prev(){dayMode?currentDate.setDate(currentDate.getDate()-1)
:currentDate.setDate(currentDate.getDate()-7)
init()}
function next(){dayMode?currentDate.setDate(currentDate.getDate()+1)
:currentDate.setDate(currentDate.getDate()+7)
init()}
function today(){currentDate=new Date(); init()}
function toggleIcons(){bigIcons=!bigIcons; render()}
function toggleView(){dayMode=!dayMode; render()}
function selectAll(){document.querySelectorAll("#filters input").forEach(c=>c.checked=true); render()}
function selectNone(){document.querySelectorAll("#filters input").forEach(c=>c.checked=false); render()}

// INIT
parseToken()

// Toon huidige en volgende 3 agendapunten, direct spraak + overlay
function showNextEvents(){
    let active = activeCalendars();
    let now = new Date();
    
    // Sorteer alle toekomstige events
    let upcoming = events
        .filter(e => active.includes(e.calendar) && e.end >= now)
        .sort((a,b) => a.start - b.start)
        .slice(0,4); // huidige + volgende 3

    let overlay = document.getElementById("speechOverlay");
    overlay.innerHTML = ""; // reset
    overlay.style.display = "block";

    if(upcoming.length === 0){
        overlay.innerText = "Er zijn geen komende agendapunten.";
        speakText("Er zijn geen komende agendapunten.");
        return;
    }

    let speechText = "Komende afspraken: ";
    upcoming.forEach(e => {
        let startStrDate = e.start.toLocaleDateString("nl-BE", {weekday:"long", day:"2-digit", month:"2-digit"});
        let startStrTime = e.start.toLocaleTimeString("nl-BE",{hour:"2-digit",minute:"2-digit"});
        overlay.innerHTML += `<div>${startStrDate} ${startStrTime} - ${e.title}</div>`;
        speechText += `${e.title} om ${startStrTime}. `;
    });

    // Start direct spraak
    speakText(speechText);

    // Overlay na 15 seconden automatisch verbergen
    setTimeout(()=>{overlay.style.display="none";},15000);
}

// Web Speech API functie
function speakText(text){
    if('speechSynthesis' in window){
        let utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'nl-NL';
        window.speechSynthesis.speak(utter);
    } else {
        console.warn("Spraakfunctie niet ondersteund in deze browser.");
    }
}
