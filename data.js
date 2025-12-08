// Define node categories for styling
const nodeStyles = {
  io: { color: "#00ea00", label: "I/O" },
  plugin__io: { color: "#00fa90", label: "Plugin I/O" },
  manager: { color: "#ff8000", label: "Manager" },
  host: { color: "#00ffff", label: "Host/Bridge" },
  process: { color: "#ff0000", label: "Processing" },
  control: { color: "#ff00ff", label: "Control" },
  audio: { color: "#8000ff", label: "Audio" },
};

const edgeId = (from, to) => `${from}::${to}`;

function createNode(id, label, level, styleCategory, parentId = null) {
  return {
    id,
    label,
    level,
    color: nodeStyles[styleCategory].color,
    group: styleCategory,
    styleLabel: nodeStyles[styleCategory].label,
    title: `${label} (${nodeStyles[styleCategory].label})`,
    parentId,
  };
}

// Core sections
const rootNodes = [
  createNode("AUDIO INPUT", "AUDIO INPUT", 0, "audio"),
  createNode("SIGNAL MANAGER", "SIGNAL MANAGER", 1, "manager", "AUDIO INPUT"),
  createNode("Signal Input", "Signal Input", 2, "io", "SIGNAL MANAGER"),
  createNode("Signal Output", "Signal Output", 2, "io", "SIGNAL MANAGER"),
  createNode("Signal Bridge", "Signal Bridge", 3, "manager", "Signal Input"),
  createNode("Signal Bridge Input", "Signal Bridge Input", 4, "io", "Signal Bridge"),
  createNode("Signal Bridge Output", "Signal Bridge Output", 4, "io", "Signal Bridge"),
  createNode("AI PROCESSING", "AI PROCESSING", 4, "host", "Signal Bridge"),
  createNode("EFFECTS SIGNAL MANAGER", "EFFECTS SIGNAL MANAGER", 5, "manager", "Signal Bridge Input"),
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
  createNode("Master Control", "Master Control", 7, "process", "Effects Signal Manager Input"),
  createNode("Master Control Input", "Master Control Input", 8, "io", "Master Control"),
  createNode("Master Control Output", "Master Control Output", 8, "io", "Master Control"),
  createNode(
    "Master Control Parameter Control",
    "Master Control Parameter Control",
    9,
    "control",
    "Master Control Input"
  ),
  createNode("Master Control Processing", "Master Control Processing", 9, "control", "Master Control Input"),
  createNode("Master Control Wet/Dry Mix", "Master Control Wet/Dry Mix", 9, "control", "Master Control Input"),
  createNode("MODULE MANAGER", "MODULE MANAGER", 10, "manager", "Master Control Wet/Dry Mix"),
  createNode("Module Manager Input", "Module Manager Input", 11, "io", "MODULE MANAGER"),
  createNode("Module Manager Output", "Module Manager Output", 11, "io", "MODULE MANAGER"),
  createNode("Compression", "Compression", 12, "process", "MODULE MANAGER"),
  createNode("Limiter", "Limiter", 12, "process", "MODULE MANAGER"),
  createNode("Gate", "Gate", 12, "process", "MODULE MANAGER"),
  createNode("CHANNEL EFFECTS MANAGER", "CHANNEL EFFECTS MANAGER", 14, "host", "Gate"),
  createNode("Channel Effects Input", "Channel Effects Input", 15, "io", "CHANNEL EFFECTS MANAGER"),
  createNode("Channel Effects Output", "Channel Effects Output", 15, "io", "CHANNEL EFFECTS MANAGER"),
  createNode("Channel Signal Bridge", "Channel Signal Bridge", 16, "manager", "Channel Effects Input"),
  createNode("Output Main", "Output Main", 2, "io", "SIGNAL MANAGER"),
  createNode("AUDIO OUTPUT", "AUDIO OUTPUT", 3, "audio", "Output Main"),
];

// Effect templates to auto-generate IO + controls
const effectTemplate = (name, levelBase) => [
  createNode(name, name, levelBase, "process", "CHANNEL EFFECTS MANAGER"),
  createNode(`${name} Input`, `${name} Input`, levelBase + 1, "io", name),
  createNode(`${name} Output`, `${name} Output`, levelBase + 1, "io", name),
  createNode(`${name} Parameter Control`, `${name} Parameter Control`, levelBase + 3, "control", `${name} Input`),
  createNode(`${name} Processing`, `${name} Processing`, levelBase + 3, "control", `${name} Input`),
  createNode(`${name} Wet/Dry Mix`, `${name} Wet/Dry Mix`, levelBase + 3, "control", `${name} Input`),
];

const channelEffects = ["Reverb", "Delay", "Saturation", "Pitch Shifter"].flatMap((fx) =>
  effectTemplate(fx, 17)
);

// New industry-standard signal processing modules
const dynamicsModules = ["Parametric EQ", "Noise Reduction", "Soft Clipping"].flatMap((fx) =>
  effectTemplate(fx, 12)
);

export const nodes = [...rootNodes, ...channelEffects, ...dynamicsModules];

// Core edges
const baseEdges = [
  { from: "AUDIO INPUT", to: "SIGNAL MANAGER" },
  { from: "SIGNAL MANAGER", to: "Signal Input" },
  { from: "Signal Output", to: "SIGNAL MANAGER", dashes: true },
  { from: "Signal Input", to: "Signal Bridge" },
  { from: "Signal Bridge", to: "Signal Bridge Input" },
  { from: "Signal Bridge", to: "Signal Output", dashes: true },
  { from: "Signal Bridge Output", to: "Signal Bridge", dashes: true },
  { from: "Signal Bridge Input", to: "EFFECTS SIGNAL MANAGER" },
  { from: "Signal Bridge", to: "AI PROCESSING" },
  { from: "EFFECTS SIGNAL MANAGER", to: "Signal Bridge Output", dashes: true },
  { from: "MODULE MANAGER", to: "Module Manager Input" },
  { from: "Module Manager Input", to: "Parametric EQ" },
  { from: "Module Manager Output", to: "MODULE MANAGER", dashes: true },
  { from: "Parametric EQ", to: "Noise Reduction" },
  { from: "Noise Reduction", to: "Soft Clipping" },
  { from: "Soft Clipping", to: "Compression" },
  { from: "Compression", to: "Limiter" },
  { from: "Limiter", to: "Gate" },
  { from: "Gate", to: "CHANNEL EFFECTS MANAGER" },
  { from: "AI PROCESSING", to: "Signal Bridge", dashes: true },
  { from: "EFFECTS SIGNAL MANAGER", to: "Effects Signal Manager Input" },
  { from: "CHANNEL EFFECTS MANAGER", to: "Module Manager Output", dashes: true },
  { from: "Effects Signal Manager Output", to: "EFFECTS SIGNAL MANAGER", dashes: true },
  { from: "Effects Signal Manager Input", to: "Master Control" },
  { from: "Master Control", to: "Effects Signal Manager Output", dashes: true },
  { from: "CHANNEL EFFECTS MANAGER", to: "Channel Effects Input" },
  { from: "Channel Effects Output", to: "CHANNEL EFFECTS MANAGER", dashes: true },
  { from: "Channel Effects Input", to: "Channel Signal Bridge" },
  { from: "Channel Signal Bridge", to: "Reverb" },
  { from: "Channel Signal Bridge", to: "Delay" },
  { from: "Channel Signal Bridge", to: "Saturation" },
  { from: "Channel Signal Bridge", to: "Pitch Shifter" },
  { from: "Channel Signal Bridge", to: "Channel Effects Output", dashes: true },
  { from: "Reverb", to: "Channel Signal Bridge", dashes: true },
  { from: "Delay", to: "Channel Signal Bridge", dashes: true },
  { from: "Saturation", to: "Channel Signal Bridge", dashes: true },
  { from: "Pitch Shifter", to: "Channel Signal Bridge", dashes: true },
  { from: "Master Control", to: "Master Control Input" },
  { from: "Master Control Output", to: "Master Control", dashes: true },
  { from: "Master Control Input", to: "Master Control Parameter Control" },
  { from: "Master Control Parameter Control", to: "Master Control Processing" },
  { from: "Master Control Processing", to: "Master Control Wet/Dry Mix" },
  { from: "Master Control Wet/Dry Mix", to: "MODULE MANAGER" },
  { from: "MODULE MANAGER", to: "Master Control Output", dashes: true },
  { from: "SIGNAL MANAGER", to: "Output Main", dashes: true },
  { from: "Output Main", to: "AUDIO OUTPUT", dashes: true },
];

// Auto edges for templated effects
const effectEdges = channelEffects.flatMap((node) => {
  const id = node.id;
  if (id.endsWith(" Input")) {
    const fx = id.replace(" Input", "");
    return [
      { from: fx, to: id },
      { from: id, to: `${fx} Parameter Control` },
      { from: `${fx} Parameter Control`, to: `${fx} Processing` },
      { from: `${fx} Processing`, to: `${fx} Wet/Dry Mix` },
      { from: `${fx} Wet/Dry Mix`, to: `${fx} Output`, dashes: true },
      { from: `${fx} Output`, to: fx, dashes: true },
    ];
  }
  return [];
});

// Auto edges for dynamics modules
const dynamicsEdges = dynamicsModules.flatMap((node) => {
  const id = node.id;
  if (id.endsWith(" Input")) {
    const fx = id.replace(" Input", "");
    return [
      { from: fx, to: id },
      { from: id, to: `${fx} Parameter Control` },
      { from: `${fx} Parameter Control`, to: `${fx} Processing` },
      { from: `${fx} Processing`, to: `${fx} Wet/Dry Mix` },
      { from: `${fx} Wet/Dry Mix`, to: `${fx} Output`, dashes: true },
      { from: `${fx} Output`, to: fx, dashes: true },
    ];
  }
  return [];
});

export const edges = [...baseEdges, ...effectEdges, ...dynamicsEdges].map((edge) => ({
  id: edgeId(edge.from, edge.to),
  ...edge,
}));
