// main.js
import { recruit } from "./recruit.js";
import { findEnemy, attackEnemy } from "./war.js";
import { updateUI } from "./ui.js";
import { state } from "./state.js";
import { itemPool } from "./itemPool.js";
import { setActiveGeneral, sellGeneral } from "./general.js";
import { buyFood, buyStone, buyHpPack, buyLoyaltyPack, buyExpPack } from "./store.js";
import { developAtk, developDef } from "./develop.js";
import { useEliteScroll } from "./eliteRecruit.js";

document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // 分頁切換
  // ===============================
  const pages = document.querySelectorAll(".page");
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      pages.forEach((p) => (p.style.display = "none"));
      document.getElementById(btn.dataset.target).style.display = "flex";
    });
  });

  // ===============================
  // UI 刷新函式
  // ===============================
  function refreshUI(msg = "") {
    updateUI(msg);
  }

  // ===============================
  // 武將按鈕事件代理
  // ===============================
  // 武將按鈕事件代理
const generalsList = document.getElementById("generalsList");
generalsList.addEventListener("click", (e) => {
  const btn = e.target.closest("button"); // 確保抓到按鈕本身
  if (!btn) return;

  const index = parseInt(btn.dataset.index);
  if (isNaN(index)) return;

  let msg = "";

  // 使用補包
  if (btn.classList.contains("btn-hp")) {
    if (state.hpPacks <= 0) msg = "沒有補包！";
    else {
      msg = itemPool.find((i) => i.name === "補包").apply(index);
      state.hpPacks--;
    }

  // 使用封侯令
  } else if (btn.classList.contains("btn-loyalty")) {
    if (state.loyaltyPacks <= 0) msg = "沒有封侯令！";
    else {
      msg = itemPool.find((i) => i.name === "封侯令").apply(index);
      state.loyaltyPacks--;
    }

  // 使用經驗禮包
  } else if (btn.classList.contains("btn-exp")) {
    if (state.expPacks <= 0) msg = "沒有經驗禮包！";
    else {
      msg = itemPool.find((i) => i.name === "經驗禮包").apply(index);
      state.expPacks--;
    }

  // 設為出戰 / 取消出戰
  } else if (btn.classList.contains("btn-active")) {
    const g = state.generals[index];
    if (!g) return;

    if (state.activeGeneral === g) {
      // 取消出戰
      state.activeGeneral = null;
      btn.innerText = "出戰";
      msg = `${g.name} 已取消出戰`;
    } else {
      // 設為出戰
      state.activeGeneral = g;
      // 重置其他所有出戰按鈕文字
      document.querySelectorAll(".btn-active").forEach(b => b.innerText = "出戰");
      btn.innerText = "取消出戰";
      msg = `${g.name} 出戰中`;
    }

  // 出售武將
  } else if (btn.classList.contains("btn-sell")) {
    msg = sellGeneral(index);
  }

  // 刷新 UI
  updateUI(msg);
});

  // ===============================
  // 招募按鈕
  // ===============================
  document.getElementById("btnRecruit")?.addEventListener("click", () =>
    refreshUI(recruit())
  );
  document.getElementById("btnEliteRecruit")?.addEventListener("click", () =>
    refreshUI(useEliteScroll())
  );

  // ===============================
  // 戰鬥按鈕
  // ===============================
  document.getElementById("btnFind")?.addEventListener("click", () =>
    refreshUI(findEnemy())
  );
  document.getElementById("btnAttack")?.addEventListener("click", () =>
    refreshUI(attackEnemy())
  );

  // ===============================
  // 商店按鈕
  // ===============================
  document.getElementById("btnBuyFood")?.addEventListener("click", () =>
    refreshUI(buyFood())
  );
  document.getElementById("btnBuyStone")?.addEventListener("click", () =>
    refreshUI(buyStone())
  );
  document.getElementById("btnBuyHpPack")?.addEventListener("click", () =>
    refreshUI(buyHpPack())
  );
  document.getElementById("btnBuyLoyaltyPack")?.addEventListener("click", () =>
    refreshUI(buyLoyaltyPack())
  );
  document.getElementById("btnBuyExpPack")?.addEventListener("click", () =>
    refreshUI(buyExpPack())
  );

  // ===============================
  // 發展按鈕
  // ===============================
  document.getElementById("btnDevelopAtk")?.addEventListener("click", () =>
    refreshUI(developAtk())
  );
  document.getElementById("btnDevelopDef")?.addEventListener("click", () =>
    refreshUI(developDef())
  );

  // ===============================
  // 初始化 UI
  // ===============================
  refreshUI("開始你的三國之旅！");
  document.getElementById("developPage").style.display = "flex";
});