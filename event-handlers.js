import {
  findRoot,
  getAudioPath,
  getEdges,
  getPath,
  // getInputPath
  // setChannelStripOptions,
} from "./helper-functions.js";
import { HIGHLIGHT_DURATION_MS, legendIcons } from "./config.js";
import { processingNodesList } from "./data.js";
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
  const getControlPanels = () =>
    Array.from(controlsContainer?.querySelectorAll("details") || []);
  const positionDrawer = (panel) => {
    // Drawer positions relative to its summary; CSS handles overlay.
    return panel;
  };
  const closeControlDrawer = (collapsePanels = true) => {
    getControlPanels().forEach((panel) => {
      panel.classList.remove("drawer");
      if (collapsePanels) {
        panel.open = false;
      }
    });
  };
  const openControlDrawer = (panel) => {
    if (!panel) return;
    getControlPanels().forEach((other) => {
      if (other !== panel) {
        other.open = false;
        other.classList.remove("drawer");
      }
    });
    panel.open = true;
    panel.classList.add("drawer");
    positionDrawer(panel);
  };
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

  // Cache/restore styles so guided tour can dim non-active nodes cleanly.
  let tourOriginalNodeColors = null;
  let tourOriginalEdgeColors = null;

  // Utility: create grouped button sections so the control bar stays organized; each button acts as a command handler over the graph data.
  const addButton = (label, onClick, groupId = "default") => {
    let detailsWrapper = controlsContainer.querySelector(
      `details[data-group="${groupId}"]`
    );
    if (!detailsWrapper) {
      detailsWrapper = document.createElement("details");
      detailsWrapper.dataset.group = groupId;
      detailsWrapper.open = false;
      const summary = document.createElement("summary");
      summary.textContent = groupId;
      detailsWrapper.appendChild(summary);
      const group = document.createElement("div");
      group.className = "control-group";
      detailsWrapper.appendChild(group);
      controlsContainer.appendChild(detailsWrapper);
    }
    const group = detailsWrapper.querySelector(".control-group");
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.addEventListener("click", onClick);
    group.appendChild(btn);
  };

  if (controlsContainer) {
    controlsContainer.addEventListener("click", (event) => {
      if (event.detail > 1) return; // let double-click handler take over
      const summary = event.target.closest("summary");
      if (!summary) return;
      const panel = summary.parentElement;
      if (!panel || panel.tagName.toLowerCase() !== "details") return;

      event.preventDefault(); // take over toggle to avoid reflow
      const alreadyOpen = panel.classList.contains("drawer");
      closeControlDrawer();
      if (!alreadyOpen) {
        panel.open = true;
        openControlDrawer(panel);
      } else {
        panel.open = false;
      }
    });
    controlsContainer.addEventListener("dblclick", (event) => {
      const summary = event.target.closest("summary");
      if (!summary) return;
      const panel = summary.parentElement;
      if (!panel || panel.tagName.toLowerCase() !== "details") return;
      event.preventDefault();
      const isOpen = panel.classList.contains("drawer");
      closeControlDrawer();
      panel.open = !isOpen;
      if (!isOpen) openControlDrawer(panel);
    });
    controlsContainer.addEventListener("scroll", () => {
      const openPanel = controlsContainer.querySelector("details.drawer");
      if (openPanel) positionDrawer(openPanel);
    });
  }
  window.addEventListener("resize", () => {
    const openPanel = controlsContainer?.querySelector("details.drawer");
    if (openPanel) positionDrawer(openPanel);
  });

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

    // Mini-map pointer disabled per UX feedback; keep main pointer only.
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

  const cacheTourStyles = () => {
    if (!tourOriginalNodeColors) {
      tourOriginalNodeColors = new Map();
      getActiveNodes().forEach((n) => tourOriginalNodeColors.set(n.id, n.color));
    }
    if (!tourOriginalEdgeColors) {
      tourOriginalEdgeColors = new Map();
      getActiveEdges().forEach((e) => tourOriginalEdgeColors.set(e.id, e.color));
    }
  };

  const restoreTourStyles = () => {
    if (tourOriginalNodeColors) {
      nodesDS.update(
        Array.from(tourOriginalNodeColors.entries()).map(([id, color]) => ({
          id,
          color,
        }))
      );
    }
    if (tourOriginalEdgeColors) {
      edgesDS.update(
        Array.from(tourOriginalEdgeColors.entries()).map(([id, color]) => ({
          id,
          color,
        }))
      );
    }
    tourOriginalNodeColors = null;
    tourOriginalEdgeColors = null;
  };

  const dimGraphForTour = (activeIds = []) => {
    const activeSet = new Set(activeIds);
    const activeEdges = getActiveEdges();
    const pathEdgeIds = activeEdges
      .filter((edge) => activeSet.has(edge.from) && activeSet.has(edge.to))
      .map((edge) => edge.id);

    const nodeUpdates = getActiveNodes().map((node) => {
      const baseColor = tourOriginalNodeColors?.get(node.id) || node.color;
      const dimColor = {
        background: "rgba(180, 180, 180, 0.22)",
        border: "rgba(120, 120, 120, 0.45)",
        highlight: { border: "#ff9500", background: "#ffe7c2" },
        hover: { border: "#ffb84d", background: "#fff2d9" },
      };
      return {
        id: node.id,
        color: activeSet.has(node.id) ? baseColor : dimColor,
      };
    });

    const edgeUpdates = activeEdges.map((edge) => {
      const baseColor =
        tourOriginalEdgeColors?.get(edge.id) ||
        edge.color || { color: "#8c8c8c", highlight: "#ff9500", hover: "#ffb84d" };
      const dimEdgeColor = {
        color: "rgba(130, 130, 130, 0.25)",
        highlight: "#ff9500",
        hover: "#ffb84d",
      };
      return {
        id: edge.id,
        color: pathEdgeIds.includes(edge.id) ? baseColor : dimEdgeColor,
      };
    });

    nodesDS.update(nodeUpdates);
    edgesDS.update(edgeUpdates);
  };

  const highlightWithDim = (ids) => {
    if (!ids?.length) return;
    cacheTourStyles();
    selectPath(ids);
    dimGraphForTour(ids);
    setTimeout(() => {
      restoreTourStyles();
      resetFocus(getActiveNodes(), getActiveEdges());
    }, HIGHLIGHT_DURATION_MS);
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
      highlightWithDim(pathIds);
    },
    "Views"
  );

  Object.entries(config.presets || {})
    .filter(([key]) => key !== "audioPath")
    .forEach(([, preset]) => {
      addButton(
        preset.label,
        () => {
          highlightWithDim(preset.nodes);
        },
        preset.label.startsWith("A/B") ? "A/B Compare" : "Presets"
      );
    });

  // Add buttons for user-created presets dynamically
  const renderUserPresets = () => {
    // Clear existing user preset buttons
    const userPresetGroup = controlsContainer.querySelector('[data-group="User Presets"]');
    if (userPresetGroup) {
      userPresetGroup.remove();
    }
    
    // Re-render user presets
    Object.values(config.userPresets || {}).forEach((preset) => {
      addButton(
        preset.label,
        () => {
          highlightWithDim(preset.nodes);
        },
        "User Presets"
      );
    });
  };

  // Add button to save current selection as a preset
  addButton("Save Current Path", () => {
    const selectedNodes = network.getSelectedNodes();
    if (selectedNodes.length === 0) {
      alert("Please select nodes to create a preset. Click nodes or use a preset to highlight a path first.");
      return;
    }
    
    const presetName = prompt("Enter a name for this preset:");
    if (!presetName) return;
    
    // Generate unique key with timestamp to avoid conflicts
    const baseKey = presetName.replace(/\s+/g, "_").toLowerCase();
    let presetKey = baseKey;
    let counter = 1;
    
    // Check for existing keys and append counter if needed
    while (config.userPresets[presetKey]) {
      presetKey = `${baseKey}_${counter}`;
      counter++;
    }
    
    try {
      config.addUserPreset(presetKey, presetName, selectedNodes);
      renderUserPresets();
      alert(`Preset "${presetName}" saved successfully!`);
    } catch (err) {
      alert(`Error saving preset: ${err.message}`);
    }
  }, "User Presets");

  // Initial render of user presets
  renderUserPresets();

  // Inline macro controls (demonstration of parameter binding)
  const macros = [
    { id: "macro-wet", label: "Global Wet", min: 0, max: 100, value: 50 },
    { id: "macro-dynamics", label: "Dynamics Depth", min: 0, max: 100, value: 60 },
    { id: "macro-fx", label: "FX Mix", min: 0, max: 100, value: 55 },
  ];
  const macroWrapper = document.createElement("div");
  macroWrapper.className = "control-group";
  macros.forEach((m) => {
    const wrap = document.createElement("div");
    wrap.className = "macro";
    const label = document.createElement("label");
    label.htmlFor = m.id;
    label.textContent = `${m.label}: ${m.value}%`;
    const input = document.createElement("input");
    input.type = "range";
    input.id = m.id;
    input.min = m.min;
    input.max = m.max;
    input.value = m.value;
    input.addEventListener("input", (e) => {
      const val = Number(e.target.value);
      label.textContent = `${m.label}: ${val}%`;
      // Hook: dispatch to controller/engine for real parameter binding
      if (window.syrupSignalFlow) {
        window.syrupSignalFlow.lastMacro = { id: m.id, value: val };
      }
    });
    wrap.appendChild(label);
    wrap.appendChild(input);
    macroWrapper.appendChild(wrap);
  });
  const macroDetails = document.createElement("details");
  macroDetails.dataset.group = "Macros";
  const macroSummary = document.createElement("summary");
  macroSummary.textContent = "Macros";
  macroDetails.appendChild(macroSummary);
  macroDetails.appendChild(macroWrapper);
  controlsContainer.appendChild(macroDetails);

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
        restoreTourStyles();
        positionPointer();
      };

      const runStep = () => {
        if (idx >= steps.length) {
          clearTour();
          return;
        }
        const { ids, text } = steps[idx];
        cacheTourStyles();
        selectPath(ids);
        dimGraphForTour(ids);
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
      // Filter nodes by ID (processingNodesList contains node IDs)
      const activeNodes = getActiveNodes().filter(n => processingNodesList.includes(n.id));
      
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
    "Toggle Offline Assets",
    () => {
      const cdnScript = document.querySelector('script[src*="vis-network"]');
      if (cdnScript) {
        cdnScript.src = "./assets/vendor/vis-network.min.js";
        alert("Switched to local vis-network (requires local vendor files). Refresh to apply.");
      } else {
        alert("Local vendor not detected. Ensure ./assets/vendor/vis-network.min.js exists.");
      }
    },
    "Theme"
  );
  addButton(
    "Keyboard Hints",
    () => {
      alert(
        "Keyboard: D toggles Dark/Light, R resets view (current mode), double-click clears highlights."
      );
    },
    "Theme"
  );
  addButton(
    "Import Presets (JSON)",
    () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";
      input.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const parsed = JSON.parse(reader.result);
            if (parsed && typeof parsed === "object") {
              Object.entries(parsed).forEach(([key, val]) => {
                if (val?.label && Array.isArray(val.nodes)) {
                  config.userPresets[key] = val;
                }
              });
              alert("Presets imported.");
              renderUserPresets();
            }
          } catch (err) {
            alert("Invalid preset file.");
          }
        };
        reader.readAsText(file);
      });
      input.click();
    },
    "User Presets"
  );
  addButton(
    "Export Presets (JSON)",
    () => {
      const dataStr = JSON.stringify(config.userPresets || {}, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "syrup-user-presets.json";
      link.click();
      URL.revokeObjectURL(url);
    },
    "User Presets"
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
      closeControlDrawer();
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
  addButton(
    "Latency Heatmap",
    () => {
      const activeEdges = getActiveEdges();
      const maxLatency = Math.max(
        ...activeEdges.map((e) => (typeof e.latency === "number" ? e.latency : 0)),
        1
      );
      const updates = activeEdges.map((e) => {
        const ratio = Math.min((e.latency || 0) / maxLatency, 1);
        const color = `rgba(${Math.floor(255 * ratio)}, ${Math.floor(120 * (1 - ratio))}, 80, 0.8)`;
        return { id: e.id, color: { color, highlight: color, hover: color } };
      });
      edgesDS.update(updates);
      setTimeout(() => {
        if (tourOriginalEdgeColors) {
          edgesDS.update(
            Array.from(tourOriginalEdgeColors.entries()).map(([id, color]) => ({ id, color }))
          );
        }
      }, HIGHLIGHT_DURATION_MS);
    },
    "Views"
  );

  // Mode switcher
  addButton(
    "Mode: Architect",
    () => {
      resetData("architect");
      clearHidden(getActiveNodes(), getActiveEdges());
      setTimeout(() => resetFocus(getActiveNodes(), getActiveEdges()), 50);
      clearSelectionAndFocus(getActiveNodes(), getActiveEdges());
    },
    "Modes"
  );
  addButton(
    "Mode: End-user",
    () => {
      resetData("endUser");
      clearHidden(getActiveNodes(), getActiveEdges());
      setTimeout(() => resetFocus(getActiveNodes(), getActiveEdges()), 50);
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
  container.innerHTML = "";
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
    <p><strong>Routing patterns:</strong> Managers enforce predictable ingress/egress while bridges isolate domains. Returns are dashed to surface non-linear routes. Dynamics live under the Module Manager so channel FX can be swapped without disturbing level governance.</p>
    <p><strong>Resilience:</strong> Physics is disabled after stabilization to avoid jitter; reset and zoom controls restore safe defaults; all paths derive from a single source of truth for nodes/edges to keep the mini-map and main graph synchronized.</p>
    <p><strong>UX cues:</strong> Bands hint at phases, presets highlight canonical paths, and toggleable groups let you trim the view for a focused story—useful for design reviews or end-user onboarding.</p>
  `;
}
