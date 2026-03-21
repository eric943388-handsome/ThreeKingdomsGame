// store.js
import { state } from "./state.js";
import { itemPool, getRandomItem } from "./itemPool.js";

/**
 * 購買道具統一函式
 */
function buyItem(name, cost) {
  if (state.gold < cost) return "金幣不足！";
  state.gold -= cost;

  const item = itemPool.find(i => i.name === name);
  if (!item) return "道具不存在！";
  const msg = item.apply(); // 套用效果
  return `購買 ${name} 成功！(${msg})`;
}

// 商店呼叫
export const buyFood = () => buyItem("糧食", 30);
export const buyStone = () => buyItem("石頭", 50);
export const buyHpPack = () => buyItem("補包", 50);
export const buyLoyaltyPack = () => buyItem("封侯令", 80);
export const buyExpPack = () => buyItem("經驗禮包", 100);