export function getPath(root, selectedNode, nodes) {
  const path = [];
  let currentNode = selectedNode;
  while (currentNode && currentNode.id !== root.id) {
    path.push(currentNode);
    currentNode = nodes.find((node) => node.id === currentNode.parentId);
  }
  path.push(root);
  return path;
}

export function dfs(root, nodes, edges) {
  const path = [];
  const stack = [root];

  while (stack.length > 0) {
    const node = stack.pop();
    if (node.visited) {
      continue;
    }
    node.visited = true;
    path.push(node);
    const children = edges
      .filter((edge) => edge.from === node.id)
      .map((edge) => nodes.find((node) => node.id === edge.to));
    stack.push(...children);
  }

  // Reset visited nodes to false
  nodes.forEach((node) => (node.visited = false));
  return path;
}

export function bfs(root, nodes, edges) {
  const path = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    if (node.visited) {
      continue;
    }
    node.visited = true;
    path.push(node);
    const children = edges
      .filter((edge) => edge.from === node.id)
      .map((edge) => nodes.find((node) => node.id === edge.to));
    queue.push(...children);
  }

  // Reset visited nodes to false
  nodes.forEach((node) => (node.visited = false));
  return path;
}

// I want to use a modified version of the BFS algorithm to find the path from the "AUDIO INPUT" node to the "AUDIO OUTPUT" node
export function getAudioPath(root, nodes, edges) {
  const start = root || nodes.find((node) => node.label === "AUDIO INPUT");
  const end = nodes.find((node) => node.label === "AUDIO OUTPUT");

  const path = [];
  const queue = [start];

  while (queue.length > 0) {
    const node = queue.shift();
    if (node.visited) {
      continue;
    }
    node.visited = true;
    path.push(node);
    if (node.id === end.id) {
      // We found the end node, so stop searching
      break;
    }
    const children = edges
      .filter((edge) => edge.from === node.id)
      .map((edge) => nodes.find((node) => node.id === edge.to));
    queue.push(...children);
  }

  // Reset visited nodes to false
  nodes.forEach((node) => (node.visited = false));
  return path;
}
