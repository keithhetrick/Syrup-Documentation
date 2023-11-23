export function getPath(root, selectedNode, nodes) {
  const path = [];
  let currentNode = selectedNode;
  while (currentNode && currentNode?.id !== root?.id) {
    path.push(currentNode);
    currentNode = nodes?.find((node) => node?.id === currentNode?.parentId);
  }
  path.push(root);
  return path;
}

export function getAudioPath(root, nodes, edges) {
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
      .map((edge) => nodes?.find((node) => node?.id === edge?.to));
    queue.push(...children);
  }

  // Reset visited nodes to false
  nodes?.forEach((node) => (node.visited = false));
  return path;
}

// Write a function that checks if the edges of each node contains a dashes boolean value of "true", then do not highlight edge
export function getEdges(nodes, edges) {
  const edgesToHighlight = [];
  edges.forEach((edge) => {
    const fromNode = nodes?.find((node) => node?.id === edge?.from);
    const toNode = nodes?.find((node) => node?.id === edge?.to);
    if (fromNode && toNode && edge.dashes) {
      edgesToHighlight?.push(edge);
    }
  });

  console.log("EDGES TO HIGHLIGHT: ", edgesToHighlight);
  return edgesToHighlight;
}
