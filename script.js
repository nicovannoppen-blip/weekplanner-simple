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


    console.log(data.items.map(c=>c.summary));


    calendars=data.items
    .filter(c=>!HIDDEN_CALENDARS.includes(c.summary))
    .sort((a,b)=>{

        let ia=CALENDAR_ORDER.indexOf(rename(a.summary));
        let ib=CALENDAR_ORDER.indexOf(rename(b.summary));

        if(ia==-1) ia=999;
        if(ib==-1) ib=999;

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
            >

            <div class="filterText">
                ${name}
            </div>

        `;


        btn.style.background=c.backgroundColor;

        btn.style.color=getContrastColor(c.backgroundColor);


        btn.onclick=()=>{

            btn.classList.toggle("active");

            render();

        };


        f.appendChild(btn);

    });

}


function getContrastColor(hex){

    if(!hex) return "#000";


    let c=hex.substring(1);

    let rgb=parseInt(c,16);

    let r=(rgb>>16)&0xff;

    let g=(rgb>>8)&0xff;

    let b=(rgb>>0)&0xff;


    let luminance=
        (0.299*r+
         0.587*g+
         0.114*b)/255;


    return luminance>0.6 ? "#000" : "#fff";

}


// =========================================================
// LOAD EVENTS
// =========================================================

async function loadEvents(){

    events=[];


    let start=new Date(currentDate);

    start.setDate(start.getDate()-7);


    let end=new Date(currentDate);

    end.setDate(end.getDate()+7);


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


        if(!data.items) continue;


        data.items.forEach(e=>{

            let s=e.start.dateTime||e.start.date;

            let en=e.end.dateTime||e.end.date;


            if(!s) return;


            events.push({

                title:e.summary||"",

                start:new Date(s),

                end:new Date(en),

                calendar:cal.id,

                calendarName:rename(cal.summary),

                color:cal.backgroundColor,

                location:e.location||""

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
// SMART PICTO
// =========================================================

function iconsForEvent(e){

    let text=(e.title).toLowerCase();


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
        text.includes("metro van") ||
        text.includes("metro naar")
    ){

        return ["metro"];

    }


    if(
        text.includes("tram van") ||
        text.includes("tram naar")
    ){

        return ["tram"];

    }


    if(
        text.includes("vliegtuig van") ||
        text.includes("vliegtuig naar")
    ){

        return ["vliegtuig"];

    }


    let found=[];


    for(let icon in ICON_AI){

        ICON_AI[icon].forEach(word=>{

            let regex=new RegExp(
                "\\b"+
                word.toLowerCase()+
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


    found.sort((a,b)=>a.pos-b.pos);


    let icons=found.map(f=>f.icon);


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

        if(!active.includes(e.calendar)) return;

        if(e.end<=startDay) return;

        if(e.start>=endDay) return;


        let start=new Date(
            Math.max(e.start,startDay)
        );


        let end=new Date(
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


// =========================================================
// RENDER
// =========================================================

function render(){

    let agenda=document.getElementById("agenda");

    agenda.innerHTML="";


    let start=getMonday(currentDate);

    let days=dayMode?1:7;


    let container=document.createElement("div");

    container.className="week";


    let active=activeCalendars();


    for(let i=0;i<days;i++){

        let d=new Date(
            dayMode?currentDate:start
        );


        if(!dayMode){

            d.setDate(
                start.getDate()+i
            );

        }


        let col=document.createElement("div");

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


        if(!dayMode || sameDay(now,d)){

            let line=document.createElement("div");

            line.className="currentTimeLine";


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


        let head=document.createElement("div");

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

            dayIcons[weekday]+" "+

            d.toLocaleDateString(
                "nl-BE",
                {
                    weekday:"long"
                }
            )+" "+

            d.toLocaleDateString(
                "nl-BE",
                {
                    day:"2-digit",
                    month:"2-digit"
                }
            );


        col.appendChild(head);


        for(let h=7;h<=23;h++){

            let line=document.createElement("div");

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


    if(bigIcons){

        agenda.classList.add("large");

    }else{

        agenda.classList.remove("large");

    }


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
                columns[i][columns[i].length-1].end
                <=e.start
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
                printMode
                ?
                "event printEvent"
                :
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
                        ${w}
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

    return (

        a.getFullYear()==b.getFullYear() &&

        a.getMonth()==b.getMonth() &&

        a.getDate()==b.getDate()

    );

}


function time(d){

    return (

        d.getHours()
        .toString()
        .padStart(2,"0")

        +

        ":"

        +

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


// =========================================================
// NAVIGATIE
// =========================================================

function prev(){

    dayMode
    ?
    currentDate.setDate(
        currentDate.getDate()-1
    )
    :
    currentDate.setDate(
        currentDate.getDate()-7
    );


    init();

}


function next(){

    dayMode
    ?
    currentDate.setDate(
        currentDate.getDate()+1
    )
    :
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
            (e.end-e.start)/
            3600000;


        if(dur>=15) return false;


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


        lineDiv.className=
            "popupLine";


        words.forEach((w,i)=>{

            let span=
                document.createElement("span");


            span.className=
                "speechWord";


            span.dataset.index=i;


            span.innerText=
                w+" ";


            lineDiv.appendChild(span);

        });


        popupText.appendChild(
            lineDiv
        );

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
        new SpeechSynthesisUtterance(
            text
        );


    msg.lang="nl-BE";


    msg.onboundary=function(event){

        if(event.name!=="word") return;


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
                speechWords[i].length+
                1;


            if(total>charIndex){

                currentWordIndex=i;

                break;

            }

        }


        spans.forEach(
            s=>
            s.classList.remove("active")
        );


        let span=
            spans[currentWordIndex];


        if(span){

            span.classList.add("active");

        }

    };


    msg.onend=()=>{

        spans.forEach(
            s=>
            s.classList.remove("active")
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


        if(diff>60) next();

        if(diff<-60) prev();

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


        let weekday=
            d.getDay();


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


clockContainer.id=
    "liveClock";


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


    let hours=
        now.getHours();


    let minutes=
        now.getMinutes();


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


    let day=
        now.getDate();


    let month=
        now.toLocaleDateString(
            "nl-BE",
            {
                month:"long"
            }
        );


    let year=
        now.getFullYear();


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
// UPDATE TIJDLIJN
// =========================================================

setInterval(
    updateCurrentTimeLine,
    60000
);


// Alleen uitvoeren als functie bestaat
if(typeof updateCurrentTimeLine==="function"){

    updateCurrentTimeLine();

}


// =========================================================
// NIEUW
// =========================================================
// AFBEELDING MAKEN VAN MORGEN
// =========================================================

let tomorrowImageDataURL=null;


/**
 * Geeft de datum van morgen terug.
 */
function getTomorrowDate(){

    let tomorrow=new Date();

    tomorrow.setDate(
        tomorrow.getDate()+1
    );

    return tomorrow;

}


/**
 * Haalt alle afspraken van morgen
 * uit de reeds geladen Google Agenda.
 */
function getTomorrowEvents(){

    let tomorrow=
        getTomorrowDate();


    let startOfTomorrow=
        new Date(tomorrow);


    startOfTomorrow.setHours(
        0,0,0,0
    );


    let endOfTomorrow=
        new Date(tomorrow);


    endOfTomorrow.setDate(
        endOfTomorrow.getDate()+1
    );


    endOfTomorrow.setHours(
        0,0,0,0
    );


    let active=
        activeCalendars();


    return events

        .filter(e=>{

            /*
             * Alleen actieve kalenders
             */
            if(
                active.length &&
                !active.includes(e.calendar)
            ){

                return false;

            }


            /*
             * Event overlapt met morgen
             */
            if(e.end<=startOfTomorrow){

                return false;

            }


            if(e.start>=endOfTomorrow){

                return false;

            }


            return true;

        })


        .sort(
            (a,b)=>
                a.start-b.start
        );

}


/**
 * Mooie datum voor bovenaan de afbeelding.
 */
function formatTomorrowDate(){

    let d=
        getTomorrowDate();


    return d.toLocaleDateString(
        "nl-BE",
        {
            weekday:"long",
            day:"numeric",
            month:"long",
            year:"numeric"
        }
    );

}


/**
 * Tekst geschikt maken voor Canvas.
 */
function wrapCanvasText(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
){

    let words=
        text.split(" ");


    let line="";


    for(let n=0;n<words.length;n++){

        let testLine=
            line+
            words[n]+
            " ";


        let metrics=
            ctx.measureText(
                testLine
            );


        let testWidth=
            metrics.width;


        if(
            testWidth>maxWidth &&
            n>0
        ){

            ctx.fillText(
                line,
                x,
                y
            );


            line=
                words[n]+" ";


            y+=lineHeight;

        }else{

            line=testLine;

        }

    }


    ctx.fillText(
        line,
        x,
        y
    );


    return y+lineHeight;

}


/**
 * Laad een pictogram uit /icons/.
 */
function loadTomorrowIcon(iconName){

    return new Promise(
        resolve=>{

            let img=
                new Image();


            img.onload=()=>{

                resolve(img);

            };


            img.onerror=()=>{

                resolve(null);

            };


            img.src=
                `icons/${iconName}.png`;

        }
    );

}


/**
 * Maak de daadwerkelijke PNG-afbeelding.
 */
async function createTomorrowCanvasImage(
    tomorrowEvents
){

    /*
     * Canvas-formaat.
     *
     * 1200 breed is mooi voor smartphone,
     * computer en eventueel afdruk.
     */

    const width=1200;


    /*
     * Hoogte wordt berekend op basis
     * van het aantal afspraken.
     */

    const headerHeight=190;

    const eventHeight=150;

    const footerHeight=80;


    let height=
        headerHeight+
        Math.max(
            tomorrowEvents.length,
            1
        )*
        eventHeight+
        footerHeight;


    /*
     * Maximumhoogte.
     *
     * Bij heel veel afspraken wordt
     * de afbeelding dus niet eindeloos.
     */

    height=
        Math.min(
            Math.max(height,650),
            5000
        );


    let canvas=
        document.createElement("canvas");


    canvas.width=width;

    canvas.height=height;


    let ctx=
        canvas.getContext("2d");


    /*
     * Achtergrond
     */

    ctx.fillStyle="#ffffff";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
     * Header
     */

    ctx.fillStyle="#4285F4";

    ctx.fillRect(
        0,
        0,
        width,
        headerHeight
    );


    /*
     * Titel
     */

    ctx.fillStyle="#ffffff";

    ctx.textAlign="center";

    ctx.font=
        "bold 52px Arial";


    ctx.fillText(
        "🌙 MORGEN",
        width/2,
        65
    );


    ctx.font=
        "bold 34px Arial";


    ctx.fillText(
        formatTomorrowDate(),
        width/2,
        120
    );


    ctx.font=
        "24px Arial";


    ctx.fillText(
        "Onze dagplanning",
        width/2,
        160
    );


    /*
     * Geen afspraken
     */

    if(tomorrowEvents.length===0){

        ctx.fillStyle="#333333";

        ctx.textAlign="center";

        ctx.font=
            "bold 36px Arial";


        ctx.fillText(
            "🌳 Geen afspraken gepland",
            width/2,
            headerHeight+150
        );


        ctx.font=
            "26px Arial";


        ctx.fillText(
            "Een rustige dag! 😊",
            width/2,
            headerHeight+200
        );


        return canvas.toDataURL(
            "image/png"
        );

    }


    /*
     * Pictogrammen vooraf laden
     */

    let iconImages=[];


    for(
        let i=0;
        i<tomorrowEvents.length;
        i++
    ){

        let event=
            tomorrowEvents[i];


        let icons=
            iconsForEvent(event);


        /*
         * We gebruiken maximaal 3 pictogrammen
         * zodat de afbeelding overzichtelijk blijft.
         */

        icons=
            icons.slice(0,3);


        let loaded=[];


        for(let ic of icons){

            let img=
                await loadTomorrowIcon(ic);


            if(img){

                loaded.push(img);

            }

        }


        iconImages.push(loaded);

    }


    /*
     * Afspraken tekenen
     */

    for(
        let i=0;
        i<tomorrowEvents.length;
        i++
    ){

        let e=
            tomorrowEvents[i];


        let y=
            headerHeight+
            i*eventHeight;


        /*
         * Achtergrond om en om
         */

        ctx.fillStyle=
            i%2===0
            ?
            "#f7f9fc"
            :
            "#ffffff";


        ctx.fillRect(
            0,
            y,
            width,
            eventHeight
        );


        /*
         * Kalenderkleur als balkje
         */

        ctx.fillStyle=
            e.color ||
            "#4285F4";


        ctx.fillRect(
            0,
            y,
            16,
            eventHeight
        );


        /*
         * Tijd
         */

        ctx.textAlign="left";

        ctx.fillStyle="#333333";

        ctx.font=
            "bold 38px Arial";


        let eventStart=
            time(e.start);


        let eventEnd=
            time(e.end);


        ctx.fillText(
            eventStart,
            45,
            y+55
        );


        ctx.font=
            "24px Arial";


        ctx.fillStyle="#777777";


        ctx.fillText(
            eventEnd,
            47,
            y+90
        );


        /*
         * Pictogrammen
         */

        let images=
            iconImages[i];


        let iconX=200;


        images.forEach(img=>{

            let maxSize=80;

            let ratio=
                Math.min(
                    maxSize/img.width,
                    maxSize/img.height
                );


            let w=
                img.width*ratio;


            let h=
                img.height*ratio;


            ctx.drawImage(
                img,
                iconX,
                y+30,
                w,
                h
            );


            iconX+=
                Math.max(
                    w+15,
                    75
                );

        });


        /*
         * Titel
         */

        let title=
            e.title ||
            "Afspraak";


        let titleX=
            Math.max(
                iconX+15,
                360
            );


        ctx.fillStyle="#111111";

        ctx.font=
            "bold 30px Arial";


        let titleY=
            y+58;


        titleY=
            wrapCanvasText(
                ctx,
                title,
                titleX,
                titleY,
                width-titleX-40,
                38
            );


        /*
         * Locatie indien aanwezig
         */

        if(e.location){

            ctx.fillStyle="#777777";

            ctx.font=
                "22px Arial";


            ctx.fillText(
                "📍 "+e.location,
                titleX,
                y+112
            );

        }


        /*
         * Kalendernaam subtiel
         */

        if(e.calendarName){

            ctx.fillStyle="#999999";

            ctx.font=
                "18px Arial";


            ctx.textAlign="right";


            ctx.fillText(
                e.calendarName,
                width-35,
                y+135
            );

        }

    }


    /*
     * Footer
     */

    ctx.fillStyle="#4285F4";

    ctx.fillRect(
        0,
        height-footerHeight,
        width,
        footerHeight
    );


    ctx.fillStyle="#ffffff";

    ctx.textAlign="center";

    ctx.font=
        "24px Arial";


    ctx.fillText(
        "🌙 Een fijne dag gewenst! ❤️",
        width/2,
        height-30
    );


    /*
     * PNG teruggeven
     */

    return canvas.toDataURL(
        "image/png"
    );

}


/**
 * Hoofdfunctie van de knop.
 */
async function makeTomorrowImage(){

    /*
     * Controleer login.
     */

    if(!token){

        alert(
            "Je moet eerst ingelogd zijn."
        );

        return;

    }


    /*
     * Open popup.
     */

    let popup=
        document.getElementById(
            "tomorrowImagePopup"
        );


    let info=
        document.getElementById(
            "tomorrowImageInfo"
        );


    let container=
        document.getElementById(
            "tomorrowImageContainer"
        );


    popup.style.display="flex";


    container.innerHTML="";


    info.innerText=
        "📅 De afspraken van morgen worden opgezocht...";


    /*
     * Ophalen.
     */

    let tomorrowEvents=
        getTomorrowEvents();


    /*
     * Status tonen.
     */

    if(
        tomorrowEvents.length===0
    ){

        info.innerText=
            "Morgen staan er geen afspraken in de geselecteerde agenda's.";

    }else{

        info.innerText=
            `${tomorrowEvents.length} afspraak`+
            (
                tomorrowEvents.length===1
                ?
                ""
                :
                "ken"
            )+
            ` gevonden voor ${formatTomorrowDate()}.`;

    }


    /*
     * Afbeelding maken.
     */

    try{

        tomorrowImageDataURL=
            await createTomorrowCanvasImage(
                tomorrowEvents
            );


        /*
         * Afbeelding tonen.
         */

        let img=
            document.createElement("img");


        img.src=
            tomorrowImageDataURL;


        img.alt=
            "Agenda voor morgen";


        container.appendChild(
            img
        );


    }catch(error){

        console.error(
            "Afbeelding maken mislukt:",
            error
        );


        info.innerText=
            "❌ Er ging iets mis bij het maken van de afbeelding.";

    }

}


/**
 * Popup sluiten.
 */
function closeTomorrowImage(){

    let popup=
        document.getElementById(
            "tomorrowImagePopup"
        );


    popup.style.display="none";

}


/**
 * PNG downloaden.
 */
function downloadTomorrowImage(){

    if(!tomorrowImageDataURL){

        alert(
            "De afbeelding is nog niet klaar."
        );

        return;

    }


    let link=
        document.createElement("a");


    link.download=
        "agenda-morgen.png";


    link.href=
        tomorrowImageDataURL;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );

}


/**
 * Afbeelding afdrukken.
 */
function printTomorrowImage(){

    if(!tomorrowImageDataURL){

        alert(
            "De afbeelding is nog niet klaar."
        );

        return;

    }


    /*
     * Tijdelijke printcontainer
     */

    let oldPrint=
        document.getElementById(
            "tomorrowPrintImage"
        );


    if(oldPrint){

        oldPrint.remove();

    }


    let printDiv=
        document.createElement("div");


    printDiv.id=
        "tomorrowPrintImage";


    printDiv.style.display=
        "none";


    let img=
        document.createElement("img");


    img.src=
        tomorrowImageDataURL;


    img.style.maxWidth=
        "100%";


    img.style.width=
        "100%";


    printDiv.appendChild(
        img
    );


    document.body.appendChild(
        printDiv
    );


    document.body.classList.add(
        "tomorrowPrinting"
    );


    /*
     * Afdrukdialoog
     */

    window.print();


    /*
     * Na afdrukken terug normaal
     */

    setTimeout(()=>{

        document.body.classList.remove(
            "tomorrowPrinting"
        );


        printDiv.remove();

    },1000);

}
