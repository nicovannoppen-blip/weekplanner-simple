let token=null
let calendars=[]
let events=[]
let currentDate=new Date()
let dayMode=false
let bigIcons=false
const BASE_URL = window.location.origin

// Hernoem lange kalender namen
function rename(name){
    if(name.toLowerCase().includes("belgie feestdagen") || name.toLowerCase().includes("schoolvakanties") || name.toLowerCase().includes("www.feestdagen-belgie.be")){
        return "Feestdagen";
    }
    return name;
}
//volgorde filter
const CALENDAR_ORDER=[
"Gezin",
"Nico",
"Elke",
"Niel",
"Odin",
"Rifter",
"Rita",
"Feestdagen"
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
winkel:["winkel","boodschappen","colruyt","hubo","aldi","lidl","decathlon","aveve","spar"],
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
Jana:["jana"],
kasteel:["kasteel"],
kermis:["kermis", "attractie", "attractiepark"],
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
Vansenne:["vansenne"],
SylvieEnKids:["sylvie en kids","sylvie en kindjes","sylvie met kindjes","sylvie met de kindjes"],
IrenaGezin:["irena","irena","irena"],
Irena:["irena alleen"],
AnthonyEnkids:["anthony en kids","anthony en kindjes","anthony met kindjes","anthony met de kindjes"],
IrenaEnJulian:["julian"],
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
Zomervakantie:["zomervakantie"],
steffifamilie:["steffie","steffi"],
Koen:["koen","koentje"],
Bhodi:["bhodi","bodi","bohdi"],
concert:["concert","festival","optreden"],
inpakken:["inpakken"],   
opzetten_tent:["opzetten"],   
safari:["safari","safaripark"],
zeehond:["zeehond"],   
reptiel:["reptiel","reptielen"], 
dierenwinkel:["dierenwinkel","schoubben"],   
}

// LOGIN / LOGOUT
function login(){
const url="https://accounts.google.com/o/oauth2/v2/auth"

window.location=url+"?"+new URLSearchParams(params)
}
const params={
client_id:CLIENT_ID,
redirect_uri:window.location.origin,
response_type:"token",
scope:"https://www.googleapis.com/auth/calendar.readonly",
prompt:"select_account"
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
    
calendars=data.items
.filter(c=>!HIDDEN_CALENDARS.includes(c.summary))
.sort((a,b)=>{

let ia=CALENDAR_ORDER.indexOf(rename(a.summary))
let ib=CALENDAR_ORDER.indexOf(rename(b.summary))

if(ia==-1) ia=999
if(ib==-1) ib=999

return ia-ib

})
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

let text=(e.title).toLowerCase()
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

// sorteer volgens positie in tekst
found.sort((a,b)=>a.pos-b.pos)

// enkel icon naam teruggeven
let icons=found.map(f=>f.icon)

// dubbele verwijderen
icons=[...new Set(icons)]

return icons

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

/* vandaag markeren */
let today=new Date()

if(
d.getDate()==today.getDate() &&
d.getMonth()==today.getMonth() &&
d.getFullYear()==today.getFullYear()
){
col.id="today"
}

/* klik ? dagweergave */

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

div.onclick=(ev)=>{

ev.stopPropagation()

let dag=e.start.toLocaleDateString(
"nl-BE",
{weekday:"long"}
)

let text=
dag+
". "+
e.title+
". Van "+
time(e.start)+
" tot "+
time(e.end)

speak(text)

}
    
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

let text="Volgende afspraken:\n"

upcoming.forEach(e=>{

text+=
"van " +
time(e.start)+
" tot "+
time(e.end)+
" "+
e.title+
"\n"

})

document.getElementById("popupText").innerText=text
document.getElementById("popup").style.display="flex"

speak(text)

}


/* ---------------- STEM ---------------- */

function speak(t){

let msg=new SpeechSynthesisUtterance(t)

msg.lang="nl-BE"

speechSynthesis.speak(msg)

}

//popup
function closePopup(){

document.getElementById("popup").style.display="none"

}



// Swipe ondersteuning (gsm/tablet)
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



/* ---------------- AFDRUKKEN ---------------- */

window.printWeek = function(){

let start=getMonday(currentDate)

let html=""

for(let i=0;i<7;i++){

let d=new Date(start)
d.setDate(start.getDate()+i)

// dag grenzen
let dayStart=new Date(d)
dayStart.setHours(0,0,0)

let dayEnd=new Date(d)
dayEnd.setHours(23,59,59)

// events filteren
let dayEvents=events.filter(e=>{
return !(e.end<dayStart || e.start>dayEnd)
})

// MEERDAAGS CORRECT MAKEN (08–23 regel)
dayEvents=dayEvents.map(e=>{

let s=new Date(e.start)
let en=new Date(e.end)

if(s<dayStart){
s=new Date(d)
s.setHours(8,0,0)
}

if(en>dayEnd){
en=new Date(d)
en.setHours(23,0,0)
}

return {...e,start:s,end:en}

})

// sorteren
dayEvents.sort((a,b)=>a.start-b.start)

// overlap layout
let columns=[]

dayEvents.forEach(e=>{

let placed=false

for(let col of columns){

if(col[col.length-1].end<=e.start){
col.push(e)
placed=true
break
}

}

if(!placed){
columns.push([e])
}

})

// HTML opbouw
html+=`
<div class="day">
<div class="dayHeader">
${d.toLocaleDateString("nl-BE",{weekday:"long"})}
${d.toLocaleDateString("nl-BE",{day:"2-digit",month:"2-digit"})}
</div>
`

// uren
for(let h=7;h<=23;h++){
html+=`<div class="hour" style="top:${(h-8)*60}px">${h}:00</div>`
}

// events tekenen
columns.forEach((colEvents,i)=>{

colEvents.forEach(e=>{

let startMin=(e.start.getHours()-7)*60+e.start.getMinutes()
let dur=(e.end-e.start)/60000

let icons=iconsForEvent(e)
.map(icon=>`<img src="${BASE_URL}/icons/${icon}" class="picto">`)
.join("")

html+=`
<div class="event"
style="
top:${startMin}px;
height:${dur}px;
left:${i*(90/columns.length)+5}%;
width:${90/columns.length-2}%;
background:${e.color};
">

<div class="pictoRow">${icons}</div>
<div class="text">${time(e.start)} - ${time(e.end)}<br>${e.title}</div>

</div>
`

})

})

html+=`</div>`
}

// nieuw venster
let w=window.open("","PRINT")

w.document.write(`
<html>
<head>
<title>Weekplanner</title>

<style>
<style>

body{
font-family:Arial;
background:white;
margin:0;
}

/* volledige pagina benutten */
.day{
position:relative;
height:1120px;
page-break-after:always;
}

/* titel groter */
.dayHeader{
text-align:center;
font-weight:bold;
padding:12px;
font-size:28px;
border-bottom:2px solid #ccc;
}

/* uur lijnen duidelijker */
.hour{
position:absolute;
left:0;
right:0;
border-top:1px solid #ddd;
font-size:12px;
color:#666;
}

/* afspraken VEEL groter */
.event{
position:absolute;
border-radius:12px;
color:white;
padding:6px;
font-size:18px;
overflow:visible;
box-shadow:0 2px 4px rgba(0,0,0,0.2);
}

/* pictogrammen groot */
.pictoRow{
display:flex;
flex-wrap:wrap;
gap:4px;
margin-bottom:4px;
}

.picto{
width:40px;
height:40px;
}

/* tekst duidelijk */
.text{
font-size:18px;
line-height:1.2;
}

/* A4 instellingen */
@page{
size:A4 portrait;
margin:8mm;
}

</style>

</style>

</head>
<body>

${html}

</body>
</html>
`)

w.document.close()

// wacht tot alle afbeeldingen geladen zijn
let images = w.document.images
let loaded = 0

    //tijdelijk
console.log("images loaded:", images.length)
    
if(images.length === 0){
w.print()
return
}

for(let img of images){

img.onload = img.onerror = () => {

loaded++

if(loaded === images.length){

// kleine extra delay voor zekerheid
setTimeout(()=>{
w.print()
},100)

}

}

}

}
