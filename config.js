// Central configuration for the Syrup signal flow presentation.
export const HIGHLIGHT_DURATION_MS = 5000;

export const presets = {
  audioPath: { label: "Highlight Audio Path", nodes: null }, // BFS-driven
  chainA: {
    label: "A/B: Chain A",
    nodes: [
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
      "Delay",
      "Signal Bridge Output",
      "Output Main",
      "AUDIO OUTPUT",
    ],
  },
  chainB: {
    label: "A/B: Chain B",
    nodes: [
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
      "Saturation",
      "Pitch Shifter",
      "Signal Bridge Output",
      "Output Main",
      "AUDIO OUTPUT",
    ],
  },
  fxChainA: {
    label: "FX Chain A",
    nodes: [
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
      "Delay",
      "Saturation",
      "Pitch Shifter",
      "Channel Signal Bridge",
      "Signal Bridge Output",
      "Output Main",
      "AUDIO OUTPUT",
    ],
  },
  dryPath: {
    label: "Dry Path",
    nodes: [
      "AUDIO INPUT",
      "SIGNAL MANAGER",
      "Signal Input",
      "Signal Bridge",
      "Signal Bridge Output",
      "Signal Output",
      "Output Main",
      "AUDIO OUTPUT",
    ],
  },
  cleaningChain: {
    label: "Cleaning Chain",
    nodes: [
      "AUDIO INPUT",
      "SIGNAL MANAGER",
      "Signal Input",
      "Signal Bridge",
      "EFFECTS SIGNAL MANAGER",
      "Effects Signal Manager Input",
      "Master Control",
      "MODULE MANAGER",
      "Parametric EQ",
      "Noise Reduction",
      "Soft Clipping",
      "CHANNEL EFFECTS MANAGER",
      "Channel Signal Bridge",
      "Signal Bridge Output",
      "Output Main",
      "AUDIO OUTPUT",
    ],
  },
  fullDynamicsChain: {
    label: "Full Dynamics Chain",
    nodes: [
      "AUDIO INPUT",
      "SIGNAL MANAGER",
      "Signal Input",
      "Signal Bridge",
      "EFFECTS SIGNAL MANAGER",
      "Effects Signal Manager Input",
      "Master Control",
      "MODULE MANAGER",
      "Parametric EQ",
      "Noise Reduction",
      "Soft Clipping",
      "Compression",
      "Limiter",
      "Gate",
      "CHANNEL EFFECTS MANAGER",
      "Channel Signal Bridge",
      "Signal Bridge Output",
      "Output Main",
      "AUDIO OUTPUT",
    ],
  },
  masteringChain: {
    label: "Mastering Chain",
    nodes: [
      "AUDIO INPUT",
      "SIGNAL MANAGER",
      "Signal Input",
      "Signal Bridge",
      "EFFECTS SIGNAL MANAGER",
      "Effects Signal Manager Input",
      "Master Control",
      "MODULE MANAGER",
      "Parametric EQ",
      "Soft Clipping",
      "Compression",
      "Limiter",
      "CHANNEL EFFECTS MANAGER",
      "Channel Signal Bridge",
      "Signal Bridge Output",
      "Output Main",
      "AUDIO OUTPUT",
    ],
  },
};

// User-created presets - dynamically managed
export const userPresets = {};

// Function to add a user preset dynamically
export function addUserPreset(name, label, nodes) {
  if (!name || !label || !Array.isArray(nodes)) {
    throw new Error("Invalid preset: name, label, and nodes array required");
  }
  userPresets[name] = { label, nodes };
  return userPresets[name];
}

// Function to remove a user preset
export function removeUserPreset(name) {
  if (userPresets[name]) {
    delete userPresets[name];
    return true;
  }
  return false;
}

// Function to get all presets (built-in + user)
export function getAllPresets() {
  return { ...presets, ...userPresets };
}

export const collapsibleGroups = {
  "Parametric EQ": [
    "Parametric EQ Input",
    "Parametric EQ Output",
    "Parametric EQ Parameter Control",
    "Parametric EQ Processing",
    "Parametric EQ Wet/Dry Mix",
  ],
  "Noise Reduction": [
    "Noise Reduction Input",
    "Noise Reduction Output",
    "Noise Reduction Parameter Control",
    "Noise Reduction Processing",
    "Noise Reduction Wet/Dry Mix",
  ],
  "Soft Clipping": [
    "Soft Clipping Input",
    "Soft Clipping Output",
    "Soft Clipping Parameter Control",
    "Soft Clipping Processing",
    "Soft Clipping Wet/Dry Mix",
  ],
  Reverb: [
    "Reverb Input",
    "Reverb Output",
    "Reverb Parameter Control",
    "Reverb Processing",
    "Reverb Wet/Dry Mix",
  ],
  Delay: [
    "Delay Input",
    "Delay Output",
    "Delay Parameter Control",
    "Delay Processing",
    "Delay Wet/Dry Mix",
  ],
  Saturation: [
    "Saturation Input",
    "Saturation Output",
    "Saturation Parameter Control",
    "Saturation Processing",
    "Saturation Wet/Dry Mix",
  ],
  "Pitch Shifter": [
    "Pitch Shifter Input",
    "Pitch Shifter Output",
    "Pitch Shifter Parameter Control",
    "Pitch Shifter Processing",
    "Pitch Shifter Wet/Dry Mix",
  ],
  "Master Control": [
    "Master Control Input",
    "Master Control Output",
    "Master Control Parameter Control",
    "Master Control Processing",
    "Master Control Wet/Dry Mix",
  ],
};

export const modes = {
  architect: {
    label: "Architect",
    visible: null, // null = show all
  },
  endUser: {
    label: "End-user",
    visible: new Set([
      "AUDIO INPUT",
      "SIGNAL MANAGER",
      "Signal Bridge",
      "EFFECTS SIGNAL MANAGER",
      "Master Control",
      "MODULE MANAGER",
      "Parametric EQ",
      "Noise Reduction",
      "Soft Clipping",
      "Compression",
      "Limiter",
      "Gate",
      "CHANNEL EFFECTS MANAGER",
      "Channel Signal Bridge",
      "Reverb",
      "Delay",
      "Saturation",
      "Pitch Shifter",
      "Signal Bridge Output",
      "Output Main",
      "AUDIO OUTPUT",
    ]),
  },
};

export const legendIcons = {
  audio: "🔊",
  io: "🎛️",
  plugin__io: "🎛️",
  manager: "🧭",
  host: "🛰️",
  process: "🧪",
  control: "🎚️",
};
