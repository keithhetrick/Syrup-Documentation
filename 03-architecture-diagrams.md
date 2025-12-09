# Flowcharts & Diagrams for "Syrup" Audio Plugin

## Document Version

1.0

### Signal Flow Diagram

This diagram showcases the signal chain from audio input to output in the "Syrup" audio plugin. It illustrates the routing and manipulation of the audio signal through various effects.

![Screen Shot 2023-11-12 at 3 07 50 PM](https://github.com/keithhetrick/Syrup-Documentation/assets/104343338/ff1ba134-8651-4b18-9cf4-7f6b19812c9c)

![Syrup Signal Flow Diagram](https://github.com/keithhetrick/Syrup-Documentation/assets/104343338/5c00e627-b39e-43d7-b759-f4984c15cd37)

### GUI Template Diagram

This diagram provides a template for the Graphical User Interface (GUI) of the "Syrup" audio plugin, outlining the layout and placement of controls such as knobs, sliders, and other interactive elements.

![Syrup GUI Template Diagram](https://github.com/keithhetrick/Syrup-Documentation/assets/104343338/9df09b33-c624-4fd2-8a3b-957473aa80d9)

---

## How to use these diagrams in implementation

- **Graph wiring**: Treat each node as a processor template (id, role, params, latency) and each edge as typed routing (audio/control/return). Generate your `AudioProcessorGraph` (or equivalent) from these templates; avoid hardcoding node IDs.
- **UI layout**: Map the GUI template to a JUCE `Component` tree (or web/native equivalent). Group controls per the diagram (Navigation, Modes, Presets, Interactivity) and bind them to controller commands, not directly to the graph.
- **Feature flags/editions**: Collapse/expand groups in the diagram to model SKU/edition differences—load nodes/edges conditionally from data.
- **Testing/QA**: Use the diagram snapshots for visual diffs; PNG export from the app should match these layouts when all nodes are visible.

## Wireframe notes (desktop + mobile)

- Desktop: Sidebar (Legend/Narrative/Mini-map) on the left; Main on the right with a Controls panel at top and the network canvas beneath. Controls are grouped as dropdowns; mini-map is visible by default.
- Mobile/tablet: Sidebar slides in via hamburger; Controls dropdowns become drawers/menus; mini-map can be toggled; network canvas remains the focal area.
- Interaction cues: Hover/click on summaries toggles drawers; command buttons sit inside grouped dropdowns; tooltips/controls-help anchor near the Controls panel.
