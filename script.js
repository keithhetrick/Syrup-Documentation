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
  // can you add boundaries to the network?

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
  // configure: {
  //   enabled: true,
  //   filter: "nodes,edges",
  //   showButton: true,
  // },
  physics: {
    // enabled: false,
    stabilization: {
      enabled: false,
      iterations: 1000,
      updateInterval: 100,
    },
    hierarchicalRepulsion: {
      nodeDistance: 150,
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      damping: 0.1,
    },
    // forceAtlas2Based: {
    //   // gravitationalConstant: -50,
    //   // centralGravity: 0.01,
    //   // springConstant: 0.08,
    //   springLength: 100,
    //   // damping: 0.4,
    //   avoidOverlap: 1,
    // },
    solver: "hierarchicalRepulsion",
    barnesHut: {
      gravitationalConstant: -80000,
      centralGravity: 0.3,
      // springLength: 95,
      // springConstant: 0.04,
      // damping: 0.09,
      avoidOverlap: 1,
    },
    timestep: 0.5,
    adaptiveTimestep: true,
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
      strokeWidth: 10,
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
