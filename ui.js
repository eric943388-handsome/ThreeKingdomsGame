// ui.js
import { state, resetGame } from "./state.js";

export function updateUI(msg = "") {
  // ===== 玩家狀態 =====
  document.getElementById("stats").innerText =
    `💰${state.gold} 🌾${state.food} 🪨${state.stone} ⚔️${state.attack} 🛡${state.defense} 👥${state.generals.length} 🏰${state.territory}`;

  // ===== 日誌訊息 =====
  document.getElementById("log").innerText = msg;

  // ===== 高級武將卷 =====
  const eliteCountEl = document.getElementById("eliteScrollCount");
  if (eliteCountEl) eliteCountEl.innerText = `高級武將卷: ${state.eliteScrolls}`;

  // ===== 武將欄 =====
  const generalsList = document.getElementById("generalsList");
  generalsList.innerHTML = "";

  // ===== 出售道具 =====
  document.getElementById("hpCount").innerText = state.hpPacks;
  document.getElementById("loyaltyCount").innerText = state.loyaltyPacks;
  document.getElementById("expCount").innerText = state.expPacks;
  // ===== 武將欄 =====
  state.generals.forEach((g, index) => {
    const div = document.createElement("div");
    div.className = "general-card";

    // 判斷是否出戰
    const isActive = state.activeGeneral === g;
    const activeBtnText = isActive ? "取消出戰" : "出戰";

    div.innerHTML = `
      <strong>${g.name}${isActive ? " ⭐出戰中" : ""}</strong><br>
      ⚔️${g.atk} ❤️${g.hp}/${g.maxHp} 忠誠度 ${g.loyalty}<br>
      <button class="btn-hp" data-index="${index}">補包</button>
      <button class="btn-loyalty" data-index="${index}">封侯令</button>
      <button class="btn-exp" data-index="${index}">經驗</button>
      <button class="btn-active" data-index="${index}">${activeBtnText}</button>
      <button class="btn-sell" data-index="${index}">出售</button>
    `;

    generalsList.appendChild(div);
  });

  // ===== 道具顯示 =====
  const itemDiv = document.getElementById("items");
  if (itemDiv) {
    itemDiv.innerText = `補包: ${state.hpPacks}  封侯令: ${state.loyaltyPacks}  經驗禮包: ${state.expPacks}`;
  }

  // ===== 敵人顯示 =====
  const enemyDiv = document.getElementById("enemy");
  enemyDiv.innerText = state.currentEnemy
    ? `⚔️${state.currentEnemy.atk} 🛡${state.currentEnemy.def}`
    : "";
}

// ===== 顯示遊戲結束視窗 =====
  export function showGameOverModal(message, isGameOver = true) {
  const modal = document.getElementById("gameOverModal");
  const modalMsg = document.getElementById("modalMessage");
  const modalCountdown = document.getElementById("modalCountdown");

  modal.style.display = "flex";
  modalMsg.innerText = message;

  // ⭐ 朝貢不用倒數
  if (!isGameOver) {
    modalCountdown.innerText = "點擊任意處關閉";
    modal.onclick = () => {
      modal.style.display = "none";
      modal.onclick = null;
    };
    return;
  }

  // ===== 原本遊戲結束邏輯 =====
  
  // ===== 遊戲結束倒數秒數 =====
  const RESET_COUNTDOWN = 3;

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