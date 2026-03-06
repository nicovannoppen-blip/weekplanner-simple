const icons = [
"school.png",
"sport.png",
"eten.png",
"slapen.png",
"spelen.png"
]

function addItem(day){

let choice = prompt(
"Kies pictogram:\n" +
"school\nsport\neten\nslapen\nspelen"
)

if(!choice) return

let img = document.createElement("img")

img.src = "icons/" + choice + ".png"
img.className="picto"

document
.querySelector(`[data-day=${day}] .slots`)
.appendChild(img)

savePlanner()

}

function savePlanner(){

let data = {}

document.querySelectorAll(".day").forEach(day=>{

let name = day.dataset.day

data[name]=[]

day.querySelectorAll("img").forEach(img=>{
data[name].push(img.src)
})

})

localStorage.setItem("planner",JSON.stringify(data))

}

function loadPlanner(){

let data = JSON.parse(localStorage.getItem("planner"))

if(!data) return

for(let day in data){

let container =
document.querySelector(`[data-day=${day}] .slots`)

data[day].forEach(src=>{

let img = document.createElement("img")

img.src=src
img.className="picto"

container.appendChild(img)

})

}

}

window.onload=loadPlanner
