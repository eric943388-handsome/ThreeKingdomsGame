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
  <strong>${g.name}${state.activeGeneral === g ? " ⭐出戰中" : ""}</strong><br>

⚔️${g.atk} ❤️${g.hp}/${g.maxHp} 忠誠度 ${g.loyalty}<br>

<button class="btn-hp" data-index="${index}">補包</button>

<button class="btn-loyalty" data-index="${index}">封侯令</button>

<button class="btn-exp" data-index="${index}">經驗</button>

<button class="btn-active" data-index="${index}">設為出戰</button>

<button class="btn-sell" data-index="${index}">出售</button>
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