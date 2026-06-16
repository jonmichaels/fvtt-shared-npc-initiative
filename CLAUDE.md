# CLAUDE.md

Guidance for AI coding agents working on `fvtt-shared-npc-initiative`.

## Project Overview

Shared NPC Initiative is a Foundry VTT v13/v14 module that groups identical NPC combatants under a single initiative result. This fork is maintained under `github.com/jonmichaels/fvtt-shared-npc-initiative` and adds Black Flag / Tales of the Valiant support to the original TPNils module.

Supported systems:
- D&D 5E (`dnd5e`) v5+; verified v5.3.3 on Foundry v14
- Black Flag / Tales of the Valiant (`black-flag`) v2+; verified v3.0.075 on Foundry v14

## Important Repository Facts

- Default branch: `master`
- Public release repo: `jonmichaels/fvtt-shared-npc-initiative`
- Original upstream: `TPNils/fvtt-shared-npc-initiative`
- License: GPL-3.0-only
- Source manifest: `src/module.json`
- Built manifest: `dist/module.json`
- Release zip: `package/module.zip`
- Runtime entrypoint: `scripts/index.js` inside the built module

Do not use `minion3000` or any old OpenClaw identity. Commits should be authored as Hermes/Hephaestus per local git config.

## Build and Verification Commands

Run from the repository root:

```bash
npm run build
npm run package
python3 -m json.tool src/module.json >/dev/null
python3 -m json.tool dist/module.json >/dev/null
python3 - <<'PY'
import json, zipfile
with zipfile.ZipFile('package/module.zip') as zf:
    names = set(zf.namelist())
    required = {
        'shared-npc-initiative/module.json',
        'shared-npc-initiative/scripts/index.js',
    }
    missing = required - names
    if missing:
        raise SystemExit(f'Missing required files: {sorted(missing)}')
    manifest = json.loads(zf.read('shared-npc-initiative/module.json'))
    print(manifest['id'], manifest['version'])
PY
```

There is no dedicated test suite in this repo. Treat successful build/package plus manual Foundry validation as the verification baseline.

## Release Requirements

Foundry installs this module from GitHub Release assets. Every release must include both:

- `module.json`
- `module.zip`

For this project, `module.json` is generated/copied into `dist/module.json` by the build. When uploading or repairing a release, use `dist/module.json` as the release `module.json` asset.

Verify assets:

```bash
HOME=/home/jon gh release view vX.Y.Z --repo jonmichaels/fvtt-shared-npc-initiative --json assets --jq '.assets[].name'
```

Expected:

```text
module.json
module.zip
```

Manifest URLs must be Foundry-friendly latest-release URLs:

```json
"manifest": "https://github.com/jonmichaels/fvtt-shared-npc-initiative/releases/latest/download/module.json",
"download": "https://github.com/jonmichaels/fvtt-shared-npc-initiative/releases/latest/download/module.zip"
```

Do not add `compatibility.maximum` to `module.json`; it breaks installs on newer Foundry releases.

## Code Architecture

`src/scripts/index.js` imports all runtime modules:

- `core.js` — system-agnostic combatant initiative roll sharing.
- `ui.js` — adds the Combat Tracker `Group NPC` toggle and stores the per-combat flag.
- `dnd5e.js` — hooks `dnd5e.preConfigureInitiative` and sets `rollData.options.fixed` when a matching NPC already rolled.
- `black-flag.js` — hooks `blackFlag.initiativeConfig` and sets `rollConfig.fixed` when a matching NPC already rolled.
- `const.js` — exports the module id `shared-npc-initiative`.

The core matching key is `combatant.token?.baseActor.uuid`, not the synthetic token actor UUID. This lets linked and unlinked tokens of the same base actor share initiative correctly.

The module intentionally skips shared initiative when:

- The actor/combatant is not an NPC.
- The current combat has flag `shared-npc-initiative.disabled` set.
- The combatant already has a numeric initiative, which indicates a manual re-roll path.
- There is no base actor UUID, such as placeholder combatants.

## Foundry/System Notes

- D&D 5E uses `rollData.options.fixed`.
- Black Flag uses `rollConfig.fixed`.
- The fallback `Combatant#getInitiativeRoll()` wrapper is still required because system hooks do not cover every path.
- The UI label checks Foundry/system i18n keys and falls back to `Group NPC`.
- Keep this module lightweight. Avoid adding settings, migrations, or dependencies unless the user explicitly asks.

## Style Guidelines

- This is a small JavaScript module with JSDoc types, not TypeScript source files.
- Use simple ES modules and Foundry global APIs (`Hooks`, `CONFIG`, `game`, `Roll`).
- Preserve existing semicolon-light style unless touching a line for another reason.
- Do not rewrite the build system unless necessary.
- Do not commit generated dependency folders or ad-hoc zip files. `package/module.zip` is a build artifact for GitHub release upload, not source.

## Manual Foundry Validation Checklist

Validate in Foundry v13/v14 worlds after changes that affect runtime behavior:

1. Enable this module.
2. Create/add multiple NPC combatants from the same base actor.
3. Roll initiative with `Group NPC` enabled.
4. Confirm same-type NPCs receive the same initiative.
5. Toggle `Group NPC` off and confirm standard per-combatant initiative returns.
6. Use manual re-roll and confirm it generates fresh individual rolls.
7. Repeat for D&D 5E and Black Flag when touching system-specific hook code.

## Common Pitfalls

- A release with only `module.zip` is broken for Foundry install/update. Upload `module.json` too.
- `src/module.json` and `dist/module.json` can drift. Keep both synchronized or rebuild before release.
- The package metadata in `package.json` is stale (`v1.1.1`) and should not be treated as release truth without checking `src/module.json` and GitHub tags.
- Do not change manifest/download URLs to version-specific paths; Foundry auto-updates need latest-release URLs.
- Do not infer Black Flag initiative config shape from D&D 5E. Check current Black Flag source or existing working code before modifying.
