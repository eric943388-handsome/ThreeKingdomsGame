// main.js
import { recruit } from "./recruit.js";
import { findEnemy, attackEnemy } from "./war.js";
import { updateUI } from "./ui.js";
import { state } from "./state.js";
import { itemPool } from "./itemPool.js";
import { sellGeneral } from "./general.js";
import { buyFood, buyStone, buyHpPack, buyLoyaltyPack, buyExpPack } from "./store.js";
import { developAtk, developDef } from "./develop.js";
import { useEliteScroll } from "./eliteRecruit.js";
import { sellItem } from "./itemActions.js";

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
  // UI刷新
  // ===============================
  function refreshUI(msg = "") {
    updateUI(msg);
  }

  // ===============================
  // 武將按鈕事件代理
  // ===============================
  const generalsList = document.getElementById("generalsList");

  generalsList.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const index = parseInt(btn.dataset.index);
    if (isNaN(index)) return;

    let msg = "";

    // ===== 道具使用（已統一）=====
    if (btn.classList.contains("btn-hp")) {
      msg = itemPool.find(i => i.name === "補包").apply(index);

    } else if (btn.classList.contains("btn-loyalty")) {
      msg = itemPool.find(i => i.name === "封侯令").apply(index);

    } else if (btn.classList.contains("btn-exp")) {
      msg = itemPool.find(i => i.name === "經驗禮包").apply(index);
    }

    // ===== 出戰 / 取消 =====
    else if (btn.classList.contains("btn-active")) {
      const g = state.generals[index];
      if (!g) return;

      if (state.activeGeneral === g) {
        state.activeGeneral = null;
        msg = `${g.name} 已取消出戰`;
      } else {
        state.activeGeneral = g;
        msg = `${g.name} 出戰中`;
      }
    }

    // ===== 出售武將 =====
    else if (btn.classList.contains("btn-sell")) {
      msg = sellGeneral(index);
    }

    updateUI(msg);
  });

  // ===============================
  // 上方道具出售（新功能🔥）
  // ===============================
  const topItems = document.getElementById("topItems");
  if (topItems) {
    topItems.addEventListener("click", (e) => {
      const type = e.target.dataset.sell;
      if (!type) return;

      const msg = sellItem(type);
      updateUI(msg);
    });
  }

  // ===============================
  // 招募
  // ===============================
  document.getElementById("btnRecruit")?.addEventListener("click", () =>
    refreshUI(recruit())
  );

  document.getElementById("btnEliteRecruit")?.addEventListener("click", () =>
    refreshUI(useEliteScroll())
  );

  // ===============================
  // 戰鬥
  // ===============================
  document.getElementById("btnFind")?.addEventListener("click", () =>
    refreshUI(findEnemy())
  );

  document.getElementById("btnAttack")?.addEventListener("click", () =>
    refreshUI(attackEnemy())
  );

  // ===============================
  // 商店
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
  // 發展
  // ===============================
  document.getElementById("btnDevelopAtk")?.addEventListener("click", () =>
    refreshUI(developAtk())
  );

  document.getElementById("btnDevelopDef")?.addEventListener("click", () =>
    refreshUI(developDef())
  );

  // ===============================
  // 初始化
  // ===============================
  refreshUI("開始你的三國之旅！");
  document.getElementById("developPage").style.display = "flex";
});