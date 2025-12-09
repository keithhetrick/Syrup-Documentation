// Central configuration for the Syrup signal flow presentation.
import { generatePreset, presetTemplates, channelEffectsList } from "./data.js";

export const HIGHLIGHT_DURATION_MS = 5000;

// Dynamically generate presets based on data.js templates
// This reduces hardcoded configurations and allows flexible signal path creation
export const presets = {
  audioPath: { label: "Highlight Audio Path", nodes: null }, // BFS-driven
  
  // A/B Chains using dynamic generation with different effect combinations
  chainA: generatePreset("A/B: Chain A", ["Reverb", "Delay"]),
  chainB: generatePreset("A/B: Chain B", ["Saturation", "Pitch Shifter"]),
  
  // Full FX chain with all effects
  fxChainA: generatePreset("FX Chain A", channelEffectsList),
  
  // Dry path from template
  dryPath: presetTemplates.dryPath,
};

export const collapsibleGroups = {
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
