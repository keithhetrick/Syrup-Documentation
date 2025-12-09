# Functional Specification Document: "Syrup" Audio Plugin

## Document Version

1.0.0

---

### Introduction

"Syrup" is a versatile audio effects plugin designed for music production and sound design, combining traditional effects with innovative AI-driven, vocal harmony, and granular synthesis features.

## Whitepaper Abstract

- **Goal**: Production-ready, modular audio processor with explicit audio/control routing, template-driven graph, and RT-safe UI/engine separation.
- **Architecture**: Nodes/edges defined as data templates; built into an `AudioProcessorGraph` with typed buses and edition/feature-flag gating. Controllers dispatch commands (presets/modes/tours) against immutable templates; UI is a thin view.
- **AI layer**: Off-audio-thread feature extraction (LUFS, crest, spectral tilt, transient density) feeding a lightweight recommender that scores existing chains/parameter presets; applied via controller to keep RT safety.
- **UX**: Guided tours, presets/A-B, collapsible groups, responsive controls/drawers, deterministic layouts for visual QA; single source of truth for main graph and mini-map.
- **Ops/QA**: Stable IDs for visual diffs, PNG export for baselines, data-only module delivery, and template validation to prevent collisions. RT discipline: no graph mutation on audio thread; lock-free parameter writes.

### Objectives

- To provide a comprehensive plugin for enhancing audio tracks with a range of effects.
- To provide a one-stop shop for music professionals that provide industry-level quality, as well as generating unique textures and soundscapes using granular synthesis.
- To introduce unique functionalities like AI recommendations, vocal harmonies, and granular synthesis manipulation.
- To model a decoupled, modular architecture where each processing block owns a single responsibility and communicates over explicit interfaces.
- To demonstrate a production-ready UX layer (guided tours, presets, A/B compare, responsive layout) alongside the audio architecture.

### Target Audience

- Songwriters
- Music Producers
- Sound Designers
- Audio Engineers

---

## Minimal Viable Product (MVP)

### Platform Compatibility

- VST3, AU, and AAX plugin formats.
- Compatible with Windows and macOS.

### Functional Requirements

#### Audio Effects

- **Reverb**: Adjustable settings for room ambiance with granular texture control.
- **Delay**: Customizable delay times, feedback, and granular time-stretching.
- **Saturation**: Analog-style warmth and color, enhanced with granular harmonics.
- **Pitch Shifter**: Flexible pitch adjustment tool with granular pitch-shifting options.

#### Granular Synthesis Effects

- **Granular Texture Overlay**: Adds a layer of granular synthesis to any effect for unique soundscapes.
- **Dynamic Grain Modulation**: Modulate effect parameters using granular synthesis techniques.
- **Spectral Granular Processing**: Apply granular synthesis to specific frequency bands.

#### Control Knobs

- **Bipolar Adjustments**: Knobs for positive and negative effect adjustments, including granular parameters.

#### Master Control

- **Wet/Dry Mix**: Overall balance of effects, including granular textures.

#### AI Integration

- **AI-Powered Recommendations**: Suggests optimal effects chains and parameter presets based on input signal analysis, including granular synthesis settings (template scoring/recommender). Implementation: extract light-weight features (LUFS, crest factor, spectral tilt, transient density) off the audio thread, score existing templates with a small model/ruleset, and apply the winning preset via the controller. Inference runs on the message thread; audio thread remains RT-safe.
- **Signal-Aware Guidance**: Integrates with the UI guided tour to surface suggested paths and module highlights.

#### Vocal Harmony Feature

- **Harmony Generation**: Creates harmonies based on the main vocal track with optional granular processing.

#### Visual Feedback

- **'Syrup' Meter**: Indicates the overall intensity of effects applied, including granular effects.
- **Knob and Slider Indicators**: Provide visual feedback on the current settings, including granular parameters.

### User Interface

- **Modern Design**: Sleek, intuitive interface with a slate gray finish and granular synthesis controls.
- **Responsive Layout**: Adaptable to various screen sizes, including granular synthesis modules.
- **Interactive Blueprint**: Live, zoom-to-fit signal-flow map with guided tours, presets, A/B compares, collapsible modules, keyboard shortcuts, and mobile hamburger/overlay.
- **Edge Semantics**: Audio/control/return edges are typed and labeled; nodes display concise role/latency metadata.

### Testing and Quality Assurance

- Rigorous testing across different DAWs for compatibility and stability, including granular synthesis features.
- UI regression coverage for guided tour timing, presets, mode toggles, and mobile interactions (hamburger/overlay).
- Keyboard and accessibility checks: reduced-motion honoring, keyboard shortcuts (`D`, `R`, `ESC`), double-click clears, and focus/dimming behaviors.

### Non-functional Requirements

- **Performance**: Low CPU usage, ensuring smooth operation in real-time audio processing, including efficient granular synthesis.
- **Reliability**: Stable across all supported platforms and DAWs, even with complex granular processing.
- **Usability**: Intuitive for both novice and experienced users, with user-friendly granular synthesis controls.
- **Responsiveness**: Layout adapts from desktop to mobile; controls remain reachable; reduced-motion respects user preferences.
- **Modularity**: Each module is independently testable and swappable; edges and parents are explicit for clear dependency mapping.

---

## Further Development

### Advanced Granular Synthesis Features

- **Real-Time Granular Processing**: Manipulate live audio inputs with granular synthesis for unique effects.
- **Granular Sequencing**: Sequence granular parameters rhythmically for evolving soundscapes.

### Expanded Vocal Processing

- **Pitch-Shift Layering**: Adds pitch-shifted layers beneath the main note, with granular options for intricate textures.

### Extended Effects

- **Modulation Routers**: For custom modulation paths, including granular parameter routing.
- **Step Sequencer**: Rhythmic modulation of effects, enhanced with granular timing options.

### Collaborative and Cloud Features

- **Preset Sharing**: Cloud-based sharing of custom presets, including granular synthesis settings.
- **Online Collaborative Workspace**: Multiple users working on the same track, with real-time granular processing capabilities.

### Environment Simulation

- **Room Acoustics Simulator**: For different spatial audio experiences, enriched with granular reverb options.

### Expansion Packs

- **Themed 'Snack Packs'**: Genre-specific or artist-inspired packs, featuring unique granular synthesis presets.

### Educational Tools

- **Integrated Tutorials**: Guides within the plugin for beginners, covering granular synthesis techniques.

### DAW Integration

- **Enhanced DAW Compatibility**: Specific features for different DAWs, with granular synthesis integration.

### Legal and Compliance

- Compliance with relevant software standards and copyright laws.

---

## Implementation Blueprint (turning this into a shipping plugin)

- **Engine graph**: Model each node here as an `AudioProcessorGraph::Node` (or equivalent) with explicit audio vs control buses. Managers/bridges become routers; dynamics live under Module Manager; channel FX remain isolated. Keep return paths typed and sparse to avoid feedback.
- **Routing contracts**: Define a `NodeTemplate` struct (id, role, latency, params, parentId) and `EdgeTemplate` (from, to, type: audio/control/return). Generate graph wiring from these templates at startup—no hardcoded IDs in code.
- **Module API**: Expose a factory for processors: `std::unique_ptr<AudioProcessor> makeProcessor(const NodeTemplate&)`. New modules ship as data + factory registration. Edition/feature flags gate which templates load.
- **Presets/modes**: Treat presets as command objects that flip visibility/params and trigger a fit/reset. Store them as JSON alongside templates; keep user presets in a writable store. A/B compare = two preset recipes with quick toggle.
- **Control surface**: Map UI commands (tour, preset, mode, collapse) to an abstract controller that updates the graph and notifies the view. Avoid UI-driven graph mutation; route everything through the controller.
- **Real-time safety**: Keep graph mutations off the audio thread; schedule node/edge changes via message thread, then swap in an updated graph atomically. Keep DSP parameter changes lock-free (atomics or AudioProcessorParameter).
- **State/persistence**: Serialize node positions (if exposed) and presets separately from audio state; keep audio parameters in the processor state tree (JUCE ValueTree or equivalent).
- **Observability**: Log command handlers (preset/mode/tour), path latency calculations, and export-to-PNG/test artifacts for QA. Stable IDs support visual diffs and telemetry joins.
