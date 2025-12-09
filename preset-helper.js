// Utility to generate/import/export user presets in a safe schema.
// Usage (in console): load JSON, validate, then export string for download.

export function validatePresets(json) {
  const result = {};
  if (!json || typeof json !== "object") return result;
  Object.entries(json).forEach(([key, val]) => {
    if (!val || typeof val !== "object") return;
    if (!val.label || !Array.isArray(val.nodes)) return;
    result[key] = { label: val.label, nodes: val.nodes.slice() };
  });
  return result;
}

export function serializePresets(presetsObj) {
  return JSON.stringify(presetsObj || {}, null, 2);
}

// Example template to start from in the console:
export const examplePresetFile = {
  my_chain: { label: "My Chain", nodes: ["Reverb", "Delay", "Saturation"] },
  alt_dynamics: { label: "Alt Dynamics", nodes: ["Compression", "Limiter", "Gate"] },
};
