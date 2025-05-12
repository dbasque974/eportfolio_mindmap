const svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");

const nodes = [
  {id: "A"}, {id: "B"}, {id: "C"}, {id: "D"},
  {id: "E"}, {id: "F"}, {id: "G"}, {id: "H"},
  {id: "I"}, {id: "J"}, {id: "K"}, {id: "L"}
];

const links = [
  {source: "A", target: "B"}, {source: "B", target: "C"},
  {source: "C", target: "D"}, {source: "D", target: "E"},
  {source: "E", target: "F"}, {source: "F", target: "G"},
  {source: "G", target: "H"}, {source: "H", target: "I"},
  {source: "I", target: "J"}, {source: "J", target: "K"},
  {source: "K", target: "L"}, {source: "L", target: "A"}
];

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).distance(60).id(d => d.id))
  .force("charge", d3.forceManyBody().strength(-200))
  .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6);

const node = svg.append("g")
  .selectAll("circle")
  .data(nodes)
  .join("circle")
  .attr("r", 8)
  .attr("fill", d => d3.schemeCategory10[Math.floor(Math.random() * 10)])
  .call(drag(simulation));

node.append("title").text(d => d.id);

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
});

function drag(simulation) {
  return d3.drag()
    .on("start", function (event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", function (event, d) {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on("end", function (event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
}
