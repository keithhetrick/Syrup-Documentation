import { nodes, edges } from "./data.js";
import { setupEventListeners } from "./event-handlers.js";

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
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
    },
    hierarchicalRepulsion: {
      nodeDistance: 160,
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      damping: 0.1,
    },
    forceAtlas2Based: {
      gravitationalConstant: -50,
      // centralGravity: 0.01,
      // springConstant: 0.08,
      springLength: 100,
      // damping: 0.4,
      avoidOverlap: 2,
    },
    solver: "hierarchicalRepulsion",
    barnesHut: {
      gravitationalConstant: -80000,
      centralGravity: 0.5,
      // springLength: 95,
      // springConstant: 0.04,
      // damping: 0.09,
      avoidOverlap: 2,
    },
    // timestep: 0.5,
    // adaptiveTimestep: true,
  },
  nodes: {
    shape: "dot",
    size: 21,
    borderWidth: 1,
    widthConstraint: { maximum: 200 },
    shadow: {
      enabled: true,
      size: 6,
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

// Setup event listeners and UI controls
setupEventListeners(network, nodes, edges);
