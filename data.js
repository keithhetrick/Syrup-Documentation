// Define node categories for styling
const nodeStyles = {
  io: { color: "#00ea00" },
  plugin__io: { color: "#00fa90" },
  manager: { color: "#ff8000" },
  host: { color: "#00ffff" },
  process: { color: "#ff0000" },
  control: { color: "#ff00ff" },
  audio: { color: "#8000ff" },
};

// Function to create a node with common properties and parent-child relationship
function createNode(id, label, level, styleCategory, pid = null) {
  return {
    id,
    label,
    level,
    color: nodeStyles[styleCategory].color,
    pid, // Parent ID for maintaining parent-child relationship
  };
}

// Modules array called "Compression" for the compressor node, "Gate" for the gate node, and "Limiter" for the limiter node

// Nodes array
export const nodes = [
  /* AUDIO INPUT NODES */
  createNode("AUDIO INPUT", "AUDIO INPUT", 0, "audio"), // <-- Root node

  /* SIGNAL MANAGER NODES */
  createNode("SIGNAL MANAGER", "SIGNAL MANAGER", 1, "manager", "AUDIO INPUT"),
  createNode("Signal Input", "Signal Input", 2, "io", "SIGNAL MANAGER"),
  createNode("Signal Output", "Signal Output", 2, "io", "SIGNAL MANAGER"),
  createNode(
    "Signal Bridge",
    "Signal Bridge",
    3,
    "manager",
    "Signal Input" || "Signal Output"
  ),
  createNode(
    "Signal Bridge Input",
    "Signal Bridge Input",
    4,
    "io",
    "Signal Bridge"
  ),
  createNode(
    "Signal Bridge Output",
    "Signal Bridge Output",
    4,
    "io",
    "Signal Bridge"
  ),

  /* AI PROCESSING */
  createNode("AI Processing", "AI Processing", 4, "host", "Signal Bridge"),

  /* EFFECTS SIGNAL MANAGER */
  createNode(
    "EFFECTS SIGNAL MANAGER",
    "EFFECTS SIGNAL MANAGER",
    5,
    "manager",
    "Signal Bridge Input" || "Signal Bridge Output"
  ),
  createNode(
    "Effects Signal Manager Input",
    "Effects Signal Manager Input",
    6,
    "io",
    "EFFECTS SIGNAL MANAGER"
  ),
  createNode(
    "Effects Signal Manager Output",
    "Effects Signal Manager Output",
    6,
    "io",
    "EFFECTS SIGNAL MANAGER"
  ),

  /* MASTER CONTROL NODES */
  createNode(
    "Master Control",
    "Master Control",
    7,
    "process",
    "Effects Signal Manager Input" || "Effects Signal Manager Output"
  ),
  createNode(
    "Master Control Input",
    "Master Control Input",
    8,
    "io",
    "Master Control"
  ),
  createNode(
    "Master Control Output",
    "Master Control Output",
    8,
    "io",
    "Master Control"
  ),

  createNode(
    "Master Control Parameter Control",
    "Master Control Parameter Control",
    9,
    "control",
    "Master Control Signal Input"
  ),
  createNode(
    "Master Control Processing",
    "Master Control Processing",
    9,
    "control",
    "Master Control Signal Input"
  ),
  createNode(
    "Master Control Wet/Dry Mix",
    "Master Control Wet/Dry Mix",
    9,
    "control",
    "Master Control Signal Input"
  ),

  /* MODULES */
  createNode(
    "MODULE MANAGER",
    "MODULE MANAGER",
    10,
    "manager",
    "Master Control Wet/Dry Mix" || "Master Control Output"
  ),
  createNode(
    "Module Manager Input",
    "Module Manager Input",
    11,
    "io",
    "MODULE MANAGER"
  ),
  createNode(
    "Module Manager Output",
    "Module Manager Output",
    11,
    "io",
    "MODULE MANAGER"
  ),

  createNode("Compression", "Compression", 12, "process", "MODULE MANAGER"),
  createNode("Limiter", "Limiter", 12, "process", "MODULE MANAGER"),
  createNode("Gate", "Gate", 12, "process", "MODULE MANAGER"),

  /* CHANNEL EFFECTS MANAGER */
  createNode(
    "CHANNEL EFFECTS MANAGER",
    "CHANNEL EFFECTS MANAGER",
    14,
    "host",
    "Gate" || "Module Manager Output"
  ),
  createNode(
    "Channel Effects Input",
    "Channel Effects Input",
    15,
    "io",
    "CHANNEL EFFECTS MANAGER"
  ),
  createNode(
    "Channel Effects Output",
    "Channel Effects Output",
    15,
    "io",
    "CHANNEL EFFECTS MANAGER"
  ),
  createNode(
    "Channel Signal Bridge",
    "Channel Signal Bridge",
    16,
    "manager",
    "Channel Effects Input" || "Channel Effects Output"
  ),

  /* REVERB NODES */
  createNode("Reverb", "Reverb", 17, "process", "CHANNEL EFFECTS MANAGER"),
  createNode("Reverb Input", "Reverb Input", 18, "io", "Reverb"),
  createNode("Reverb Output", "Reverb Output", 18, "io", "Reverb"),

  createNode(
    "Reverb Parameter Control",
    "Reverb Parameter Control",
    20,
    "control",
    "Reverb Signal Host Input"
  ),
  createNode(
    "Reverb Processing",
    "Reverb Processing",
    20,
    "control",
    "Reverb Signal Host Input"
  ),
  createNode(
    "Reverb Wet/Dry Mix",
    "Reverb Wet/Dry Mix",
    20,
    "control",
    "Reverb Signal Host Input"
  ),

  /* DELAY NODES */
  createNode("Delay", "Delay", 17, "process", "CHANNEL EFFECTS MANAGER"),
  createNode("Delay Input", "Delay Input", 18, "io", "Delay"),
  createNode("Delay Output", "Delay Output", 18, "io", "Delay"),

  createNode(
    "Delay Parameter Control",
    "Delay Parameter Control",
    20,
    "control",
    "Delay Signal Host Input"
  ),
  createNode(
    "Delay Processing",
    "Delay Processing",
    20,
    "control",
    "Delay Signal Host Input"
  ),
  createNode(
    "Delay Wet/Dry Mix",
    "Delay Wet/Dry Mix",
    20,
    "control",
    "Delay Signal Host Input"
  ),

  /* SATURATION NODES */
  createNode(
    "Saturation",
    "Saturation",
    17,
    "process",
    "CHANNEL EFFECTS MANAGER"
  ),
  createNode("Saturation Input", "Saturation Input", 18, "io", "Saturation"),
  createNode("Saturation Output", "Saturation Output", 18, "io", "Saturation"),

  createNode(
    "Saturation Parameter Control",
    "Saturation Parameter Control",
    20,
    "control",
    "Saturation Signal Host Input"
  ),
  createNode(
    "Saturation Processing",
    "Saturation Processing",
    20,
    "control",
    "Saturation Signal Host Input"
  ),
  createNode(
    "Saturation Wet/Dry Mix",
    "Saturation Wet/Dry Mix",
    20,
    "control",
    "Saturation Signal Host Input"
  ),

  /* PITCH SHIFTER NODES */
  createNode(
    "Pitch Shifter",
    "Pitch Shifter",
    17,
    "process",
    "CHANNEL EFFECTS MANAGER"
  ),
  createNode(
    "Pitch Shifter Input",
    "Pitch Shifter Input",
    18,
    "io",
    "Pitch Shifter"
  ),
  createNode(
    "Pitch Shifter Output",
    "Pitch Shifter Output",
    18,
    "io",
    "Pitch Shifter"
  ),

  createNode(
    "Pitch Shifter Parameter Control",
    "Pitch Shifter Parameter Control",
    20,
    "control",
    "Pitch Shifter Input"
  ),
  createNode(
    "Pitch Shifter Processing",
    "Pitch Shifter Processing",
    20,
    "control",
    "Pitch Shifter Input"
  ),
  createNode(
    "Pitch Shifter Wet/Dry Mix",
    "Pitch Shifter Wet/Dry Mix",
    20,
    "control",
    "Pitch Shifter Input"
  ),

  /* OUTPUT MAIN NODES */
  createNode("Output Main", "Output Main", 2, "io", "SIGNAL MANAGER"),
  createNode("AUDIO OUTPUT", "AUDIO OUTPUT", 3, "audio", "Output Main"),
];

export const edges = [
  /* AUDIO INPUT EDGES */
  { from: "AUDIO INPUT", to: "SIGNAL MANAGER" },

  /* SIGNAL MANAGER EDGES */
  { from: "SIGNAL MANAGER", to: "Signal Input" },
  { from: "Signal Output", dashes: true, to: "SIGNAL MANAGER" },
  { from: "Signal Input", to: "Signal Bridge" },
  { from: "Signal Bridge", to: "Signal Bridge Input" },
  { from: "Signal Bridge", dashes: true, to: "Signal Output" },
  { from: "Signal Bridge Output", dashes: true, to: "Signal Bridge" },
  { from: "Signal Bridge Input", to: "EFFECTS SIGNAL MANAGER" },
  { from: "Signal Bridge", to: "AI Processing" },
  { from: "EFFECTS SIGNAL MANAGER", dashes: true, to: "Signal Bridge Output" },

  /* MODULE MANAGER EDGES */
  { from: "MODULE MANAGER", to: "Module Manager Input" },
  { from: "Module Manager Input", to: "Compression" },
  { from: "Module Manager Output", dashes: true, to: "MODULE MANAGER" },
  { from: "Compression", to: "Limiter" },
  { from: "Limiter", to: "Gate" },
  { from: "Gate", to: "CHANNEL EFFECTS MANAGER" },

  /* AI PROCESSING EDGES */
  { from: "AI Processing", dashes: true, to: "Signal Bridge" },

  /* EFFECTS SIGNAL MANAGER EDGES */
  { from: "EFFECTS SIGNAL MANAGER", to: "Effects Signal Manager Input" },
  {
    from: "CHANNEL EFFECTS MANAGER",
    dashes: true,
    to: "Module Manager Output",
  },
  {
    from: "Effects Signal Manager Output",
    dashes: true,
    to: "EFFECTS SIGNAL MANAGER",
  },
  { from: "Effects Signal Manager Input", to: "Master Control" },
  { from: "Master Control", dashes: true, to: "Effects Signal Manager Output" },
  { from: "CHANNEL EFFECTS MANAGER", to: "Channel Effects Input" },
  {
    from: "Channel Effects Output",
    dashes: true,
    to: "CHANNEL EFFECTS MANAGER",
  },

  { from: "Channel Effects Input", to: "Channel Signal Bridge" },

  { from: "Channel Signal Bridge", to: "Reverb" },
  { from: "Channel Signal Bridge", to: "Delay" },
  { from: "Channel Signal Bridge", to: "Saturation" },
  { from: "Channel Signal Bridge", to: "Pitch Shifter" },
  { from: "Channel Signal Bridge", dashes: true, to: "Channel Effects Output" },
  { from: "Reverb", dashes: true, to: "Channel Signal Bridge" },
  { from: "Delay", dashes: true, to: "Channel Signal Bridge" },
  { from: "Saturation", dashes: true, to: "Channel Signal Bridge" },
  { from: "Pitch Shifter", dashes: true, to: "Channel Signal Bridge" },

  /* REVERB EDGES */
  { from: "Reverb", to: "Reverb Input" },
  { from: "Reverb Input", to: "Reverb Parameter Control" },
  { from: "Reverb Parameter Control", to: "Reverb Processing" },
  { from: "Reverb Processing", to: "Reverb Wet/Dry Mix" },
  { from: "Reverb Wet/Dry Mix", dashes: true, to: "Reverb Output" },

  { from: "Reverb Output", dashes: true, to: "Reverb" },

  /* DELAY EDGES */
  { from: "Delay", to: "Delay Input" },
  { from: "Delay Input", to: "Delay Parameter Control" },
  { from: "Delay Parameter Control", to: "Delay Processing" },
  { from: "Delay Processing", to: "Delay Wet/Dry Mix" },
  { from: "Delay Wet/Dry Mix", dashes: true, to: "Delay Output" },

  { from: "Delay Output", dashes: true, to: "Delay" },

  /* SATURATION EDGES */
  { from: "Saturation", to: "Saturation Input" },
  { from: "Saturation Input", to: "Saturation Parameter Control" },
  { from: "Saturation Parameter Control", to: "Saturation Processing" },
  { from: "Saturation Processing", to: "Saturation Wet/Dry Mix" },
  {
    from: "Saturation Wet/Dry Mix",
    dashes: true,
    to: "Saturation Output",
  },

  { from: "Saturation Output", dashes: true, to: "Saturation" },

  /* PITCH SHIFTER EDGES */
  { from: "Pitch Shifter", to: "Pitch Shifter Input" },
  { from: "Pitch Shifter Input", to: "Pitch Shifter Parameter Control" },
  { from: "Pitch Shifter Parameter Control", to: "Pitch Shifter Processing" },
  { from: "Pitch Shifter Processing", to: "Pitch Shifter Wet/Dry Mix" },
  {
    from: "Pitch Shifter Wet/Dry Mix",
    dashes: true,
    to: "Pitch Shifter Output",
  },

  { from: "Pitch Shifter Output", dashes: true, to: "Pitch Shifter" },

  /* MASTER CONTROL EDGES */
  { from: "Master Control", to: "Master Control Input" },
  { from: "Master Control Output", dashes: true, to: "Master Control" },
  { from: "Master Control Input", to: "Master Control Parameter Control" },
  { from: "Master Control Parameter Control", to: "Master Control Processing" },
  { from: "Master Control Processing", to: "Master Control Wet/Dry Mix" },
  { from: "Master Control Wet/Dry Mix", to: "MODULE MANAGER" },
  { from: "MODULE MANAGER", dashes: true, to: "Master Control Output" },

  /* OUTPUT MAIN EDGES */
  { from: "SIGNAL MANAGER", dashes: true, to: "Output Main" },
  { from: "Output Main", dashes: true, to: "AUDIO OUTPUT" }, // <-- Last node
];
