import { nodes, edges } from "./data.js";

// Configuration for the network graph
var options = {
  layout: {
    improvedLayout: true,
    hierarchical: {
      enabled: true,
      levelSeparation: 150,
      nodeSpacing: 450,
      treeSpacing: 200,
      blockShifting: true,
      edgeMinimization: true,
      parentCentralization: true,
      direction: "UD",
      sortMethod: "directed",
    },
  },
  interaction: {
    dragNodes: true, // do not allow dragging nodes
    dragView: true, // do not allow dragging the view
    zoomView: true, // do not allow zooming
    selectable: true, // do not allow selection
    hover: true, // do not allow hovering
    hoverConnectedEdges: true, // do highlight connected edges when hovering a node
    navigationButtons: true, // do not show navigation buttons
    keyboard: true, // do not allow using the keyboard
    multiselect: false, // do not allow multiselect
  },
  physics: {
    enabled: true,
    hierarchicalRepulsion: { nodeDistance: 180 },
    solver: "hierarchicalRepulsion",
  },
  nodes: {
    shape: "dot",
    size: 21,
    widthConstraint: { maximum: 200 },
    font: {
      size: 24,
      color: "#000000",
    },
  },
  edges: {
    smooth: true,
    width: 2,
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

// Function that highlights the path of a selected node
network.on("selectNode", function (params) {
  var selectedNodeId = params.nodes[0];
  var selectedNode = nodes.find((node) => node.id === selectedNodeId);
  var rootId = selectedNode.rootId;
  var root = nodes.find((node) => node.id === rootId);
  var path = getPath(root, selectedNode);
  var pathIds = path.map((node) => node.id);
  network.selectNodes(pathIds);
});

function getPath(root, selectedNode) {
  var path = [];
  var currentNode = selectedNode;
  while (currentNode.id !== root.id) {
    path.push(currentNode);
    currentNode = nodes.find((node) => node.id === currentNode.parentId);
  }
  path.push(root);
  return path;
}
