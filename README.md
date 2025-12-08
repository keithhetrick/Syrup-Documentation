# Syrup Documentation

<!--- This markdown file contains the README for the Syrup Documentation repository, which provides information about the Syrup audio effects plugin. The plugin is designed for music production and sound design, and includes both traditional effects and AI-driven vocal harmony features. The repository contains the blueprint and Signal Flow code for the plugin documentation. For more information, visit the Syrup Documentation website. --->

"Syrup" is a versatile audio effects plugin designed for music production and sound design, combining traditional effects with innovative AI-driven and vocal harmony features.

![Syrup Audio Plugin Screenshot](https://github.com/keithhetrick/Syrup-Documentation/assets/104343338/9bd94a2f-c4be-4d8c-90b3-b0a5cb11513f)

The plugin is being developed by Syrup Audio, a Nashville-based audio software company, and will be released as a VST3 plugin for Windows and macOS. The plugin is being developed using the [JUCE](https://juce.com/) framework.

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

## What this repo demonstrates (JD-aligned)

- Translation of intricate mockups into live vector graphics with interactive controls (vis-network + custom UI).
- Complex control surface: guided tours, presets, A/B compare, collapsible modules, mode switches, keyboard shortcuts, and mobile-friendly hamburger/overlay.
- Modular, de-coupled architecture: each node owns one responsibility; dependencies are explicit; edges are typed (audio/control/return).
- UX R&D: responsive layout, mini-map mirroring, in-graph/mini pointer guidance, accessibility tweaks (reduced-motion, keyboard hints).
- JUCE/plugin context: documentation and signal-flow blueprint for a JUCE-based, VST3/AU/AAX audio plugin with AI/harmony/granular features.

## Engineering notes

- Data-driven graph: nodes/edges are templated, typed, and parented explicitly; edge IDs are stable; hidden sets avoid reflow on toggles.
- Interaction stability: physics disabled after initial settle; zoom disabled to prevent mobile jitter; fit applied on load/reset; hamburger/overlay gate sidebar interactions on touch.
- Semantics: edges labeled for audio/control/return; nodes carry role/latency metadata for richer tooltips and tours.
