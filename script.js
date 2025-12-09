import { nodes, edges } from "./data.js";
import { setupEventListeners } from "./event-handlers.js";
import { buildEdgeType } from "./helper-functions.js";
import {
  presets,
  collapsibleGroups,
  modes,
  legendIcons,
  HIGHLIGHT_DURATION_MS,
  userPresets,
  addUserPreset,
  removeUserPreset,
  getAllPresets,
} from "./config.js";

// normalize data with ids for vis.js selection APIs
const descriptions = {
  "AUDIO INPUT": "Entry point from DAW/host into Syrup.",
  "SIGNAL MANAGER": "Receives host audio and bridges into plugin routing.",
  "Signal Bridge": "Connects core signal to processing/AI paths.",
  "EFFECTS SIGNAL MANAGER": "Routes into master control and module manager.",
  "Master Control": "Global wet/dry and top-level macro control.",
  "MODULE MANAGER": "Dynamics chain hub (comp/limiter/gate).",
  "Parametric EQ": "Multi-band parametric equalizer for frequency shaping.",
  "Noise Reduction": "Intelligent noise reduction for signal cleanup.",
  "Soft Clipping": "Soft saturation and clipping for warmth and ceiling control.",
  Compression: "Dynamics processor for level control.",
  Limiter: "Ceiling protection to prevent clipping.",
  Gate: "Noise gate/expander for cleanup.",
  "CHANNEL EFFECTS MANAGER": "Time/pitch/color effect hub.",
  "Channel Signal Bridge": "Splits to Reverb/Delay/Saturation/Pitch.",
  Reverb: "Creates space/ambience.",
  Delay: "Echo/time-based repeats.",
  Saturation: "Color/drive for harmonic content.",
  "Pitch Shifter": "Transposes or harmonizes signal.",
  "AUDIO OUTPUT": "Final signal back to the host/DAW.",
};

const describeNode = (node) =>
  descriptions[node.id] || `${node.label} (${node.styleLabel || "Node"})`;

// Optional richer metadata for tooltips
const nodeMeta = {
  "Master Control": { latency: "0.3ms", params: "Wet/Dry, Macro", role: "Global mix" },
  "Parametric EQ": { latency: "0.2ms", params: "Frequency, Q, Gain (multi-band)", role: "EQ/Tone" },
  "Noise Reduction": { latency: "1.5ms", params: "Threshold, Reduction, Attack/Release", role: "Cleanup" },
  "Soft Clipping": { latency: "~0ms", params: "Threshold, Knee, Drive", role: "Saturation/Limit" },
  "Compression": { latency: "1.0ms", params: "Threshold, Ratio, Attack/Release", role: "Dynamics" },
  "Limiter": { latency: "0.8ms", params: "Ceiling, Lookahead", role: "Ceiling" },
  "Gate": { latency: "0.5ms", params: "Threshold, Range, Hold/Release", role: "Noise cleanup" },
  "Reverb": { latency: "3.0ms", params: "Time, Pre-delay, Size", role: "Space" },
  "Delay": { latency: "2.5ms", params: "Time, Feedback, Mix", role: "Echo" },
  "Saturation": { latency: "~0ms", params: "Drive, Tone, Bias", role: "Color" },
  "Pitch Shifter": { latency: "5.0ms", params: "Shift, Formant, Mix", role: "Pitch" },
};

// Config now lives in config.js (presets, modes, collapsibleGroups, legendIcons, HIGHLIGHT_DURATION_MS)

const nodeData = nodes.map((node, idx) => {
  const baseColor = node.color;
  const meta = nodeMeta[node.id] || {};
  return {
    id: node.id,
    ...node,
    _idx: idx,
    baseColor,
    color: {
      background: baseColor,
      border: baseColor,
      highlight: { border: "#ff9500", background: "#ffe7c2" },
      hover: { border: "#ffb84d", background: "#fff2d9" },
    },
    title: `<strong>${node.label}</strong><br>${describeNode(node)}${
      meta.role ? `<br><em>${meta.role}</em>` : ""
    }${meta.params ? `<br>Params: ${meta.params}` : ""}${
      meta.latency ? `<br>Latency: ${meta.latency}` : ""
    }`,
  };
});
const edgeData = edges.map((edge, idx) => ({
  id: edge.id ?? `edge-${idx}`,
  ...edge,
  type: buildEdgeType(edge, nodeData),
}));

const edgeColors = {
  audio: "#8c8c8c",
  control: "#5f27cd",
  return: "#d12d2d",
};

edgeData.forEach((edge) => {
  const color = edgeColors[edge.type] || edgeColors.audio;
  edge.baseColor = color;
  edge.color = {
    color,
    highlight: "#ff9500",
    hover: "#ffb84d",
  };
  edge.title = `${edge.type.toUpperCase()} path`;
  if (edge.type === "control") {
    edge.label = "ctrl";
  } else if (edge.type === "return") {
    edge.label = "ret";
  } else {
    edge.label = "";
  }
});

// Configuration for the network graph
const options = {
  layout: {
    improvedLayout: true,
    hierarchical: {
      enabled: true,
      levelSeparation: 120,
      nodeSpacing: 260,
      treeSpacing: 160,
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
    zoomView: true, // allow zoom; mobile jitter mitigated by disabled physics
    zoomSpeed: 0.2,
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
    enabled: false,
  },
  nodes: {
    shape: "dot",
    size: 21,
    borderWidth: 1,
    borderWidthSelected: 4,
    widthConstraint: { maximum: 200 },
    shadow: {
      enabled: true,
      size: 6,
    },
    color: {
      border: "#222222",
      background: "#ffffff",
      highlight: { border: "#ff9500", background: "#ffe7c2" },
      hover: { border: "#ffb84d", background: "#fff2d9" },
    },
    font: {
      size: 20,
      color: "#000000",
      strokeWidth: 8,
    },
  },
  edges: {
    smooth: true,
    hoverWidth: 2.5,
    width: 2,
    selectionWidth: 4,
    color: {
      color: "#555555",
      highlight: "#ff9500",
      hover: "#ffb84d",
    },
    arrows: { to: { enabled: true, scaleFactor: 1, type: "arrow" } },
    font: {
      size: 10,
      align: "top",
      strokeWidth: 0,
      color: "#3a3a3a",
    },
  },
};

// Initialize the network
const container = document.getElementById("mynetwork");
const controlsHelp = document.getElementById("controls-help");
const hamburger = document.getElementById("hamburger");
const sidebarOverlay = document.getElementById("sidebar-overlay");
if (!container) {
  console.error("Network container not found");
} else if (typeof vis === "undefined") {
  container.innerHTML =
    "vis-network failed to load. Check your connection and refresh.";
} else {
  try {
    if (controlsHelp) {
      controlsHelp.dataset.tip =
        "Presenter tips: Toggle modes (Architect/End-user), use presets or A/B chains to highlight paths, collapse modules to show hierarchy, double-click canvas to clear highlights, mini-map for quick overview.";
    }
    const toggleSidebar = (force) => {
      const open = force ?? !document.body.classList.contains("sidebar-open");
      document.body.classList.toggle("sidebar-open", open);
      if (hamburger) hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    };
    if (hamburger) {
      hamburger.addEventListener("click", () => toggleSidebar());
    }
    if (sidebarOverlay) {
      sidebarOverlay.addEventListener("click", () => toggleSidebar(false));
    }
    const controlsContainer = document.getElementById("controls");
    if (controlsContainer) {
      controlsContainer.addEventListener("click", () => {
        if (window.innerWidth <= 1024) toggleSidebar(false);
      });
    }
    // Visual boundary overlays to reinforce modular phases without reflowing the graph.
    const bands = [
      { label: "Input & Signal Manager", start: 0, end: 16, color: "rgba(255,149,0,0.08)" },
      { label: "Managers & Master Control", start: 16, end: 36, color: "rgba(0,0,0,0.05)" },
      { label: "Dynamics Modules", start: 36, end: 56, color: "rgba(128,0,255,0.06)" },
      { label: "Channel FX", start: 56, end: 76, color: "rgba(0,128,255,0.06)" },
      { label: "Output", start: 76, end: 100, color: "rgba(0,200,120,0.08)" },
    ];
    bands.forEach((band) => {
      const div = document.createElement("div");
      div.className = "band-overlay";
      div.style.top = `${band.start}%`;
      div.style.height = `${band.end - band.start}%`;
      div.style.background = band.color;
      div.textContent = band.label;
      container.appendChild(div);
    });

    const nodesDS = new vis.DataSet(nodeData);
    const edgesDS = new vis.DataSet(edgeData);
    const miniNodesDS = new vis.DataSet(nodeData.map((n) => ({ ...n })));
    const miniEdgesDS = new vis.DataSet(edgeData.map((e) => ({ ...e })));

    const nodeLookup = new Map(nodeData.map((n) => [n.id, n]));
    const childrenLookup = new Map();
    edgeData.forEach((edge) => {
      const arr = childrenLookup.get(edge.from) || [];
      arr.push(edge.to);
      childrenLookup.set(edge.from, arr);
    });

    const network = new vis.Network(
      container,
      { nodes: nodesDS, edges: edgesDS },
      options
    );
    // Physics stays off after initial draw to prevent jitter/auto-zoom on drag.
    network.setOptions({ physics: { enabled: false, stabilization: false } });

    // Mini-map overview for quick navigation (static, no interaction).
    const miniContainer = document.getElementById("mini-map");
    let miniNetwork = null;
    if (miniContainer) {
      const miniOptions = {
        layout: {
          hierarchical: {
            enabled: true,
            levelSeparation: 80,
            nodeSpacing: 140,
            direction: "UD",
          },
        },
        physics: false,
        interaction: { dragNodes: false, dragView: true, zoomView: true },
        nodes: {
          shape: "dot",
          size: 10,
          font: { size: 12 },
        },
        edges: {
          width: 1,
          smooth: false,
          arrows: { to: { enabled: true, scaleFactor: 0.7, type: "arrow" } },
        },
      };
      miniNetwork = new vis.Network(
        miniContainer,
        { nodes: miniNodesDS, edges: miniEdgesDS },
        miniOptions
      );
      miniContainer.addEventListener("click", (evt) => {
        if (!network) return;
        const rect = miniContainer.getBoundingClientRect();
        const x = evt.clientX - rect.left;
        const y = evt.clientY - rect.top;
        const pos = miniNetwork.DOMtoCanvas({ x, y });
        network.moveTo({ position: pos, animation: true });
      });
    }

    const architectNodes = [...nodeData];
    const architectEdges = [...edgeData];

    const resetData = (mode = "architect") => {
      const modeConfig = modes[mode] || modes.architect;
      document.body.dataset.mode = mode;
      const visibleSet =
        modeConfig.visible instanceof Set ? modeConfig.visible : null;

      const nodeUpdates = architectNodes.map((n) => ({
        id: n.id,
        hidden: visibleSet ? !visibleSet.has(n.id) : false,
      }));
      const edgeUpdates = architectEdges.map((e) => ({
        id: e.id,
        hidden:
          visibleSet && (!visibleSet.has(e.from) || !visibleSet.has(e.to)),
      }));
      nodesDS.update(nodeUpdates);
      edgesDS.update(edgeUpdates);
      miniNodesDS.update(nodeUpdates);
      miniEdgesDS.update(edgeUpdates);
    };

    // Setup event listeners and UI controls
    setupEventListeners(
      network,
      nodeData,
      edgeData,
      nodesDS,
      edgesDS,
      resetData,
      {
        nodeLookup,
        childrenLookup,
        miniNetwork,
        miniContainer,
      },
      {
        presets,
        collapsibleGroups,
        modes,
        legendIcons,
        userPresets,
        addUserPreset,
        removeUserPreset,
        getAllPresets,
      },
      container
    );
    const clearHiddenAll = () => {
      const nodeUpdates = nodesDS.get().map((n) => ({ id: n.id, hidden: false }));
      const edgeUpdates = edgesDS.get().map((e) => ({ id: e.id, hidden: false }));
      nodesDS.update(nodeUpdates);
      edgesDS.update(edgeUpdates);
      miniNodesDS.update(nodeUpdates);
      miniEdgesDS.update(edgeUpdates);
    };

    const performResetAndFit = () => {
      const initialMode = "architect";
      document.body.classList.remove("theme-dark");
      resetData(initialMode);
      clearHiddenAll();
      network.unselectAll();
      network.fit({ animation: { duration: 600, easingFunction: "easeInOutQuad" } });
      if (miniNetwork) miniNetwork.fit({ animation: false });
    };

    performResetAndFit();
    network.stabilize();
    network.once("stabilizationIterationsDone", performResetAndFit);
  } catch (err) {
    container.innerHTML = "Error initializing network graph.";
    console.error(err);
  }
}
