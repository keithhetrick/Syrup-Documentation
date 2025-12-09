# Component-to-Handler Map

Quick map of UI surface to command handlers and graph actions.

## Sidebar
- **Legend**: static render of node groups + edge types (audio/control/return).
- **Story**: architecture narrative (no handlers).
- **Mini-map**: mirrors main dataset; click-to-pan; selection follows main graph commands.

## Main
- **Controls panel** (`details` dropdowns):
  - *Navigation*: `fit`, `reset focus`, `toggle mini-map`, `reset node positions`.
  - *Views*: `highlight audio path`, `return edges`, `guided tour` (dims non-path nodes, reselects path).
  - *Presets / A/B Compare / User Presets*: select preset nodes; command dispatch to focus/highlight.
  - *Modules*: toggle collapsible groups (hide/show nodes/edges).
  - *Modes*: Architect vs End-user (visibility sets).
  - *Interactivity*: `simulate audio path`, `show path latency`, `waveform animation`.
  - *Navigation (physics)*: `toggle physics wiggle`.
  - *Theme*: `toggle dark/light`, `export PNG`, `keyboard hints`.
- **Controls help**: tooltip content only.
- **Network canvas**: vis-network instance (`window.syrupSignalFlow.network`) with command handlers for select/deselect, double-click clear.

## Controller pattern
- Buttons are treated as command handlers: they mutate datasets (nodes/edges) via a controller, not direct DOM hacks.
- Datasets are single-sourced; main graph and mini-map share node/edge stores for consistency.
- Guided tour caches/restores styles and dims non-path nodes per step.

## Theming
- CSS variables in `style.css` (`:root`, `.theme-dark`) control palette. Extend by adding a new body class with the same vars; no layout edits required.

## Engine mapping (AudioProcessorGraph)
- Nodes ↔ `AudioProcessorGraph::Node` with audio/control buses.
- Edges ↔ connections (audio/control/return); IDs are stable/deduped.
- Presets/modes act as command objects: set visibility/params and trigger fit/reset.
- Modules add/remove via data templates; feature flags gate template loading.
