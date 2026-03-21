// war.js
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
 */
function calculateEscapeChance(loyalty) {
  return 1 - Math.pow(loyalty / 100, 2);
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
 * 生成敵人數值
 */
function generateEnemyStats(territory = 0) {
  let atkMin, atkMax, defMin, defMax;

  if (territory < 10) {
    atkMin = 15; atkMax = 35; defMin = 15; defMax = 35;
  } else if (territory < 20) {
    atkMin = 35; atkMax = 60; defMin = 35; defMax = 60;
  } else if (territory < 30) {
    atkMin = 40; atkMax = 80; defMin = 40; defMax = 80;
  } else if (territory < 40) {
    if (Math.random() < 0.5) { atkMin = 50; atkMax = 140; defMin = 20; defMax = 40; }
    else { atkMin = 20; atkMax = 50; defMin = 50; defMax = 140; }
  } else if (territory < 49) {
    atkMin = 100; atkMax = 200; defMin = 100; defMax = 200;
  } else {
    atkMin = 250; atkMax = 350; defMin = 250; defMax = 350;
  }

  return {
    atk: randInt(atkMin, atkMax),
    def: randInt(defMin, defMax)
  };
}

/**
 * 套用武將技能加成
 */
function applyGeneralSkills(general, baseAtk, baseDef) {
  let atk = baseAtk;
  let def = baseDef;

  if (general.skills && general.skills.length > 0) {
    general.skills.forEach(skill => {
      if (skill.type === "passive") {
        if (skill.target === "atk") atk = Math.floor(atk * skill.multiplier);
        if (skill.target === "def") def = Math.floor(def * skill.multiplier);
      }
    });
  }

  return { atk, def };
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

  // 玩家總戰力
  let playerAtk = state.attack;
  let playerDef = state.defense;

  if (state.activeGeneral) {
    const g = state.activeGeneral;
    playerAtk = state.attack

    // 武將本身攻擊 + 技能加成
    const skillApplied = applyGeneralSkills(g, g.atk, g.def || 0);
    playerAtk += skillApplied.atk;
    playerDef += skillApplied.def;

    // 技能訊息
    if (g.skills && g.skills.length > 0) {
      g.skills.forEach(skill => {
        if (skill.type === "passive") {
          if (skill.target === "atk") msg += `\n${g.name} 技能觸發！攻擊力 x${skill.multiplier} → ${skillApplied.atk}`;
          if (skill.target === "def") msg += `\n${g.name} 技能觸發！防禦力 x${skill.multiplier} → ${playerDef}`;
        }
      });
    }
  }

  // 勝負判定
  const win = playerAtk >= enemy.def;
  msg += win ? "\n勝利！" : "\n戰敗...";

  // 兵力損耗
  const fixedLoss = Math.floor(enemy.atk * 0.2);
  state.attack = Math.max(0, state.attack - fixedLoss);
  msg += `\n兵力固定消耗 ${fixedLoss}`;
  const extraLoss = Math.max(0, enemy.atk - playerDef);
  state.attack = Math.max(0, state.attack - extraLoss);
  if (extraLoss > 0) msg += `\n兵力額外損耗 ${extraLoss}（敵人攻擊高於防禦）`;

  // 武將血量 & 忠誠損耗
  if (state.activeGeneral) {
    const g = state.activeGeneral;
    const damage = Math.floor(enemy.atk / 4);
    g.hp -= damage;
    msg += `\n${g.name} 受到 ${damage} 傷害`;

    if (g.hp <= 0) {
      msg += `\n${g.name} 戰死`;
      state.generals = state.generals.filter(x => x !== g);
      state.activeGeneral = null;
    } else {
      g.loyalty -= 5;
      msg += `\n${g.name} 忠誠下降 5`;
      if (Math.random() < calculateEscapeChance(g.loyalty)) {
        msg += `\n${g.name} 忠誠低，你這昏君，叛逃!!`;
        state.generals = state.generals.filter(x => x !== g);
        state.activeGeneral = null;
        state.attack = Math.floor(state.attack * 0.75);
        state.defense = Math.floor(state.defense * 0.75);
      }
    }
  }

  // 掉落道具
  const dropRate = win ? dropRates.win : dropRates.lose;
  if (Math.random() < dropRate) {
    const dropMsg = getRandomItem();
    if (dropMsg) msg += `\n獲得 ${dropMsg}`;
  }

  // 金幣獎勵
  state.gold += win ? 100 : 30;

  // 領土變化
  state.territory += win ? 1 : -1;

  // 遊戲結束檢查
  if (state.territory <= 0) showGameOverModal("💀 領土歸零，遊戲結束！");
  else if (state.territory >= 50) showGameOverModal("👑 你統一天下了！");

  // 清空敵人
  state.currentEnemy = null;

  return msg;
}