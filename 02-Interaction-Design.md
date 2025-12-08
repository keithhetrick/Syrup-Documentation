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

### AI Mode Button

- **Function**: Activates AI-based effect recommendations.
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

---

"Syrup - helping your tracks find their sweet spot 🍯"
