import { state } from "./state.js";
import { itemPool } from "./itemPool.js";

export function useHpPack(index) {
  if (!state.generals[index]) return "武將不存在！";
  if (state.hpPacks <= 0) return "沒有補包！";
  state.hpPacks--;
  // 固定補包效果
  return itemPool.find(i => i.name === "補包").apply(index);
}

export function useLoyaltyPack(index) {
  if (!state.generals[index]) return "武將不存在！";
  if (state.loyaltyPacks <= 0) return "沒有封侯令！";
  state.loyaltyPacks--;
  return itemPool.find(i => i.name === "封侯令").apply(index);
}

export function useExpPack(index) {
  if (!state.generals[index]) return "武將不存在！";
  if (state.expPacks <= 0) return "沒有經驗禮包！";
  state.expPacks--;
  return itemPool.find(i => i.name === "經驗禮包").apply(index);
}

export function setActiveGeneral(index) {
  const g = state.generals[index];
  if (!g) return "武將不存在";

  if (state.activeGeneral === g) {
    state.activeGeneral = null;
    return { msg: `${g.name} 已取消出戰`, index, active: false };
  }

  state.activeGeneral = g;
  return { msg: `${g.name} 設為出征`, index, active: true };
}

export function sellGeneral(index) {
  const g = state.generals[index];
  if (!g) return "武將不存在！";

  state.gold += 50;
  if (state.activeGeneral === g) state.activeGeneral = null;
  state.generals.splice(index, 1);

  return `${g.name} 已出售`;
}