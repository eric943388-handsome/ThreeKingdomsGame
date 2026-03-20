import { state } from "./state.js";
import { warriorPool } from "./warriorPool.js";
import { itemPool } from "./itemPool.js";
import { weightedRandom } from "./utils.js";

export function recruit() {
  if (state.gold < 100) return "金幣不足！";
  state.gold -= 100;
  let msg = "";

  if (Math.random() < 0.4) { // 武將 40%
    if (warriorPool.length === 0) return "武將池空了！";
    const g = weightedRandom(warriorPool);
    warriorPool.splice(warriorPool.indexOf(g), 1);

    state.generals.push({ ...g, hp: 100, maxHp: 100, loyalty: 100 });
    msg = `🎉 抽到武將：${g.name}`;
  } else { // 道具 60%
    const item = weightedRandom(itemPool);
    if (item.name === "補包") state.hpPacks += 1;
    if (item.name === "封侯令") state.loyaltyPacks += 1;
    if (item.name === "經驗禮包") state.expPacks += 1;
    msg = `🎁 抽到道具：${item.name}`;
  }

  return msg;
}