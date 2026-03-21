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
  if (state.expPacks <= 0) return "沒有經驗禮包！";
  state.expPacks -= 1;
  g.atk += 10;
  g.maxHp += 10; // 增加最大血量
  g.hp = Math.min(g.hp + 10, g.maxHp); // 補血，但不超過 maxHp

  updateUI(`${g.name} 使用經驗禮包，攻擊 +10，最大血量 +10`);
}