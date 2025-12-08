// Shared UI helpers for focus, hiding, and timed clearing.
export function createFocusController(network, nodesDS, edgesDS) {
  let highlightTimer = null;

  const resetFocus = (activeNodes, activeEdges) => {
    const nodesReset = activeNodes.map((n) => ({
      id: n.id,
      color: {
        ...n.color,
        background: n.baseColor,
        border: n.baseColor,
        opacity: 1,
      },
    }));
    const edgesReset = activeEdges.map((e) => ({
      id: e.id,
      color: { ...e.color, color: e.baseColor, opacity: 1 },
    }));
    nodesDS.update(nodesReset);
    edgesDS.update(edgesReset);
  };

  const applyFocus = (activeNodes, activeEdges, nodeIds = [], edgeIds = []) => {
    const nodeSet = new Set(nodeIds);
    const edgeSet = new Set(edgeIds);
    const nodeUpdates = activeNodes.map((n) => ({
      id: n.id,
      color: {
        ...n.color,
        background: n.baseColor,
        border: n.baseColor,
        opacity: nodeSet.size ? (nodeSet.has(n.id) ? 1 : 0.25) : 1,
      },
    }));
    const edgeUpdates = activeEdges.map((e) => ({
      id: e.id,
      color: {
        ...e.color,
        color: e.baseColor,
        opacity: edgeSet.size ? (edgeSet.has(e.id) ? 1 : 0.2) : 1,
      },
    }));
    nodesDS.update(nodeUpdates);
    edgesDS.update(edgeUpdates);
  };

  const clearSelectionAndFocus = (activeNodes, activeEdges) => {
    if (highlightTimer) {
      clearTimeout(highlightTimer);
      highlightTimer = null;
    }
    network.unselectAll();
    resetFocus(activeNodes, activeEdges);
  };

  const scheduleClear = (delayMs, activeNodes, activeEdges) => {
    if (highlightTimer) clearTimeout(highlightTimer);
    highlightTimer = setTimeout(() => {
      highlightTimer = null;
      clearSelectionAndFocus(activeNodes, activeEdges);
    }, delayMs);
  };

  return {
    applyFocus,
    resetFocus,
    scheduleClear,
    clearSelectionAndFocus,
  };
}

// Hide/unhide without removing nodes/edges.
export function createHideController(nodesDS, edgesDS) {
  const hiddenNodes = new Set();
  const hiddenEdges = new Set();

  const clearHidden = (activeNodes, activeEdges) => {
    const nodesList = activeNodes ?? nodesDS.get();
    const edgesList = activeEdges ?? edgesDS.get();
    hiddenNodes.clear();
    hiddenEdges.clear();
    nodesDS.update(nodesList.map((n) => ({ id: n.id, hidden: false })));
    edgesDS.update(edgesList.map((e) => ({ id: e.id, hidden: false })));
  };

  const setHidden = (ids, hidden, type = "node") => {
    const dataSet = type === "node" ? nodesDS : edgesDS;
    const registry = type === "node" ? hiddenNodes : hiddenEdges;
    const existingIds = ids.filter((id) => Boolean(dataSet.get(id)));
    existingIds.forEach((id) => (hidden ? registry.add(id) : registry.delete(id)));
    dataSet.update(existingIds.map((id) => ({ id, hidden })));
  };

  return { hiddenNodes, hiddenEdges, clearHidden, setHidden };
}
