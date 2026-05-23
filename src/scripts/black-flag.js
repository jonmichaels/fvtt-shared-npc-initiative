import { MODULE } from "./const.js";

// Skip the roll prompt for Black Flag
Hooks.on(`blackFlag.initiativeConfig`, (/** @type {Actor} */actor, /** @type {object} */rollConfig) => {
  if (actor.type !== 'npc' || !game.combat) {
    return;
  }
  if (game.combat?.getFlag(MODULE, 'disabled') ?? false) {
    // disabled
    return;
  }
  for (const combatant of game.combat.combatants.values()) {
    if (combatant.actor?.uuid === actor.uuid && typeof combatant.initiative === 'number') {
      // re-roll initiative
      return;
    }
  }
  const worldActor = actor.isToken ? actor.token?.baseActor : actor;
  for (const combatant of game.combat.combatants.values()) {
    if (typeof combatant.initiative !== 'number') {
      continue;
    }
    if (combatant.token?.baseActor.uuid === worldActor.uuid) {
      rollConfig.fixed = combatant.initiative;
      return;
    }
  }
});
