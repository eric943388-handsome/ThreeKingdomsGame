import { state, resetGame } from "./state.js";
import { weightedRandom, randInt } from "./utils.js";
import { updateUI } from "./ui.js";
import { getRandomItem } from "./itemPool.js";
import { returnGeneralToPool } from "./generalPoolManager.js";
import { handleTribute } from "./tribute.js";
import { showGameOverModal } from "./ui.js";

// ===== 掉落設定 =====
const dropRates = {
  win: 0.5,
  lose: 0.3
};



/**
 * 計算武將叛逃機率
 * 忠誠 100 -> 0%
 * 忠誠 0   -> 100%
 * 指數 4 曲線
 */
function calculateEscapeChance(loyalty) {
  const normalized = 1 - loyalty / 100;
  return Math.pow(normalized, 4);
}


/**
 * 生成敵人數值
 */
function generateEnemyStats(territory = 0) {
  let atkMin, atkMax, defMin, defMax;

  if (territory < 10) { atkMin = 15; atkMax = 35; defMin = 15; defMax = 35; }
  else if (territory < 20) { atkMin = 45; atkMax = 70; defMin = 45; defMax = 70; }
  else if (territory < 30) { atkMin = 60; atkMax = 90; defMin = 60; defMax = 90; }
  else if (territory < 40) {
    if (Math.random() < 0.5) { atkMin = 50; atkMax = 140; defMin = 20; defMax = 50; }
    else { atkMin = 20; atkMax = 50; defMin = 50; defMax = 140; }
  }
  else if (territory < 49) { atkMin = 100; atkMax = 200; defMin = 100; defMax = 200; }
  else { atkMin = 250; atkMax = 350; defMin = 250; defMax = 350; }

  return { atk: randInt(atkMin, atkMax), def: randInt(defMin, defMax) };
}

/**
 * 套用武將技能加成
 */
function applyGeneralSkills(general, baseAtk, baseDef) {
  let atk = baseAtk;
  let def = baseDef;
  let logs = [];

  if (general.skills && general.skills.length > 0) {
    general.skills.forEach(skill => {
      if (skill.type === "passive") {

        if (skill.target === "atk") {
          const before = atk;
          atk = Math.floor(atk * skill.multiplier);

          logs.push(
            `${general.name}施放【${skill.name}】攻擊從 ${before} 提升為 ${atk}`
          );
        }

        if (skill.target === "def") {
          const before = def;
          def = Math.floor(def * skill.multiplier);

          logs.push(
            `${general.name}施放【${skill.name}】防禦從 ${before} 提升為 ${def}`
          );
        }

      }
    });
  }

  return { atk, def, logs };
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

  // ===== 玩家總攻擊力 / 防禦力 =====
  let playerAtk = state.attack;
  let playerDef = state.defense;

  if (state.activeGeneral) {
    const g = state.activeGeneral;

    // 武將攻擊加入玩家自身攻擊
    playerAtk += g.atk;

    // 套用技能加成
    const skillApplied = applyGeneralSkills(g, playerAtk, playerDef);

    playerAtk = skillApplied.atk;
    playerDef = skillApplied.def;

    // ⭐ 加入技能文字
    skillApplied.logs.forEach(log => {
      msg += `\n${log}`;
    });
  }

  // ===== 勝負判定 =====
  const win = playerAtk >= enemy.def;
  msg += win ? "\n勝利！" : "\n戰敗...";

  // ===== 兵力損耗 =====
  const fixedLoss = Math.floor(enemy.atk * 0.2);
  state.attack = Math.max(0, state.attack - fixedLoss);
  msg += `\n兵力固定消耗 ${fixedLoss}`;

  const extraLoss = Math.max(0, enemy.atk - playerDef);
  state.attack = Math.max(0, state.attack - extraLoss);
  if (extraLoss > 0) msg += `\n兵力額外損耗 ${extraLoss}（敵人攻擊高於防禦）`;

  // ===== 武將血量 & 忠誠損耗 =====
  if (state.activeGeneral) {
    const g = state.activeGeneral;
    const damage = Math.floor(enemy.atk / 4);
    g.hp -= damage;
    msg += `\n${g.name} 受到 ${damage} 傷害`;

    if (g.hp <= 0) {
      msg += `\n${g.name} 戰死`;

      // ⭐ 放回武將池
      returnGeneralToPool(g);

      state.generals = state.generals.filter(x => x !== g);
      state.activeGeneral = null;
    }
    else {
      g.loyalty -= 5;
      msg += `\n${g.name} 忠誠下降 5`;

    if (Math.random() < calculateEscapeChance(g.loyalty)) {
      msg += `\n${g.name} 忠誠低，你這昏君，叛逃!!`;

      // ⭐ 放回武將池
      returnGeneralToPool(g);

      state.generals = state.generals.filter(x => x !== g);
      state.activeGeneral = null;
      state.attack = Math.floor(state.attack * 0.75);
      state.defense = Math.floor(state.defense * 0.75);
    }
    }
  }

  // ===== 掉落道具 =====
  const rate = win ? 0.5 : 0.3;
  if (Math.random() < rate) {
    const dropMsg = getRandomItem();
    if (dropMsg) msg += `\n獲得 ${dropMsg}`;
  }

  // 固定金幣獎勵
  state.gold += win ? 150 : 0;

  // ===== 領土變化 =====
  state.territory += win ? 1 : -1;

// ===============================
// 朝貢（只負責呼叫）
// ===============================
const tributeMsg = handleTribute();

if (tributeMsg) {
  msg += "\n" + tributeMsg;

  // ⭐ 朝貢用「非遊戲結束模式」
  showGameOverModal(tributeMsg, false);
}

  // 遊戲結束檢查
  if (state.territory <= 0) showGameOverModal("💀 領土歸零，遊戲結束！");
  else if (state.territory >= 50) showGameOverModal("👑 你統一天下了！");

  state.currentEnemy = null;

  return msg;
}

