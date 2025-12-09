# Interaction Design for "Syrup" Audio Plugin

## Document Version

1.0.0

---

## Define User Interactions

### Knobs and Sliders

- **Function**: Adjust audio effects parameters.
- **Interaction**: Click-and-drag to increase/decrease values. Hovering shows current value.
- **Feedback**: Knob/slider moves smoothly with mouse drag; value changes are reflected in real-time on the UI.
- **A/B Context**: When A/B compare is active, knob changes are visually scoped to the active chain.
- **Parameter schema**: Each control maps to a parameter definition with:
  - `id` (string, stable), `label` (UI copy), `unit` (e.g., dB, ms, %), `range` (min/max), `default`, `taper` (linear/log), `step` (optional).
  - Flags: `modulatable` (bool), `automationId` (host-facing name), `group` (e.g., Dynamics, Time, Color), `context` (Architect/End-user visibility).
  - Binding: UI reads from parameter store; writes go through a controller to the engine parameter (e.g., JUCE `AudioProcessorParameter`), supporting host automation.

### AI Mode Button

- **Function**: Activates AI-based effect recommendations (e.g., suggests chains and parameter presets based on input signal analysis—implemented via a recommender that scores templates).
- **Implementation**: AI runs off the audio thread: feature extraction (LUFS, crest, spectral tilt) → score templates → dispatch winning preset as a command; UI shows the selected preset, not arbitrary mutation.
- **Interaction**: Click to toggle AI mode.
- **Feedback**: Button illuminates or changes color when active; an overlay or sidebar appears with suggestions.

### Undo Button

- **Function**: Reverts the last action.
- **Interaction**: Click to undo.
- **Feedback**: Brief animation indicating reversal; UI elements revert to previous state.

### 'Syrup' Bottle (If applicable)

- **Function**: Visually indicates the cumulative effect of the applied audio processing.
- **Interaction**: Non-interactive, but reacts to changes in effect parameters.
- **Feedback**: Fills up or empties dynamically based on the intensity of the effects used.

### 'Syrup' Meter

- **Function**: Displays overall intensity of effects.
- **Interaction**: Non-interactive, updates automatically.
- **Feedback**: The meter level rises/falls in accordance with the total effect strength.

### Guided Tour Button

- **Function**: Steps through the signal path with timed highlights.
- **Interaction**: Click to start; auto-advances with in-graph and mini-map pointers.
- **Feedback**: Pointers follow the active nodes; selection and focus animate per step; double-click or reset clears tour.
- **Implementation**: Tour is a sequenced command queue; cache/restore node/edge styles, dim non-path nodes, and drive both main/minimap selections from the same dataset.

### A/B Compare Buttons

- **Function**: Highlight two predefined chains for contrast.
- **Interaction**: Click to select a chain; clear/reset to exit.
- **Feedback**: Path highlight and mini-map selection; dimmed non-path nodes to focus attention.

### Hamburger / Overlay (Mobile)

- **Function**: Toggles sidebar on mobile/tablet.
- **Interaction**: Tap to open; tap overlay or ESC to close; control clicks auto-close on mobile.
- **Feedback**: Slide-in/out animation; overlay dimming; aria-expanded updates.

---

## Animations and Transitions

- **Knob/Slider Movement**: Smooth, fluid animation that tracks the mouse movement accurately.
- **AI Mode Activation**: A fade-in/out or glow effect to indicate activation.
- **Undo Action**: A quick fade or flash to symbolize the undo action, with affected controls moving back to their previous positions.
- **'Syrup' Bottle Fill**: (If applicable) Gradual rise/fall of the syrup level with a smooth, liquid-like animation.
- **Parameter Value Pop-ups**: When adjusting knobs/sliders, a small pop-up showing the current value appears, fading in and out smoothly.
- **Guided Tour**: Timed step transitions with pointer repositioning; non-path nodes/edges are dimmed for focus.
- **Highlighting**: Focus animations increase edge width and node border weight on selection; dimming applied to non-selected elements.
- **Reduced Motion**: Respect `prefers-reduced-motion` by disabling non-essential transitions.

---

## Additional Considerations

- **Responsive Feedback**: Ensure that every user action receives immediate and intuitive visual feedback.
- **Consistency**: Maintain consistent interaction patterns across similar elements for intuitive use.
- **Accessibility**: Design interactions to be accessible, considering different user capabilities.
- **Performance**: Optimize animations and transitions to be lightweight, ensuring they don't impact plugin performance.
- **Keyboard**: `D` toggles theme, `R` resets view; ESC closes mobile sidebar; double-click clears highlights.
- **Edge Semantics**: Audio/control/return edges use distinct labels/colors to reinforce flow semantics.
- **Modularity**: Each node represents a single responsibility; interactions never cross module boundaries, reinforcing a de-coupled model.
- **Implementation notes**:
  - Treat UI buttons as command handlers; they call into a controller that updates graph state (vis network or JUCE Component graph) and pushes fit/reset as needed.
  - Keep datasets single-sourced: main graph, mini-map, and presets all read the same node/edge store to avoid drift.
  - On desktop/mobile, use overlays/drawers for controls; ensure ESC/overlay click cancels; summary double-click toggles dropdowns.
  - Respect `prefers-reduced-motion` by skipping non-essential animations; keyboard shortcuts must mirror UI actions for parity.
  - Component tree: Sidebar (Legend, Narrative, Mini-map) + Main (Controls panel, Controls help, Network canvas). Control groups: Navigation, Modes, Presets, A/B Compare, Views, Modules, Interactivity, Theme, User Presets.
  - Data portability: User Presets can be imported/exported as JSON for sharing; keep schema `{ label, nodes[] }` with stable IDs.

---

"Syrup - helping your tracks find their sweet spot 🍯"
