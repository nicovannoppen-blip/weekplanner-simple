const CLIENT_ID="259423355709-81s2fclv800ps73gqm8vb7t4vkcvct81.apps.googleusercontent.com";

const START_HOUR=7;
const END_HOUR=21;
const PX_PER_HOUR=60;

let accessToken=null;
let currentDate=new Date();
let viewMode="week";
let calendars=[];
let events=[];

/* ---------- LOGIN ---------- */

function login(){
  const url="https://accounts.google.com/o/oauth2/v2/auth";
  const params={
    client_id:CLIENT_ID,
    redirect_uri:window.location.origin,
    response_type:"token",
    scope:"https://www.googleapis.com/auth/calendar.readonly"
  };
  window.location=url+"?"+new URLSearchParams(params);
}

function logout(){
  location.reload();
}

function parseToken(){
  const hash=window.location.hash.substring(1);
  const params=new URLSearchParams(hash);
  accessToken=params.get("access_token");
  if(accessToken){
    window.history.replaceState({},document.title,"/");
    init();
  }
}

/* ---------- INIT ---------- */

async function init(){
  await loadCalendars();
  renderFilters();
  await loadEvents();
  render();
}

/* ---------- DATA ---------- */

async function loadCalendars(){
  const res=await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {headers:{Authorization:"Bearer "+accessToken}}
  );
  calendars=(await res.json()).items;
}

async function loadEvents(){
  const start=getStartDate();
  const end=new Date(start);
  end.setDate(start.getDate()+(viewMode==="week"?7:1));

  events=[];

  for(const cal of calendars){
    const res=await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal.id)}/events?timeMin=${start.toISOString()}&timeMax=${end.toISOString()}&singleEvents=true&orderBy=startTime`,
      {headers:{Authorization:"Bearer "+accessToken}}
    );
    const data=await res.json();
    if(data.items){
      data.items.forEach(e=>{
        e.color=cal.backgroundColor||"#5f6368";
        e.calendarName=cal.summary;
        events.push(e);
      });
    }
  }
}

/* ---------- VIEW ---------- */

function setView(mode){
  viewMode=mode;
  loadEvents().then(render);
}

function previous(){
  currentDate.setDate(currentDate.getDate()-(viewMode==="week"?7:1));
  loadEvents().then(render);
}

function next(){
  currentDate.setDate(currentDate.getDate()+(viewMode==="week"?7:1));
  loadEvents().then(render);
}

function getStartDate(){
  if(viewMode==="week"){
    const d=new Date(currentDate);
    d.setDate(d.getDate()-(d.getDay()+6)%7);
    d.setHours(0,0,0,0);
    return d;
  } else {
    const d=new Date(currentDate);
    d.setHours(0,0,0,0);
    return d;
  }
}

/* ---------- FILTERS ---------- */

function renderFilters(){
  const div=document.getElementById("filters");
  div.innerHTML="";
  calendars.forEach(cal=>{
    div.innerHTML+=`
    <label>
      <input type="checkbox" checked data-id="${cal.id}" onchange="render()">
      ${cal.summary}
    </label>
    `;
  });
}

function getSelectedCalendars(){
  return Array.from(document.querySelectorAll("#filters input:checked"))
    .map(cb=>cb.dataset.id);
}

function selectAll(){
  document.querySelectorAll("#filters input")
    .forEach(cb=>cb.checked=true);
  render();
}

function deselectAll(){
  document.querySelectorAll("#filters input")
    .forEach(cb=>cb.checked=false);
  render();
}

/* ---------- RENDER ---------- */

function render(){
  const container=document.getElementById("calendar");
  container.className=viewMode==="week"?"week-view":"day-view";
  container.innerHTML="";

  const start=getStartDate();
  const days=viewMode==="week"?7:1;
  const selected=getSelectedCalendars();

  for(let i=0;i<days;i++){
    const date=new Date(start);
    date.setDate(start.getDate()+i);

    const dayDiv=document.createElement("div");
    dayDiv.className="day";

    dayDiv.innerHTML=`<div class="day-header">
      ${date.toLocaleDateString("nl-BE",{weekday:"long",day:"numeric",month:"numeric"})}
    </div>
    <div class="allday"></div>
    <div class="timeline"></div>`;

    container.appendChild(dayDiv);

    renderDay(date,dayDiv,selected);
  }
}

/* ---------- DAY RENDER ---------- */

function renderDay(date,dayDiv,selected){

  const timeline=dayDiv.querySelector(".timeline");

  for(let h=START_HOUR;h<=END_HOUR;h++){
    const label=document.createElement("div");
    label.className="hour";
    label.style.top=((h-START_HOUR)*PX_PER_HOUR)+"px";
    label.innerText=h+":00";
    timeline.appendChild(label);
  }

  const dayEvents=events.filter(e=>{
    if(!selected.includes(e.calendarName)) return false;
    const d=new Date(e.start.dateTime||e.start.date);
    return d.toDateString()===date.toDateString();
  });

  const timed=dayEvents.filter(e=>e.start.dateTime);

  layoutEvents(timed,timeline);
}

/* ---------- OVERLAP ENGINE ---------- */

function layoutEvents(list,timeline){

  const items=list.map(e=>{
    const start=new Date(e.start.dateTime);
    const end=new Date(e.end.dateTime);
    return {...e,start,end};
  });

  items.sort((a,b)=>a.start-b.start);

  const groups=[];

  items.forEach(item=>{
    let placed=false;
    for(const group of groups){
      if(!group.some(g=>overlap(g,item))){
        group.push(item);
        placed=true;
        break;
      }
    }
    if(!placed) groups.push([item]);
  });

  groups.forEach(group=>{
    group.forEach((item,index)=>{
      const width=100/group.length;
      const top=((item.start.getHours()-START_HOUR)*PX_PER_HOUR)
        +(item.start.getMinutes()/60*PX_PER_HOUR);
      const height=((item.end-item.start)/3600000)*PX_PER_HOUR;

      const div=document.createElement("div");
      div.className="event";
      div.style.top=top+"px";
      div.style.left=(index*width)+"%";
      div.style.width=width+"%";
      div.style.height=height+"px";
      div.style.background=item.color;

      div.innerHTML=`
        <div class="event-header">
          ${iconHTML(item)}
          ${item.summary}
        </div>
      `;

      enableDrag(div);
      timeline.appendChild(div);
    });
  });
}

function overlap(a,b){
  return a.end>b.start && b.end>a.start;
}

/* ---------- DRAG (mouse + touch) ---------- */

function enableDrag(el){
  let startY, startTop;

  const move=e=>{
    const y=e.touches?e.touches[0].clientY:e.clientY;
    el.style.top=(startTop+(y-startY))+"px";
  };

  const up=()=>{
    document.removeEventListener("mousemove",move);
    document.removeEventListener("mouseup",up);
    document.removeEventListener("touchmove",move);
    document.removeEventListener("touchend",up);
  };

  el.addEventListener("mousedown",e=>{
    startY=e.clientY;
    startTop=parseInt(el.style.top);
    document.addEventListener("mousemove",move);
    document.addEventListener("mouseup",up);
  });

  el.addEventListener("touchstart",e=>{
    startY=e.touches[0].clientY;
    startTop=parseInt(el.style.top);
    document.addEventListener("touchmove",move);
    document.addEventListener("touchend",up);
  });
}

/* ---------- ICONS ---------- */

function iconHTML(e){
  return `<img src="https://api.iconify.design/mdi/${getIcon(e)}.svg?color=white">`;
}

function getIcon(e){
  const text=(e.summary||"").toLowerCase();
  const loc=(e.location||"").toLowerCase();

  if(text.includes("bus naar school")) return "bus-school";
  if(text.includes("bus naar huis")) return "bus";
  if(text.includes("slapen")) return "sleep";
  if(text.includes("rijden")) return "car";
  if(text.includes("beugel")) return "tooth";

  if(loc.includes("kapelstraat 73")) return "hospital-box";
  if(loc.includes("puthofveld 4")) return "nurse";

  if(text.includes("oppas thuis")) return "home";
  if(text.includes("oppas bij haar")) return "home-heart";

  return "calendar";
}

function toggleKidMode(){
  document.body.classList.toggle("kid-mode");
}

window.onload = () => {
  parseToken();
};
