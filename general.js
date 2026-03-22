// general.js
import { state } from "./state.js";
import { returnGeneralToPool } from "./generalPoolManager.js";

// ===============================
// 設定出戰 / 取消出戰
// ===============================
export function setActiveGeneral(index) {
  const g = state.generals[index];
  if (!g) return "武將不存在";

  if (state.activeGeneral === g) {
    state.activeGeneral = null;
    return `${g.name} 已取消出戰`;
  }

  state.activeGeneral = g;
  return `${g.name} 出戰中`;
}

// ===============================
// 出售武將
// ===============================
export function sellGeneral(index) {
  const g = state.generals[index];
  if (!g) return "武將不存在！";

  state.gold += 200;

  // ⭐ 放回卡池
  returnGeneralToPool(g);

  if (state.activeGeneral === g) {
    state.activeGeneral = null;
  }

  state.generals.splice(index, 1);

  return `${g.name} 已出售（+200金）`;
}