const svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

const nodes = [
  {id: "Université", poste: "Enseignant vacataire", competences: ["Médiation culturelle", "Pédagogie", "Expression écrite"]},
  {id: "PNP Informatique", poste: "Gérant", competences: ["Stratégie digitale", "Gestion de projet", "Relation client"]},
  {id: "YES Formation", poste: "Formateur", competences: ["Communication", "Accompagnement", "Gestion d’équipe"]},
  {id: "Bassin Vital", poste: "Projet de mémoire", competences: ["Conception de parcours", "Médiation augmentée", "Création sonore"]},
  {id: "Opcommerce", poste: "Concepteur formateur", competences: ["IA & commerce", "Digitalisation", "Pédagogie active"]},
  {id: "Master HN", poste: "Étudiant en master", competences: ["Humanités numériques", "Recherche", "Innovation pédagogique"]}
];

const links = [
  {source: "Université", target: "PNP Informatique"},
  {source: "PNP Informatique", target: "YES Formation"},
  {source: "YES Formation", target: "Bassin Vital"},
  {source: "Bassin Vital", target: "Opcommerce"},
  {source: "Opcommerce", target: "Master HN"},
  {source: "Master HN", target: "Université"}
];

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).distance(140).id(d => d.id))
  .force("charge", d3.forceManyBody().strength(-400))
  .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke", "#aaa");

const node = svg.append("g")
  .selectAll("circle")
  .data(nodes)
  .join("circle")
  .attr("r", 12)
  .attr("fill", "#333")
  .style("cursor", "pointer")
  .on("click", (event, d) => showTooltip(d))
  .call(drag(simulation));

const label = svg.append("g")
  .selectAll("text")
  .data(nodes)
  .join("text")
  .text(d => d.id)
  .attr("font-size", "12px")
  .attr("dy", "-1.5em")
  .attr("text-anchor", "middle");

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

function showTooltip(d) {
  tooltip.transition()
    .duration(200)
    .style("opacity", 0.95);

  tooltip.html(`<strong>${d.id}</strong><br>${d.poste}<br><em>Compétences :</em><ul>${d.competences.map(c => `<li>${c}</li>`).join("")}</ul>`)
    .style("left", (event.pageX + 15) + "px")
    .style("top", (event.pageY - 40) + "px");
}

svg.on("click", () => {
  tooltip.transition().duration(500).style("opacity", 0);
});

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);

  label
    .attr("x", d => d.x)
    .attr("y", d => d.y);
});

function drag(simulation) {
  return d3.drag()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
}
