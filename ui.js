import { state } from "./state.js";

export function updateUI(msg = "") {
  document.getElementById("stats").innerText =
    `💰${state.gold} 🌾${state.food} 🪨${state.stone} ⚔️${state.attack} 🛡${state.defense} 👥${state.generals.length} 🏰${state.territory}`;
  
  document.getElementById("log").innerText = msg;

  const generalsList = document.getElementById("generalsList");
  generalsList.innerHTML = "";

  state.generals.forEach((g, index) => {
    const div = document.createElement("div");
    div.className = "general-card";
    div.innerHTML = `
      <strong>${g.name}</strong><br>
      ⚔️${g.atk} ❤️${g.hp}/${g.maxHp} 忠誠${g.loyalty}<br>
      <button class="btn-hp" data-index="${index}">使用補包</button>
      <button class="btn-loyalty" data-index="${index}">使用封侯令</button>
      <button class="btn-exp" data-index="${index}">使用經驗禮包</button>
    `;
    generalsList.appendChild(div);
  });

  const itemDiv = document.getElementById("items");
  if (itemDiv) {
    itemDiv.innerText = `補包: ${state.hpPacks}  封侯令: ${state.loyaltyPacks}  經驗禮包: ${state.expPacks}`;
  }

  const enemyDiv = document.getElementById("enemy");
  enemyDiv.innerText = state.currentEnemy ? `⚔️${state.currentEnemy.atk} 🛡${state.currentEnemy.def}` : "";
}