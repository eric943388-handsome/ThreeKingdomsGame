// main.js
import { recruit } from "./recruit.js";
import { findEnemy, attackEnemy } from "./war.js";
import { updateUI } from "./ui.js";
import { state } from "./state.js";
import { itemPool } from "./itemPool.js";
import { sellGeneral, setActiveGeneral } from "./general.js";
import { buyFood, buyStone, buyHpPack, buyLoyaltyPack, buyExpPack } from "./store.js";
import { developAtk, developDef } from "./develop.js";
import { useEliteScroll } from "./eliteRecruit.js";
import { sellItem } from "./itemActions.js";


document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // 分頁切換（修正版）
  // ===============================
  const pages = document.querySelectorAll(".page");

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      pages.forEach(p => p.style.display = "none");
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
  // 武將操作（🔥完全統一）
  // ===============================
  const generalsList = document.getElementById("generalsList");

  const itemMap = {
    "btn-hp": "補包",
    "btn-loyalty": "封侯令",
    "btn-exp": "經驗禮包"
  };

  generalsList.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const index = parseInt(btn.dataset.index);
    if (isNaN(index)) return;

    let msg = "";

    // ===== 道具使用（統一 itemPool）=====
    for (const cls in itemMap) {
      if (btn.classList.contains(cls)) {
        const item = itemPool.find(i => i.name === itemMap[cls]);
        msg = item.apply(index);
        updateUI(msg);
        return;
      }
    }

    // ===== 出戰 / 取消 =====
    if (btn.classList.contains("btn-active")) {
      msg = setActiveGeneral(index);
    }

    // ===== 出售武將 =====
    else if (btn.classList.contains("btn-sell")) {
      msg = sellGeneral(index);
    }

    updateUI(msg);
  });

  // ===============================
  // 上方道具出售
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