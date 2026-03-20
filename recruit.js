import { state } from "./state.js";
import { warriorPool } from "./warriorPool.js";
import { itemPool } from "./itemPool.js";
import { weightedRandom } from "./utils.js";

export function recruit() {
  if (state.gold < 100) return "金幣不足！";
  state.gold -= 100;
  let msg = "";

    if (Math.random() < 0.3 && warriorPool.length > 0) {
    const g = weightedRandom(warriorPool);
    // 從武將池移除
    warriorPool.splice(warriorPool.indexOf(g), 1);

    // 加入玩家武將，血量、最大血量、忠誠度從武將池取
    state.generals.push({
      ...g,
      hp: g.hp || 100,       // 初始血量
      maxHp: g.maxHp || 100, // 最大血量
      loyalty: g.loyalty || 100
    });
    msg = `🎉 抽到武將：${g.name}`;
    
  } else {
    // 武將池空或隨機抽到道具
    const item = weightedRandom(itemPool);

    switch (item.name) {
      case "補包":
        state.hpPacks += 1;
        break;
      case "封侯令":
        state.loyaltyPacks += 1;
        break;
      case "經驗禮包":
        state.expPacks += 1;
        break;
      case "金幣":
        state.gold += 1;
        break;
      case "石頭":
        state.stone += 30;
        break;
      case "糧食":
        state.food += 50;
        break;
    }

    msg = `🎁 抽到道具：${item.name}`;
  }

  return msg;
}