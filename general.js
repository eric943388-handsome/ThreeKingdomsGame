// general.js
import { state } from "./state.js";

/**
 * 使用補包
 */
export function useHpPack(index){
  const g = state.generals[index];
  if(!g || state.hpPacks <= 0) return "沒有補包！";
  g.hp = g.maxHp;
  state.hpPacks--;
  return `${g.name} 血量已恢復！`;
}

/**
 * 使用封侯令
 */
export function useLoyaltyPack(index){
  const g = state.generals[index];
  if(!g || state.loyaltyPacks <= 0) return "沒有封侯令！";
  g.loyalty = Math.min(100, g.loyalty + 10);
  state.loyaltyPacks--;
  return `${g.name} 忠誠度提升 10！`;
}

/**
 * 使用經驗禮包
 */
export function useExpPack(index){
  const g = state.generals[index];
  if(!g || state.expPacks <= 0) return "沒有經驗禮包！";
  const atkInc = Math.floor(Math.random()*3)+1;
  const hpInc = Math.floor(Math.random()*6)+5;
  g.atk += atkInc;
  g.maxHp += hpInc;
  g.hp = Math.min(g.maxHp, g.hp+hpInc);
  state.expPacks--;
  return `${g.name} 獲得鍛鍊！攻擊 +${atkInc}, 最大血量 +${hpInc}`;
}

/**
 * 武將鍛鍊
 */
export function train(index){
  const g = state.generals[index];
  if(!g) return "沒有武將可以鍛鍊！";
  g.atk += 2;
  g.maxHp += 5;
  g.hp = Math.min(g.maxHp, g.hp+5);
  return `${g.name} 經過鍛鍊，攻擊 +2, 最大血量 +5`;
}