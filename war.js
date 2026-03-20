import { state, resetGame } from "./state.js";
import { warriorPool } from "./warriorPool.js";
import { itemPool } from "./itemPool.js";
import { weightedRandom } from "./utils.js";

export function findEnemy() {
  state.currentEnemy = {
    atk: Math.floor(Math.random() * 50) + 10,
    def: Math.floor(Math.random() * 50) + 10,
    hp: Math.floor(Math.random() * 100) + 50
  };
  return state.currentEnemy;
}

export function attackEnemy() {
  if (!state.currentEnemy) return "請先找敵人！";
  const enemy = state.currentEnemy;
  const totalAtk = state.attack + state.generals.reduce((sum, g) => sum + g.atk, 0);

  state.generals.forEach(g => {
    g.hp = Math.max(0, g.hp - Math.floor(enemy.atk / 4));
    g.loyalty = Math.max(0, g.loyalty - 5);
  });

  let msg = "";
  if (totalAtk > enemy.def) {
    state.gold += 100;
    state.attack = Math.max(0, state.attack - 5);
    state.territory += 1;
    msg = "🏆 戰勝！領土 +1";

    if (Math.random() < 0.3) {
      const item = weightedRandom(itemPool);
      if (item.name === "補包") state.hpPacks += 1;
      if (item.name === "封侯令") state.loyaltyPacks += 1;
      if (item.name === "經驗禮包") state.expPacks += 1;
      msg += `，獲得道具 ${item.name} 🎁`;
    }
  } else {
    state.attack = Math.max(0, state.attack - 10);
    state.territory -= 1;
    msg = "⚔️ 戰敗... 領土 -1";
  }

  state.generals = state.generals.filter(g => {
    if (g.hp <= 0 || Math.random() * 100 > g.loyalty) {
      warriorPool.push({ name: g.name, atk: g.atk, def: g.def, weight: 3 });
      return false;
    }
    return true;
  });

  state.currentEnemy = null;

  if (state.territory <= 0 || state.territory >= 50) {
    const modal = document.getElementById("gameOverModal");
    const modalMsg = document.getElementById("modalMessage");
    const modalCountdown = document.getElementById("modalCountdown");
    modalMsg.innerText = state.territory <= 0 ? "💀 領土歸零，遊戲結束！" : "👑 你統一天下了！";
    modal.style.display = "flex";

    let countdown = 3;
    modalCountdown.innerText = `遊戲將在 ${countdown} 秒後重置`;

    const interval = setInterval(() => {
      countdown--;
      modalCountdown.innerText = `遊戲將在 ${countdown} 秒後重置`;
      if (countdown < 0) {
        clearInterval(interval);
        modal.style.display = "none";
        resetGame();
      }
    }, 1000);
  }

  return msg;
}