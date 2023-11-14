import {
  getPath,
  getAudioPath,
  // getInputPath
} from "./helper-functions.js";

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

  // getAudioPath button
  const getAudioPathButton = document.createElement("button");
  getAudioPathButton.innerHTML = "Get Audio Path";
  getAudioPathButton.addEventListener("click", function () {
    handleSearchButtonClick(network, nodes, edges, getAudioPath);
  });
  document.body.appendChild(getAudioPathButton);

  // getInputPath button
  // const getInputPathButton = document.createElement("button");
  // getInputPathButton.innerHTML = "Get Input Path";
  // getInputPathButton.addEventListener("click", function () {
  //   handleSearchButtonClick(network, nodes, edges, getInputPath);
  // });
  // document.body.appendChild(getInputPathButton);
}

function handleSearchButtonClick(network, nodes, edges, searchFunction) {
  const selectedNodeId = network.getSelectedNodes()[0];
  const selectedNode = nodes.find(
    (node) => node.id === selectedNodeId || node.rootId === selectedNodeId
  );
  const rootId = selectedNode.rootId || selectedNode.id;
  const root = nodes.find((node) => node.id === rootId);
  const path = searchFunction(root, nodes, edges);
  const pathIds = path?.map((node) => node.id);
  network.selectNodes(pathIds);

  setTimeout(() => network.unselectAll(), 200);
}
