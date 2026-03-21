import { state, resetGame } from "./state.js";
import { weightedRandom, randInt } from "./utils.js";
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

  let atkMin, atkMax, defMin, defMax;

  // ===== 根據領土決定區間 =====
  if (territory < 10) {
    atkMin = 10; atkMax = 30;
    defMin = 10; defMax = 30;
  }
  else if (territory < 20) {
    atkMin = 25; atkMax = 60;
    defMin = 25; defMax = 40;
  }
  else if (territory < 30) {
    atkMin = 40; atkMax = 70;
    defMin = 40; defMax = 60;
  }
  else if (territory < 40) {
    // ===== 特異區 =====
    if (Math.random() < 0.5) {
      // 高攻低防
      atkMin = 50; atkMax = 120;
      defMin = 20; defMax = 40;
    } else {
      // 高防低攻
      atkMin = 20; atkMax = 40;
      defMin = 80; defMax = 120;
    }
  }
  else {
    atkMin = 100; atkMax = 200;
    defMin = 100; defMax = 200;
  }

  return {
    atk: randInt(atkMin, atkMax),
    def: randInt(defMin, defMax)
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
  const loss = Math.floor(enemy.atk * 0.2);
  state.attack = Math.max(0, state.attack - loss);
  let lostAtk = Math.max(0, enemy.atk - state.defense);
  state.attack = Math.floor(Math.max(0, state.attack - lostAtk));
  msg += ` 兵力減少 ${lostAtk}`;

  // ===== 武將血量 & 忠誠損耗 =====
  if (state.activeGeneral) {
    const g = state.activeGeneral;
    const damage = Math.floor(Math.max(0, enemy.atk / 4));
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
        state.attack = Math.floor(state.attack - state.attack / 4);
        state.defense = Math.floor(state.defense - state.defense / 4);
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