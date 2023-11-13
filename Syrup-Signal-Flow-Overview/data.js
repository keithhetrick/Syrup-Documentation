// Define node categories for styling
const nodeStyles = {
  io: { color: "#00ea00" },
  plugin__io: { color: "#00fa90" },
  manager: { color: "#ff8000" },
  host: { color: "#00ffff" },
  process: { color: "#ff0000" },
  control: { color: "#ff00ff" },
  audio: { color: "#8000ff", font: "#ffffff" },
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

// Nodes array
export const nodes = [
  /* AUDIO INPUT NODES */
  createNode("AUDIO INPUT", "AUDIO INPUT", 0, "audio"),

  /* SIGNAL MANAGER NODES */
  createNode("SIGNAL MANAGER", "SIGNAL MANAGER", 1, "manager", "AUDIO INPUT"),
  createNode("Signal Input", "Signal Input", 2, "io", "SIGNAL MANAGER"),
  createNode("Signal Output", "Signal Output", 2, "io", "SIGNAL MANAGER"),
  createNode("Signal Bridge", "Signal Bridge", 3, "manager", "Signal Input"),
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
  createNode(
    "AI Processing Host",
    "AI Processing Host",
    5,
    "host",
    "Signal Bridge"
  ),
  createNode(
    "AI Processing Input",
    "AI Processing Input",
    6,
    "plugin__io",
    "AI Processing Host"
  ),
  createNode(
    "AI Processing Output",
    "AI Processing Output",
    6,
    "plugin__io",
    "AI Processing Host"
  ),
  createNode(
    "AI Processing",
    "AI Processing",
    7,
    "process",
    "AI Processing Input"
  ),

  /* EFFECTS SIGNAL MANAGER */
  createNode(
    "EFFECTS SIGNAL MANAGER",
    "EFFECTS SIGNAL MANAGER",
    5,
    "manager",
    "AI Processing Host"
  ),
  createNode(
    "Effects Signal Manager Input",
    "Effects Signal Manager Input",
    8,
    "io",
    "EFFECTS SIGNAL MANAGER"
  ),
  createNode(
    "Effects Signal Manager Output",
    "Effects Signal Manager Output",
    8,
    "io",
    "EFFECTS SIGNAL MANAGER"
  ),

  /* SINGLE EFFECTS HOST */
  createNode(
    "Single Effects Host",
    "Single Effects Host",
    9,
    "host",
    "Effects Signal Manager Input"
  ),
  createNode(
    "Single Effects Input",
    "Single Effects Input",
    10,
    "io",
    "Single Effects Host"
  ),
  createNode(
    "Single Effects Output",
    "Single Effects Output",
    10,
    "io",
    "Single Effects Host"
  ),

  /* REVERB NODES */
  createNode("Reverb", "Reverb", 11, "process", "Single Effects Host"),
  createNode("Reverb Input", "Reverb Input", 12, "io", "Reverb"),
  createNode("Reverb Output", "Reverb Output", 12, "io", "Reverb"),
  createNode(
    "Reverb Signal Host",
    "Reverb Signal Host",
    13,
    "host",
    "Reverb Input"
  ),
  createNode(
    "Reverb Signal Host Input",
    "Reverb Signal Host Input",
    14,
    "plugin__io",
    "Reverb Signal Host"
  ),
  createNode(
    "Reverb Signal Host Output",
    "Reverb Signal Host Output",
    14,
    "plugin__io",
    "Reverb Signal Host"
  ),
  createNode(
    "Reverb Parameter Control",
    "Reverb Parameter Control",
    15,
    "control",
    "Reverb Signal Host Input"
  ),
  createNode(
    "Reverb Processing",
    "Reverb Processing",
    15,
    "control",
    "Reverb Signal Host Input"
  ),
  createNode(
    "Reverb Wet/Dry Mix",
    "Reverb Wet/Dry Mix",
    15,
    "control",
    "Reverb Signal Host Input"
  ),

  /* DELAY NODES */
  createNode("Delay", "Delay", 11, "process", "Single Effects Host"),
  createNode("Delay Input", "Delay Input", 12, "io", "Delay"),
  createNode("Delay Output", "Delay Output", 12, "io", "Delay"),
  createNode(
    "Delay Signal Host",
    "Delay Signal Host",
    13,
    "host",
    "Delay Input"
  ),
  createNode(
    "Delay Signal Host Input",
    "Delay Signal Host Input",
    14,
    "plugin__io",
    "Delay Signal Host"
  ),
  createNode(
    "Delay Signal Host Output",
    "Delay Signal Host Output",
    14,
    "plugin__io",
    "Delay Signal Host"
  ),
  createNode(
    "Delay Parameter Control",
    "Delay Parameter Control",
    15,
    "control",
    "Delay Signal Host Input"
  ),
  createNode(
    "Delay Processing",
    "Delay Processing",
    15,
    "control",
    "Delay Signal Host Input"
  ),
  createNode(
    "Delay Wet/Dry Mix",
    "Delay Wet/Dry Mix",
    15,
    "control",
    "Delay Signal Host Input"
  ),

  /* SATURATION NODES */
  createNode("Saturation", "Saturation", 11, "process", "Single Effects Host"),
  createNode("Saturation Input", "Saturation Input", 12, "io", "Saturation"),
  createNode("Saturation Output", "Saturation Output", 12, "io", "Saturation"),
  createNode(
    "Saturation Signal Host",
    "Saturation Signal Host",
    13,
    "host",
    "Saturation Input"
  ),
  createNode(
    "Saturation Signal Host Input",
    "Saturation Signal Host Input",
    14,
    "plugin__io",
    "Saturation Signal Host"
  ),
  createNode(
    "Saturation Signal Host Output",
    "Saturation Signal Host Output",
    14,
    "plugin__io",
    "Saturation Signal Host"
  ),
  createNode(
    "Saturation Parameter Control",
    "Saturation Parameter Control",
    15,
    "control",
    "Saturation Signal Host Input"
  ),
  createNode(
    "Saturation Processing",
    "Saturation Processing",
    15,
    "control",
    "Saturation Signal Host Input"
  ),
  createNode(
    "Saturation Wet/Dry Mix",
    "Saturation Wet/Dry Mix",
    15,
    "control",
    "Saturation Signal Host Input"
  ),

  /* PITCH SHIFTER NODES */
  createNode(
    "Pitch Shifter",
    "Pitch Shifter",
    11,
    "process",
    "Single Effects Host"
  ),
  createNode(
    "Pitch Shifter Input",
    "Pitch Shifter Input",
    12,
    "io",
    "Pitch Shifter"
  ),
  createNode(
    "Pitch Shifter Output",
    "Pitch Shifter Output",
    12,
    "io",
    "Pitch Shifter"
  ),
  createNode(
    "Pitch Shifter Signal Host",
    "Pitch Shifter Signal Host",
    13,
    "host",
    "Pitch Shifter Input"
  ),
  createNode(
    "Pitch Shifter Signal Host Input",
    "Pitch Shifter Signal Host Input",
    14,
    "plugin__io",
    "Pitch Shifter Signal Host"
  ),
  createNode(
    "Pitch Shifter Signal Host Output",
    "Pitch Shifter Signal Host Output",
    14,
    "plugin__io",
    "Pitch Shifter Signal Host"
  ),
  createNode(
    "Pitch Shifter Parameter Control",
    "Pitch Shifter Parameter Control",
    15,
    "control",
    "Pitch Shifter Input"
  ),
  createNode(
    "Pitch Shifter Processing",
    "Pitch Shifter Processing",
    15,
    "control",
    "Pitch Shifter Input"
  ),
  createNode(
    "Pitch Shifter Wet/Dry Mix",
    "Pitch Shifter Wet/Dry Mix",
    15,
    "control",
    "Pitch Shifter Input"
  ),

  /* MASTER CONTROL NODES */
  createNode(
    "Master Control",
    "Master Control",
    9,
    "process",
    "Single Effects Host"
  ),
  createNode(
    "Master Control Input",
    "Master Control Input",
    10,
    "io",
    "Master Control"
  ),
  createNode(
    "Master Control Output",
    "Master Control Output",
    10,
    "io",
    "Master Control"
  ),
  createNode(
    "Master Control Signal Host",
    "Master Control Signal Host",
    11,
    "host",
    "Master Control Input"
  ),
  createNode(
    "Master Control Signal Input",
    "Master Control Signal Input",
    12,
    "plugin__io",
    "Master Control Signal Host"
  ),
  createNode(
    "Master Control Signal Output",
    "Master Control Signal Output",
    12,
    "plugin__io",
    "Master Control Signal Host"
  ),
  createNode(
    "Master Control Parameter Control",
    "Master Control Parameter Control",
    13,
    "control",
    "Master Control Signal Input"
  ),
  createNode(
    "Master Control Processing",
    "Master Control Processing",
    13,
    "control",
    "Master Control Signal Input"
  ),
  createNode(
    "Master Control Wet/Dry Mix",
    "Master Control Wet/Dry Mix",
    13,
    "control",
    "Master Control Signal Input"
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
  { from: "Signal Bridge Input", to: "AI Processing Host" },

  /* AI PROCESSING EDGES */
  { from: "AI Processing Host", dashes: true, to: "Signal Bridge Output" },
  { from: "AI Processing", dashes: true, to: "AI Processing Output" },
  { from: "AI Processing", to: "AI Processing Input" },
  { from: "AI Processing Output", dashes: true, to: "AI Processing Host" },
  { from: "AI Processing Host", to: "AI Processing Input" },

  /* EFFECTS SIGNAL MANAGER EDGES */
  { from: "EFFECTS SIGNAL MANAGER", to: "Effects Signal Manager Input" },
  { from: "EFFECTS SIGNAL MANAGER", dashes: true, to: "Signal Bridge Output" },
  {
    from: "Single Effects Host",
    dashes: true,
    to: "Effects Signal Manager Output",
  },
  { from: "Effects Signal Manager Input", to: "Single Effects Host" },
  {
    from: "Effects Signal Manager Output",
    dashes: true,
    to: "EFFECTS SIGNAL MANAGER",
  },
  { from: "Effects Signal Manager Input", to: "Master Control" },
  { from: "Master Control", dashes: true, to: "Effects Signal Manager Output" },
  { from: "Single Effects Host", to: "Single Effects Input" },
  { from: "Single Effects Output", dashes: true, to: "Single Effects Host" },
  { from: "Single Effects Input", to: "Reverb" },
  { from: "Single Effects Input", to: "Delay" },
  { from: "Single Effects Input", to: "Saturation" },
  { from: "Single Effects Input", to: "Pitch Shifter" },

  /* REVERB EDGES */
  { from: "Reverb", to: "Reverb Input" },
  { from: "Reverb Input", to: "Reverb Signal Host" },
  { from: "Reverb Signal Host", to: "Reverb Signal Host Input" },
  { from: "Reverb Signal Host Output", dashes: true, to: "Reverb Signal Host" },
  { from: "Reverb Signal Host Input", to: "Reverb Parameter Control" },
  { from: "Reverb Parameter Control", to: "Reverb Processing" },
  { from: "Reverb Processing", to: "Reverb Wet/Dry Mix" },
  { from: "Reverb Wet/Dry Mix", dashes: true, to: "Reverb Signal Host Output" },
  { from: "Reverb Signal Host", dashes: true, to: "Reverb Output" },
  { from: "Reverb Output", dashes: true, to: "Reverb" },
  { from: "Reverb", dashes: true, to: "Single Effects Output" },

  /* DELAY EDGES */
  { from: "Delay", to: "Delay Input" },
  { from: "Delay Input", to: "Delay Signal Host" },
  { from: "Delay Signal Host", to: "Delay Signal Host Input" },
  { from: "Delay Signal Host Input", to: "Delay Parameter Control" },
  { from: "Delay Parameter Control", to: "Delay Processing" },
  { from: "Delay Processing", to: "Delay Wet/Dry Mix" },
  { from: "Delay Signal Host Output", dashes: true, to: "Delay Signal Host" },
  { from: "Delay Wet/Dry Mix", dashes: true, to: "Delay Signal Host Output" },
  { from: "Delay Signal Host", dashes: true, to: "Delay Output" },
  { from: "Delay Output", dashes: true, to: "Delay" },
  { from: "Delay", dashes: true, to: "Single Effects Output" },

  /* SATURATION EDGES */
  { from: "Saturation", to: "Saturation Input" },
  { from: "Saturation Input", to: "Saturation Signal Host" },
  { from: "Saturation Signal Host", to: "Saturation Signal Host Input" },
  { from: "Saturation Signal Host Input", to: "Saturation Parameter Control" },
  { from: "Saturation Parameter Control", to: "Saturation Processing" },
  { from: "Saturation Processing", to: "Saturation Wet/Dry Mix" },
  {
    from: "Saturation Wet/Dry Mix",
    dashes: true,
    to: "Saturation Signal Host Output",
  },
  {
    from: "Saturation Signal Host Output",
    dashes: true,
    to: "Saturation Signal Host",
  },
  { from: "Saturation Signal Host", dashes: true, to: "Saturation Output" },
  { from: "Saturation Output", dashes: true, to: "Saturation" },
  { from: "Saturation", dashes: true, to: "Single Effects Output" },

  /* PITCH SHIFTER EDGES */
  { from: "Pitch Shifter", to: "Pitch Shifter Input" },
  { from: "Pitch Shifter Input", to: "Pitch Shifter Signal Host" },
  { from: "Pitch Shifter Signal Host", to: "Pitch Shifter Signal Host Input" },
  {
    from: "Pitch Shifter Signal Host Input",
    to: "Pitch Shifter Parameter Control",
  },
  { from: "Pitch Shifter Parameter Control", to: "Pitch Shifter Processing" },
  { from: "Pitch Shifter Processing", to: "Pitch Shifter Wet/Dry Mix" },
  {
    from: "Pitch Shifter Wet/Dry Mix",
    dashes: true,
    to: "Pitch Shifter Signal Host Output",
  },
  {
    from: "Pitch Shifter Signal Host Output",
    dashes: true,
    to: "Pitch Shifter Signal Host",
  },
  {
    from: "Pitch Shifter Signal Host",
    dashes: true,
    to: "Pitch Shifter Output",
  },
  { from: "Pitch Shifter Output", dashes: true, to: "Pitch Shifter" },
  { from: "Pitch Shifter", dashes: true, to: "Single Effects Output" },

  /* MASTER CONTROL EDGES */
  { from: "Master Control", to: "Master Control Input" },
  { from: "Master Control Output", dashes: true, to: "Master Control" },
  { from: "Master Control Input", to: "Master Control Signal Host" },
  { from: "Master Control Signal Host", to: "Master Control Signal Input" },
  {
    from: "Master Control Signal Input",
    to: "Master Control Parameter Control",
  },
  { from: "Master Control Parameter Control", to: "Master Control Processing" },
  { from: "Master Control Processing", to: "Master Control Wet/Dry Mix" },
  {
    from: "Master Control Wet/Dry Mix",
    dashes: true,
    to: "Master Control Signal Output",
  },
  {
    from: "Master Control Signal Output",
    dashes: true,
    to: "Master Control Signal Host",
  },
  {
    from: "Master Control Signal Host",
    dashes: true,
    to: "Master Control Output",
  },

  /* OUTPUT MAIN EDGES */
  { from: "SIGNAL MANAGER", dashes: true, to: "Output Main" },
  { from: "Output Main", dashes: true, to: "AUDIO OUTPUT" },
];
