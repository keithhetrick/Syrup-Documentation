import { nodes, edges } from "./data.js";

// Configuration for the network graph
var options = {
  layout: {
    hierarchical: {
      direction: "UD",
      sortMethod: "directed",
      levelSeparation: 150,
      nodeSpacing: 450,
      treeSpacing: 200,
    },
  },
  nodes: {
    shape: "box",
    margin: 10,
    widthConstraint: { maximum: 200 },
    font: { size: 25 },
  },
  edges: {
    smooth: true,
    arrows: { to: { enabled: true, scaleFactor: 1, type: "arrow" } },
  },
  physics: {
    enabled: true,
    hierarchicalRepulsion: { nodeDistance: 180 },
    solver: "hierarchicalRepulsion",
  },
};

// Initialize the network
var container = document.getElementById("mynetwork");
var network = new vis.Network(
  container,
  { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) },
  options
);
