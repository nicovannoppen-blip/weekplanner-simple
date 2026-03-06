let view="week"
let bigIcons=false

let calendars={}
let events=[]

const hiddenCalendars=[
"Weeknummers",
"Agenda",
"Borgloon Weather",
"agenda website"
]

function login(){

document.getElementById("login").style.display="none"
document.getElementById("app").style.display="block"

loadCalendars()

}

function setView(v){

view=v
render()

}

function toggleBigIcons(){

bigIcons=!bigIcons

document.body.classList.toggle("bigIcons")

}

function selectAll(){

for(let id in calendars){

calendars[id].enabled=true

}

renderFilters()
render()

}

function deselectAll(){

for(let id in calendars){

calendars[id].enabled=false

}

renderFilters()
render()

}

function loadCalendars(){

const url="https://www.googleapis.com/calendar/v3/users/me/calendarList?key=YOUR_API_KEY"

fetch(url)
.then(r=>r.json())
.then(data=>{

data.items.forEach(cal=>{

if(hiddenCalendars.includes(cal.summary))return

let name=cal.summary

if(name==="Belgie Feestdagen Schoolvakanties www.feestdagen-belgie.be"){
name="feestdagen"
}

calendars[cal.id]={
name:name,
color:cal.backgroundColor,
enabled:true
}

loadEvents(cal.id)

})

renderFilters()

})

}

function loadEvents(id){

const start=new Date().toISOString()

const end=new Date(Date.now()+7*86400000).toISOString()

const url=`https://www.googleapis.com/calendar/v3/calendars/${id}/events?timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime&key=YOUR_API_KEY`

fetch(url)
.then(r=>r.json())
.then(data=>{

data.items.forEach(e=>{

events.push({
title:e.summary,
location:e.location||"",
start:new Date(e.start.dateTime||e.start.date),
calendar:id
})

})

render()

})

}

function renderFilters(){

const f=document.getElementById("filters")

f.innerHTML=""

for(let id in calendars){

let c=calendars[id]

let cb=document.createElement("input")
cb.type="checkbox"
cb.checked=c.enabled

cb.onchange=()=>{

c.enabled=cb.checked
render()

}

f.append(cb)
f.append(" "+c.name+" ")

}

}

function render(){

const cal=document.getElementById("calendar")

cal.innerHTML=""

if(view==="day"){
cal.classList.add("dayView")
}else{
cal.classList.remove("dayView")
}

let days=7
if(view==="day")days=1

for(let d=0;d<days;d++){

let date=new Date()
date.setDate(date.getDate()+d)

let day=document.createElement("div")
day.className="day"

let header=document.createElement("div")
header.className="dayHeader"

let options={weekday:"long"}

let name=date.toLocaleDateString("nl-NL",options)

let short=date.toLocaleDateString("nl-NL").slice(0,5)

header.innerText=name+" "+short

day.append(header)

events.forEach(ev=>{

if(!calendars[ev.calendar]?.enabled)return

let evDate=new Date(ev.start)

if(evDate.toDateString()!==date.toDateString())return

let hour=evDate.getHours()

if(hour<7||hour>23)return

let div=document.createElement("div")
div.className="event"

div.style.background=calendars[ev.calendar].color

let icon=getIcon(ev)

div.innerHTML=`<img src="icons/${icon}.png">${ev.title}`

day.append(div)

})

cal.append(day)

}

}

function getIcon(ev){

let t=ev.title.toLowerCase()
let loc=ev.location.toLowerCase()

if(loc.includes("orelia puthof")) return "nurse"

if(t.includes("rita oppas thuis")) return "babysit_home"

if(t.includes("oppas door loriana")) return "babysit_home"

if(t.includes("rita oppas bij haar")) return "sleepover"

if(t.includes("school")) return "school"

if(t.includes("verjaardag")) return "birthday"

return "event"

}

if('serviceWorker' in navigator){

navigator.serviceWorker.register("service-worker.js")

}
