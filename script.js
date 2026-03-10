let token=null
let calendars=[]
let events=[]

let currentDate=new Date()
let dayMode=false
let bigIcons=false

function parseToken(){

const hash=location.hash.substring(1)
const params=new URLSearchParams(hash)

token=params.get("access_token")

if(token) init()

}

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

label.innerHTML=
`<input type="checkbox" checked value="${c.id}"> ${c.summary}`

label.querySelector("input").addEventListener("change",render)

f.appendChild(label)

})

}

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

let r=await fetch(url,{
headers:{Authorization:"Bearer "+token}
})

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

function activeCalendars(){

let list=[]

document.querySelectorAll("#filters input").forEach(c=>{

if(c.checked)list.push(c.value)

})

return list

}

function iconsForEvent(e){

let text=(e.title+" "+e.location).toLowerCase()

let icons=[]

let words=text.split(" ")

words.forEach(w=>{
icons.push(w)
})

if(icons.length==0)icons.push("algemeen")

return icons

}

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

let dayEvents=events.filter(e=>{

return sameDay(e.start,d) && active.includes(e.calendar)

})

layoutEvents(dayEvents,col)

container.appendChild(col)

}

agenda.appendChild(container)

if(bigIcons)agenda.classList.add("large")
else agenda.classList.remove("large")

}

function layoutEvents(list,col){

list.sort((a,b)=>a.start-b.start)

list.forEach(e=>{

let start=(e.start.getHours()-7)*60+e.start.getMinutes()
let dur=(e.end-e.start)/60000

let div=document.createElement("div")
div.className="event"

div.style.top=start+"px"
div.style.height=dur+"px"
div.style.left="5%"
div.style.width="90%"
div.style.background=e.color

let icons=iconsForEvent(e)

let html=""

icons.forEach(i=>{
html+=`<img src="icons/${i}.png" class="picto">`
})

html+=`<div>${time(e.start)} ${e.title}</div>`

div.innerHTML=html

col.appendChild(div)

})

}

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

function prev(){

dayMode?currentDate.setDate(currentDate.getDate()-1)
:currentDate.setDate(currentDate.getDate()-7)

init()

}

function next(){

dayMode?currentDate.setDate(currentDate.getDate()+1)
:currentDate.setDate(currentDate.getDate()+7)

init()

}

function today(){

currentDate=new Date()
init()

}

function toggleIcons(){

bigIcons=!bigIcons
render()

}

function toggleView(){

dayMode=!dayMode
render()

}

function selectAll(){

document.querySelectorAll("#filters input").forEach(c=>c.checked=true)
render()

}

function selectNone(){

document.querySelectorAll("#filters input").forEach(c=>c.checked=false)
render()

}

parseToken()
