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

// Create a function containing a long Switch Statement to catch the EXACT path that is being told, and add id's to it so that it can be found in the button – the path should be as follows: "AUDIO INPUT" -> "SIGNAL MANAGER" -> "Signal Input" -> "Signal Bridge" -> "Signal Bridge Input" -> "EFFECTS SIGNAL MANAGER" -> "Effects Signal Manager Input" -> "Single Effects Host" -> "Single Effects Input" -> "Reverb" -> "Reverb Input" -> "Reverb Signal Host" -> "Reverb Signal Host Input" -> "Reverb Parameter Control" -> "Reverb Processing" -> "Reverb Wet/Dry Mix"

// export function getInputPath(currentLabel) {
// write an internal hash map helper function that pushes/adds currentLabel into path array using their id's using map, meaning that "AUDIO INPUT" will be pushed into path array with an id called "audio-input-id" and so on & make it so that it runs everythime the button is clicked
let inputPath = {};
export const getInputPath = (currentLabel) => {
  let path = {};
  let key = currentLabel;

  switch (currentLabel) {
    case "AUDIO INPUT":
      key = "audio-input-id";
      path = [];
      break;
    case "SIGNAL MANAGER":
      key = "signal-manager-id";
      path = ["audio-input-id"];
      break;
    case "Signal Input":
      key = "signal-input-id";
      path = ["audio-input-id", "signal-manager-id"];
      break;
    case "Signal Bridge":
      key = "signal-bridge-id";
      path = ["audio-input-id", "signal-manager-id", "signal-input-id"];
      break;
    case "Signal Bridge Input":
      key = "signal-bridge-input-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
      ];
      break;
    case "EFFECTS SIGNAL MANAGER":
      key = "effects-signal-manager-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
        "signal-bridge-input-id",
      ];
      break;
    case "Effects Signal Manager Input":
      key = "effects-signal-manager-input-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
        "signal-bridge-input-id",
        "effects-signal-manager-id",
      ];
      break;
    case "Single Effects Host":
      key = "single-effects-host-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
        "signal-bridge-input-id",
        "effects-signal-manager-id",
        "effects-signal-manager-input-id",
      ];
      break;
    case "Single Effects Input":
      key = "single-effects-input-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
        "signal-bridge-input-id",
        "effects-signal-manager-id",
        "effects-signal-manager-input-id",
        "single-effects-host-id",
      ];
      break;
    case "Reverb":
      key = "reverb-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
        "signal-bridge-input-id",
        "effects-signal-manager-id",
        "effects-signal-manager-input-id",
        "single-effects-host-id",
        "single-effects-input-id",
      ];
      break;
    case "Reverb Input":
      key = "reverb-input-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
        "signal-bridge-input-id",
        "effects-signal-manager-id",
        "effects-signal-manager-input-id",
        "single-effects-host-id",
        "single-effects-input-id",
        "reverb-id",
      ];
      break;
    case "Reverb Signal Host":
      key = "reverb-signal-host-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
        "signal-bridge-input-id",
        "effects-signal-manager-id",
        "effects-signal-manager-input-id",
        "single-effects-host-id",
        "single-effects-input-id",
        "reverb-id",
        "reverb-input-id",
      ];
      break;
    case "Reverb Signal Host Input":
      key = "reverb-signal-host-input-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
        "signal-bridge-input-id",
        "effects-signal-manager-id",
        "effects-signal-manager-input-id",
        "single-effects-host-id",
        "single-effects-input-id",
        "reverb-id",
        "reverb-input-id",
        "reverb-signal-host-id",
      ];
      break;
    case "Parameter Control":
      key = "parameter-control-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
        "signal-bridge-input-id",
        "effects-signal-manager-id",
        "effects-signal-manager-input-id",
        "single-effects-host-id",
        "single-effects-input-id",
        "reverb-id",
        "reverb-input-id",
        "reverb-signal-host-id",
      ];
      break;
    case "Reverb Processing":
      key = "reverb-processing-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
        "signal-bridge-input-id",
        "effects-signal-manager-id",
        "effects-signal-manager-input-id",
        "single-effects-host-id",
        "single-effects-input-id",
        "reverb-id",
        "reverb-input-id",
        "reverb-signal-host-id",
      ];
      break;
    case "Reverb Wet/Dry Mix":
      key = "reverb-wet-dry-mix-id";
      path = [
        "audio-input-id",
        "signal-manager-id",
        "signal-input-id",
        "signal-bridge-id",
        "signal-bridge-input-id",
        "effects-signal-manager-id",
        "effects-signal-manager-input-id",
        "single-effects-host-id",
        "single-effects-input-id",
        "reverb-id",
        "reverb-input-id",
        "reverb-signal-host-id",
      ];

      break;
    default:
      break;
  }
  inputPath = { key, path };
  // console.log("INSIDE SWITCH: ", inputPath);

  return inputPath;
};

// console.log("OUTSIDE SWITCH: ", inputPath);
