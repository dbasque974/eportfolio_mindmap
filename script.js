let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 100;
canvas.height = 100;

let circles = [];
let popup = document.getElementById("popup");
let popupTitle = document.getElementById("popup-title");
let popupCompetences = document.getElementById("popup-competences");

fetch("data.json")
  .then(res => {
    if (!res.ok) {
      throw new Error("Erreur lors du chargement de data.json : " + res.status);
    }
    return res.json();
  })
  .then(data => {
    console.log("Données reçues :", data);
    circles = data;
    draw();
  })
  .catch(error => {
    console.error("Erreur fetch :", error);
  });

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#fefcc8";
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.font = "14px Courier New";
    ctx.textAlign = "center";
    ctx.fillText(circle.label, circle.x, circle.y);
  });
}

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let circle of circles) {
    const dx = x - circle.x;
    const dy = y - circle.y;
    if (Math.sqrt(dx * dx + dy * dy) < circle.r) {
      showPopup(circle);
      return;
    }
  }
});

function showPopup(circle) {
  popupTitle.textContent = circle.label;
  popupCompetences.innerHTML = "";
  circle.competences.forEach(c => {
    let li = document.createElement("li");
    li.textContent = c;
    popupCompetences.appendChild(li);
  });
  popup.classList.remove("hidden");
}

function closePopup() {
  popup.classList.add("hidden");
}
