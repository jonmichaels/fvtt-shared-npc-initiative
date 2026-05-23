# Shared NPC Initiative

> **⚠️ Disclaimer:** This module was modified by an AI coding agent (Hephaestus, via Hermes Agent) under the direction of Jon Michaels to add Black Flag support. The original module was created by TPNils. While tested and functional, users should verify behavior in their own games.

[![Foundry VTT](https://img.shields.io/badge/Foundry-v13-orange)](https://foundryvtt.com)
[![D&D 5E](https://img.shields.io/badge/System-D%26D%205E-red)](https://dnd.wizards.com)
[![PF1e](https://img.shields.io/badge/System-PF1e-darkgreen)](https://paizo.com/pathfinder)
[![Black Flag](https://img.shields.io/badge/System-Black%20Flag%20%2F%20ToV-blue)](https://github.com/koboldpress/black-flag)
[![Version](https://img.shields.io/badge/Version-1.2.0-green)](https://github.com/jonmichaels/fvtt-shared-npc-initiative/releases)
[![License](https://img.shields.io/badge/License-GPL%203.0-lightgrey)](LICENSE)

Groups identical NPCs under a single initiative roll — reducing GM workload during combat. Supports **Black Flag / Tales of the Valiant**, **D&D 5E**, and **Pathfinder 1E**. Toggle on/off from the Combat Tracker.

## Features

| Feature | Description |
|---------|-------------|
| **Shared Initiative** | NPCs of the same type (e.g., "Goblin", "Skeleton") receive identical initiative results |
| **Combat Tracker Toggle** | Enable or disable grouping with a checkbox in the Combat Tracker header |
| **Manual Re-roll** | The "Re-roll initiative" function always generates fresh, individual rolls for all combatants |
| **Multi-System** | Works with Black Flag / ToV, D&D 5E, and Pathfinder 1E out of the box |

## Installation

**In Foundry VTT:**
1. Go to **Add-on Modules** → **Install Module**
2. Paste the manifest URL: `https://github.com/jonmichaels/fvtt-shared-npc-initiative/releases/latest/download/module.json`
3. Click **Install**
4. Enable the module in your world

**Manual:**
Download the [latest release](https://github.com/jonmichaels/fvtt-shared-npc-initiative/releases) and extract to `Data/modules/shared-npc-initiative/`.

## System Compatibility

| System | Status |
|--------|--------|
| **Black Flag / Tales of the Valiant** | ✅ Supported (v2.0+) |
| **D&D 5E** | ✅ Supported (v5.0+) |
| **Pathfinder 1E** | ✅ Supported (v11+) |

Other systems may work via the generic initiative interception — they just won't get the system-specific roll prompt skip optimization.

## How It Works

The module uses two strategies:

1. **System-specific hook** — Intercepts the system's initiative configuration to set a fixed value for same-type NPCs, skipping the roll dialog entirely (D&D 5E: `dnd5e.preConfigureInitiative`, Black Flag: `blackFlag.initiativeConfig`)
2. **Generic Combatant override** — Patches Foundry's `getInitiativeRoll()` to create a shared roll per actor type, ensuring identical results even for systems without dedicated hooks

When the "Group NPC" toggle is off, or when using manual re-roll, standard per-combatant initiative behavior is restored.

## Credits

- **Original module:** [TPNils/fvtt-shared-npc-initiative](https://github.com/TPNils/fvtt-shared-npc-initiative) — created by TPNils
- **Black Flag support & maintenance:** Jon Michaels, coded by Hephaestus (AI agent via Hermes)

## License

GPL-3.0 — see [LICENSE](LICENSE)
