import { state, resetGame } from "./state.js";
import { itemPool } from "./itemPool.js";

// ===============================
// UI 更新入口（唯一入口）
// ===============================
export function updateUI(msg = "") {
  document.getElementById("stats").innerText =
    `💰${state.gold} 🌾${state.food} 🪨${state.stone} ⚔️${state.attack} 🛡${state.defense} 👥${state.generals.length} 🏰${state.territory}`;

  document.getElementById("log").innerText = msg;

  const eliteCountEl = document.getElementById("eliteScrollCount");
  if (eliteCountEl) {
    eliteCountEl.innerText = `高級武將卷: ${state.eliteScrolls}`;
  }

  document.getElementById("hpCount").innerText = state.hpPacks;
  document.getElementById("loyaltyCount").innerText = state.loyaltyPacks;
  document.getElementById("expCount").innerText = state.expPacks;

  renderGenerals();
}

// ===============================
// 🧑 武將列表（純 render，不含邏輯）
// ===============================
function renderGenerals() {
  const generalsList = document.getElementById("generalsList");
  generalsList.innerHTML = "";

  state.generals.forEach((g, index) => {
    const div = document.createElement("div");
    div.className = "general-card";

    const isActive = state.activeGeneral === g;
    const activeBtnText = isActive ? "取消出戰" : "出戰";

    div.innerHTML = `
      <strong>${g.name}${isActive ? " ⭐出戰中" : ""}</strong><br>
      ⚔️${g.atk} ❤️${g.hp}/${g.maxHp} 忠誠 ${g.loyalty}<br>
      <button class="btn-active" data-index="${index}">${activeBtnText}</button>
      <button class="btn-sell" data-index="${index}">出售</button>
    `;

    generalsList.appendChild(div);
  });
}

// ===============================
// 🪟 遊戲結束
// ===============================
export function showGameOverModal(message, isGameOver = true) {
  const modal = document.getElementById("gameOverModal");
  const modalMsg = document.getElementById("modalMessage");
  const modalCountdown = document.getElementById("modalCountdown");

  modal.style.display = "flex";
  modalMsg.innerText = message;

  if (!isGameOver) {
    modalCountdown.innerText = "點擊任意處關閉";
    modal.onclick = () => {
      modal.style.display = "none";
      modal.onclick = null;
    };
    return;
  }

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
}

// ===============================
// 🖨 打字機
// ===============================
function typeWriter(element, text, speed = 20) {
  element.innerText = "";
  let i = 0;

  const timer = setInterval(() => {
    element.innerText += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// ===============================
// 🎬 介紹
// ===============================
export function showIntro() {
  const modal = document.getElementById("gameOverModal");
  const msg = document.getElementById("modalMessage");
  const btn = document.getElementById("modalBtn");

  modal.style.display = "flex";

  const text = `
⚔️ 戰鬥規則

1. 攻擊 >= 敵方防禦 → 勝利
2. 每場戰鬥會消耗兵力
3. 敵人攻擊會造成損失
4. 武將會一起參戰
5. 忠誠太低會叛逃
6. 目標：統一50城
`;

  typeWriter(msg, text, 15);

  btn.style.display = "inline-block";
  btn.innerText = "開始遊戲";

  btn.onclick = () => {
    modal.style.display = "none";
  };
}

// ===============================
// 🪟 武將 Modal
// ===============================
export function showGeneralModal(general) {
  if (!general) return console.warn("沒有武將資料");

  const modal = document.getElementById("generalModal");
  if (!modal) return console.warn("找不到 generalModal");

  // 更新武將資訊
  document.getElementById("gmName").innerText = general.name;
  document.getElementById("gmLevel").innerText =
    `Lv.${general.level ?? 1} EXP ${general.exp ?? 0}/${general.expToNext ?? 100}`;
  document.getElementById("gmStats").innerText =
    `HP: ${general.hp ?? 0}/${general.maxHp ?? 0}
ATK: ${general.atk ?? 0}
DEF: ${general.def ?? 0}`;
  document.getElementById("gmUpgrade").innerText =
    `升級次數：${general.upgrades?.times || 0}`;

  const skillBox = document.getElementById("gmSkills");
  if (!general.skills || general.skills.length === 0) {
    skillBox.innerText = "無技能";
  } else {
    skillBox.innerHTML =
      "<b>技能：</b><br>" +
      general.skills
        .map(s => `⚔️ <b>${s.name}</b><br><small>${s.desc}</small>`)
        .join("<br>");
  }

  // 顯示 modal
  modal.style.display = "flex";

  // 關閉按鈕
  document.getElementById("closeGeneralModal").onclick = () => {
    modal.style.display = "none";
  };
}

