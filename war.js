// war.js
import { state, resetGame } from "./state.js";
import { weightedRandom } from "./utils.js";
import { updateUI } from "./ui.js";
import { itemPool } from "./itemPool.js";

/**
 * 找敵人
 * 扣除 20 金幣，如果金幣不足，直接遊戲結束
 */
export function findEnemy() {
  if (state.gold < 20) {
    const modal = document.getElementById("gameOverModal");
    const modalMsg = document.getElementById("modalMessage");
    const modalCountdown = document.getElementById("modalCountdown");

    modal.style.display = "flex";
    modalMsg.innerText = "💀 金幣不足，無法出征，坐以待斃！";

    let countdown = 3;
    modalCountdown.innerText = `遊戲將在 ${countdown} 秒後重置`;

    const interval = setInterval(() => {
      countdown--;
      modalCountdown.innerText = `遊戲將在 ${countdown} 秒後重置`;
      if (countdown < 0) {
        clearInterval(interval);
        modal.style.display = "none";
        resetGame(); 
        document.getElementById("developPage").style.display = "flex";
        updateUI("遊戲已重置，開始新的征程！");
      }
    }, 1000);

    return;
  }

  // 扣除金幣
  state.gold -= 20;

  // 生成敵人
  state.currentEnemy = {
    atk: Math.floor(Math.random() * 50) + 10,
    def: Math.floor(Math.random() * 50) + 10,

  };

  updateUI("找到敵人！花費金幣 20");
}

/**
 * 攻擊敵人
 * 勝負判定：玩家總攻擊 >= 敵方防禦即勝利
 * 兵力減少：敵方攻擊 - 玩家防禦，不低於 0
 * 武將血量減少：敵方攻擊 / 4
 * 戰敗忠誠度扣除：10~20 隨機
 * 道具掉落：50% 機率，使用 weightedRandom 從 itemPool 掉落
 * 領土變化：勝利 +1，失敗 -1
 * 遊戲結束檢查：領土 <=0 或 >=50 倒數 3 秒重置
 */
export function attackEnemy() {
  if (!state.currentEnemy) return "請先找敵人！";

  let msg = "";

  // 玩家總攻擊
  const totalAtk = state.attack + state.generals.reduce((a, g) => a + g.atk, 0);

  // 勝負判定
  const win = totalAtk >= state.currentEnemy.def;
  msg += win ? "勝利！" : "戰敗...";

  // ===== 統一兵力損耗 =====
  let lostAtk = state.currentEnemy.atk - state.defense;
  if (lostAtk < 0) lostAtk = 0;
  state.attack = Math.max(0, state.attack - lostAtk);
  msg += ` 兵力減少 ${lostAtk}`;

  // ===== 武將血量扣除 =====
state.generals.forEach((g) => {
  g.hp -= state.currentEnemy.atk / 4;
  if (g.hp <= 0) {
    g._dead = true; // 死亡
    msg += `\n${g.name} 死亡`;
  }
});

  // ===== 戰敗忠誠度扣除 =====
  if (!win) {
    state.generals.forEach((g) => {
      if (!g._dead) {
        const lostLoyalty = Math.floor(Math.random() * 11) + 10; // 10~20
        g.loyalty = Math.max(0, g.loyalty - lostLoyalty);
        if (g.loyalty === 0) {
          msg += `\n${g.name} 叛逃！`;
          const stolenAtk = Math.floor(state.attack / 4);
          state.attack = Math.max(0, state.attack - stolenAtk);
          g._dead = true; // 回到武將池
        }
      }
    });
  }

  // ===== 清理死亡或叛逃武將 =====
  state.generals = state.generals.filter(g => !g._dead);

  // ===== 道具掉落 =====
  state.gold += 100;
  const dropRoll = Math.random();
  if (dropRoll < 0.5) { // 50% 機率掉落道具
    const item = weightedRandom(itemPool);
    switch (item.name) {
      case "補包":
        state.hpPacks += 1;
        msg += "\n獲得 補包 x1";
        break;
      case "封侯令":
        state.loyaltyPacks += 1;
        msg += "\n獲得 封侯令 x1";
        break;
      case "經驗禮包":
        state.expPacks += 1;
        msg += "\n獲得 經驗禮包 x1";
        break;
      case "金幣":
        state.gold += 200;
        msg += "\n獲得 金幣 x1";
        break;
      case "糧食":
        state.food += 50;
        msg += "\n獲得 糧食 x20";
        break;
      case "石頭":
        state.stone += 50
        msg += "\n獲得 石頭 x30";
        break;
    }
  }

  // ===== 領土變化 =====
  state.territory += win ? 1 : -1;

  // ===== 遊戲結束檢查 =====
  if (state.territory <= 0 || state.territory >= 50) {
    const modal = document.getElementById("gameOverModal");
    const modalMsg = document.getElementById("modalMessage");
    const modalCountdown = document.getElementById("modalCountdown");

    modal.style.display = "flex";
    modalMsg.innerText = state.territory <= 0 ? "💀 領土歸零，遊戲結束！" : "👑 你統一天下了！";

    let countdown = 3;
    modalCountdown.innerText = `遊戲將在 ${countdown} 秒後重置`;

    const interval = setInterval(() => {
      countdown--;
      modalCountdown.innerText = `遊戲將在 ${countdown} 秒後重置`;
      if (countdown < 0) {
        clearInterval(interval);
        modal.style.display = "none";
        resetGame();
        document.getElementById("developPage").style.display = "flex"; // 回首頁
        updateUI("遊戲已重置，開始新的征程！");
      }
    }, 1000);
  }

  state.currentEnemy = null;
  return msg;
}