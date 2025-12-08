export function getPath(root, selectedNode, nodes, lookup) {
  if (!root || !selectedNode) return [];
  const path = [];
  let currentNode = selectedNode;
  while (currentNode && currentNode?.id !== root?.id) {
    path.push(currentNode);
    currentNode =
      lookup?.get(currentNode?.parentId) ||
      nodes?.find((node) => node?.id === currentNode?.parentId);
  }
  path.push(root);
  return path;
}

export function findRoot(node, nodes, lookup) {
  let current = node;
  let lastValid = node;
  while (current?.parentId) {
    const parent =
      lookup?.get(current.parentId) ||
      nodes?.find((n) => n?.id === current?.parentId);
    if (!parent) break;
    lastValid = parent;
    current = parent;
  }
  return lastValid;
}

export function getAudioPath(root, nodes, edges, lookup) {
  const start = root || nodes?.find((node) => node.label === "AUDIO INPUT");
  const end = nodes?.find((node) => node?.label === "AUDIO OUTPUT");

  const path = [];
  const queue = [start];

  while (queue.length > 0) {
    const node = queue.shift();
    if (node?.visited) {
      continue;
    }
    node.visited = true;
    path.push(node);
    if (node?.id === end?.id) {
      // We found the end node, so stop searching
      break;
    }
    const children = edges
      .filter((edge) => edge?.from === node?.id)
      .map(
        (edge) =>
          lookup?.get(edge?.to) || nodes?.find((node) => node?.id === edge?.to)
      );
    queue.push(...children);
  }

  // Reset visited nodes to false
  nodes?.forEach((node) => (node.visited = false));
  return path;
}

// Checks if the edges of each node contains a dashes boolean value of "true", then do not highlight edge
export function getEdges(nodes, edges) {
  const edgesToHighlight = edges
    .filter((edge) => edge?.isReturn || edge?.dashes)
    .map((edge) => edge?.id ?? `${edge?.from}->${edge?.to}`);
  return edgesToHighlight;
}

export function buildEdgeType(edge, nodes) {
  if (edge?.isReturn || edge?.dashes) return "return";
  const fromNode = nodes?.find((n) => n?.id === edge?.from);
  const toNode = nodes?.find((n) => n?.id === edge?.to);
  if (fromNode?.group === "control" || toNode?.group === "control")
    return "control";
  return "audio";
}
