const PASSWORD = "familie";

let mode = "week";

let calendars = {
"rita":"#ff0000",
"loriana":"#00aaff",
"orelia puthof":"#008000",
"feestdagen":"#ff9900"
};

function login(){

let pass = document.getElementById("password").value;

if(pass===PASSWORD){

document.getElementById("loginScreen").style.display="none";
document.getElementById("agendaScreen").style.display="block";

if(document.getElementById("remember").checked){
localStorage.setItem("agendaLogin","1");
}

loadCalendars();

}else{
alert("Fout wachtwoord");
}

}

window.onload = function(){

if(localStorage.getItem("agendaLogin")==="1"){
document.getElementById("loginScreen").style.display="none";
document.getElementById("agendaScreen").style.display="block";
loadCalendars();
}

}


function setWeek(){
mode="week";
renderAgenda();
}

function setDay(){
mode="day";
renderAgenda();
}


function toggleBigIcons(){
document.body.classList.toggle("bigIcons");
}



function loadCalendars(){

gapi.load("client", async ()=>{

await gapi.client.init({
apiKey:"YOUR_API_KEY",
discoveryDocs:["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
});

renderAgenda();

});

}



function renderAgenda(){

let container = document.getElementById("agendaContainer");

container.innerHTML="";

let startHour = 7;

for(let d=0; d<7; d++){

let day = document.createElement("div");

day.className="day";

let title = document.createElement("h3");

let date = new Date();
date.setDate(date.getDate()+d);

title.innerText =
date.toLocaleDateString("nl-BE",{weekday:"long"})+
" "+date.toLocaleDateString("nl-BE");

day.appendChild(title);


for(let h=startHour; h<22; h++){

let slot = document.createElement("div");

slot.className="hour";

slot.innerText=h+":00";

day.appendChild(slot);

}

container.appendChild(day);

if(mode==="day") break;

}

}
