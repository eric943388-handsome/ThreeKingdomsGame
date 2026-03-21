import { state } from "./state.js";
import { warriorPool } from "./warriorPool.js";
import { weightedRandom } from "./utils.js";
import { getRandomItem } from "./itemPool.js";

/**
 * 招募（抽卡）
 * 1. 消耗 100 金幣
 * 2. 30% 機率抽到武將（若 warriorPool 非空）
 * 3. 其餘抽到道具，統一使用 itemPool.apply
 */
export function recruit() {
  if (state.gold < 100) return "金幣不足！";
  state.gold -= 100;

  let msg = "";

  // 30% 機率抽到武將
  if (Math.random() < 0.3 && warriorPool.length > 0) {
    const g = weightedRandom(warriorPool);
    // 從武將池移除
    warriorPool.splice(warriorPool.indexOf(g), 1);

    // 加入玩家武將列表
    state.generals.push({
      name: g.name,
      atk: g.atk,
      hp: g.hp,
      maxHp: g.maxHp,
      loyalty: g.loyalty
    });

    msg = `🎉 抽到武將：${g.name} (血量 ${g.hp}/${g.maxHp})`;
  } else {
    // 抽到道具，統一使用資料驅動
    const itemMsg = getRandomItem();
    msg = `🎁 抽到道具：${itemMsg}`;
  }

  return msg;
}