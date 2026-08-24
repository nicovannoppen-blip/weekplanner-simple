let token=null
let calendars=[]
let events=[]
let currentDate=new Date()
let dayMode=false
let bigIcons=false


// =========================================================
// HERNOEM LANGE KALENDER NAMEN
// =========================================================

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


// =========================================================
// VOLGORDE FILTER
// =========================================================

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


// =========================================================
// SMART PICTO AI
// =========================================================

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

}


// =========================================================
// LOGIN / LOGOUT
// =========================================================

function login(){

    window.location.href="/api/auth";

}


async function logout(){

    try{

        await fetch("/api/logout");

    }catch(e){

        console.error("Logout fout:",e);

    }

    token=null;

    localStorage.removeItem("token");

    location.reload();

}


async function parseToken(){

    try{

        const response=await fetch("/api/token");

        if(!response.ok){

            token=null;

            console.log("Niet ingelogd");

            return;

        }

        const data=await response.json();

        token=data.access_token;

        console.log("Automatisch ingelogd");

        await init();

    }catch(error){

        console.error("Authenticatie fout:",error);

        token=null;

    }

}


async function init(){

    if(!token){
        return;
    }

    await loadCalendars();

    await loadEvents();

    render();

}


// =========================================================
// GOOGLE CALENDAR
// =========================================================

async function loadCalendars(){

    let r=await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
            headers:{
                Authorization:"Bearer "+token
            }
        }
    );

    let data=await r.json();

    if(!r.ok){

        console.error("Kalenders ophalen mislukt:",data);

        return;

    }

    console.log(
        data.items.map(c=>c.summary)
    );

    calendars=data.items
    .filter(c=>!HIDDEN_CALENDARS.includes(c.summary))
    .sort((a,b)=>{

        let ia=CALENDAR_ORDER.indexOf(
            rename(a.summary)
        );

        let ib=CALENDAR_ORDER.indexOf(
            rename(b.summary)
        );

        if(ia===-1)ia=999;

        if(ib===-1)ib=999;

        return ia-ib;

    });

    buildFilters();

}


function buildFilters(){

    let f=document.getElementById("filters");

    f.innerHTML="";

    calendars.forEach(c=>{

        let btn=document.createElement("div");

        btn.className="filterBtn active";

        btn.dataset.id=c.id;

        let name=rename(c.summary);

        let iconName=name.toLowerCase();

        btn.innerHTML=`
            <img
                src="icons/${iconName}.png"
                class="filterIcon"
                onerror="this.style.display='none'"
            >

            <div class="filterText">
                ${escapeHtml(name)}
            </div>
        `;

        btn.style.background=c.backgroundColor;

        btn.style.color=
            getContrastColor(c.backgroundColor);

        btn.onclick=()=>{

            btn.classList.toggle("active");

            render();

        };

        f.appendChild(btn);

    });

}


function getContrastColor(hex){

    if(!hex)return"#000";

    let c=hex.substring(1);

    let rgb=parseInt(c,16);

    let r=(rgb>>16)&0xff;

    let g=(rgb>>8)&0xff;

    let b=rgb&0xff;

    let luminance=
        (0.299*r+
         0.587*g+
         0.114*b)/255;

    return luminance>0.6?"#000":"#fff";

}


// =========================================================
// EVENTS LADEN
// =========================================================

async function loadEvents(){

    events=[];

    let start=new Date(currentDate);

    start.setDate(
        start.getDate()-7
    );

    let end=new Date(currentDate);

    end.setDate(
        end.getDate()+7
    );

    for(let cal of calendars){

        let url=
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?`+
        `timeMin=${start.toISOString()}&`+
        `timeMax=${end.toISOString()}&`+
        `singleEvents=true&orderBy=startTime`;

        let r=await fetch(
            url,
            {
                headers:{
                    Authorization:"Bearer "+token
                }
            }
        );

        let data=await r.json();

        if(!r.ok){

            console.error(
                "Agenda ophalen mislukt:",
                data
            );

            continue;

        }

        (data.items||[]).forEach(e=>{

            let s=e.start.dateTime||e.start.date;

            let en=e.end.dateTime||e.end.date;

            if(!s)return;

            events.push({

                title:e.summary||"",

                start:new Date(s),

                end:new Date(en),

                calendar:cal.id,

                calendarName:rename(cal.summary),

                color:cal.backgroundColor,

                location:e.location||"",

                allDay:!e.start.dateTime

            });

        });

    }

}


// =========================================================
// FILTER
// =========================================================

function activeCalendars(){

    let list=[];

    document
        .querySelectorAll(".filterBtn.active")
        .forEach(b=>{

            list.push(b.dataset.id);

        });

    return list;

}


// =========================================================
// PICTOGRAMMEN
// =========================================================

function iconsForEvent(e){

    let text=(e.title||"").toLowerCase();

    if(
        text.includes("rijden van") ||
        text.includes("rijden naar")
    ){
        return["auto"];
    }

    if(
        text.includes("fietsen van") ||
        text.includes("fietsen naar")
    ){
        return["fietsen"];
    }

    if(
        text.includes("wandelen van") ||
        text.includes("wandelen naar") ||
        text.includes("lopen van") ||
        text.includes("lopen naar")
    ){
        return["wandelen_rugzak"];
    }

    if(
        text.includes("trein van") ||
        text.includes("trein naar")
    ){
        return["trein"];
    }

    if(
        text.includes("bus van") ||
        text.includes("bus naar") ||
        text.includes("openbaar vervoer nemen") ||
        text.includes("openbaar vervoer van") ||
        text.includes("openbaar vervoer naar")
    ){
        return["bus"];
    }

    if(
        text.includes("metro van") ||
        text.includes("metro naar")
    ){
        return["metro"];
    }

    if(
        text.includes("tram van") ||
        text.includes("tram naar")
    ){
        return["tram"];
    }

    if(
        text.includes("vliegtuig van") ||
        text.includes("vliegtuig naar")
    ){
        return["vliegtuig"];
    }

    let found=[];

    for(let icon in ICON_AI){

        ICON_AI[icon].forEach(word=>{

            let regex=
                new RegExp(
                    "\\b"+
                    escapeRegex(word.toLowerCase())+
                    "\\b",
                    "i"
                );

            let match=text.match(regex);

            if(match){

                found.push({

                    icon:icon,

                    pos:match.index

                });

            }

        });

    }

    found.sort(
        (a,b)=>a.pos-b.pos
    );

    let icons=found.map(
        f=>f.icon
    );

    icons=[...new Set(icons)];

    return icons;

}


// =========================================================
// MEERDAAGSE EVENTS
// =========================================================

function eventsForDay(day,active){

    let startDay=new Date(day);

    startDay.setHours(8,0,0,0);

    let endDay=new Date(day);

    endDay.setHours(23,0,0,0);

    let list=[];

    events.forEach(e=>{

        if(!active.includes(e.calendar))
            return;

        if(e.end<=startDay)
            return;

        if(e.start>=endDay)
            return;

        let start=new Date(
            Math.max(
                e.start,
                startDay
            )
        );

        let end=new Date(
            Math.min(
                e.end,
                endDay
            )
        );

        list.push({

            ...e,

            start:start,

            end:end

        });

    });

    return list;

}


// =========================================================
// RENDER
// =========================================================

function render(){

    let agenda=
        document.getElementById("agenda");

    agenda.innerHTML="";

    let start=getMonday(currentDate);

    let days=dayMode?1:7;

    let container=
        document.createElement("div");

    container.className="week";

    let active=activeCalendars();

    for(let i=0;i<days;i++){

        let d=new Date(
            dayMode?
            currentDate:
            start
        );

        if(!dayMode)
            d.setDate(
                start.getDate()+i
            );

        let col=
            document.createElement("div");

        col.className="day";

        let todayDate=new Date();

        if(
            d.getDate()==todayDate.getDate() &&
            d.getMonth()==todayDate.getMonth() &&
            d.getFullYear()==todayDate.getFullYear()
        ){

            col.id="today";

        }

        let now=new Date();

        if(
            !dayMode ||
            sameDay(now,d)
        ){

            let line=
                document.createElement("div");

            line.className=
                "currentTimeLine";

            let minutesSince7=
                (now.getHours()-7)*60+
                now.getMinutes();

            line.style.top=
                minutesSince7+"px";

            col.appendChild(line);

        }


        col.onclick=()=>{

            currentDate=new Date(d);

            dayMode=true;

            render();

        };


        let head=
            document.createElement("div");

        head.className="dayHeader";

        let dayIcons=[
            "☀️",
            "🌙",
            "🔥",
            "🌳",
            "⭐",
            "🎉",
            "🌈"
        ];

        let weekday=d.getDay();

        head.innerHTML=
            dayIcons[weekday]+
            " "+
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

            let line=
                document.createElement("div");

            line.className="hour";

            line.style.top=
                ((h-7)*60)+"px";

            col.appendChild(line);

        }


        let dayEvents=
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


    let todayCol=
        document.getElementById("today");

    if(todayCol){

        todayCol.scrollIntoView({

            behavior:"smooth",

            inline:"center",

            block:"nearest"

        });

    }

}


// =========================================================
// LAYOUT EVENTS
// =========================================================

function layoutEvents(
    list,
    col,
    printMode=false
){

    list.sort(
        (a,b)=>a.start-b.start
    );

    let columns=[];

    list.forEach(e=>{

        let placed=false;

        for(
            let i=0;
            i<columns.length;
            i++
        ){

            if(
                columns[i][
                    columns[i].length-1
                ].end<=e.start
            ){

                columns[i].push(e);

                placed=true;

                break;

            }

        }

        if(!placed){

            columns.push([e]);

        }

    });


    columns.forEach(
        (colEvents,i)=>{

        colEvents.forEach(e=>{

            let start=
                (e.start.getHours()-7)*60+
                e.start.getMinutes();

            let dur=
                (e.end-e.start)/60000;

            let div=
                document.createElement("div");

            div.className=
                printMode?
                "event printEvent":
                "event";

            div.style.top=
                start+"px";

            div.style.height=
                dur+"px";


            let width=
                90/columns.length;

            let left=
                5+i*width;

            div.style.left=
                left+"%";

            div.style.width=
                (width-2)+"%";


            div.style.background=
                e.color;


            let icons=
                iconsForEvent(e);

            let iconHTML=
                `<div class="icons">`;


            icons.forEach(ic=>{

                let extraClass="";

                if(

                    ic==="steffifamilie" ||
                    ic==="IrenaGezin" ||
                    ic==="kindjeshalen" ||
                    ic==="kindjesnaar" ||
                    ic==="Jana_en_Vinny" ||
                    ic==="SylvieEnKids" ||
                    ic==="Vansenne" ||
                    ic==="AnthonyEnkids" ||
                    ic==="IrenaEnJulian" ||
                    ic==="vannoppen"

                ){

                    extraClass="bigicon";

                }else{

                    extraClass="smallicon";

                }

                iconHTML+=`

                    <img
                        src="icons/${ic}.png"
                        class="picto ${extraClass}"
                        onerror="this.style.display='none'"
                    >

                `;

            });


            iconHTML+=`</div>`;


            let displayText=
                time(e.start)+
                " "+
                (e.title||"");


            let speechText=(
                "agenda "+
                e.calendarName+
                ": "+
                e.title+
                ". van "+
                time(e.start)+
                " tot "+
                time(e.end)
            ).toLowerCase();


            let words=
                displayText.split(" ");


            let textHTML=
                `<div class="eventText">`;


            words.forEach((w,i)=>{

                textHTML+=`

                    <span
                        class="speechWord"
                        data-index="${i}"
                    >
                        ${escapeHtml(w)}
                    </span>

                `;

            });


            textHTML+=`</div>`;


            div.innerHTML=
                iconHTML+
                textHTML;


            div.onclick=(ev)=>{

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


// =========================================================
// HELPERS
// =========================================================

function sameDay(a,b){

    return(
        a.getFullYear()==b.getFullYear() &&
        a.getMonth()==b.getMonth() &&
        a.getDate()==b.getDate()
    );

}


function time(d){

    return(
        d.getHours()
            .toString()
            .padStart(2,"0")
        +
        ":"+
        d.getMinutes()
            .toString()
            .padStart(2,"0")
    );

}


function getMonday(d){

    d=new Date(d);

    let day=d.getDay();

    let diff=
        d.getDate()-
        day+
        (day==0?-6:1);

    return new Date(
        d.setDate(diff)
    );

}


function escapeHtml(text){

    return String(text||"")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


function escapeRegex(text){

    return String(text).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );

}


// =========================================================
// NAVIGATIE
// =========================================================

function prev(){

    dayMode?
        currentDate.setDate(
            currentDate.getDate()-1
        ):
        currentDate.setDate(
            currentDate.getDate()-7
        );

    init();

}


function next(){

    dayMode?
        currentDate.setDate(
            currentDate.getDate()+1
        ):
        currentDate.setDate(
            currentDate.getDate()+7
        );

    init();

}


function today(){

    currentDate=new Date();

    init();

}


function toggleView(){

    dayMode=!dayMode;

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


// =========================================================
// INIT
// =========================================================

parseToken();


// =========================================================
// KOMENDE AFSPRAKEN
// =========================================================

function showNextEvents(){

    let now=new Date();

    let upcoming=events
        .filter(e=>{

            let dur=
                (e.end-e.start)/3600000;

            if(dur>=15)
                return false;

            return e.start>now;

        })
        .sort(
            (a,b)=>a.start-b.start
        )
        .slice(0,4);


    let popup=
        document.getElementById("popup");

    let popupText=
        document.getElementById("popupText");

    popupText.innerHTML="";


    upcoming.forEach(e=>{

        let lineText=(
            "agenda "+
            (e.calendarName||"")+
            ": van "+
            time(e.start)+
            " tot "+
            time(e.end)+
            " "+
            (e.title||" ")+
            "."
        ).toLowerCase();


        let words=
            lineText.split(/\s+/);


        let lineDiv=
            document.createElement("div");

        lineDiv.className="popupLine";


        words.forEach((w,i)=>{

            let span=
                document.createElement("span");

            span.className=
                "speechWord";

            span.dataset.index=i;

            span.innerText=w+" ";

            lineDiv.appendChild(span);

        });


        popupText.appendChild(lineDiv);

    });


    popup.style.display="flex";


    speak(

        upcoming.map(e=>

            "agenda "+
            (e.calendarName||"")+
            ": van "+
            time(e.start)+
            " tot "+
            time(e.end)+
            " "+
            (e.title||"")

        ).join(". "),

        popupText

    );

}


// =========================================================
// STEM
// =========================================================

function speak(text,lineDiv){

    speechSynthesis.cancel();

    let speechWords=
        text.split(/\s+/);

    let spans=
        Array.from(
            lineDiv.querySelectorAll(
                ".speechWord"
            )
        );

    let msg=
        new SpeechSynthesisUtterance(text);

    msg.lang="nl-BE";

    msg.onboundary=function(event){

        if(event.name!=="word")
            return;

        let charIndex=
            event.charIndex;

        let total=0;

        let currentWordIndex=
            speechWords.length-1;


        for(
            let i=0;
            i<speechWords.length;
            i++
        ){

            total+=
                speechWords[i].length+1;

            if(total>charIndex){

                currentWordIndex=i;

                break;

            }

        }


        spans.forEach(
            s=>s.classList.remove("active")
        );


        let span=
            spans[currentWordIndex];

        if(span)
            span.classList.add("active");

    };


    msg.onend=()=>{

        spans.forEach(
            s=>s.classList.remove("active")
        );

    };


    speechSynthesis.speak(msg);

}


// =========================================================
// POPUP
// =========================================================

function closePopup(){

    document.getElementById(
        "popup"
    ).style.display="none";

}


// =========================================================
// SWIPE
// =========================================================

let touchStartX=0;


document.addEventListener(
    "touchstart",
    e=>{
        touchStartX=
            e.changedTouches[0].screenX;
    }
);


document.addEventListener(
    "touchend",
    e=>{

        let touchEndX=
            e.changedTouches[0].screenX;

        let diff=
            touchStartX-touchEndX;

        if(diff>60)
            next();

        if(diff<-60)
            prev();

    }
);


// =========================================================
// PRINT WEEK
// =========================================================

function printWeek(){

    let start=
        getMonday(currentDate);

    let printContainer=
        document.getElementById(
            "printContainer"
        );


    if(!printContainer){

        printContainer=
            document.createElement("div");

        printContainer.id=
            "printContainer";

        document.body.appendChild(
            printContainer
        );

    }


    printContainer.innerHTML="";


    let active=
        activeCalendars();


    for(let i=0;i<7;i++){

        let d=
            new Date(start);

        d.setDate(
            start.getDate()+i
        );


        let dayEvents=
            eventsForDay(
                d,
                active
            );


        let dayDiv=
            document.createElement("div");

        dayDiv.className=
            "printDay";


        let dayIcons=[
            "☀️",
            "🌙",
            "🔥",
            "🌳",
            "⭐",
            "🎉",
            "🌈"
        ];


        let weekday=d.getDay();


        let h2=
            document.createElement("h2");


        h2.innerText=
            dayIcons[weekday]+
            " "+
            d.toLocaleDateString(
                "nl-BE",
                {
                    weekday:"long",
                    day:"2-digit",
                    month:"2-digit"
                }
            );


        dayDiv.appendChild(h2);


        let dayContainer=
            document.createElement("div");

        dayContainer.className=
            "printDayContainer";

        dayDiv.appendChild(
            dayContainer
        );


        for(let h=7;h<=23;h++){

            let hourLine=
                document.createElement("div");

            hourLine.className=
                "printHour";

            hourLine.style.top=
                ((h-7)*60)+"px";

            hourLine.innerText=
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
        "Tip: zet je printer op enkelzijdig voor beste resultaat"
    );

    window.print();

    location.reload();

}


// =========================================================
// LIVE KLOK
// =========================================================

let clockContainer=
    document.createElement("div");

clockContainer.id="liveClock";

clockContainer.style.display=
    "inline-flex";

clockContainer.style.alignItems=
    "center";

clockContainer.style.marginLeft=
    "5px";

clockContainer.style.gap=
    "30px";

document
    .querySelector("header")
    .appendChild(clockContainer);


let clockTime=
    document.createElement("div");

clockTime.id=
    "liveClockTime";

clockTime.style.cursor=
    "pointer";

clockTime.style.fontWeight=
    "bold";

clockTime.style.fontSize=
    "3em";

clockContainer.appendChild(
    clockTime
);


let clockDate=
    document.createElement("div");

clockDate.id=
    "liveClockDate";

clockDate.style.cursor=
    "pointer";

clockDate.style.fontWeight=
    "bold";

clockDate.style.fontSize=
    "1em";

clockContainer.appendChild(
    clockDate
);


function updateClock(){

    let now=new Date();

    let hours=
        now.getHours()
        .toString()
        .padStart(2,"0");

    let minutes=
        now.getMinutes()
        .toString()
        .padStart(2,"0");


    clockTime.innerText=
        `${hours}:${minutes}`;


    let weekday=
        now.toLocaleDateString(
            "nl-BE",
            {
                weekday:"long"
            }
        );

    let day=
        now.getDate()
        .toString()
        .padStart(2,"0");

    let month=
        now.toLocaleDateString(
            "nl-BE",
            {
                month:"long"
            }
        );

    let year=
        now.getFullYear();


    clockDate.innerText=
        `${weekday} ${day} ${month} ${year}`;

}


setInterval(
    updateClock,
    1000
);

updateClock();


clockTime.onclick=()=>{

    let now=new Date();

    let hours=now.getHours();

    let minutes=now.getMinutes();

    let speech=
        `Het is ${hours} uur en ${minutes} minuten.`;

    let msg=
        new SpeechSynthesisUtterance(
            speech
        );

    msg.lang="nl-BE";

    speechSynthesis.speak(msg);

};


clockDate.onclick=()=>{

    let now=new Date();

    let weekday=
        now.toLocaleDateString(
            "nl-BE",
            {
                weekday:"long"
            }
        );

    let day=now.getDate();

    let month=
        now.toLocaleDateString(
            "nl-BE",
            {
                month:"long"
            }
        );

    let year=now.getFullYear();


    let speech=
        `Vandaag is ${weekday} ${day} ${month} ${year}.`;

    let msg=
        new SpeechSynthesisUtterance(
            speech
        );

    msg.lang="nl-BE";

    speechSynthesis.speak(msg);

};


// =========================================================
// UPDATE CURRENT TIME LINE
// =========================================================

setInterval(
    updateCurrentTimeLine,
    60000
);

updateCurrentTimeLine();


function updateCurrentTimeLine(){

    let now=new Date();

    let line=
        document.querySelector(
            ".currentTimeLine"
        );

    if(!line)
        return;

    let minutesSince7=
        (now.getHours()-7)*60+
        now.getMinutes();

    line.style.top=
        minutesSince7+"px";

}


// =========================================================
// =========================================================
// SLAAPVERHAAL
// =========================================================
// =========================================================


// ---------------------------------------------------------
// Datum van morgen
// ---------------------------------------------------------

function getTomorrow(){

    let tomorrow=new Date();

    tomorrow.setDate(
        tomorrow.getDate()+1
    );

    tomorrow.setHours(
        0,0,0,0
    );

    return tomorrow;

}


// ---------------------------------------------------------
// Nederlandse datum
// ---------------------------------------------------------

function formatStoryDate(date){

    return date.toLocaleDateString(
        "nl-BE",
        {
            weekday:"long",
            day:"numeric",
            month:"long",
            year:"numeric"
        }
    );

}


// ---------------------------------------------------------
// Haal ALLE afspraken van morgen rechtstreeks
// uit Google Calendar.
// Dit staat los van de huidige weekweergave.
// ---------------------------------------------------------

async function getTomorrowCalendarEvents(){

    if(!token){

        throw new Error(
            "Je bent niet ingelogd."
        );

    }


    if(!calendars || calendars.length===0){

        await loadCalendars();

    }


    let tomorrow=
        getTomorrow();


    let dayAfter=
        new Date(tomorrow);

    dayAfter.setDate(
        dayAfter.getDate()+1
    );


    let result=[];


    for(const cal of calendars){

        let url=
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?`+
            `timeMin=${encodeURIComponent(tomorrow.toISOString())}&`+
            `timeMax=${encodeURIComponent(dayAfter.toISOString())}&`+
            `singleEvents=true&`+
            `orderBy=startTime&`+
            `maxResults=100`;


        let response=
            await fetch(
                url,
                {
                    headers:{
                        Authorization:
                            "Bearer "+token
                    }
                }
            );


        if(!response.ok){

            let errorText=
                await response.text();

            console.error(
                "Fout bij kalender:",
                cal.summary,
                errorText
            );

            continue;

        }


        let data=
            await response.json();


        (data.items||[]).forEach(event=>{

            let isAllDay=
                Boolean(event.start.date);


            let start=
                event.start.dateTime ||
                event.start.date;


            let end=
                event.end.dateTime ||
                event.end.date;


            if(!start)
                return;


            result.push({

                title:
                    event.summary ||
                    "Afspraak",

                start:
                    new Date(start),

                end:
                    new Date(end),

                calendar:
                    rename(cal.summary),

                location:
                    event.location ||
                    "",

                description:
                    event.description ||
                    "",

                allDay:
                    isAllDay

            });

        });

    }


    result.sort(
        (a,b)=>a.start-b.start
    );


    return result;

}


// ---------------------------------------------------------
// Maak een rustige samenvatting van de agenda.
// Deze tekst wordt naar de API gestuurd.
// ---------------------------------------------------------

function createStoryAgendaSummary(events){

    if(!events.length){

        return `
Er staan morgen geen afspraken in de agenda.
Maak daarom een rustig fantasie-avontuur waarin Odin en Niel
een gewone maar bijzondere dag beleven.
`;

    }


    let lines=[];


    events.forEach((event,index)=>{

        let timeText;


        if(event.allDay){

            timeText=
                "de hele dag";

        }else{

            timeText=
                `${time(event.start)} tot ${time(event.end)}`;

        }


        let line=
            `${index+1}. ${timeText} — ${event.title}`;


        if(event.calendar){

            line+=
                ` [agenda: ${event.calendar}]`;

        }


        if(event.location){

            line+=
                ` [plaats: ${event.location}]`;

        }


        lines.push(line);

    });


    return lines.join("\n");

}


// ---------------------------------------------------------
// Vorig verhaal ophalen.
// Dit zorgt voor continuïteit tussen verhalen.
// ---------------------------------------------------------

function getPreviousStory(){

    try{

        return localStorage.getItem(
            "odinNielLastStory"
        ) || "";

    }catch(error){

        console.warn(
            "Vorig verhaal kon niet worden gelezen:",
            error
        );

        return "";

    }

}


// ---------------------------------------------------------
// Nieuw verhaal bewaren.
// ---------------------------------------------------------

function saveStory(story){

    try{

        localStorage.setItem(
            "odinNielLastStory",
            story
        );

        localStorage.setItem(
            "odinNielLastStoryDate",
            new Date().toISOString()
        );

    }catch(error){

        console.warn(
            "Verhaal kon niet worden opgeslagen:",
            error
        );

    }

}


// ---------------------------------------------------------
// Genereer verhaal via onze server.
// ---------------------------------------------------------

async function generateTomorrowStory(
    calendarEvents
){

    let tomorrow=
        getTomorrow();


    let previousStory=
        getPreviousStory();


    // Het vorige verhaal kan erg lang zijn.
    // We gebruiken alleen het einde als continuïteitsanker.
    let previousExcerpt="";

    if(previousStory){

        previousExcerpt=
            previousStory.slice(-5000);

    }


    let agendaSummary=
        createStoryAgendaSummary(
            calendarEvents
        );


    let response=
        await fetch(
            "/api/story",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                        "application/json"
                },

                body:JSON.stringify({

                    date:
                        tomorrow.toISOString(),

                    agenda:
                        agendaSummary,

                    previousStory:
                        previousExcerpt

                })

            }
        );


    let data=
        await response.json();


    if(!response.ok){

        throw new Error(
            data.error ||
            "Het slaapverhaal kon niet worden gemaakt."
        );

    }


    if(!data.story){

        throw new Error(
            "De AI heeft geen verhaal teruggestuurd."
        );

    }


    return data.story;

}


// ---------------------------------------------------------
// Verhaal tonen
// ---------------------------------------------------------

function displayStory(story,date){

    let panel=
        document.getElementById(
            "storyPanel"
        );

    let content=
        document.getElementById(
            "storyContent"
        );

    let loading=
        document.getElementById(
            "storyLoading"
        );

    let actions=
        document.getElementById(
            "storyActions"
        );

    let storyDate=
        document.getElementById(
            "storyDate"
        );


    storyDate.innerText=
        formatStoryDate(date);


    content.innerHTML=
        formatStoryHtml(story);


    loading.style.display=
        "none";


    content.style.display=
        "block";


    actions.style.display=
        "flex";


    panel.classList.add(
        "visible"
    );


    panel.scrollTop=0;

}


// ---------------------------------------------------------
// Maak tekst netjes op.
// ---------------------------------------------------------

function formatStoryHtml(story){

    let safe=
        escapeHtml(story);


    let paragraphs=
        safe
        .split(/\n\s*\n/)
        .map(p=>p.trim())
        .filter(Boolean);


    if(paragraphs.length===0){

        paragraphs=
            safe
            .split("\n")
            .map(p=>p.trim())
            .filter(Boolean);

    }


    return paragraphs
        .map(p=>{

            if(
                p.length<100 &&
                !p.includes(".")
            ){

                return `
                    <div class="storyHeading">
                        ${p}
                    </div>
                `;

            }


            return `
                <p class="storyParagraph">
                    ${p.replace(/\n/g,"<br>")}
                </p>
            `;

        })
        .join("");

}


// ---------------------------------------------------------
// KNOP: Maak slaapverhaal voor morgen
// ---------------------------------------------------------

async function makeTomorrowStory(){

    let panel=
        document.getElementById(
            "storyPanel"
        );

    let loading=
        document.getElementById(
            "storyLoading"
        );

    let content=
        document.getElementById(
            "storyContent"
        );

    let actions=
        document.getElementById(
            "storyActions"
        );

    let storyDate=
        document.getElementById(
            "storyDate"
        );

    let button=
        document.getElementById(
            "storyButton"
        );


    if(!token){

        alert(
            "Je moet eerst ingelogd zijn om de agenda te kunnen gebruiken."
        );

        return;

    }


    // Stop eventueel lopende voorleesfunctie.
    speechSynthesis.cancel();


    panel.classList.add(
        "visible"
    );


    loading.style.display=
        "block";


    content.style.display=
        "none";


    actions.style.display=
        "none";


    let tomorrow=
        getTomorrow();


    storyDate.innerText=
        formatStoryDate(tomorrow);


    button.disabled=true;

    button.innerText=
        "🌙 Verhaal wordt gemaakt...";


    try{

        let calendarEvents=
            await getTomorrowCalendarEvents();


        let story=
            await generateTomorrowStory(
                calendarEvents
            );


        saveStory(story);


        displayStory(
            story,
            tomorrow
        );


    }catch(error){

        console.error(
            "Slaapverhaal fout:",
            error
        );


        loading.innerHTML=`

            <div style="font-size:50px;">
                😕
            </div>

            <div style="margin-top:15px;">
                Het slaapverhaal kon niet worden gemaakt.
            </div>

            <div
                style="
                    margin-top:10px;
                    font-size:14px;
                    color:#777;
                "
            >
                ${escapeHtml(error.message)}
            </div>

        `;

        loading.style.display=
            "block";


        content.style.display=
            "none";


        actions.style.display=
            "none";


    }finally{

        button.disabled=false;

        button.innerText=
            "📖 Maak slaapverhaal voor morgen";

    }

}


// ---------------------------------------------------------
// Sluit verhaal
// ---------------------------------------------------------

function closeStory(){

    stopStoryReading();

    document
        .getElementById("storyPanel")
        .classList.remove("visible");

}


// ---------------------------------------------------------
// Verhaal voorlezen
// ---------------------------------------------------------

function readStory(){

    let content=
        document.getElementById(
            "storyContent"
        );


    if(!content)
        return;


    let text=
        content.innerText.trim();


    if(!text)
        return;


    speechSynthesis.cancel();


    let msg=
        new SpeechSynthesisUtterance(
            text
        );


    msg.lang="nl-BE";

    // Rustig tempo voor bedtijd.
    msg.rate=0.82;

    msg.pitch=1;


    speechSynthesis.speak(msg);

}


// ---------------------------------------------------------
// Voorlezen stoppen
// ---------------------------------------------------------

function stopStoryReading(){

    speechSynthesis.cancel();

}


// ---------------------------------------------------------
// Verhaal afdrukken
// ---------------------------------------------------------

function printStory(){

    stopStoryReading();


    let content=
        document.getElementById(
            "storyContent"
        );


    if(
        !content ||
        !content.innerText.trim()
    ){

        return;

    }


    document.body.classList.add(
        "storyPrinting"
    );


    window.print();


    setTimeout(()=>{

        document.body.classList.remove(
            "storyPrinting"
        );

    },1000);

}


// ---------------------------------------------------------
// Escape handler voor slaapverhaal
// ---------------------------------------------------------

document.addEventListener(
    "keydown",
    event=>{

        if(
            event.key==="Escape"
        ){

            let panel=
                document.getElementById(
                    "storyPanel"
                );


            if(
                panel &&
                panel.classList.contains(
                    "visible"
                )
            ){

                closeStory();

            }

        }

    }
);
