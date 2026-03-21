import { state, resetGame } from "./state.js";
import { weightedRandom } from "./utils.js";
import { updateUI } from "./ui.js";
import { getRandomItem } from "./itemPool.js";

// ===== 掉落設定 =====
const dropRates = {
  win: 0.5,  // 勝利掉落機率
  lose: 0.3  // 戰敗掉落機率
};

// ===== 遊戲結束倒數秒數 =====
const RESET_COUNTDOWN = 3;

/**
 * 計算武將叛逃機率
 * 忠誠 100 -> 0% 叛逃
 * 忠誠 0   -> 100% 叛逃
 * 曲線：1 - (loyalty / 100)^2
 */
function calculateEscapeChance(loyalty) {
  return 1 - Math.pow(loyalty / 100, 2);
}

/**
 * 掉落道具
 */
function dropItem(win) {
  const rate = win ? dropRates.win : dropRates.lose;
  if (Math.random() < rate) {
    return getRandomItem();
  }
  return null;
}

/**
 * 顯示遊戲結束 Modal
 */
function showGameOverModal(message) {
  const modal = document.getElementById("gameOverModal");
  const modalMsg = document.getElementById("modalMessage");
  const modalCountdown = document.getElementById("modalCountdown");

  modal.style.display = "flex";
  modalMsg.innerText = message;

  let countdown = RESET_COUNTDOWN;
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
}

/**
 * 生成敵人數值，考慮領土倍率與特異區
 * baseAtk / baseDef: 基礎隨機值範圍 10~25
 */
function generateEnemyStats(territory = 0) {
  // 基礎值 10~25
  let baseAtk = Math.floor(Math.random() * 20) + 10;
  let baseDef = Math.floor(Math.random() * 20) + 10;

  // 特異區 30~39
  if (territory >= 30 && territory <= 39) {
    if (Math.random() < 0.5) {
      // 高攻低防
      baseAtk *= 2;
      baseDef = Math.floor(baseDef * 0.5);
    } else {
      // 高防低攻
      baseDef *= 2;
      baseAtk = Math.floor(baseAtk * 0.5);
    }
  }

  // 領土倍率
  let factor = 1;
  if (territory >= 49) factor = 2.5;
  else if (territory >= 40) factor = 2;
  else if (territory >= 30) factor = 1.8;
  else if (territory >= 20) factor = 1.5;
  else if (territory >= 10) factor = 1.2;

  return {
    atk: Math.floor(baseAtk * factor),
    def: Math.floor(baseDef * factor),
  };
}

/**
 * 找敵人
 */
export function findEnemy() {
  if (state.gold < 20) {
    showGameOverModal("💀 金幣不足，無法出征，坐以待斃！");
    return;
  }

  state.gold -= 20;
  state.currentEnemy = generateEnemyStats(state.territory);

  updateUI("找到敵人！花費金幣 20");
}

/**
 * 攻擊敵人
 */
export function attackEnemy() {
  if (!state.currentEnemy) return "請先找敵人！";

  const enemy = state.currentEnemy;
  let msg = "";

  // 玩家總攻擊力
  const generalAtk = state.activeGeneral ? state.activeGeneral.atk : 0;
  const totalAtk = state.attack + generalAtk;

  // 勝負判定
  const win = totalAtk >= enemy.def;
  msg += win ? "勝利！" : "戰敗...";

  // ===== 兵力損耗 =====
  state.attack = Math.floor(Math.max(0, state.attack - (enemy.atk)*0.2));
  let lostAtk = Math.max(0, enemy.atk - state.defense);
  state.attack = Math.max(0, state.attack - lostAtk);
  msg += ` 兵力減少 ${lostAtk}`;

  // ===== 武將血量 & 忠誠損耗 =====
  if (state.activeGeneral) {
    const g = state.activeGeneral;
    const damage = Math.max(0, enemy.atk / 4);
    g.hp -= damage;
    msg += `\n${g.name} 受到 ${damage} 傷害`;

    // 武將死亡
    if (g.hp <= 0) {
      msg += `\n${g.name} 戰死`;
      state.generals = state.generals.filter(x => x !== g);
      state.activeGeneral = null;
    } else {
      // 忠誠下降
      g.loyalty -= 5;
      msg += `\n${g.name} 忠誠下降 5`;

      // 忠誠叛逃判定
      const escapeChance = calculateEscapeChance(g.loyalty);
      if (Math.random() < escapeChance) {
        msg += `\n${g.name} 忠誠低，你這昏君，叛逃!!`;
        state.generals = state.generals.filter(x => x !== g);
        state.activeGeneral = null;
        state.attack -= state.attack / 4;
        state.defense -= state.defense / 4;
      }
    }
  }

  // ===== 掉落道具 =====
  const dropMsg = dropItem(win);
  if (dropMsg) msg += `\n獲得 ${dropMsg}`;

  // 勝利固定獎勵
  state.gold += win ? 100 : 30;

  // ===== 領土變化 =====
  state.territory += win ? 1 : -1;

  // ===== 遊戲結束檢查 =====
  if (state.territory <= 0) {
    showGameOverModal("💀 領土歸零，遊戲結束！");
  } else if (state.territory >= 50) {
    showGameOverModal("👑 你統一天下了！");
  }

  // 清空當前敵人
  state.currentEnemy = null;

  return msg;
}