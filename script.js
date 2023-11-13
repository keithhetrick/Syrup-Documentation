import { nodes, edges } from "./data.js";

// Configuration for the network graph
const options = {
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
  // put a limit on how much to zoom in & out
  interaction: {
    dragNodes: true, // do not allow dragging nodes
    dragView: true, // do not allow dragging the view
    zoomView: true, // do not allow zooming
    zoomSpeed: 0.25, // do not allow zooming
    selectable: true, // do not allow selection
    hover: true, // do not allow hovering
    hoverConnectedEdges: true, // do not highlight connected edges when hovering a node
    navigationButtons: true, // do not show navigation buttons
    multiselect: false, // do not allow multiselect
    keyboard: {
      enabled: true,
      speed: { x: 10, y: 10, zoom: 0.02 },
      bindToWindow: true,
    }, // do not allow keyboard navigation
  },
  configure: {
    enabled: true,
    filter: "nodes,edges",
    showButton: true,
  },
  physics: {
    enabled: true,
    hierarchicalRepulsion: { nodeDistance: 180 },
    solver: "hierarchicalRepulsion",
  },
  nodes: {
    shape: "dot",
    size: 21,
    borderWidth: 1,
    widthConstraint: { maximum: 200 },
    shadow: {
      enabled: true,
      size: 8,
    },
    font: {
      size: 24,
      color: "#000000",
      strokeWidth: 5,
    },
  },
  edges: {
    smooth: true,
    hoverWidth: 2.5,
    width: 2,
    arrows: { to: { enabled: true, scaleFactor: 1, type: "arrow" } },
  },
};

// Initialize the network
const container = document.getElementById("mynetwork");
const network = new vis.Network(
  container,
  { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) },
  options
);

// Function that highlights the path of a selected node
network.on("selectNode", function (params) {
  const selectedNodeId = params.nodes[0];
  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const rootId = selectedNode.rootId;
  const root = nodes.find((node) => node.id === rootId);
  const path = getPath(root, selectedNode);
  const pathIds = path.map((node) => node.id);
  network.selectNodes(pathIds);
});

function getPath(root, selectedNode) {
  const path = [];
  const currentNode = selectedNode;
  while (currentNode.id !== root.id) {
    path.push(currentNode);
    currentNode = nodes.find((node) => node.id === currentNode.parentId);
  }
  path.push(root);
  return path;
}
