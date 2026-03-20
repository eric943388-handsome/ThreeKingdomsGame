// store.js
import { state } from "./state.js";

export function buyFood() {
  if (state.gold < 30) return "金幣不足！";
  state.gold -= 30;
  state.food += 50;
  return "購買糧食成功！";
}

export function buyStone() {
  if (state.gold < 30) return "金幣不足！";
  state.gold -= 30;
  state.stone += 50;
  return "購買石頭成功！";
}

// 新增道具購買
export function buyHpPack() {
  if (state.gold < 50) return "金幣不足！";
  state.gold -= 50;
  state.hpPacks += 1;
  return "購買補包成功！";
}

export function buyLoyaltyPack() {
  if (state.gold < 80) return "金幣不足！";
  state.gold -= 80;
  state.loyaltyPacks += 1;
  return "購買封侯令成功！";
}

export function buyExpPack() {
  if (state.gold < 100) return "金幣不足！";
  state.gold -= 100;
  state.expPacks += 1;
  return "購買經驗禮包成功！";
}