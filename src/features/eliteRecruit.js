import { weightedRandom } from "../utils/utils.js";
import { warriorPool } from "../data/warriorPool.js";
import { eliteWarriorPool } from "../data/eliteWarriorPool.js";
import { state } from "../core/state.js";
import { getRandomItem } from "../data/itemPool.js";

export function eliteRecruit() {
  let msg = "";
  const rand = Math.random();

  const hasNormal = warriorPool.length > 0;
  const hasElite = eliteWarriorPool.length > 0;

  // ===== 兩池都空 → 只能道具 =====
  if (!hasNormal && !hasElite) {
    const itemMsg = getRandomItem();
    return `🎁 抽到 道具 ${itemMsg}`;
  }

  // ===== 抽高級 =====
  if (rand < 0.4 && hasElite) {
    const g = weightedRandom(eliteWarriorPool);

    eliteWarriorPool.splice(eliteWarriorPool.indexOf(g), 1);

    state.generals.push({ ...g });

    msg = `🎉 抽到 高級武將 ${g.name}！`;
  }

  // ===== 抽一般 =====
  else if (rand < 0.9 && hasNormal) {
    const g = weightedRandom(warriorPool);

    warriorPool.splice(warriorPool.indexOf(g), 1);

    state.generals.push({ ...g });

    msg = `✨ 抽到 一般武將 ${g.name}`;
  }

  // ===== fallback（某池空） =====
  else if (hasElite) {
    const g = weightedRandom(eliteWarriorPool);

    eliteWarriorPool.splice(eliteWarriorPool.indexOf(g), 1);

    state.generals.push({ ...g });

    msg = `🎉 抽到 高級武將 ${g.name}！`;
  } 
  else if (hasNormal) {
    const g = weightedRandom(warriorPool);

    warriorPool.splice(warriorPool.indexOf(g), 1);

    state.generals.push({ ...g });

    msg = `✨ 抽到 一般武將 ${g.name}`;
  } 
  else {
    const itemMsg1 = getRandomItem();
    const itemMsg2 = getRandomItem();

    msg = `🎁 抽到道具：${itemMsg1}、${itemMsg2}`;
  }

  return msg;
}

export function useEliteScroll() {
  if (state.eliteScrolls <= 0) return "沒有高級武將卷";
  state.eliteScrolls--;
  return eliteRecruit();
}
