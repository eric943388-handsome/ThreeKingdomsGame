//general.js
import { state } from "./state.js";
import { getRandomItem } from "./itemPool.js";

export function useHpPack(index) {
  if (!state.generals[index]) return "武將不存在！";
  if (state.hpPacks <= 0) return "沒有補包！";
  state.hpPacks--;
  return getRandomItem(index); // 作用於武將
}

export function useLoyaltyPack(index) {
  if (!state.generals[index]) return "武將不存在！";
  if (state.loyaltyPacks <= 0) return "沒有封侯令！";
  state.loyaltyPacks--;
  return getRandomItem(index);
}

export function useExpPack(index) {
  if (!state.generals[index]) return "武將不存在！";
  if (state.expPacks <= 0) return "沒有經驗禮包！";
  state.expPacks--;
  return getRandomItem(index);
}
/**
 * 設為出戰武將
 * @param {number} index 武將索引
 * @returns {string} 操作訊息
 */
export function setActiveGeneral(index) {
  const g = state.generals[index];
  if (!g) return "武將不存在！";

  state.activeGeneral = g;
  return `${g.name} 出戰！`;
}

/**
 * 出售武將，出售獲得金幣 50
 * @param {number} index 武將索引
 * @returns {string} 操作訊息
 */
export function sellGeneral(index) {
  const g = state.generals[index];
  if (!g) return "武將不存在！";

  state.gold += 50;

  // 若出售的是出戰武將，清空出戰狀態
  if (state.activeGeneral === g) state.activeGeneral = null;

  state.generals.splice(index, 1);

  return `${g.name} 已出售`;
}