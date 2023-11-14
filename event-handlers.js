import { getPath, dfs, bfs, getAudioPath } from "./helper-functions.js";

export function setupEventListeners(network, nodes, edges) {
  // Event listener for highlighting the path of a selected node
  network.on("selectNode", function (params) {
    const selectedNodeId = params.nodes[0];
    const selectedNode = nodes.find((node) => node.id === selectedNodeId);
    const rootId = selectedNode.rootId;
    const root = nodes.find((node) => node.id === rootId);
    const path = getPath(root, selectedNode, nodes);
    const pathIds = path.map((node) => node.id);
    network.selectNodes(pathIds);
  });

  // Depth First Search tree button
  const dfsButton = document.createElement("button");
  dfsButton.innerHTML = "Depth First Search";
  dfsButton.addEventListener("click", function () {
    handleSearchButtonClick(network, nodes, edges, dfs);
  });

  document.body.appendChild(dfsButton);

  // Breadth First Search tree button
  const bfsButton = document.createElement("button");
  bfsButton.innerHTML = "Breadth First Search";
  bfsButton.addEventListener("click", function () {
    handleSearchButtonClick(network, nodes, edges, bfs);
  });
  document.body.appendChild(bfsButton);

  // add getAudioPath button
  const getAudioPathButton = document.createElement("button");
  getAudioPathButton.innerHTML = "Get Audio Path";
  getAudioPathButton.addEventListener("click", function () {
    handleSearchButtonClick(network, nodes, edges, getAudioPath);
  });
  document.body.appendChild(getAudioPathButton);
}

function handleSearchButtonClick(network, nodes, edges, searchFunction) {
  const selectedNodeId = network.getSelectedNodes()[0];
  const selectedNode = nodes.find(
    (node) => node.id === selectedNodeId || node.rootId === selectedNodeId
  );
  const rootId = selectedNode.rootId || selectedNode.id;
  const root = nodes.find((node) => node.id === rootId);
  const path = searchFunction(root, nodes, edges);
  const pathIds = path.map((node) => node.id);
  network.selectNodes(pathIds);

  setTimeout(() => network.unselectAll(), 200);
}
