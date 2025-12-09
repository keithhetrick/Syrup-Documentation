# Build Playbook (from repo to running plugin)

## Goals

- Make it obvious how to go from this data-driven graph/UI to a shipping plugin.
- Keep RT-safety: no audio-thread mutation; controller drives presets/modes; templates generate the graph.
- Provide UI style/knob starting points and parameter binding schema.

## Quickstart (web demo)

1. Serve locally: `python3 -m http.server 8000` and open `http://localhost:8000`.
2. Use controls (presets/modes/tour) to understand the flow; inspect data in `data.js` and `config.js`.
3. Export PNG for visual baseline; use the guided tour to see intended paths.

## Engine integration (JUCE/AudioProcessorGraph)

1. Create a JUCE project; add an `AudioProcessorGraph` member.
2. Load node/edge templates (mirror `data.js`/`config.js`) into structs `{ id, role, params, parentId }`, `{ from, to, type }`.
3. Instantiate processors via a factory keyed by template id; connect audio vs control buses per edge type (audio/control/return).
4. Apply modes/presets as commands: set node visibility/params, then trigger fit/reset in the UI layer.
5. Keep graph mutations off the audio thread; perform swaps on the message thread and use lock-free parameter updates.
6. Log command handler invocations and recommendations (AI mode) for QA/telemetry.

### Minimal JUCE scaffold (pseudocode)

```cpp
// Templates (could be JSON-driven)
struct NodeTemplate { String id; String role; String parentId; };
struct EdgeTemplate { String from; String to; String type; }; // type: audio/control/return

AudioProcessorGraph graph;
HashMap<String, uint32> nodeIds; // map id -> graph node ID

std::unique_ptr<AudioProcessor> makeProcessor(const NodeTemplate& t) {
    if (t.id == "Reverb") return std::make_unique<ReverbProcessor>();
    // ... add other modules
    return std::make_unique<AudioProcessorGraph::AudioGraphIOProcessor>(
        AudioProcessorGraph::AudioGraphIOProcessor::audioInputNode);
}

void buildGraph(const Array<NodeTemplate>& nodes, const Array<EdgeTemplate>& edges) {
    graph.clear();
    nodeIds.clear();
    for (auto& n : nodes) {
        auto proc = makeProcessor(n);
        auto node = graph.addNode(std::move(proc));
        nodeIds.set(n.id, node->nodeID);
    }
    for (auto& e : edges) {
        auto* fromNode = graph.getNodeForId(nodeIds[e.from]);
        auto* toNode   = graph.getNodeForId(nodeIds[e.to]);
        if (!fromNode || !toNode) continue;
        const bool isControl = (e.type == "control");
        const bool isReturn  = (e.type == "return");
        // Map to appropriate buses: audio = 0, control could be sidechain/aux bus
        graph.addConnection({ { nodeIds[e.from], isControl ? 1u : 0u },
                              { nodeIds[e.to],   isReturn  ? 1u : 0u } });
    }
}
```

Run `buildGraph` on the message thread when loading presets/modes; avoid touching it from the audio thread. Expose parameters via `AudioProcessorParameter`/`AudioProcessorValueTreeState` and bind UI controls through the controller layer.

## UI binding (Component tree or webview)

- Map controls to command handlers (see `components-map.md`): Navigation, Modes, Presets/A-B, Modules, Interactivity, Theme.
- Use the single source of truth for nodes/edges across main graph and mini-map; avoid duplicating datasets.
- Respect keyboard parity (`D`, `R`, `ESC`, double-click clear); mobile drawers/hamburger mirror desktop behavior.

## Parameter binding schema (knobs/sliders)

Fields: `id`, `label`, `unit`, `range {min,max}`, `default`, `taper (linear|log)`, `step?`, `modulatable (bool)`, `automationId`, `group`, `context (architect|endUser)`.
Binding: UI reads from a parameter store; writes dispatch to controller → engine parameter (e.g., `AudioProcessorParameter`), host-automation friendly.

## Style guide (starting point)

- Palette: see README “Theme palette” and CSS vars in `style.css`. Extend by adding a body class with overrides.
- Typography: Headings `Space Grotesk` for title, `Inter` for body/controls.
- Controls: Buttons use `--accent/--accent-2` gradient; dropdowns (`details`) get subtle shadows; cursor pointer on controls/summary.
- Knobs/sliders (suggested): circular knob with accent ring, muted track, accent pointer; hover = accent-2 glow; active = thicker border; labels use muted text.
- Layout: Sidebar (Legend, Story, Mini-map); Main (Controls + Canvas). Mobile uses drawers/hamburger; mini-map toggle available.

## AI recommender hook

- Extract off-thread features (LUFS, crest factor, spectral tilt, transient density); feed a small model/ruleset to score existing chain/param templates.
- Apply the winning preset via controller; never mutate graph ad hoc. Log recommendation + chosen preset for QA.

## Data portability (presets)

- User presets are JSON `{ label, nodes[] }` keyed by stable IDs. Import/export via UI to share across machines.
- Validate on import: ensure label present and nodes is an array; skip invalid entries, log warning.

## QA checklist

- Graph integrity: unique node/edge IDs, typed buses, no orphaned nodes after mode/preset.
- RT safety: no audio-thread graph mutation; lock-free parameter writes; message-thread graph swaps.
- Visual baselines: PNG export matches expected layout; guided tour dims non-path nodes; presets/toggles sync main + mini-map.
- DAW smoke: instantiate/bypass/automate wet/dry; verify latency reporting vs `getLatencySamples()`.

## Assets and offline constraints

- Host vis-network and fonts locally if CDN access is blocked: download the UMD bundle and Google Fonts, serve from `/assets/vendor`.
- Update `index.html` to point to local copies when needed; keep checksums/version notes to avoid cache confusion.
- Example local wiring:
  - Place `vis-network.min.js` in `/assets/vendor/vis-network.min.js`; update the script tag in `index.html` to point there.
  - Download Google Fonts (Space Grotesk, Inter) into `/assets/vendor/fonts/` and add `@font-face` declarations in `style.css` to reference local files before the CDN fallback.

## Validation & error handling

- Validate templates before build: unique node IDs; unique edge IDs; allowed edge types (`audio|control|return`); no orphans; return edges bounded (no unintended feedback).
- On validation failure: log and skip offending entries; surface a UI toast/console warning; disable dependent controls if a critical group is missing.
- Runtime safety: guard against null containers and missing datasets; fail closed (disable actions) when graph build fails.

## Telemetry & accessibility (opt-in)

- Metrics: command handler usage (presets/modes/tours), AI recommendations (input features, chosen preset), preset load/apply times, PNG export success.
- Opt-out: central flag to disable telemetry; avoid sending audio content—only IDs/timings.
- Accessibility: ensure focus order for hamburger/drawers/buttons; add `aria-expanded` on summaries, meaningful labels on buttons; respect `prefers-reduced-motion`.
