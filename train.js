//廢了

import { state } from "./state.js";
import { updateUI } from "./ui.js";

export function train(index){
  if(state.generals.length===0){ updateUI("沒有武將可以鍛鍊！"); return; }
  if(state.expPacks<=0){ updateUI("沒有經驗禮包！"); return; }

  const g = state.generals[index];
  const atkInc = Math.floor(Math.random()*3)+1;
  const hpInc = Math.floor(Math.random()*6)+5;

  g.atk += atkInc;
  g.maxHp += hpInc;
  g.hp = Math.min(g.maxHp, g.hp+hpInc);

  state.expPacks -= 1;
  updateUI(`${g.name} 獲得鍛鍊！攻擊 +${atkInc}, 最大血量 +${hpInc}`);
}