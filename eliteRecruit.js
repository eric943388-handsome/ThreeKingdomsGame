import { weightedRandom } from "./utils.js";
import { warriorPool } from "./warriorPool.js";
import { eliteWarriorPool } from "./eliteWarriorPool.js"; // 改為從新檔案導入
import { state } from "./state.js";
import { getRandomItem } from "./itemPool.js";

export function eliteRecruit() {
  const rand = Math.random();
  let msg = "";

  if (rand < 0.4) {
    const g = weightedRandom(eliteWarriorPool);
    state.generals.push({ ...g });
    msg = `🎉 抽到 高級武將 ${g.name}！`;
  } else if (rand < 0.9) { //0.9-0.4=0.5
    const g = weightedRandom(warriorPool);
    state.generals.push({ ...g });
    msg = `✨ 抽到 一般武將 ${g.name}`;
  } else {
    msg = `🎁 抽到 道具 ${getRandomItem()}`;
  }

  return msg;
}

export function useEliteScroll() {
  if (state.eliteScrolls <= 0) return "沒有高級武將卷";
  state.eliteScrolls--;
  return eliteRecruit();
}