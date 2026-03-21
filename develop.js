// develop.js
import { state } from "./state.js";
import { updateUI } from "./ui.js";

export function developAtk() {
  // ===== 根據當前兵力計算消耗 =====
  let cost = 20; // 預設消耗

  if (state.attack >= 20 && state.attack < 50) cost = 30;
  else if (state.attack >= 50 && state.attack < 100) cost = 50;
  else if (state.attack >= 100 && state.attack < 150) cost = 75;
  else if (state.attack >= 150) cost = 100; // 可以繼續擴展

  if (state.food < cost) return `糧食不足，需要 ${cost} 糧食`;

  state.food -= cost;
  state.attack += 5;

  return `兵力提升 💪 攻擊 +5 (消耗 ${cost} 糧食)`;
}

export function developDef() {
  // ===== 根據當前防禦計算消耗 =====
  let cost = 50; // 預設消耗

  if (state.defense >= 50 && state.defense < 100) cost = 75;
  else if (state.defense >= 100 && state.defense < 150) cost = 100;
  else if (state.defense >= 150) cost = 150; // 可以繼續擴展

  if (state.stone < cost) return `石頭不足，需要 ${cost} 石頭`;
  
  state.stone -= cost;
  state.defense += 5;

  return `國防提升 ⚔️ 防禦 +5 (消耗 ${cost} 石頭)`;
}