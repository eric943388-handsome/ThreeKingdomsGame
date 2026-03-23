//廢了

import { state } from "./state.js";
import { updateUI } from "./ui.js"; 


export function useHpPack(index) {
  const g = state.generals[index];
  if (!g) return "武將不存在！";
  if (state.hpPacks <= 0) return "沒有補包！";
  g.hp = g.maxHp;
  state.hpPacks -= 1;
  return `${g.name} 血量已恢復！`;
}

export function useLoyaltyPack(index) {
  const g = state.generals[index];
  if (!g) return "武將不存在！";
  if (state.loyaltyPacks <= 0) return "沒有封侯令！";
  g.loyalty = Math.min(100, g.loyalty + 20);
  state.loyaltyPacks -= 1;
  return `${g.name} 忠誠度提升！`;
}

export function useExpPack(index) {
  const g = state.generals[index];
  if (!g) return "武將不存在！";

  // 判斷升級次數
  const times = g.upgrades?.times || 0;

  // 判斷普通/高級武將
  const isElite = g.skills && g.skills.length > 0;
    console.log("使用經驗禮包，武將:", g.name, "升級次數:", g.upgrades?.times, "背包剩餘:", state.expPacks);
  // 普通/高級武將判定禮包需求
  let neededPacks = 1; // 普通武將前 5 次
  if (isElite) { // 高級武將
    neededPacks = times === 0 ? 2 : times >= 5 ? 3 : 2;
  } else { // 普通武將
    if (times >= 10) neededPacks = 3;
    else if (times >= 5) neededPacks = 2;
    else neededPacks = 1;
  }

  if (state.expPacks < neededPacks) return `經驗禮包不足，需要 ${neededPacks} 個！`;

  // 扣除禮包
  state.expPacks -= neededPacks;

  // 升級加成
  g.atk += 10;
  g.maxHp += 10;
  g.hp = Math.min(g.hp + 10, g.maxHp);

  // 記錄升級次數
  g.upgrades = g.upgrades || { times: 0 };
  g.upgrades.times++;

  updateUI(`${g.name} 使用 ${neededPacks} 個經驗禮包，攻擊 +10，最大血量 +10，升級次數 ${g.upgrades.times}`);
}