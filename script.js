// ✅ Déclare d'abord la variable avant tout usage
let circles = [];

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupCompetences = document.getElementById("popup-competences");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

fetch("data.json")
  .then(res => {
    if (!res.ok) throw new Error("data.json introuvable");
    return res.json();
  })
  .then(data => {
    console.log("Données reçues :", data);
    circles = data;
    draw();
  })
  .catch(error => console.error("Erreur fetch :", error));

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
    ctx.fillStyle = "#fffbd5";
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.font = "bold 14px 'Courier New'";
    ctx.fillText(circle.label, circle.x, circle.y);
  });
}

canvas.addEventListener("click", (e) => {
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
  circle.competences.forEach(skill => {
    const li = document.createElement("li");
    li.textContent = skill;
    popupCompetences.appendChild(li);
  });
  popup.classList.remove("hidden");
}

function closePopup() {
  popup.classList.add("hidden");
}
