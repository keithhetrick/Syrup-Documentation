# Testing Guide for Signal Flow Optimizations

This document provides instructions for testing the new interactive features added to the Syrup Signal Flow documentation.

## Prerequisites

1. Start a local web server:
   ```bash
   python3 -m http.server 8000
   ```

2. Open `http://localhost:8000` in a modern web browser

## Feature Testing

### 1. Dynamic Preset Generation

**Test**: Verify presets are generated dynamically from templates

**Steps**:
1. Open browser console (F12)
2. Check config.js imports from data.js:
   ```javascript
   console.log(window.syrupSignalFlow);
   ```
3. Click "A/B: Chain A" button - should highlight Reverb + Delay effects
4. Click "A/B: Chain B" button - should highlight Saturation + Pitch Shifter effects
5. Click "FX Chain A" button - should highlight all four effects

**Expected Result**: Presets work correctly with dynamically generated node lists

---

### 2. Real-time Signal Flow Simulation

**Test**: Verify runtime simulation API functionality

**Steps**:
1. Open browser console (F12)
2. Run simulation:
   ```javascript
   window.syrupSignalFlow.simulateSignalFlow([
     "AUDIO INPUT",
     "SIGNAL MANAGER", 
     "Signal Input",
     "Signal Bridge"
   ], { duration: 500, showLatency: true });
   ```
3. Watch nodes highlight sequentially
4. Check console for latency messages

**Expected Result**: Nodes highlight one by one with configurable timing; console shows latency info

---

### 3. Latency Calculation

**Test**: Verify path latency calculation

**Steps**:
1. Open browser console (F12)
2. Calculate latency for a path:
   ```javascript
   const latency = window.syrupSignalFlow.calculatePathLatency([
     "Compression", "Limiter", "Gate", "Reverb", "Delay"
   ]);
   console.log(`Total: ${latency.total}ms`, latency.details);
   ```

**Expected Result**: Console displays total latency (sum of individual node latencies) and breakdown

---

### 4. Audio Path Preview

**Test**: Verify preview functionality

**Steps**:
1. Click on any effect node (e.g., "Reverb")
2. Click "Show Path Latency" button
3. Review the alert showing:
   - Total path latency
   - Individual node contributions

**Alternative Test via Console**:
```javascript
const result = window.syrupSignalFlow.previewAudioPath("Reverb");
console.log(result);
```

**Expected Result**: Path from AUDIO INPUT to selected node is highlighted; latency breakdown shown

---

### 5. Drag-and-Drop Node Positioning

**Test**: Verify node repositioning with persistence

**Steps**:
1. Click and drag any node to a new position
2. Check console message: "Node [name] position saved: {x, y}"
3. Refresh the page
4. Verify node remains in custom position
5. Click "Reset Node Positions" button
6. Refresh page again
7. Verify node returns to default position

**Expected Result**: 
- Nodes can be dragged freely
- Positions persist across page reloads
- Reset button clears saved positions

---

### 6. Waveform Animation

**Test**: Verify visual feedback for processing nodes

**Steps**:
1. Click "Toggle Waveform Animation" button
2. Check that processing nodes (Compression, Limiter, Gate, Reverb, Delay, Saturation, Pitch Shifter) have enhanced shadows
3. Look for "🎵 Waveform Mode Active" indicator in top-right corner
4. Check console message: "Waveform animation enabled for processing nodes"
5. Click button again to disable
6. Verify shadows return to normal

**Expected Result**: Processing nodes get visual indicators when waveform mode is active

---

### 7. Simulate Audio Path Button

**Test**: Verify full audio path simulation

**Steps**:
1. Click "Simulate Audio Path" button in Interactivity group
2. Watch signal flow through the complete audio chain
3. Check console for latency calculation message
4. Observe sequential node highlighting

**Expected Result**: Complete path from AUDIO INPUT to AUDIO OUTPUT highlights with animation; total latency logged

---

### 8. Edge Optimization

**Test**: Verify simplified edge routing

**Visual Inspection**:
1. Enable "Return Edges" view
2. Verify dashed return edges are organized logically
3. Check that forward flow edges are solid
4. Confirm no redundant or overlapping edges

**Expected Result**: Graph is cleaner with clear separation between forward signal flow and return paths

---

## Console API Reference

Access the runtime API via `window.syrupSignalFlow`:

```javascript
// Available methods:
window.syrupSignalFlow.simulateSignalFlow(pathNodes, options)
window.syrupSignalFlow.calculatePathLatency(pathNodes)
window.syrupSignalFlow.previewAudioPath(nodeId)
window.syrupSignalFlow.getNodeInfo(nodeId)

// Available data:
window.syrupSignalFlow.network      // vis.js network instance
window.syrupSignalFlow.nodesDS      // nodes DataSet
window.syrupSignalFlow.edgesDS      // edges DataSet
window.syrupSignalFlow.nodeData     // node metadata array
window.syrupSignalFlow.edgeData     // edge metadata array
window.syrupSignalFlow.positionStore // position persistence methods
```

---

## Browser Compatibility

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Known Limitations

1. External CDN resources (vis-network, Google Fonts) may be blocked in some environments
2. SessionStorage is cleared when browser/tab is closed (intentional for demo purposes)
3. Drag-and-drop may have slight lag on older devices
4. Waveform animations are CSS-based and don't represent actual audio processing

## Reporting Issues

If you encounter any issues:
1. Check browser console for errors
2. Verify JavaScript files loaded correctly
3. Confirm vis-network library loaded from CDN
4. Check that sessionStorage is enabled in browser
