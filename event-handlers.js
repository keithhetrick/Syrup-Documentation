import {
  findRoot,
  getAudioPath,
  getEdges,
  getPath,
  // getInputPath
  // setChannelStripOptions,
} from "./helper-functions.js";
import { HIGHLIGHT_DURATION_MS, legendIcons } from "./config.js";
import { channelEffectsList } from "./data.js";
import { createFocusController, createHideController } from "./ui-helpers.js";

const edgeTypeStyles = {
  audio: "#8c8c8c",
  control: "#5f27cd",
  return: "#d12d2d",
};

export function setupEventListeners(
  network,
  nodes,
  edges,
  nodesDS,
  edgesDS,
  resetData,
  lookups,
  config,
  graphContainer
) {
  const controlsContainer = document.getElementById("controls");
  const { hiddenNodes, hiddenEdges, clearHidden, setHidden } = createHideController(
    nodesDS,
    edgesDS
  );
  const { applyFocus, resetFocus, scheduleClear, clearSelectionAndFocus } =
    createFocusController(network, nodesDS, edgesDS);
  const tourPointer =
    (graphContainer && graphContainer.querySelector(".tour-pointer")) ||
    (() => {
      if (!graphContainer) return null;
      const el = document.createElement("div");
      el.className = "tour-pointer";
      graphContainer.appendChild(el);
      return el;
    })();
  const miniPointer =
    (lookups.miniContainer && lookups.miniContainer.querySelector(".mini-pointer")) ||
    (() => {
      if (!lookups.miniContainer) return null;
      const el = document.createElement("div");
      el.className = "mini-pointer";
      lookups.miniContainer.style.position = "relative";
      lookups.miniContainer.appendChild(el);
      return el;
    })();

  // Utility: create grouped button sections so the control bar stays organized.
  const addButton = (label, onClick, groupId = "default") => {
    let group = controlsContainer.querySelector(`[data-group="${groupId}"]`);
    if (!group) {
      group = document.createElement("div");
      group.className = "control-group";
        group.dataset.group = groupId;
        const header = document.createElement("div");
        header.className = "control-group-title";
        header.textContent = groupId;
        group.appendChild(header);
        controlsContainer.appendChild(group);
      }
      const btn = document.createElement("button");
      btn.textContent = label;
      btn.addEventListener("click", onClick);
      group.appendChild(btn);
    };

  const getActiveNodes = () => nodesDS.get();
  const getActiveEdges = () => edgesDS.get();

  const positionPointer = (ids, text) => {
    if (!tourPointer) return;
    if (!ids?.length) {
      tourPointer.style.display = "none";
      if (miniPointer) miniPointer.style.display = "none";
      return;
    }
    const positions = network.getPositions(ids);
    const keys = Object.keys(positions);
    if (!keys.length) {
      tourPointer.style.display = "none";
      if (miniPointer) miniPointer.style.display = "none";
      return;
    }
    const avg = keys.reduce(
      (acc, key) => {
        acc.x += positions[key].x;
        acc.y += positions[key].y;
        return acc;
      },
      { x: 0, y: 0 }
    );
    avg.x /= keys.length;
    avg.y /= keys.length;
    const domPos = network.canvasToDOM(avg);
    tourPointer.style.left = `${domPos.x}px`;
    tourPointer.style.top = `${domPos.y}px`;
    tourPointer.textContent = text || "";
    tourPointer.style.display = "block";

    if (miniPointer && lookups.miniNetwork) {
      const miniPos = lookups.miniNetwork.canvasToDOM(avg);
      miniPointer.style.left = `${miniPos.x}px`;
      miniPointer.style.top = `${miniPos.y}px`;
      miniPointer.textContent = text ? "•" : " ";
      miniPointer.style.display = "block";
    }
  };

  const selectPath = (pathIds) => {
    if (!pathIds?.length) return;
    network.selectNodes(pathIds);
    const activeEdges = getActiveEdges();
    const pathEdgeIds = activeEdges
      .filter(
        (edge) => pathIds.includes(edge.from) && pathIds.includes(edge.to)
      )
      .map((edge) => edge.id);
    if (pathEdgeIds.length) {
      network.selectEdges(pathEdgeIds);
    }
    applyFocus(getActiveNodes(), getActiveEdges(), pathIds, pathEdgeIds);
  };

  // Event listener for highlighting the path of a selected node
  network.on("selectNode", function (params) {
    const activeNodes = getActiveNodes();
    const selectedNodeId = params.nodes[0];
    const selectedNode =
      lookups.nodeLookup.get(selectedNodeId) ||
      activeNodes.find((node) => node.id === selectedNodeId);
    const root = findRoot(selectedNode, activeNodes, lookups.nodeLookup);
    const path = getPath(root, selectedNode, activeNodes, lookups.nodeLookup);
    const pathIds = path?.map((node) => node.id);
    selectPath(pathIds);
    if (lookups.miniNetwork) {
      lookups.miniNetwork.selectNodes(pathIds, true);
    }
  });

  network.on("deselectNode", () => resetFocus(getActiveNodes(), getActiveEdges()));
  network.on("deselectEdge", () => resetFocus(getActiveNodes(), getActiveEdges()));
  network.on("click", (params) => {
    if (!params.nodes.length && !params.edges.length) {
      resetFocus(getActiveNodes(), getActiveEdges());
    }
  });
  network.on("doubleClick", () => {
    clearSelectionAndFocus(getActiveNodes(), getActiveEdges());
    if (lookups.miniNetwork) {
      lookups.miniNetwork.unselectAll();
    }
    positionPointer();
    if (miniPointer) miniPointer.style.display = "none";
  });

  addButton(
    "Highlight Audio Path",
    () => {
      const activeNodes = getActiveNodes();
      const activeEdges = getActiveEdges();
      const path = getAudioPath(null, activeNodes, activeEdges, lookups.nodeLookup);
      const pathIds = path?.map((node) => node.id);
      selectPath(pathIds);
      scheduleClear(HIGHLIGHT_DURATION_MS, getActiveNodes(), getActiveEdges());
    },
    "Views"
  );

  Object.entries(config.presets || {})
    .filter(([key]) => key !== "audioPath")
    .forEach(([, preset]) => {
      addButton(
        preset.label,
        () => {
          selectPath(preset.nodes);
          scheduleClear(HIGHLIGHT_DURATION_MS, getActiveNodes(), getActiveEdges());
        },
        preset.label.startsWith("A/B") ? "A/B Compare" : "Presets"
      );
    });

  addButton("Return Edges", () => {
    const dashedEdgeIds = getEdges(getActiveNodes(), getActiveEdges());
    if (dashedEdgeIds?.length) {
      network.selectEdges(dashedEdgeIds);
      applyFocus([], dashedEdgeIds);
      if (lookups.miniNetwork) {
        lookups.miniNetwork.selectEdges(dashedEdgeIds);
      }
    }
    scheduleClear(HIGHLIGHT_DURATION_MS, getActiveNodes(), getActiveEdges());
  }, "Views");

  addButton("Zoom to Fit", () => network.fit({ animation: true }), "Navigation");
  addButton("Toggle Mini-map", () => {
    const overview = document.getElementById("overview");
    if (overview) overview.classList.toggle("hidden");
  }, "Navigation");
  addButton(
    "Reset Highlight",
    () => clearSelectionAndFocus(getActiveNodes(), getActiveEdges()),
    "Views"
  );
  addButton(
    "Guided Tour",
    () => {
      const steps = [
        { ids: ["AUDIO INPUT", "SIGNAL MANAGER", "Signal Input"], text: "Signal enters via the host into the Signal Manager." },
        { ids: ["Signal Bridge", "EFFECTS SIGNAL MANAGER"], text: "Signal Bridge hands audio into the Effects Signal Manager." },
        { ids: ["Master Control", "MODULE MANAGER"], text: "Master Control and Module Manager provide global dynamics control." },
        { ids: ["Compression", "Limiter", "Gate"], text: "Dynamics chain: Compression → Limiter → Gate." },
        { ids: ["CHANNEL EFFECTS MANAGER", "Channel Signal Bridge"], text: "Channel Effects Manager routes into the channel FX bridge." },
        { ids: ["Reverb", "Delay", "Saturation", "Pitch Shifter"], text: "Time/pitch/color modules fan out in parallel." },
        { ids: ["Signal Bridge Output", "Output Main", "AUDIO OUTPUT"], text: "Signal rejoins at the bridge and exits to the host output." },
      ];
      let idx = 0;
      let tourTimer = null;

      const clearTour = () => {
        if (tourTimer) {
          clearTimeout(tourTimer);
          tourTimer = null;
        }
        clearSelectionAndFocus(getActiveNodes(), getActiveEdges());
        if (lookups.miniNetwork) lookups.miniNetwork.unselectAll();
        positionPointer();
      };

      const runStep = () => {
        if (idx >= steps.length) {
          clearTour();
          return;
        }
        const { ids, text } = steps[idx];
        selectPath(ids);
        if (lookups.miniNetwork) lookups.miniNetwork.selectNodes(ids, true);
        positionPointer(ids, text);
        idx += 1;
        tourTimer = setTimeout(runStep, 3600);
      };

      clearTour();
      runStep();
    },
    "Views"
  );

  addButton(
    "Reset View",
    () => {
      const initialMode = "architect";
      document.body.classList.remove("theme-dark");
      resetData(initialMode);
      clearHidden(getActiveNodes(), getActiveEdges());
      setTimeout(() => {
        resetFocus(getActiveNodes(), getActiveEdges());
        network.fit({ animation: true });
      }, 50);
      clearSelectionAndFocus(getActiveNodes(), getActiveEdges());
    },
    "Navigation"
  );

  let physicsEnabled = true;
  addButton("Toggle Physics Wiggle", () => {
    physicsEnabled = !physicsEnabled;
    if (physicsEnabled) {
      network.setOptions({ physics: { enabled: true } });
      network.stabilize();
      setTimeout(() => network.setOptions({ physics: { enabled: false, stabilization: false } }), 800);
    } else {
      network.setOptions({ physics: { enabled: false, stabilization: false } });
    }
  }, "Navigation");

  // Drag-and-drop node positioning controls
  addButton("Reset Node Positions", () => {
    if (window.syrupSignalFlow && window.syrupSignalFlow.positionStore) {
      window.syrupSignalFlow.positionStore.clear();
      alert("Node positions cleared. Refresh page to reset layout.");
    } else {
      sessionStorage.removeItem('syrup-node-positions');
      alert("Node positions cleared. Refresh page to reset layout.");
    }
  }, "Navigation");

  // Real-time simulation and interactivity controls
  addButton("Simulate Audio Path", () => {
    if (window.syrupSignalFlow) {
      const audioPath = [
        "AUDIO INPUT",
        "SIGNAL MANAGER",
        "Signal Input",
        "Signal Bridge",
        "EFFECTS SIGNAL MANAGER",
        "Effects Signal Manager Input",
        "Master Control",
        "MODULE MANAGER",
        "Compression",
        "Limiter",
        "Gate",
        "CHANNEL EFFECTS MANAGER",
        "Channel Signal Bridge",
        "Reverb",
        "Signal Bridge Output",
        "Output Main",
        "AUDIO OUTPUT"
      ];
      const latency = window.syrupSignalFlow.calculatePathLatency(audioPath);
      console.log(`Simulating audio path. Total latency: ${latency.total.toFixed(2)}ms`);
      window.syrupSignalFlow.simulateSignalFlow(audioPath, { 
        duration: 300, 
        showLatency: true 
      });
    } else {
      alert("Runtime API not available yet. Please wait for initialization.");
    }
  }, "Interactivity");

  addButton("Show Path Latency", () => {
    const selected = network.getSelectedNodes();
    if (selected.length === 0) {
      alert("Select a node to see its path latency");
      return;
    }
    
    if (window.syrupSignalFlow) {
      const result = window.syrupSignalFlow.previewAudioPath(selected[0]);
      if (result) {
        const details = result.latency.details
          .map(d => `${d.node}: ${d.latency.toFixed(2)}ms`)
          .join('\n');
        alert(`Path Latency Analysis\n\nTotal: ${result.latency.total.toFixed(2)}ms\n\nDetails:\n${details}`);
      }
    }
  }, "Interactivity");

  // Waveform animation controls
  let waveformEnabled = false;
  addButton("Toggle Waveform Animation", () => {
    waveformEnabled = !waveformEnabled;
    const graphContainer = document.getElementById("mynetwork");
    
    if (waveformEnabled) {
      graphContainer.classList.add("waveform-active");
      // Add visual indicator for active waveform mode
      // Use processing effect nodes from data.js
      const processingNodes = ["Compression", "Limiter", "Gate", ...channelEffectsList];
      const activeNodes = getActiveNodes().filter(n => processingNodes.includes(n.id));
      
      activeNodes.forEach(node => {
        nodesDS.update({
          id: node.id,
          shadow: { enabled: true, size: 10, x: 0, y: 0, color: 'rgba(255, 149, 0, 0.5)' }
        });
      });
      
      console.log("Waveform animation enabled for processing nodes");
    } else {
      graphContainer.classList.remove("waveform-active");
      // Remove visual indicator
      const activeNodes = getActiveNodes();
      activeNodes.forEach(node => {
        nodesDS.update({
          id: node.id,
          shadow: { enabled: true, size: 6 }
        });
      });
      
      console.log("Waveform animation disabled");
    }
  }, "Interactivity");

  addButton("Toggle Dark/Light", () => {
    document.body.classList.toggle("theme-dark");
  }, "Theme");
  addButton(
    "Keyboard Hints",
    () => {
      alert(
        "Keyboard: D toggles Dark/Light, R resets view (current mode), double-click clears highlights."
      );
    },
    "Theme"
  );

  // Keyboard shortcuts for quick toggles
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "d") {
      document.body.classList.toggle("theme-dark");
    } else if (e.key.toLowerCase() === "r") {
      const mode = document.body.dataset.mode || "architect";
      resetData(mode);
      clearHidden();
      resetFocus(getActiveNodes(), getActiveEdges());
      network.fit({ animation: true });
      clearSelectionAndFocus(getActiveNodes(), getActiveEdges());
    } else if (e.key === "Escape") {
      document.body.classList.remove("sidebar-open");
    }
  });

  addButton("Export PNG", () => {
    const canvas = network?.canvas?.frame?.canvas;
    if (!canvas) return;
    const link = document.createElement("a");
    const mode = document.body.dataset.mode || "architect";
    const theme = document.body.classList.contains("theme-dark") ? "dark" : "light";
    link.download = `syrup-signal-flow-${mode}-${theme}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, "Theme");

  // Mode switcher
  addButton(
    "Mode: Architect",
    () => {
      resetData("architect");
      clearHidden(getActiveNodes(), getActiveEdges());
      setTimeout(() => {
        resetFocus(getActiveNodes(), getActiveEdges());
        network.fit({ animation: true });
      }, 50);
      clearSelectionAndFocus(getActiveNodes(), getActiveEdges());
    },
    "Modes"
  );
  addButton(
    "Mode: End-user",
    () => {
      resetData("endUser");
      clearHidden(getActiveNodes(), getActiveEdges());
      setTimeout(() => {
        resetFocus(getActiveNodes(), getActiveEdges());
        network.fit({ animation: true });
      }, 50);
      clearSelectionAndFocus(getActiveNodes(), getActiveEdges());
    },
    "Modes"
  );

  Object.keys(config.collapsibleGroups || {}).forEach((groupName) => {
    addButton(`Toggle ${groupName}`, () => {
      const activeNodes = getActiveNodes();
      const activeEdges = getActiveEdges();
      const toToggle = config.collapsibleGroups[groupName];
      const anyVisible = toToggle.some(
        (id) => !hiddenNodes.has(id) && activeNodes.find((n) => n.id === id)
      );
      setHidden(toToggle, anyVisible, "node");
      const relatedEdges = activeEdges
        .filter(
          (edge) => toToggle.includes(edge.from) || toToggle.includes(edge.to)
        )
        .map((e) => e.id);
      setHidden(relatedEdges, anyVisible, "edge");
    }, "Modules");
  });

  renderLegend(nodes, document.getElementById("legend"), config.legendIcons);
  renderNarrative();
  clearHidden(getActiveNodes(), getActiveEdges());
  resetFocus(getActiveNodes(), getActiveEdges());
}

function renderLegend(nodes, container, legendIcons) {
  if (!container) return;
  container.innerHTML = "<h3>Legend</h3>";
  const seen = new Set();
  nodes.forEach((node) => {
    if (seen.has(node.group)) return;
    seen.add(node.group);
    const row = document.createElement("div");
    row.className = "legend-row";
    const swatch = document.createElement("div");
    swatch.className = "legend-swatch";
    swatch.style.background = node.color;
    row.appendChild(swatch);
    const icon = document.createElement("span");
    icon.className = "legend-icon";
    icon.textContent = legendIcons[node.group] || "⬤";
    row.appendChild(icon);
    row.appendChild(
      document.createTextNode(`${node.styleLabel || node.group} elements`)
    );
    container.appendChild(row);
  });

  const edgeHeader = document.createElement("div");
  edgeHeader.style.marginTop = "0.75rem";
  edgeHeader.textContent = "Edges";
  edgeHeader.style.fontWeight = "700";
  edgeHeader.style.fontSize = "13px";
  container.appendChild(edgeHeader);

  Object.entries(edgeTypeStyles).forEach(([type, color]) => {
    const row = document.createElement("div");
    row.className = "legend-row";
    const swatch = document.createElement("div");
    swatch.className = "legend-swatch";
    swatch.style.background = color;
    row.appendChild(swatch);
    const icon = document.createElement("span");
    icon.className = "legend-icon";
    icon.textContent = type === "return" ? "↩" : type === "control" ? "⚙" : "→";
    row.appendChild(icon);
    row.appendChild(document.createTextNode(type));
    container.appendChild(row);
  });

  const decoupled = document.createElement("div");
  decoupled.className = "legend-row";
  const badge = document.createElement("div");
  badge.className = "legend-swatch";
  badge.style.background = "#00c6ae";
  decoupled.appendChild(badge);
  const icon = document.createElement("span");
  icon.className = "legend-icon";
  icon.textContent = "🧩";
  decoupled.appendChild(icon);
  decoupled.appendChild(
    document.createTextNode("Modules are independent / de-coupled")
  );
  container.appendChild(decoupled);
}

function renderNarrative() {
  const container = document.getElementById("narrative");
  if (!container) return;
  container.innerHTML = `
    <h3>Architecture Story</h3>
    <p>Audio enters via <strong>Signal Manager</strong>, passes through <strong>Master Control</strong> and the <strong>Module Manager</strong> for dynamics, then the <strong>Channel Effects Manager</strong> fans out into time/pitch/color modules before rejoining the bridge to the main output.</p>
    <p>Each node owns a single responsibility and never crosses into another node’s role—concerns stay localized and the modular architecture stays de-coupled. Guided tours, A/B presets, collapsible modules, and mode switches demonstrate the complex control surface and UX iteration for both architect and end-user views.</p>
  `;
}
