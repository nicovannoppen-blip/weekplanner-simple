const CLIENT_ID="259423355709-81s2fclv800ps73gqm8vb7t4vkcvct81.apps.googleusercontent.com";
const API_KEY="AIzaSyCM4qaYbYNZ4vRIIsYGAAw66TnuBKiRLjY";

const DISCOVERY_DOC="https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES="https://www.googleapis.com/auth/calendar.readonly";

let calendars=[]
let events=[]

let viewMode="week"
let bigIcons=false

document.getElementById("loginBtn").onclick=login

function login(){

gapi.load('client', async ()=>{

await gapi.client.init({
apiKey:API_KEY,
discoveryDocs:[DISCOVERY_DOC]
})

const tokenClient=google.accounts.oauth2.initTokenClient({
client_id:CLIENT_ID,
scope:SCOPES,
callback:(tokenResponse)=>{
loadCalendars()
}
})

tokenClient.requestAccessToken()

document.getElementById("loginScreen").style.display="none"
document.getElementById("app").style.display="block"

})
}

async function loadCalendars(){

const res=await gapi.client.calendar.calendarList.list()

calendars=res.result.items

buildFilters()

loadEvents()

}

function buildFilters(){

const container=document.getElementById("calendarFilters")

container.innerHTML=""

calendars.forEach(cal=>{

if(
cal.summary==="Weeknummers" ||
cal.summary==="Agenda" ||
cal.summary==="Borgloon Weather" ||
cal.summary==="agenda website"
)return

const label=document.createElement("label")

const check=document.createElement("input")
check.type="checkbox"
check.checked=true
check.dataset.id=cal.id
check.onchange=loadEvents

label.appendChild(check)
label.append(cal.summary)

container.appendChild(label)

})

}

async function loadEvents(){

events=[]

const checks=document.querySelectorAll("#calendarFilters input:checked")

for(let check of checks){

const calId=check.dataset.id

const res=await gapi.client.calendar.events.list({
calendarId:calId,
timeMin:new Date().toISOString(),
singleEvents:true,
orderBy:"startTime",
maxResults:2500
})

res.result.items.forEach(ev=>{
ev.calendarId=calId
events.push(ev)
})

}

render()

}

function render(){

const container=document.getElementById("agendaContainer")

container.innerHTML=""

if(viewMode==="week"){

container.className="weekView"

const days=7

for(let i=0;i<days;i++){

const date=new Date()
date.setDate(date.getDate()+i)

const col=document.createElement("div")
col.className="dayColumn"

const title=document.createElement("div")
title.className="dayTitle"

title.innerText=date.toLocaleDateString("nl-BE",{weekday:"long"})+" "+date.toLocaleDateString("nl-BE")

col.appendChild(title)

events.forEach(ev=>{

const start=new Date(ev.start.dateTime||ev.start.date)

if(start.toDateString()!==date.toDateString())return
if(start.getHours()<7)return

col.appendChild(buildEvent(ev))

})

container.appendChild(col)

}

}

}

function buildEvent(ev){

const div=document.createElement("div")

const cal=calendars.find(c=>c.id===ev.calendarId)

div.className="event"
div.style.background=cal.backgroundColor

const img=document.createElement("img")

img.src=getIcon(ev)

div.appendChild(img)

const span=document.createElement("span")
span.innerText=ev.summary

div.appendChild(span)

return div

}

function getIcon(ev){

const text=(ev.summary||"").toLowerCase()
const loc=(ev.location||"").toLowerCase()

if(loc.includes("orelia puthof"))
return "icons/nurse.png"

if(text.includes("rita oppas thuis"))
return "icons/babysit_home.png"

if(text.includes("oppas door loriana"))
return "icons/babysit_home.png"

if(text.includes("rita oppas bij haar"))
return "icons/logeren.png"

return "icons/default.png"

}

document.getElementById("bigPictoBtn").onclick=()=>{

bigIcons=!bigIcons

document.body.classList.toggle("bigIcons")

}

document.getElementById("dayViewBtn").onclick=()=>{

viewMode="day"
render()

}

document.getElementById("weekViewBtn").onclick=()=>{

viewMode="week"
render()

}
