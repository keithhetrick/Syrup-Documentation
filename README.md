# Syrup Documentation

<!--- This markdown file contains the README for the Syrup Documentation repository, which provides information about the Syrup audio effects plugin. The plugin is designed for music production and sound design, and includes both traditional effects and AI-driven vocal harmony features. The repository contains the blueprint and Signal Flow code for the plugin documentation. For more information, visit the Syrup Documentation website. --->

"Syrup" is a versatile audio effects plugin designed for music production and sound design, combining traditional effects with innovative AI-driven and vocal harmony features.

![Syrup Audio Plugin Screenshot](https://github.com/keithhetrick/Syrup-Documentation/assets/104343338/9bd94a2f-c4be-4d8c-90b3-b0a5cb11513f)

The plugin is being developed by Bellweather Studios, a Nashville-based audio software company, and will be released as a VST3 plugin for Windows and macOS. The plugin is being developed using the [JUCE](https://juce.com/) framework.

The plugin is being fronted by [Keith Hetrick](https://en.wikipedia.org/wiki/Keith_Hetrick), a software engineer and Grammy-Nominated songwriter/musician/producer based in the Nashville Metropolitan area.

This repository contains the blueprint & Signal Flow code for the Syrup Audio Plugin Documentation.

Visit the [Syrup Modular Signal Flow website](https://keithhetrick.github.io/Syrup-Documentation/) to see the current modular layout.

## Presenting the interactive map

- Serve locally (e.g., `python3 -m http.server 8000`) and open `index.html`.
- Use grouped controls to zoom/fit, toggle physics, switch light/dark themes; export PNG when ready to share.
- Switch modes: Architect (full detail) vs. End-user (high-level view) to show different stakeholder slices.
- Presets: FX Chain A, Dry, Audio Path, and A/B compare buttons highlight common routes; collapse modules to show the modular hierarchy.
- Guided Tour: in-graph and mini-map pointers step through the path with timing tuned for presentations.
- Keyboard: `D` toggles theme, `R` resets current mode and fits view. Double-click clears highlights; hamburger/overlay keep controls usable on mobile/tablet.

## New Interactive Features

### Dynamic Preset Generation

- **Automatic preset building** from effect templates - no more hardcoded signal chains
- **Flexible combinations**: Create custom A/B chains with any effect combination
- **Template-based system**: Define once in `data.js`, reuse everywhere in `config.js`

### Real-time Signal Flow Simulation

- **Runtime API** accessible via `window.syrupSignalFlow` for interactive testing
- **Path highlighting**: Animate signal flow through the graph with configurable speed
- **Latency calculation**: Real-time estimation of processing delays across signal paths
- **Audio previews**: Select any node to preview its signal path and total latency

```javascript
// Example: Simulate signal flow
window.syrupSignalFlow.simulateSignalFlow(pathNodes, {
  duration: 300, // ms per node
  showLatency: true,
});

// Calculate latency for a path
const latency = window.syrupSignalFlow.calculatePathLatency(pathNodes);
console.log(`Total latency: ${latency.total.toFixed(2)}ms`);

// Preview path to selected node
window.syrupSignalFlow.previewAudioPath("Reverb");
```

### Drag-and-Drop Node Positioning

- **Repositionable nodes**: Drag any node to adjust the graph layout on-the-fly
- **Session persistence**: Your custom positions are saved automatically
- **Reset capability**: "Reset Node Positions" button restores default layout
- **Visual feedback**: Enhanced shadows and borders during drag operations

## Whitepaper snapshot (what this is)

- Data-driven, modular signal graph (nodes/edges as templates) mapped to an `AudioProcessorGraph` with typed audio/control/return buses.
- Controller layer issues commands (presets, modes, tours) against immutable templates; UI is a view, main/mini share one dataset.
- RT-safe discipline: no audio-thread graph mutation, lock-free parameter updates, deterministic layouts for visual QA; stable IDs for diffs/telemetry.
- AI recommender: off-thread feature extraction → score existing chains/params → apply winning preset via controller; logged for QA.
- UX: guided tours with dimming, presets/A-B, collapsible modules, responsive dropdowns/drawers, PNG export for baselines; keyboard/mobile parity.

### Visual and Audio Feedback

- **Waveform animations**: Toggle animated processing indicators on effect nodes
- **Latency display**: "Show Path Latency" button provides detailed analysis
- **Simulate Audio Path**: Watch signal flow through the entire audio chain
- **Console logging**: Real-time feedback during simulations with latency info

### New Control Groups

- **Interactivity**: Contains simulation, latency, and waveform controls
- **Navigation**: Enhanced with node position reset functionality
- All existing controls remain fully functional

## Getting started

- Run locally: `python3 -m http.server 8000` → open `http://localhost:8000`.
- See `build-playbook.md` for turning this into a JUCE/AudioProcessorGraph plugin (engine wiring, RT safety, parameter schema, style guide).

## What this repo demonstrates (role-aligned)

- Translation of intricate mockups into live vector graphics with interactive controls (vis-network + custom UI).
- Complex control surface: guided tours, presets, A/B compare, collapsible modules, mode switches, keyboard shortcuts, and mobile-friendly hamburger/overlay.
- Modular, de-coupled architecture: each node owns one responsibility; dependencies are explicit; edges are typed (audio/control/return).
- UX R&D: responsive layout, mini-map mirroring, in-graph/mini pointer guidance, accessibility tweaks (reduced-motion, keyboard hints).
- JUCE/plugin context: documentation and signal-flow blueprint for a JUCE-based, VST3/AU/AAX audio plugin with AI/harmony/granular features.

## How this maps to a real product

- Drop the nodes/edges into an `AudioProcessorGraph` (JUCE) or equivalent engine graph; managers/bridges become processors, and typed edges map to audio vs. control buses.
- Use the preset definitions as factory recipes for macro buttons (A/B chains, “Architect vs End-user” modes) in a production UI; everything stays data-driven.
- The decoupled module template (e.g., EQ/NR/Clipper attached under Module Manager) shows how to add/remove processors without touching downstream nodes—mirrors modular C++ design.
- Stability cues (physics off post-stabilization, reset/fit commands, single source of truth for nodes/edges) translate to real-time safe patterns: predictable routing, no hidden mutations, deterministic redraw.
- The UI layout (dropdown groupings, overlays, mini-map) doubles as a spec for desktop and touch surfaces—swap the rendering layer (JUCE Components, WebView, or native) while keeping the interaction model intact.
- Onboarding and support: guided tour, presets, and highlight flows become in-product help; keyboard hints map to DAW-friendly shortcuts; export-to-PNG doubles as a QA artifact.
- Packaging/ops: the data-driven graph lets installers ship new modules as data (JSON/templates) with minimal binary change; clear node/edge IDs keep migrations predictable.
- Extensibility: add a new processor by defining a node template and wiring edges—UI/control surface updates automatically; collapse groups to model feature flags/editions.
- Quality gates: single source of truth for nodes/edges/presets simplifies snapshot tests; deterministic layouts (physics off) aid visual diffs; return-path styling calls out error-prone routes.
- JUCE mapping: nodes/edges mirror `AudioProcessorGraph` nodes with audio/control buses; UI hierarchy maps cleanly to a `Component` tree. Controllers (presets/modes) act like command handlers atop the graph.
- Real-time/RT-safe hints: deterministic layout, no hidden mutation of node sets, and data-only updates enable lock-free scheduling of control changes; reset/fit act as predictable “known good” states.
- Deployment/perf: presets/modules are payloads, not code; edge IDs stable for migration; visuals tuned for low-cost redraw (physics off, memoized data sets), which mirrors real-time CPU budgeting discipline.
- Observability/QA: stable IDs and deterministic draws enable visual diffing; export PNG and console tracing of latency/path simulate production profiling hooks; easy to wire to telemetry (e.g., log command handlers and path latencies).
- State discipline: controls are pure command dispatch over immutable templates (nodes/edges/presets), keeping side effects centralized; mini-map/main share the same datasets for consistency.
- Production hardening: deduped edge IDs and template-based modules prevent runtime collisions; patterns support template validation and edition/feature-flagging before deployment.
- AI recommender: “AI Mode” is a recommender that scores template chains/parameter sets from input analysis; surfaced as presets/commands, not ad hoc mutations.
- AI implementation: extract lightweight features (LUFS, crest, spectral tilt, transient density) off the audio thread; feed a small model or ruleset to score existing template chains/parameter presets; apply the winning preset via the controller. Keep the model inference deterministic and non-RT (message thread), and log recommendations for QA.

## Theme palette (implementation cheatsheet)

- Light: bg `#f7f5f1`, panel `#ffffff`, text `#1a1d25`, muted `#5f6470`, accent `#ff8c37`, accent-2 `#00c6ae`, border `#e4e7ed`.
- Dark: bg `#0f1115`, panel `#151924`, text `#e8ecf3`, muted `#9ba3b3`, accent `#ffb354`, accent-2 `#27d1c1`, border `#1f2734`.
- Usage: accent for primary CTAs/hover, accent-2 for active/secondary; border for panels; muted for helper copy; background gradients already in CSS for depth cues. Extend themes by overriding CSS variables only—no layout changes required.

### Extend or override themes

To add a new palette, define CSS variables on `:root` (light) and `.theme-dark` (dark) or another body class:

```css
:root {
  --bg: #f0f7ff;
  --panel: #ffffff;
  --text: #0f1b2d;
  --muted: #5c6b7a;
  --accent: #4f8bff;
  --accent-2: #34d399;
  --border: #d9e2ef;
}
body.theme-midnight {
  --bg: #0b0e14;
  --panel: #141924;
  --text: #e2e8f0;
  --muted: #9aa3b5;
  --accent: #7c5cff;
  --accent-2: #2dd4bf;
  --border: #1f2734;
}
```

Then toggle by adding the class to `body` (e.g., `document.body.classList.add('theme-midnight')`). No component changes required; all UI elements consume the CSS vars.

## Engineering notes

- **Data-driven graph**: nodes/edges are templated, typed, and parented explicitly; edge IDs are stable; hidden sets avoid reflow on toggles.
- **Dynamic preset generation**: Presets auto-generated from effect templates in `data.js`, eliminating hardcoded chains in `config.js`.
- **Simplified edge routing**: Reorganized baseEdges with clear forward/return path separation for cleaner visualization.
- **Runtime simulation API**: JavaScript API for interactive path highlighting, latency calculation, and audio previews.
- **Drag-and-drop positioning**: SessionStorage-based persistence for custom node arrangements with visual feedback.
- **Interaction stability**: physics disabled after initial settle; zoom disabled to prevent mobile jitter; fit applied on load/reset; hamburger/overlay gate sidebar interactions on touch.
- **Semantics**: edges labeled for audio/control/return; nodes carry role/latency metadata for richer tooltips and tours.
- **Waveform animations**: CSS-based visual feedback for processing nodes with toggle control.

## Implementation notes (engine/UI resonance)

- Control/audio pairing: typed edges (audio/control/return) mirror how you’d wire `AudioProcessorGraph` audio vs. parameter/control buses; return paths are explicitly styled to flag potential feedback.
- Presets as commands: preset/mode buttons are treated as command handlers that swap visible nodes/edges and trigger fit/focus—mirrors a controller layer above the graph.
- Extensible surface: new processors ship as data templates; the UI auto-renders buttons and legend entries without code changes, keeping UI and engine in lockstep.
