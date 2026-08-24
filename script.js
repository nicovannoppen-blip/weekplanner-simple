/* ============================================================
   GEZINSAGENDA VANNOPPEKES
   ============================================================ */

let token = null;
let calendars = [];
let events = [];
let currentDate = new Date();
let dayMode = false;
let bigIcons = false;


/* ============================================================
   KALENDER NAMEN
============================================================ */

function rename(name){

    if(
        name.toLowerCase().includes("belgie feestdagen") ||
        name.toLowerCase().includes("schoolvakanties") ||
        name.toLowerCase().includes("www.feestdagen-belgie.be") ||
        name.toLowerCase().includes("feestdagen in belgië")
    ){
        return "Feestdagen";
    }

    return name;
}


/* ============================================================
   KALENDER VOLGORDE
============================================================ */

const CALENDAR_ORDER = [

    "Gezin",
    "Nico",
    "Elke",
    "Niel",
    "Odin",
    "Rifter",
    "Rita",
    "Feestdagen"

];


/* ============================================================
   VERBORGEN KALENDERS
============================================================ */

const HIDDEN_CALENDARS = [];


/* ============================================================
   SMART PICTO AI
============================================================ */

const ICON_AI = {

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

wandelen_bergen:["bergen"],

wandelen_oude_stad:["oudestad"],

wandelen_rugzak:["wandelen rugzak","wandelen"],

wandeling_park_bos:["wandeling parkbos"],

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

kermis:["kermis","attractie","attractiepark"],

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

IrenaGezin:["irena","irena"],

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

feest:["feest","viering","verjaardagsfeest"],

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

Koen:["koen","koentje"],

Bhodi:["bhodi","bodi","bohdi"],

concert:["concert","festival","optreden"],

inpakken:["inpakken"],

opzetten_tent:["opzetten"],

safari:["safari","safaripark"],

zeehond:["zeehond"],

reptiel:["reptiel","reptielen"],

dierenwinkel:["dierenwinkel","schoubben"],

gezin:["gezin"],

Johnny:["johnny","papa"],

verhuizen:["verhuizen","tent opruimen"],

tattoo:["tattoo","tatoo","tatoe"],

luchtballon:["luchtballon","ballonvaart"],

schoolreis:["schoolreis"],

sauna:["sauna","welness"],

geit:["geit"],

geit_eten_geven:["geit eten geven","geit_voederen"],

kameel:["kameel","kamelen"],

OmieEnOpie:["omie en opie","opie en omie"],

paard_rijden:["paard rijden","ponyrijden"],

pony:["pony"],

binnenspeeltuin:["binnenspeeltuin"],

speeltuin:["speeltuin"],

verkennen:["verkennen"],

welkomstspel:["welkomstspel"],

dierenspeurtocht:["dierenspeurtocht"],

knutselen:["knutselen","workshop"],

volksspelen:["volksspelen"],

dansen:["dansen"],

huifkar:["huifkar"],

pannenkoek:["pannenkoek","pannenkoeken"],

efteling:["efteling"],

boerenontbijt:["boerenontbijt"],

bowlen:["bowlen"],

golf:["golf"],

etensamen:["samen eten","eten samen"],

dolfinarium:["dolfinarium"],

winkelcentrum:["winkelcentrum"],

markt:["markt"],

toonmoment:["toonmoment"],

parking:["parking"],

wekker:["wekker"],

vissen:["vissen","aquarium"],

vuurtoren:["vuurtoren"],

Hunebed:["hunebed"],

bunker:["bunker","bunkers"],

ster:["ster","sterren"],

orca:["orca","orka"],

cinema:["cinema","kinepolis","euroscoop"],

medicatie_druppels:["druppeltjes"],

gezelschapsspel:["gezelschapsspel"],

kamp:["kamp","bivak"],

camper:["camper","mobilhome"],

fotograaf:["fotograaf","fotoshoot","photoshoot"],

sanne:["sanne"],

koken:["koken"],

kampvuur:["kampvuur"],

oogarts:["oogarts"]

};


/* ============================================================
   LOGIN
============================================================ */

function login(){

    window.location.href = "/api/auth";

}


async function logout(){

    try{

        await fetch("/api/logout");

    }catch(e){

        console.error("Logout fout:",e);

    }

    token = null;

    localStorage.removeItem("token");

    location.reload();

}


/* ============================================================
   TOKEN
============================================================ */

async function parseToken(){

    try{

        const response = await fetch("/api/token");

        if(!response.ok){

            token = null;

            console.log("Niet ingelogd");

            return;

        }

        const data = await response.json();

        token = data.access_token;

        console.log("Automatisch ingelogd");

        await init();

    }catch(error){

        console.error("Authenticatie fout:",error);

        token = null;

    }

}


/* ============================================================
   INIT
============================================================ */

async function init(){

    if(!token){

        return;

    }

    await loadCalendars();

    await loadEvents();

    render();

}


/* ============================================================
   CALENDARS
============================================================ */

async function loadCalendars(){

    let r = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
            headers:{
                Authorization:"Bearer "+token
            }
        }
    );

    let data = await r.json();

    calendars = data.items
        .filter(c=>!HIDDEN_CALENDARS.includes(c.summary))
        .sort((a,b)=>{

            let ia = CALENDAR_ORDER.indexOf(rename(a.summary));
            let ib = CALENDAR_ORDER.indexOf(rename(b.summary));

            if(ia===-1) ia=999;
            if(ib===-1) ib=999;

            return ia-ib;

        });

    buildFilters();

}


/* ============================================================
   FILTERS
============================================================ */

function buildFilters(){

    let f = document.getElementById("filters");

    f.innerHTML = "";

    calendars.forEach(c=>{

        let btn = document.createElement("div");

        btn.className = "filterBtn active";

        btn.dataset.id = c.id;

        let name = rename(c.summary);

        let iconName = name.toLowerCase();

        btn.innerHTML = `
            <img src="icons/${iconName}.png" class="filterIcon">
            <div class="filterText">${name}</div>
        `;

        btn.style.background = c.backgroundColor;

        btn.style.color = getContrastColor(c.backgroundColor);

        btn.onclick = ()=>{

            btn.classList.toggle("active");

            render();

        };

        f.appendChild(btn);

    });

}


function getContrastColor(hex){

    if(!hex) return "#000";

    let c = hex.substring(1);

    let rgb = parseInt(c,16);

    let r = (rgb>>16)&0xff;
    let g = (rgb>>8)&0xff;
    let b = rgb&0xff;

    let luminance =
        (0.299*r + 0.587*g + 0.114*b)/255;

    return luminance > 0.6 ? "#000" : "#fff";

}


/* ============================================================
   EVENTS LADEN
============================================================ */

async function loadEvents(){

    events = [];

    let start = new Date(currentDate);

    start.setDate(start.getDate()-7);

    let end = new Date(currentDate);

    end.setDate(end.getDate()+7);

    for(let cal of calendars){

        let url =
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?`+
            `timeMin=${start.toISOString()}&`+
            `timeMax=${end.toISOString()}&`+
            `singleEvents=true&orderBy=startTime`;

        let r = await fetch(
            url,
            {
                headers:{
                    Authorization:"Bearer "+token
                }
            }
        );

        let data = await r.json();

        if(!data.items) continue;

        data.items.forEach(e=>{

            let s = e.start.dateTime || e.start.date;

            let en = e.end.dateTime || e.end.date;

            if(!s) return;

            events.push({

                title:e.summary || "",

                start:new Date(s),

                end:new Date(en),

                calendar:cal.id,

                calendarName:rename(cal.summary),

                color:cal.backgroundColor,

                location:e.location || ""

            });

        });

    }

}


/* ============================================================
   ACTIVE CALENDARS
============================================================ */

function activeCalendars(){

    let list = [];

    document.querySelectorAll(".filterBtn.active")
        .forEach(b=>{

            list.push(b.dataset.id);

        });

    return list;

}


/* ============================================================
   PICTOGRAMMEN
============================================================ */

function iconsForEvent(e){

    let text = (e.title || "").toLowerCase();

    if(
        text.includes("rijden van") ||
        text.includes("rijden naar")
    ){

        return ["auto"];

    }

    if(
        text.includes("fietsen van") ||
        text.includes("fietsen naar")
    ){

        return ["fietsen"];

    }

    if(
        text.includes("wandelen van") ||
        text.includes("wandelen naar") ||
        text.includes("lopen van") ||
        text.includes("lopen naar")
    ){

        return ["wandelen_rugzak"];

    }

    if(
        text.includes("trein van") ||
        text.includes("trein naar")
    ){

        return ["trein"];

    }

    if(
        text.includes("bus van") ||
        text.includes("bus naar") ||
        text.includes("openbaar vervoer nemen") ||
        text.includes("openbaar vervoer van") ||
        text.includes("openbaar vervoer naar")
    ){

        return ["bus"];

    }

    if(
        text.includes("vliegtuig van") ||
        text.includes("vliegtuig naar")
    ){

        return ["vliegtuig"];

    }

    let found = [];

    for(let icon in ICON_AI){

        ICON_AI[icon].forEach(word=>{

            let regex = new RegExp(
                "\\b"+word.toLowerCase()+"\\b",
                "i"
            );

            let match = text.match(regex);

            if(match){

                found.push({

                    icon:icon,

                    pos:match.index

                });

            }

        });

    }

    found.sort((a,b)=>a.pos-b.pos);

    let icons = found.map(f=>f.icon);

    icons = [...new Set(icons)];

    return icons;

}


/* ============================================================
   EVENTS VOOR DAG
============================================================ */

function eventsForDay(day,active){

    let startDay = new Date(day);

    startDay.setHours(0,0,0,0);

    let endDay = new Date(day);

    endDay.setHours(23,59,59,999);

    let list = [];

    events.forEach(e=>{

        if(!active.includes(e.calendar)) return;

        if(e.end <= startDay) return;

        if(e.start >= endDay) return;

        let start = new Date(
            Math.max(e.start,startDay)
        );

        let end = new Date(
            Math.min(e.end,endDay)
        );

        list.push({

            ...e,

            start:start,

            end:end

        });

    });

    return list;

}


/* ============================================================
   RENDER
============================================================ */

function render(){

    let agenda = document.getElementById("agenda");

    agenda.innerHTML = "";

    let start = getMonday(currentDate);

    let days = dayMode ? 1 : 7;

    let container = document.createElement("div");

    container.className = "week";

    let active = activeCalendars();

    for(let i=0;i<days;i++){

        let d = new Date(
            dayMode ? currentDate : start
        );

        if(!dayMode){

            d.setDate(start.getDate()+i);

        }

        let col = document.createElement("div");

        col.className = "day";

        let todayDate = new Date();

        if(
            d.getDate()==todayDate.getDate() &&
            d.getMonth()==todayDate.getMonth() &&
            d.getFullYear()==todayDate.getFullYear()
        ){

            col.id = "today";

        }


        let now = new Date();

        if(!dayMode || sameDay(now,d)){

            let line = document.createElement("div");

            line.className = "currentTimeLine";

            let minutesSince7 =
                (now.getHours()-7)*60+
                now.getMinutes();

            line.style.top =
                minutesSince7+"px";

            col.appendChild(line);

        }


        col.onclick = ()=>{

            currentDate = new Date(d);

            dayMode = true;

            render();

        };


        let head = document.createElement("div");

        head.className = "dayHeader";

        let dayIcons =
            ["☀️","🌙","🔥","🌳","⭐","🎉","🌈"];

        let weekday = d.getDay();

        head.innerHTML =
            dayIcons[weekday]+" "+
            d.toLocaleDateString(
                "nl-BE",
                {
                    weekday:"long"
                }
            )+
            " "+
            d.toLocaleDateString(
                "nl-BE",
                {
                    day:"2-digit",
                    month:"2-digit"
                }
            );

        col.appendChild(head);


        for(let h=7;h<=23;h++){

            let line =
                document.createElement("div");

            line.className = "hour";

            line.style.top =
                ((h-7)*60)+"px";

            col.appendChild(line);

        }


        let dayEvents =
            eventsForDay(
                d,
                active
            );

        layoutEvents(
            dayEvents,
            col
        );

        container.appendChild(col);

    }

    agenda.appendChild(container);

    if(bigIcons)
        agenda.classList.add("large");
    else
        agenda.classList.remove("large");


    let todayCol =
        document.getElementById("today");

    if(todayCol){

        todayCol.scrollIntoView({

            behavior:"smooth",

            inline:"center",

            block:"nearest"

        });

    }

}


/* ============================================================
   LAYOUT EVENTS
============================================================ */

function layoutEvents(list,col,printMode=false){

    list.sort(
        (a,b)=>a.start-b.start
    );

    let columns = [];

    list.forEach(e=>{

        let placed = false;

        for(let i=0;i<columns.length;i++){

            if(
                columns[i][
                    columns[i].length-1
                ].end <= e.start
            ){

                columns[i].push(e);

                placed = true;

                break;

            }

        }

        if(!placed){

            columns.push([e]);

        }

    });


    columns.forEach((colEvents,i)=>{

        colEvents.forEach(e=>{

            let start =
                (e.start.getHours()-7)*60+
                e.start.getMinutes();

            let dur =
                (e.end-e.start)/60000;

            let div =
                document.createElement("div");

            div.className =
                printMode
                ? "event printEvent"
                : "event";

            div.style.top =
                start+"px";

            div.style.height =
                dur+"px";


            let width =
                90/columns.length;

            let left =
                5+i*width;

            div.style.left =
                left+"%";

            div.style.width =
                (width-2)+"%";


            div.style.background =
                e.color;


            let icons =
                iconsForEvent(e);

            let iconHTML =
                `<div class="icons">`;

            icons.forEach(ic=>{

                let extraClass = "";

                if(
                    ic==="steffifamilie" ||
                    ic==="IrenaGezin" ||
                    ic==="kindjeshalen" ||
                    ic==="kindjesnaar" ||
                    ic==="SylvieEnKids" ||
                    ic==="Vansenne" ||
                    ic==="AnthonyEnkids" ||
                    ic==="IrenaEnJulian" ||
                    ic==="vannoppen"
                ){

                    extraClass = "bigicon";

                }else{

                    extraClass = "smallicon";

                }

                iconHTML +=
                    `<img src="icons/${ic}.png" class="picto ${extraClass}">`;

            });

            iconHTML += `</div>`;


            let displayText =
                time(e.start)+" "+
                (e.title || "");


            let speechText =

                "agenda "+
                e.calendarName+
                ": "+
                e.title+
                ". van "+
                time(e.start)+
                " tot "+
                time(e.end);


            let words =
                displayText.split(" ");


            let textHTML =
                `<div class="eventText">`;


            words.forEach((w,i)=>{

                textHTML +=
                    `<span class="speechWord" data-index="${i}">${w}</span> `;

            });


            textHTML +=
                `</div>`;


            div.innerHTML =
                iconHTML+
                textHTML;


            div.onclick = ev=>{

                ev.stopPropagation();

                speak(
                    speechText,
                    div
                );

            };


            col.appendChild(div);

        });

    });

}


/* ============================================================
   HELPERS
============================================================ */

function sameDay(a,b){

    return (
        a.getFullYear()==b.getFullYear() &&
        a.getMonth()==b.getMonth() &&
        a.getDate()==b.getDate()
    );

}


function time(d){

    return d.getHours()
        .toString()
        .padStart(2,"0")
        +":"+
        d.getMinutes()
        .toString()
        .padStart(2,"0");

}


function getMonday(d){

    d = new Date(d);

    let day = d.getDay();

    let diff =
        d.getDate()-
        day+
        (day==0 ? -6 : 1);

    return new Date(
        d.setDate(diff)
    );

}


/* ============================================================
   NAVIGATIE
============================================================ */

function prev(){

    dayMode
        ? currentDate.setDate(
            currentDate.getDate()-1
          )
        : currentDate.setDate(
            currentDate.getDate()-7
          );

    init();

}


function next(){

    dayMode
        ? currentDate.setDate(
            currentDate.getDate()+1
          )
        : currentDate.setDate(
            currentDate.getDate()+7
          );

    init();

}


function today(){

    currentDate = new Date();

    init();

}


function toggleView(){

    dayMode = !dayMode;

    render();

}


function selectAll(){

    document
        .querySelectorAll(".filterBtn")
        .forEach(b=>{
            b.classList.add("active");
        });

    render();

}


function selectNone(){

    document
        .querySelectorAll(".filterBtn")
        .forEach(b=>{
            b.classList.remove("active");
        });

    render();

}


/* ============================================================
   KOMENDE AFSPRAKEN
============================================================ */

function showNextEvents(){

    let now = new Date();

    let upcoming = events

        .filter(e=>{

            let dur =
                (e.end-e.start)/3600000;

            if(dur>=15)
                return false;

            return e.start>now;

        })

        .sort(
            (a,b)=>a.start-b.start
        )

        .slice(0,4);


    let popup =
        document.getElementById("popup");

    let popupText =
        document.getElementById("popupText");


    popupText.innerHTML = "";


    upcoming.forEach(e=>{

        let lineText = (

            "agenda "+
            (e.calendarName || "")+
            ": van "+
            time(e.start)+
            " tot "+
            time(e.end)+
            " "+
            (e.title || "")+
            "."

        ).toLowerCase();


        let words =
            lineText.split(/\s+/);


        let lineDiv =
            document.createElement("div");

        lineDiv.className =
            "popupLine";


        words.forEach((w,i)=>{

            let span =
                document.createElement("span");

            span.className =
                "speechWord";

            span.dataset.index = i;

            span.innerText =
                w+" ";

            lineDiv.appendChild(span);

        });


        popupText.appendChild(
            lineDiv
        );

    });


    popup.style.display = "flex";


    speak(

        upcoming.map(e=>

            "agenda "+
            (e.calendarName || "")+
            ": van "+
            time(e.start)+
            " tot "+
            time(e.end)+
            " "+
            (e.title || "")

        ).join(". "),

        popupText

    );

}


/* ============================================================
   STEM
============================================================ */

function speak(text,lineDiv){

    speechSynthesis.cancel();

    let speechWords =
        text.split(/\s+/);

    let spans =
        Array.from(
            lineDiv.querySelectorAll(
                ".speechWord"
            )
        );


    let msg =
        new SpeechSynthesisUtterance(
            text
        );

    msg.lang = "nl-BE";


    msg.onboundary =
        function(event){

            if(event.name!=="word")
                return;


            let charIndex =
                event.charIndex;


            let total = 0;

            let currentWordIndex =
                speechWords.length-1;


            for(
                let i=0;
                i<speechWords.length;
                i++
            ){

                total +=
                    speechWords[i].length+1;


                if(total>charIndex){

                    currentWordIndex=i;

                    break;

                }

            }


            spans.forEach(
                s=>s.classList.remove("active")
            );


            let span =
                spans[currentWordIndex];


            if(span)
                span.classList.add("active");

        };


    msg.onend = ()=>{

        spans.forEach(
            s=>s.classList.remove("active")
        );

    };


    speechSynthesis.speak(msg);

}


/* ============================================================
   POPUP
============================================================ */

function closePopup(){

    document.getElementById(
        "popup"
    ).style.display="none";

}


/* ============================================================
   SWIPE
============================================================ */

let touchStartX = 0;

document.addEventListener(
    "touchstart",
    e=>{
        touchStartX =
            e.changedTouches[0].screenX;
    }
);


document.addEventListener(
    "touchend",
    e=>{

        let touchEndX =
            e.changedTouches[0].screenX;

        let diff =
            touchStartX-touchEndX;

        if(diff>60)
            next();

        if(diff<-60)
            prev();

    }
);


/* ============================================================
   PRINT WEEK
============================================================ */

function printWeek(){

    let start =
        getMonday(currentDate);

    let printContainer =
        document.getElementById(
            "printContainer"
        );


    if(!printContainer){

        printContainer =
            document.createElement("div");

        printContainer.id =
            "printContainer";

        document.body.appendChild(
            printContainer
        );

    }


    printContainer.innerHTML = "";


    let active =
        activeCalendars();


    for(let i=0;i<7;i++){

        let d =
            new Date(start);

        d.setDate(
            start.getDate()+i
        );


        let dayEvents =
            eventsForDay(
                d,
                active
            );


        let dayDiv =
            document.createElement("div");

        dayDiv.className =
            "printDay";


        let dayIcons =
            ["☀️","🌙","🔥","🌳","⭐","🎉","🌈"];


        let weekday =
            d.getDay();


        let h2 =
            document.createElement("h2");


        h2.innerText =

            dayIcons[weekday]+" "+
            d.toLocaleDateString(
                "nl-BE",
                {
                    weekday:"long",
                    day:"2-digit",
                    month:"2-digit"
                }
            );


        dayDiv.appendChild(h2);


        let dayContainer =
            document.createElement("div");


        dayContainer.className =
            "printDayContainer";


        dayDiv.appendChild(
            dayContainer
        );


        for(let h=7;h<=23;h++){

            let hourLine =
                document.createElement("div");

            hourLine.className =
                "printHour";

            hourLine.style.top =
                ((h-7)*60)+"px";

            hourLine.innerText =
                h+":00";

            dayContainer.appendChild(
                hourLine
            );

        }


        layoutEvents(
            dayEvents,
            dayContainer,
            true
        );


        printContainer.appendChild(
            dayDiv
        );

    }


    alert(
        "Tip: zet je printer op enkelzijdig voor het beste resultaat."
    );


    window.print();

    location.reload();

}


/* ============================================================
   KLOK
============================================================ */

let clockContainer =
    document.createElement("div");

clockContainer.id =
    "liveClock";

clockContainer.style.display =
    "inline-flex";

clockContainer.style.alignItems =
    "center";

clockContainer.style.marginLeft =
    "5px";

clockContainer.style.gap =
    "30px";


document
    .querySelector("header")
    .appendChild(
        clockContainer
    );


let clockTime =
    document.createElement("div");

clockTime.id =
    "liveClockTime";

clockTime.style.cursor =
    "pointer";

clockTime.style.fontWeight =
    "bold";

clockTime.style.fontSize =
    "3em";


clockContainer.appendChild(
    clockTime
);


let clockDate =
    document.createElement("div");

clockDate.id =
    "liveClockDate";

clockDate.style.cursor =
    "pointer";

clockDate.style.fontWeight =
    "bold";

clockDate.style.fontSize =
    "1em";


clockContainer.appendChild(
    clockDate
);


function updateClock(){

    let now = new Date();

    let hours =
        now.getHours()
        .toString()
        .padStart(2,"0");

    let minutes =
        now.getMinutes()
        .toString()
        .padStart(2,"0");


    clockTime.innerText =
        `${hours}:${minutes}`;


    let weekday =
        now.toLocaleDateString(
            "nl-BE",
            {
                weekday:"long"
            }
        );


    let day =
        now.getDate()
        .toString()
        .padStart(2,"0");


    let month =
        now.toLocaleDateString(
            "nl-BE",
            {
                month:"long"
            }
        );


    let year =
        now.getFullYear();


    clockDate.innerText =
        `${weekday} ${day} ${month} ${year}`;

}


setInterval(
    updateClock,
    1000
);

updateClock();


clockTime.onclick = ()=>{

    let now = new Date();

    let speech =
        `Het is ${now.getHours()} uur en ${now.getMinutes()} minuten.`;

    let msg =
        new SpeechSynthesisUtterance(
            speech
        );

    msg.lang = "nl-BE";

    speechSynthesis.speak(msg);

};


clockDate.onclick = ()=>{

    let now = new Date();

    let weekday =
        now.toLocaleDateString(
            "nl-BE",
            {
                weekday:"long"
            }
        );

    let day =
        now.getDate();


    let month =
        now.toLocaleDateString(
            "nl-BE",
            {
                month:"long"
            }
        );


    let year =
        now.getFullYear();


    let speech =
        `Vandaag is ${weekday} ${day} ${month} ${year}.`;


    let msg =
        new SpeechSynthesisUtterance(
            speech
        );

    msg.lang = "nl-BE";

    speechSynthesis.speak(msg);

};


/* ============================================================
   TIJDLIJN
============================================================ */

function updateCurrentTimeLine(){

    if(typeof render==="function")
        render();

}


setInterval(
    updateCurrentTimeLine,
    60000
);


/* ============================================================
   ============================================================
   SLAAPVERHAAL
   ============================================================
============================================================ */


/*
    Deze functie haalt de afspraken van morgen
    rechtstreeks uit Google Agenda.

    Hierdoor zijn we niet afhankelijk van de
    huidige weekweergave.
*/

async function getTomorrowEvents(){

    if(!token){

        throw new Error(
            "Je bent niet ingelogd."
        );

    }


    let tomorrow =
        new Date();

    tomorrow.setDate(
        tomorrow.getDate()+1
    );

    tomorrow.setHours(
        0,0,0,0
    );


    let dayAfter =
        new Date(tomorrow);

    dayAfter.setDate(
        dayAfter.getDate()+1
    );


    let result = [];


    for(let cal of calendars){

        let url =

            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?`+
            `timeMin=${encodeURIComponent(tomorrow.toISOString())}&`+
            `timeMax=${encodeURIComponent(dayAfter.toISOString())}&`+
            `singleEvents=true&orderBy=startTime`;


        try{

            let response =
                await fetch(
                    url,
                    {
                        headers:{
                            Authorization:
                                "Bearer "+token
                        }
                    }
                );


            if(!response.ok)
                continue;


            let data =
                await response.json();


            if(!data.items)
                continue;


            data.items.forEach(e=>{

                let start =
                    e.start.dateTime ||
                    e.start.date;


                let end =
                    e.end.dateTime ||
                    e.end.date;


                if(!start)
                    return;


                result.push({

                    title:
                        e.summary || "",

                    start:
                        new Date(start),

                    end:
                        new Date(end),

                    calendarName:
                        rename(cal.summary),

                    location:
                        e.location || ""

                });

            });


        }catch(error){

            console.error(
                "Agenda fout:",
                error
            );

        }

    }


    result.sort(
        (a,b)=>a.start-b.start
    );


    return result;

}


/* ============================================================
   ACTIVITEIT HERKENNEN
============================================================ */

function storyActivity(event){

    let text =
        (
            (event.title || "")+
            " "+
            (event.location || "")
        ).toLowerCase();


    if(
        text.includes("binnenspeeltuin")
    ){

        return {
            type:"play",
            name:"de binnenspeeltuin",
            detail:"een grote overdekte speelplek vol klimtoestellen en kleine geheime hoekjes"
        };

    }


    if(
        text.includes("speeltuin")
    ){

        return {
            type:"play",
            name:"de speeltuin",
            detail:"een vrolijke plek met hoge glijbanen en spannende klimtoestellen"
        };

    }


    if(
        text.includes("strand") ||
        text.includes("zee")
    ){

        return {
            type:"beach",
            name:"het strand",
            detail:"het rustige strand waar de zee zachtjes tegen het zand fluistert"
        };

    }


    if(
        text.includes("stad") ||
        text.includes("stadje") ||
        text.includes("centrum")
    ){

        return {
            type:"city",
            name:"het stadje",
            detail:"de kleine straatjes waar overal iets bijzonders te ontdekken valt"
        };

    }


    if(
        text.includes("museum")
    ){

        return {
            type:"museum",
            name:"het museum",
            detail:"een stil gebouw vol oude geheimen en wonderlijke voorwerpen"
        };

    }


    if(
        text.includes("wandelen") ||
        text.includes("wandeling") ||
        text.includes("bos")
    ){

        return {
            type:"forest",
            name:"het bos",
            detail:"het zachte bos waar de bladeren ritselen in de wind"
        };

    }


    if(
        text.includes("zwem") ||
        text.includes("zwembad")
    ){

        return {
            type:"water",
            name:"het water",
            detail:"een warme plek met rustig kabbelend water"
        };

    }


    if(
        text.includes("camping") ||
        text.includes("tent")
    ){

        return {
            type:"camp",
            name:"de camping",
            detail:"de gezellige plek waar tenten zachtjes bewegen in de avondwind"
        };

    }


    if(
        text.includes("winkel") ||
        text.includes("boodschap")
    ){

        return {
            type:"shop",
            name:"de winkels",
            detail:"een gezellig straatje met kleine winkeltjes"
        };

    }


    if(
        text.includes("trein")
    ){

        return {
            type:"train",
            name:"de trein",
            detail:"een lange trein die rustig door het landschap reed"
        };

    }


    if(
        text.includes("bus")
    ){

        return {
            type:"bus",
            name:"de bus",
            detail:"een vriendelijke bus die hen naar hun volgende avontuur bracht"
        };

    }


    if(
        text.includes("auto") ||
        text.includes("rijden")
    ){

        return {
            type:"car",
            name:"de auto",
            detail:"de auto waarmee ze rustig naar hun volgende bestemming reden"
        };

    }


    if(
        text.includes("pannenkoek")
    ){

        return {
            type:"food",
            name:"pannenkoeken",
            detail:"warme, heerlijke pannenkoeken met een geur die zelfs de uil wakker maakte"
        };

    }


    if(
        text.includes("dieren") ||
        text.includes("dierentuin") ||
        text.includes("zoo")
    ){

        return {
            type:"animals",
            name:"de dieren",
            detail:"allerlei nieuwsgierige dieren die hen vriendelijk begroetten"
        };

    }


    if(
        text.includes("kasteel")
    ){

        return {
            type:"castle",
            name:"het kasteel",
            detail:"een oud kasteel met torens die tot hoog boven de bomen uitstaken"
        };

    }


    if(
        text.includes("dino")
    ){

        return {
            type:"dino",
            name:"de dinosaurussen",
            detail:"grote vriendelijke dinosaurussen uit een heel ver verleden"
        };

    }


    if(
        text.includes("koken") ||
        text.includes("eten")
    ){

        return {
            type:"food",
            name:"het eten",
            detail:"een heerlijke maaltijd waar iedereen rustig van genoot"
        };

    }


    if(
        text.includes("feest") ||
        text.includes("verjaardag")
    ){

        return {
            type:"party",
            name:"het feest",
            detail:"een klein en gezellig feest vol warme lichtjes"
        };

    }


    if(
        text.includes("tuin")
    ){

        return {
            type:"garden",
            name:"de tuin",
            detail:"de groene tuin vol planten, bloemen en kleine kriebelbeestjes"
        };

    }


    return {

        type:"general",

        name:
            event.title ||
            "een bijzondere plek",

        detail:
            "een plek waar iets bijzonders bleek te gebeuren"

    };

}


/* ============================================================
   MOOIE TEKST VAN AFSPRAAK
============================================================ */

function storyDescription(event){

    let activity =
        storyActivity(event);

    return activity;

}


/* ============================================================
   HULPTEKST
============================================================ */

function firstNameFromTitle(title){

    let text =
        (title || "").toLowerCase();


    if(text.includes("odin"))
        return "Odin";

    if(text.includes("niel"))
        return "Niel";

    return null;

}


/* ============================================================
   SLAAPVERHAAL GENERATOR
============================================================ */

function generateSleepStory(eventsTomorrow){

    let date =
        new Date();

    date.setDate(
        date.getDate()+1
    );


    let dateText =
        date.toLocaleDateString(
            "nl-BE",
            {
                weekday:"long",
                day:"numeric",
                month:"long"
            }
        );


    let activities =
        eventsTomorrow.map(
            storyDescription
        );


    let paragraphs = [];


    /*
       BEGIN
    */

    paragraphs.push(

        `Het was een rustige avond in het kabouterbos. `+
        `De maan hing als een klein zilveren lampje tussen de donkere boomtakken. `+
        `In een huisje onder een grote oude eik lagen Odin en Niel al bijna in bed. `+
        `Maar net toen Niel zijn dekentje goed trok, hoorde hij buiten een heel zacht geluid. `+
        `Tik... tik... tik... `+
        `Odin keek nieuwsgierig door het ronde raampje. `+
        `"Wat zou dat zijn?" fluisterde hij.`
        
    );


    paragraphs.push(

        `Op het pad voor hun huisje zat de oude uil. `+
        `Naast hem stond de schildpad, en tussen twee varens piepte het egeltje voorzichtig tevoorschijn. `+
        `De drie vrienden keken alsof ze op iets bijzonders wachtten. `+
        `Odin en Niel deden hun kabouterjasjes aan en stapten naar buiten. `+
        `"Er is vannacht iets vreemds gebeurd," zei de uil zacht. `+
        `"De Maanster heeft een klein stukje van zijn licht verloren."`
        
    );


    paragraphs.push(

        `Niel keek naar de hemel. `+
        `Inderdaad. Tussen de sterren zat een klein donker plekje. `+
        `De schildpad knikte langzaam. `+
        `"Het licht komt morgen terug," zei hij, `+
        `"maar alleen als jullie goed opletten tijdens jullie avonturen." `+
        `Het egeltje glimlachte. `+
        `"Misschien vinden we onderweg wel een glinsterend stukje van het maanlicht."`
        
    );


    /*
       ACTIVITEITEN
    */

    if(activities.length===0){

        paragraphs.push(

            `De volgende ochtend begonnen Odin en Niel rustig aan hun dag. `+
            `Er stond niets vast, en daarom besloten ze het kabouterbos te verkennen. `+
            `Elke plek die ze bezochten leek hen een klein geheim te vertellen.`
            
        );

    }


    activities.forEach((activity,index)=>{

        let extra = "";


        if(activity.type==="play"){

            extra =

                `Toen ze daar aankwamen, zagen Odin en Niel iets wonderlijks. `+
                `De speelplek was niet zomaar een gewone speelplek. `+
                `Helemaal bovenaan stond een klein houten deurtje dat alleen kabouters konden zien. `+
                `Het egeltje klom voorzichtig achter hen aan. `+
                `Toen Odin het deurtje opende, dwarrelden er drie zachte lichtjes naar buiten. `+
                `De uil fluisterde dat het misschien stukjes van de Maanster waren.`;

        }

        else if(activity.type==="beach"){

            extra =

                `Aan het strand bleven de kabouters even helemaal stil. `+
                `De golven kwamen zachtjes aanrollen en trokken zich daarna weer terug. `+
                `Niel zag iets schitteren tussen het zand. `+
                `Hij bukte zich en vond een piepklein zilveren schelpje. `+
                `Toen hij het schelpje tegen zijn oor hield, hoorde hij niet alleen de zee, maar ook een heel zacht slaapliedje.`;

        }

        else if(activity.type==="city"){

            extra =

                `In de kleine straatjes ontdekten Odin en Niel allerlei geluidjes. `+
                `Een deurbel klingelde, ergens lachte iemand en verderop reed een fiets voorbij. `+
                `Maar tussen al die geluiden hoorden de kabouters plotseling een zacht gerinkel. `+
                `Op de grond lag een klein zilveren belletje. `+
                `Het egeltje tikte er voorzichtig tegenaan en meteen wees een sterretje de weg naar de volgende plek.`;

        }

        else if(activity.type==="museum"){

            extra =

                `In het museum vonden ze een oude kast die niemand anders kon openen. `+
                `Odin legde zijn hand op het deurtje en het ging vanzelf een klein stukje open. `+
                `Binnen lag een kaart van het kabouterbos. `+
                `Op de kaart stonden drie kleine sterren getekend. `+
                `De schildpad glimlachte. `+
                `"We zijn op de goede weg."`;

        }

        else if(activity.type==="forest"){

            extra =

                `In het bos liepen ze heel rustig verder. `+
                `De bomen bewogen zachtjes heen en weer. `+
                `Het egeltje wees naar een klein paadje tussen de varens. `+
                `Daar vonden ze een rond steentje dat warm aanvoelde. `+
                `Toen Odin het oppakte, begon het steentje heel zacht te glanzen.`;

        }

        else if(activity.type==="water"){

            extra =

                `Bij het water gingen Odin en Niel even zitten. `+
                `De schildpad keek tevreden naar de kleine golfjes. `+
                `Opeens kwam er een kringetje over het water. `+
                `Daarna nog één. `+
                `En nog één. `+
                `In het midden verscheen een klein zilveren lichtje dat langzaam naar de kant dreef.`;

        }

        else if(activity.type==="camp"){

            extra =

                `Toen ze bij de camping kwamen, zagen ze hoe de tenten zachtjes bewogen in de wind. `+
                `De uil vloog boven hen en wees naar een klein lichtje tussen twee tenten. `+
                `Odin en Niel gingen voorzichtig kijken. `+
                `Daar lag een klein stukje maanlicht te rusten alsof het moe was.`;

        }

        else if(activity.type==="shop"){

            extra =

                `Tussen de winkeltjes zagen de kabouters iets glinsteren. `+
                `Het lag helemaal onderaan bij een deur. `+
                `Het was een klein zilveren knopje. `+
                `Toen Niel het aanraakte, klonk ergens heel ver weg een vrolijk kabouterbelletje.`;

        }

        else if(activity.type==="train" || activity.type==="bus" || activity.type==="car"){

            extra =

                `Onderweg hielden Odin en Niel goed hun ogen open. `+
                `De wereld gleed rustig voorbij en achter iedere bocht kon iets nieuws verschijnen. `+
                `De uil vloog een stukje mee en de schildpad had een klein kaartje bij zich. `+
                `Zo wisten ze precies wanneer ze moesten opletten.`;

        }

        else if(activity.type==="food"){

            extra =

                `Toen het tijd was om iets lekkers te eten, werd iedereen vanzelf een beetje vrolijk. `+
                `Zelfs de uil kwam dichterbij. `+
                `Het egeltje kreeg een klein hapje en de schildpad nam rustig de tijd. `+
                `Na het eten voelde iedereen zich warm en tevreden. `+
                `Precies toen begon het gevonden maanlicht opnieuw zacht te schitteren.`;

        }

        else if(activity.type==="animals"){

            extra =

                `De dieren waren nieuwsgierig naar de twee kabouters. `+
                `Een klein dier wees met zijn neus naar een verborgen paadje. `+
                `Odin en Niel volgden het spoor en ontdekten daar een rustige plek waar honderden kleine lichtpuntjes tussen het gras zweefden.`;

        }

        else if(activity.type==="castle"){

            extra =

                `Bij het kasteel zagen ze hoog boven de toren een klein zilveren lichtje. `+
                `De uil vloog omhoog en kwam even later terug met goed nieuws. `+
                `Het lichtje was een stukje van de Maanster.`;

        }

        else if(activity.type==="dino"){

            extra =

                `De dinosaurussen waren gelukkig heel vriendelijk. `+
                `Een grote dino boog zijn hoofd zodat Odin en Niel op zijn rug konden kijken. `+
                `Van daarboven zagen ze iets schitteren in de verte. `+
                `Het was opnieuw een stukje maanlicht.`;

        }

        else if(activity.type==="garden"){

            extra =

                `In de tuin zochten ze tussen de bladeren. `+
                `Een klein egeltje kroop onder een plant vandaan. `+
                `Hij had iets gevonden: een piepklein zilveren blaadje. `+
                `Het voelde zacht en warm en begon meteen te glanzen toen Odin het aanraakte.`;

        }

        else if(activity.type==="party"){

            extra =

                `Er waren warme lichtjes en iedereen was rustig en blij. `+
                `Odin ontdekte dat zelfs de maanster een beetje begon te schitteren. `+
                `Misschien hield de Maanster wel van vrolijke momenten.`;

        }

        else{

            extra =

                `Odin en Niel bleven goed kijken. `+
                `Ook al leek het op het eerste gezicht een gewone plek, de kabouters wisten inmiddels dat gewone dagen soms de mooiste geheimen verborgen. `+
                `En inderdaad: vlakbij vonden ze een klein zilveren lichtje.`;

        }


        paragraphs.push(

            `${extra} `+
            `Daarna gingen Odin en Niel rustig verder. `+
            `Ze hoefden nergens haast voor te maken. `+
            `De uil vloog boven hen, de schildpad kwam op zijn eigen rustige tempo achter hen aan en het egeltje huppelde vrolijk tussen de bladeren.`
            
        );

    });


    /*
       MIDDEN VAN HET VERHAAL
    */

    paragraphs.push(

        `Toen de avond langzaam dichterbij kwam, hadden Odin en Niel alle kleine lichtjes verzameld. `+
        `Ze gingen samen met hun vrienden naar de hoogste heuvel van het kabouterbos. `+
        `Daar konden ze de hele hemel zien. `+
        `De maan stond precies boven de oude eik. `+
        `Odin legde de lichtjes voorzichtig naast elkaar.`
        
    );


    paragraphs.push(

        `Maar er gebeurde niets. `+
        `De Maanster bleef donker. `+
        `Niel keek een beetje bezorgd. `+
        `"Misschien hebben we iets vergeten," zei hij. `+
        `De uil knikte. `+
        `"Jullie hebben de lichtjes gevonden. Maar het belangrijkste stukje ontbreekt nog."`
        
    );


    paragraphs.push(

        `Iedereen werd stil. `+
        `De schildpad dacht lang na. `+
        `Het egeltje keek naar de grond. `+
        `Toen hoorde Niel iets heel zachts. `+
        `Niet boven hen, maar vlak naast hem. `+
        `Het was het geluid van de wind door de bladeren. `+
        `En plots begreep hij het.`
        
    );


    paragraphs.push(

        `"Het laatste stukje is misschien helemaal geen lichtje," zei Niel. `+
        `"Misschien is het de herinnering aan alles wat we vandaag samen hebben meegemaakt." `+
        `Odin glimlachte. `+
        `De uil sloot zijn ogen. `+
        `De schildpad glimlachte. `+
        `En het egeltje kroop dicht tegen Odin aan.`
        
    );


    /*
       EINDE
    */

    paragraphs.push(

        `Odin en Niel dachten aan alle plekken die ze die dag hadden gezien. `+
        `Aan de kleine ontdekkingen. `+
        `Aan het lachen. `+
        `Aan de rustige momenten. `+
        `Aan hun vrienden. `+
        `Aan de schildpad die altijd rustig bleef, de uil die alles vanuit de lucht zag en het egeltje dat altijd wel ergens een geheim vond.`
        
    );


    paragraphs.push(

        `Toen gebeurde er iets wonderlijks. `+
        `Eerst begon één klein lichtje te glanzen. `+
        `Daarna een tweede. `+
        `En toen alle andere. `+
        `De lichtjes zweefden langzaam omhoog. `+
        `Ze gingen steeds hoger en hoger, totdat ze precies op hun plaats in de Maanster terechtkwamen.`
        
    );


    paragraphs.push(

        `De hemel werd weer helder. `+
        `De maan straalde zacht over het kabouterbos. `+
        `De bomen kregen zilveren randjes en zelfs het kleine huisje van Odin en Niel leek een beetje te glinsteren.`
        
    );


    paragraphs.push(

        `De uil keek naar de kabouters. `+
        `"Het is gelukt." `+
        `De schildpad knikte langzaam. `+
        `"Omdat jullie goed hebben gekeken." `+
        `Het egeltje geeuwde. `+
        `"En omdat jullie samen waren."`
        
    );


    paragraphs.push(

        `Odin en Niel wandelden terug naar hun huisje. `+
        `De nacht was inmiddels helemaal stil geworden. `+
        `Odin trok zijn pyjama aan en kroop onder zijn dekentje. `+
        `Niel legde zijn hoofd op zijn kussen. `+
        `Buiten hoorden ze de uil nog één keer zacht roepen.`
        
    );


    paragraphs.push(

        `De schildpad lag al te slapen onder een groot blad. `+
        `Het egeltje had zich opgerold tot een klein bolletje. `+
        `En hoog boven het kabouterbos stond de Maanster te schitteren.`
        
    );


    paragraphs.push(

        `Odin deed zijn ogen dicht. `+
        `Niel deed zijn ogen dicht. `+
        `De maan scheen zacht door het raam. `+
        `En ergens heel ver weg fluisterde de nacht: `+
        `"Slaap maar rustig. Morgen wacht er weer een nieuw avontuur."`
        
    );


    paragraphs.push(

        `En zo vielen Odin en Niel langzaam in slaap. `+
        `Dromend van bossen, sterren, kleine geheimen en alle avonturen die nog zouden komen.`
        
    );


    return {

        dateText:dateText,

        paragraphs:paragraphs

    };

}


/* ============================================================
   HTML VOOR VERHAAL
============================================================ */

function storyToHTML(paragraphs){

    return paragraphs
        .map(p=>`<p>${escapeHTML(p)}</p>`)
        .join("");

}


function escapeHTML(text){

    return text
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


/* ============================================================
   SLAAPVERHAAL MAKEN
============================================================ */

async function makeSleepStory(){

    let overlay =
        document.getElementById(
            "storyOverlay"
        );

    let loading =
        document.getElementById(
            "storyLoading"
        );

    let storyText =
        document.getElementById(
            "storyText"
        );

    let storyDate =
        document.getElementById(
            "storyDate"
        );


    overlay.style.display = "block";

    loading.style.display = "block";

    storyText.innerHTML = "";


    try{

        if(!token){

            throw new Error(
                "Je bent niet ingelogd bij Google Agenda."
            );

        }


        loading.innerHTML =
            "📅 De afspraken van morgen worden opgehaald...";


        let tomorrowEvents =
            await getTomorrowEvents();


        loading.innerHTML =
            "🧙 Odin en Niel zijn hun avontuur aan het voorbereiden...";


        /*
           kleine vertraging zodat de gebruiker
           de animatietekst ook echt ziet
        */

        await new Promise(
            resolve=>setTimeout(
                resolve,
                400
            )
        );


        let story =
            generateSleepStory(
                tomorrowEvents
            );


        storyDate.innerText =
            "Avontuur voor "+
            story.dateText;


        storyText.innerHTML =
            storyToHTML(
                story.paragraphs
            );


        loading.style.display =
            "none";


    }catch(error){

        console.error(
            "Slaapverhaal fout:",
            error
        );


        loading.innerHTML =

            "😕 Het slaapverhaal kon niet worden gemaakt.<br><br>"+
            escapeHTML(error.message);

    }

}


/* ============================================================
   VERHAAL SLUITEN
============================================================ */

function closeSleepStory(){

    speechSynthesis.cancel();

    document.getElementById(
        "storyOverlay"
    ).style.display = "none";

}


/* ============================================================
   VERHAAL VOORLEZEN
============================================================ */

function readSleepStory(){

    let storyText =
        document.getElementById(
            "storyText"
        );


    if(!storyText)
        return;


    let text =
        storyText.innerText;


    if(!text)
        return;


    speechSynthesis.cancel();


    let msg =
        new SpeechSynthesisUtterance(
            text
        );


    msg.lang = "nl-BE";

    msg.rate = 0.85;

    msg.pitch = 1.0;

    msg.volume = 1;


    /*
       Probeer een Nederlandse stem
       te vinden.
    */

    let voices =
        speechSynthesis.getVoices();


    let dutchVoice =
        voices.find(
            voice =>
                voice.lang === "nl-BE"
        ) ||
        voices.find(
            voice =>
                voice.lang.startsWith("nl")
        );


    if(dutchVoice){

        msg.voice =
            dutchVoice;

    }


    speechSynthesis.speak(msg);

}


/* ============================================================
   VERHAAL STOPPEN
============================================================ */

function stopSleepStory(){

    speechSynthesis.cancel();

}


/* ============================================================
   VERHAAL PRINTEN
============================================================ */

function printSleepStory(){

    document.body.classList.add(
        "printStoryMode"
    );


    window.print();


    setTimeout(()=>{

        document.body.classList.remove(
            "printStoryMode"
        );

    },1000);

}


/* ============================================================
   INIT STARTEN
============================================================ */

parseToken();
