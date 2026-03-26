let token=null
let calendars=[]
let events=[]
let currentDate=new Date()
let dayMode=false
let bigIcons=false

// Hernoem lange kalender namen
function rename(name){
    if(name.toLowerCase().includes("belgie feestdagen") || name.toLowerCase().includes("schoolvakanties") || name.toLowerCase().includes("www.feestdagen-belgie.be")
       || name.toLowerCase().includes("feestdagen in belgië") ){
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
bakfiets:["bakfiets"],
bezoek_van:["bezoek van","komt","komen"],
boot:["boot"],
bos:["bos"],
camper:["camper"],
camping_caravan:["camping caravan"],
camping:["camping"],
carnaval:["carnaval"],
elke:["elke","mama"],
fietsen:["fietsen"],
Jana:["jana"],
kasteel:["kasteel"],
kermis:["kermis"],
kermis:["kermis", "attractie", "attractiepark"],
kippen_eten_geven:["kippen eten geven"],
koffer:["koffer"],
logeren:["logeren","bij"],
museum:["museum"],
nico:["nico","papa"],
niel:["niel"],
Niels:["niels"],
odin:["odin"],
op_bezoek:["op bezoek","bezoeken"],
orthodontist:["orthodontist","orthodont"],
pedicure:["pedicure","myrthe"],
pretpark:["pretpark"],
psycholoog:["psycholoog","nele","karen","thuisbegeleiding"],
rita:["rita","moeke"],
rolstoel:["rolstoel symbool"],
spelen_binnen:["spelen binnen"],
spelen_buiten:["spelen buiten"],
stad:["stad"],
Steven:["steven"],
Thomas:["thomas"],
trein:["trein"],
tuin:["tuin","snoeien","planten","oogsten"],
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
feestdagen:["feestdag","feestdagen"],
grootouderfeest:["grootouderfeest"],
Herfstvakantie:["herfstvakantie"],
karton:["karton"],
kerstmis:["kerstmis","kerst"],
kerstvakantie:["kerstvakantie"],
kindjeshalen:["kindjes halen","Kindjes en Rita halen"],
kindjesnaar:["kindjes naar"],
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
Koen:["koen"],
Koen:["koen","koentje"],
Bhodi:["bhodi","bodi","bohdi"],
concert:["concert","festival","optreden"],
inpakken:["inpakken"],   
opzetten_tent:["opzetten"],   
safari:["safari","safaripark"],
zeehond:["zeehond"],   
reptiel:["reptiel","reptielen"], 
dierenwinkel:["dierenwinkel","schoubben"],  
gezin:["gezin"]
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

function logout(){

    // token wissen
    token = null;
    localStorage.removeItem("token");

    // URL opschonen
    window.history.replaceState({}, document.title, window.location.pathname);

    // gewoon refreshen
    location.reload();
}

// PARSE TOKEN
function parseToken(){

    // 🔥 eerst kijken of token al bestaat
    token = localStorage.getItem("token")

    if(token){
        init()
        return
    }

    // anders uit URL halen
    const hash=location.hash.substring(1)
    const params=new URLSearchParams(hash)
    token=params.get("access_token")

    if(token){
        localStorage.setItem("token", token)  // 🔥 opslaan
        init()
    }
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

    //tijdelijk!!!!
    console.log(data.items.map(c => c.summary))

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

        let btn=document.createElement("div")
        btn.className="filterBtn active"
        btn.dataset.id=c.id

        let name = rename(c.summary)
        let iconName = name.toLowerCase()

        btn.innerHTML=`
            <img src="icons/${iconName}.png" class="filterIcon">
            <div class="filterText">${name}</div>
        `

        // kleur
        btn.style.background = c.backgroundColor
        btn.style.color = getContrastColor(c.backgroundColor)

        // klik = toggle
        btn.onclick=()=>{
            btn.classList.toggle("active")
            render()
        }

        f.appendChild(btn)
    })


}

function getContrastColor(hex){
    if(!hex) return "#000"

    let c = hex.substring(1) // remove #
    let rgb = parseInt(c, 16)
    let r = (rgb >> 16) & 0xff
    let g = (rgb >> 8) & 0xff
    let b = (rgb >> 0) & 0xff

    let luminance = (0.299*r + 0.587*g + 0.114*b)/255

    return luminance > 0.6 ? "#000" : "#fff"
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
calendarName: rename(cal.summary),
color:cal.backgroundColor,
location:e.location||""
})
})
}
}

// FILTER
function activeCalendars(){
let list=[]
document.querySelectorAll(".filterBtn.active").forEach(b=>{
        list.push(b.dataset.id)
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
function layoutEvents(list, col, printMode=false){
    list.sort((a,b)=>a.start-b.start);
    let columns=[];

    // Overlappende kolommen berekenen
    list.forEach(e=>{
        let placed=false;
        for(let i=0;i<columns.length;i++){
            if(columns[i][columns[i].length-1].end<=e.start){
                columns[i].push(e);
                placed=true;
                break;
            }
        }
        if(!placed){
            columns.push([e]);
        }
    });

    // Render events
    columns.forEach((colEvents,i)=>{
        colEvents.forEach(e=>{

            let start=(e.start.getHours()-7)*60+e.start.getMinutes();
            let dur=(e.end-e.start)/60000;
            let div=document.createElement("div");
            div.className = printMode ? "event printEvent" : "event";
            div.style.top=start+"px";
            div.style.height=dur+"px";

            // Breedte/positie
            let width=90/columns.length;
            let left=5 + i*width;
            div.style.left=left+"%";
            div.style.width=(width-2)+"%";

            // Kleur
            div.style.background = e.color;

            // ================= ICONS =================
            let icons = iconsForEvent(e);

            let iconHTML = `<div class="icons">`;

            icons.forEach(ic => {

                let extraClass = "";

                if(
                    ic === "steffifamilie" ||
                    ic === "IrenaGezin" ||
                    ic === "kindjeshalen" ||
                    ic === "kindjesnaar" ||
                    ic === "Jana_en_Vinny" ||
                    ic === "SylvieEnKids" ||
                    ic === "Vansenne" ||
                    ic === "AnthonyEnkids" ||
                    ic === "IrenaEnJulian" ||
                    ic === "vannoppen"
                ){
                    extraClass = "bigicon";
                } else {
                    extraClass = "smallicon";
                }

                iconHTML += `<img src="icons/${ic}.png" class="picto ${extraClass}">`;
            });

            iconHTML += `</div>`;

            // ================= TEKST =================
            // Voor visuele agenda: titel + begintijd
            let displayText = time(e.start) + " " + (e.title || "");
            // Voor spraak: kalendernaam + titel + start + eind
            let speechText = (
                "agenda " + e.calendarName +
                ": " + e.title +
                ". van " + time(e.start) +
                " tot " + time(e.end)
            ).toLowerCase();
            
            let words = displayText.split(" ");
            
            let textHTML = `<div class="eventText">`;
            
            words.forEach((w,i)=>{
                textHTML += `<span class="speechWord" data-index="${i}">${w}</span> `
            })
            
            textHTML += `</div>`;
            
            let html = iconHTML + textHTML;
            
            div.innerHTML = html;
            
            // Klik voor spraak
            div.onclick = (ev) => {
                ev.stopPropagation();
                speak(speechText, div); // 🔥 element meegeven
            }

            col.appendChild(div);
        });
    });
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
function toggleView(){dayMode=!dayMode; render()}

function selectAll(){
    document.querySelectorAll(".filterBtn").forEach(b=>{
        b.classList.add("active")
    })
    render()
}

function selectNone(){
    document.querySelectorAll(".filterBtn").forEach(b=>{
        b.classList.remove("active")
    })
    render()
}

// INIT
parseToken()

/* ---------------- KOMENDE AFSPRAKEN ---------------- */

function showNextEvents(){

    let now = new Date();

    // Filter korte komende afspraken
    let upcoming = events
    .filter(e=>{
        let dur = (e.end - e.start) / 3600000;
        if(dur >= 15) return false;
        return e.start > now;
    })
    .sort((a,b)=>a.start - b.start)
    .slice(0,4);

    let popup = document.getElementById("popup");
    let popupText = document.getElementById("popupText");

    // Maak de popup leeg
    popupText.innerHTML = "";

    // Voor elke afspraak, maak een <div> met spans per woord
    upcoming.forEach(e=>{
        // Tekst voor visueel + spraak
        let lineText = (
            "agenda " + (e.calendarName || "") +
            ": van " + time(e.start) +
            " tot " + time(e.end) +
            " " + (e.title || " ")+
            "."
        ).toLowerCase();

        // Splits woorden
        let words = lineText.split(/\s+/);

        let lineDiv = document.createElement("div");
        lineDiv.className = "popupLine"; // voor eventueel styling

        words.forEach((w,i)=>{
            let span = document.createElement("span");
            span.className = "speechWord";
            span.dataset.index = i;
            span.innerText = w + " ";
            lineDiv.appendChild(span);
        });

        popupText.appendChild(lineDiv);
    });

    // Toon de popup
    popup.style.display = "flex";

    // Spraakfunctie
    speak(
        upcoming.map(e => 
            "agenda " + (e.calendarName || "") +
            ": van " + time(e.start) +
            " tot " + time(e.end) +
            " " + (e.title || "")
        ).join(". "), 
        popupText
    );
}


/* ---------------- STEM ---------------- */

function speak(text, element){
    speechSynthesis.cancel();

    let spans = Array.from(element.querySelectorAll(".speechWord"));
    let visualWords = spans.map(s => s.innerText.trim().toLowerCase());

    // Bereid spraaktekst voor: lowercase + splitsen
    let speechWords = text.toLowerCase().split(/\s+/);

    let currentVisualIndex = 0;

    let msg = new SpeechSynthesisUtterance(text);
    msg.lang = "nl-BE";

    msg.onboundary = function(event){
        if(event.name !== "word") return;

        // het woord dat uitgesproken wordt
        let charIndex = event.charIndex;
        let total = 0;
        let spokenWordIndex = 0;
        for(let i=0; i<speechWords.length; i++){
            total += speechWords[i].length + 1;
            if(total > charIndex){
                spokenWordIndex = i;
                break;
            }
        }
        let spokenWord = speechWords[spokenWordIndex];

        // Synchroniseer: highlight het volgende woord in visual dat overeenkomt
        while(currentVisualIndex < visualWords.length){
            if(visualWords[currentVisualIndex] === spokenWord){
                // highlight
                spans.forEach(s => s.classList.remove("active"));
                spans[currentVisualIndex].classList.add("active");
                currentVisualIndex++;
                break;
            } else {
                // skip words die in speech zitten maar niet in visual
                currentVisualIndex++;
            }
        }
    }

    msg.onend = ()=>{
        // highlight laatste woord kort, ook bij lange tekst
        spans.forEach(s => s.classList.remove("active"));
        if(spans.length > 0){
            spans[spans.length - 1].classList.add("active");
            setTimeout(()=>spans.forEach(s => s.classList.remove("active")), 300);
        }
    }

    speechSynthesis.speak(msg);
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


/* ---------------- PRINT WEEK ---------------- */
function printWeek() {
    let start = getMonday(currentDate);
    let printContainer = document.getElementById("printContainer");

    if(!printContainer){
        printContainer = document.createElement("div");
        printContainer.id = "printContainer";
        document.body.appendChild(printContainer);
    }

    printContainer.innerHTML = ""; // leegmaken

    let active = activeCalendars();

    for(let i=0;i<7;i++){
        let d = new Date(start);
        d.setDate(start.getDate() + i);

        let dayEvents = eventsForDay(d, active);

        // Dagdiv
        let dayDiv = document.createElement("div");
        dayDiv.className = "printDay";

        // Header
        let dayIcons=["☀️","🌙","🔥","🌳","⭐","🎉","🌈"];

        let weekday = d.getDay();

        let h2 = document.createElement("h2");
        h2.innerText =
        dayIcons[weekday] + " " +
        d.toLocaleDateString("nl-BE", {
            weekday:"long",
            day:"2-digit",
            month:"2-digit"
        });
        dayDiv.appendChild(h2);

        // Container voor uren en events
        let dayContainer = document.createElement("div");
        dayContainer.className = "printDayContainer";
        dayDiv.appendChild(dayContainer);

        // Urenlijn
        for(let h=7; h<=23; h++){
            let hourLine = document.createElement("div");
            hourLine.className = "printHour";
            hourLine.style.top = ((h-7)*60) + "px"; // 1px per minuut
            hourLine.innerText = h + ":00";
            dayContainer.appendChild(hourLine);
        }

        // Render events in print mode
        layoutEvents(dayEvents, dayContainer, true); // true = printMode

        printContainer.appendChild(dayDiv);
    }

    window.print();

    //pagina herladen omdat hij anders gek doet
    location.reload();
}
