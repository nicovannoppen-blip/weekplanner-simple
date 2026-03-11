const CLIENT_ID="259423355709-81s2fclv800ps73gqm8vb7t4vkcvct81.apps.googleusercontent.com"

let token=null
let calendars=[]
let events=[]
let currentDate=new Date()

let bigIcons=false
let dayMode=false

const HIDDEN=[
"Weeknummers",
"Agenda",
"Borgloon Weather",
"agenda website"
]


// SMART PICTO AI
const ICON_AI={
school:["school","klas","les"],
thuis:["thuis","huis"],    
kunstschool:["beeldatelier"],
bus:["bus"],
zwemmen:["zwem","zwembad","zwemmen","plopsaqua"],
dokter:["dokter","arts","ziekenhuis"],
tandarts:["tandarts"],
beugel:["beugel"],
auto:["auto","rijden"],
eten:["eten","lunch","avondeten"],
slapen:["slapen","bedtijd"],
sport:["sport","training"],
winkel:["winkel","boodschappen","colruyt","hubo","aldi","lidl","decathlon"],
Verjaardag:["verjaardag","jarig"],
oppas:["oppas","nanny"],
muziek:["muziek","piano","gitaar"],
computer:["computer","tablet"],
lezen:["lezen","boek"],
douchen:["douchen","bad"],
wandelen_bergen:["wandelen bergen"],
wandelen_oude_stad:["wandelen oude stad"],
wandelen_rugzak:["wandelen rugzak"],
wandeling_park_bos:["wandeling park bos"],
wandelzoektocht_bos:["wandelzoektocht bos"],
ziekenhuis:["ziekenhuis"],
bureau:["nacht","nachtvergadering","team","teambuilding"],
algemeen:["algemeen"],
bakfiets:["bakfiets"],
bezoek_van:["bezoek van","komt","komen"],
boot:["boot"],
bos:["bos"],
camper:["camper"],
camping_caravan:["camping caravan"],
camping:["camping"],
carnaval:["carnaval"],
Elke:["elke","mama"],
fietsen:["fietsen"],
Jana_en_Vinny:["jana en vinny"],
Jana:["jana"],
kasteel:["kasteel"],
kermis:["kermis"],
kippen_eten_geven:["kippen eten geven"],
koffer:["koffer"],
logeren:["logeren","bij"],
moeke:["moeke", "rita"],
museum:["museum"],
Nico:["nico","papa"],
Niel:["niel"],
Niels:["niels"],
Odin:["odin"],
op_bezoek:["op bezoek","bezoeken"],
orthodontist:["orthodontist","orthodont"],
pedicure:["pedicure","myrthe"],
pretpark:["pretpark"],
psycholoog:["psycholoog","nele","karen","thuisbegeleiding"],
Rita:["rita","moeke"],
rolstoel:["rolstoel symbool"],
spelen_binnen:["spelen binnen"],
spelen_buiten:["spelen buiten"],
stad:["stad"],
Steven:["steven"],
Thomas:["thomas"],
trein:["trein"],
tuin:["tuin","snoeien"],
verpleegster:["v18","n14","l80","l89","l90","v18","v23"],
Vinny:["vinny"],
vliegtuig:["vliegtuig","airport","luchthaven"],
vorming:["vorming","Bedrijfseerstehulp"],
naschoolse_opvang:["strooppotje"],
Ophelie:["ophelie","ophélie"],
Vansenne:["vansenne","anthony en sylvie","sylvie en anthony"],
SylvieEnKids:["sylvie en kids","sylvie en kindjes","sylvie met kindjes","sylvie met de kindjes"],
IrenaGezin:["naar irena","irena komt","irena"],
Irena:["irena alleen"],
AnthonyEnkids:["anthony en kids","anthony en kindjes","anthony met kindjes","anthony met de kindjes"],
IrenaEnJulian:["irena en julian", "irena met julian"],
Sylvie:["sylvie"],
Anthony:["anthony"],
Thibeau:["thibeau"],
vannoppen:["vannoppen","vannoppens"],
broers:["broers"],
zoo:["zoo","dierentuin"],
garage:["garage","pascal"],
lopen:["lopen","tungrirun"],
Alexander:["alexander"],
Christine:["christine"],
dino:["dino"],
Facts:["facts"],
feest:["feest","viering"],
grootouderfeest:["grootouderfeest"],
Herfstvakantie:["herfstvakantie"],
karton:["karton"],
kerstmis:["kerstmis","kerst"],
kerstvakantie:["kerstvakantie"],
kindjeshalen:["kindjes halen","Kindjes en Rita halen"],
kindjesnaarrita:["kindjes naar rita"],
Krokusvakantie:["krokusvakantie"],
Loriana:["loriana"],
mamaenpapa:["mama en papa"],
musical:["musical"],
paasvakantie:["paasvakantie"],
pasen:["pasen"],
ramadan:["ramadan"],
trouwen:["trouwen"],
voorraad:["voorraad"],
Zomervakantie:["zomervakantie"]
}



/* ---------------- LOGIN ---------------- */

function login(){

const url="https://accounts.google.com/o/oauth2/v2/auth"

const params={
client_id:CLIENT_ID,
redirect_uri:window.location.origin,
response_type:"token",
scope:"https://www.googleapis.com/auth/calendar.readonly",
prompt:"select_account"
}

window.location=url+"?"+new URLSearchParams(params)

}

function parseToken(){

const hash=location.hash.substring(1)
const params=new URLSearchParams(hash)

token=params.get("access_token")

if(token) init()

}

/* ---------------- INIT ---------------- */

async function init(){

await loadCalendars()
await loadEvents()

render()

}

/* ---------------- CALENDARS ---------------- */

async function loadCalendars(){

let r=await fetch(
"https://www.googleapis.com/calendar/v3/users/me/calendarList",
{headers:{Authorization:"Bearer "+token}}
)

let data=await r.json()

calendars=data.items.filter(c=>!HIDDEN.includes(c.summary))

buildFilters()

}

function buildFilters(){

let f=document.getElementById("filters")
f.innerHTML=""

calendars.forEach(c=>{

let label=document.createElement("label")

label.innerHTML=
`<input type="checkbox" checked value="${c.id}"> ${rename(c.summary)}`

label.querySelector("input").addEventListener("change",render)

f.appendChild(label)

})

}

function rename(n){

if(n.includes("Belgie Feestdagen")) return "Feestdagen"

return n

}

/* ---------------- EVENTS ---------------- */

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
`singleEvents=true&`+
`orderBy=startTime&`+
`maxResults=2500`

let r=await fetch(url,{
headers:{Authorization:"Bearer "+token}
})

let data=await r.json()

data.items.forEach(e=>{

if(!e.start?.dateTime) return

events.push({

title:e.summary,
start:new Date(e.start.dateTime),
end:new Date(e.end.dateTime),
color:cal.backgroundColor,
calendar:cal.id,
location:e.location||""

})

})

}

}

/* ---------------- ACTIVE CALENDARS ---------------- */

function activeCalendars(){

let list=[]

document.querySelectorAll("#filters input:checked")
.forEach(cb=>list.push(cb.value))

return list

}

/* ---------------- RENDER ---------------- */

function render(){

let agenda=document.getElementById("agenda")
agenda.innerHTML=""

let active=activeCalendars()

let start=getMonday(currentDate)

let days=dayMode?1:7

let container=document.createElement("div")
container.className=dayMode?"dayView":"week"

for(let i=0;i<days;i++){

let d=new Date(dayMode?currentDate:start)

if(!dayMode)d.setDate(start.getDate()+i)

let col=document.createElement("div")
col.className="day"

/* vandaag markeren */

let today=new Date()

if(
d.getDate()==today.getDate() &&
d.getMonth()==today.getMonth() &&
d.getFullYear()==today.getFullYear()
){
col.id="today"
}

/* klik → dagweergave */

col.onclick=()=>{

currentDate=new Date(d)
dayMode=true
render()

}

/* header */

let head=document.createElement("div")
head.className="dayHeader"

let dayIcons=["☀️","🌙","🔥","🌳","⭐","🎉","🌈"]

let weekday=d.getDay()

head.innerHTML=
dayIcons[weekday]+" "+
d.toLocaleDateString("nl-BE",{weekday:"long"})+
" "+
d.toLocaleDateString("nl-BE",{day:"2-digit",month:"2-digit"})

col.appendChild(head)

/* uren */

for(let h=7;h<=23;h++){

let line=document.createElement("div")
line.className="hour"

line.style.top=((h-7)*60)+"px"

line.innerText=h+":00"

col.appendChild(line)

}

/* events */

let dayEvents=getEventsForDay(d)

layoutEvents(dayEvents,col)

container.appendChild(col)

}

agenda.appendChild(container)

/* grote pictogrammen */

if(bigIcons) agenda.classList.add("large")
else agenda.classList.remove("large")

/* auto zoom naar vandaag */

let todayCol=document.getElementById("today")

if(todayCol){

todayCol.scrollIntoView({
behavior:"smooth",
inline:"center",
block:"nearest"
})

}

}

/* ---------------- EVENTS PER DAG ---------------- */

function getEventsForDay(day){

let list=[]

events.forEach(e=>{

let start=e.start
let end=e.end

let dayStart=new Date(day)
dayStart.setHours(0,0,0)

let dayEnd=new Date(day)
dayEnd.setHours(23,59,59)

if(end<dayStart||start>dayEnd) return

list.push(e)

})

return list

}

/* ---------------- EVENT LAYOUT ---------------- */

function layoutEvents(dayEvents,col){

let active=activeCalendars()

dayEvents
.filter(e=>active.includes(e.calendar))
.sort((a,b)=>a.start-b.start)

let columns=[]

dayEvents.forEach(e=>{

let placed=false

for(let i=0;i<columns.length;i++){

if(columns[i][columns[i].length-1].end<=e.start){

columns[i].push(e)
placed=true
break

}

}

if(!placed) columns.push([e])

})

columns.forEach((colEvents,i)=>{

colEvents.forEach(e=>{

let start=(e.start.getHours()-7)*60+e.start.getMinutes()
let dur=(e.end-e.start)/60000

let div=document.createElement("div")
div.className="event"

div.style.top=start+"px"
div.style.height=dur+"px"

div.style.left=(i*(90/columns.length)+5)+"%"
div.style.width=(90/columns.length-2)+"%"

div.style.background=e.color

/* pictogrammen */

let icons=iconsForEvent(e)

let html=""

icons.forEach(icon=>{

html+=`<img src="icons/${icon}.png" class="icon">`

})

div.innerHTML=html

col.appendChild(div)

})

})

}

/* ---------------- SMART PICTO AI ---------------- */

function iconsForEvent(e){

let text=(e.title+" "+e.location).toLowerCase()

let found=[]

for(let icon in ICON_AI){

ICON_AI[icon].forEach(word=>{

let regex=new RegExp("\\b"+word.toLowerCase()+"\\b","i")

let match=text.match(regex)

if(match){

found.push({
icon:icon,
pos:match.index
})

}

})

}

/* sorteer volgens tekst */

found.sort((a,b)=>a.pos-b.pos)

let icons=found.map(f=>f.icon)

/* duplicaten verwijderen */

icons=[...new Set(icons)]

return icons

}

/* ---------------- NAVIGATIE ---------------- */

function prev(){

if(dayMode) currentDate.setDate(currentDate.getDate()-1)
else currentDate.setDate(currentDate.getDate()-7)

init()

}

function next(){

if(dayMode) currentDate.setDate(currentDate.getDate()+1)
else currentDate.setDate(currentDate.getDate()+7)

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

/* ---------------- FILTERS ---------------- */

function selectAll(){

document.querySelectorAll("#filters input")
.forEach(c=>c.checked=true)

render()

}

function selectNone(){

document.querySelectorAll("#filters input")
.forEach(c=>c.checked=false)

render()

}

/* ---------------- KOMENDE AFSPRAKEN ---------------- */

function showNextEvents(){

let now=new Date()

let upcoming=events
.filter(e=>{

let dur=(e.end-e.start)/3600000

if(dur>=15) return false

return e.start>now

})
.sort((a,b)=>a.start-b.start)
.slice(0,4)

let text=""

upcoming.forEach(e=>{

text+=time(e.start)+" "+e.title+"\n"

})

alert(text)

speak(text)

}

/* ---------------- STEM ---------------- */

function speak(t){

let msg=new SpeechSynthesisUtterance(t)

msg.lang="nl-BE"

speechSynthesis.speak(msg)

}

/* ---------------- HULPFUNCTIES ---------------- */

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

/* ---------------- SWIPE ---------------- */

let touchStartX=0

document.addEventListener("touchstart",e=>{
touchStartX=e.changedTouches[0].screenX
})

document.addEventListener("touchend",e=>{

let touchEndX=e.changedTouches[0].screenX

let diff=touchStartX-touchEndX

if(diff>60) next()
if(diff<-60) prev()

})

parseToken()

if(diff>60) next()
if(diff<-60) prev()

})
