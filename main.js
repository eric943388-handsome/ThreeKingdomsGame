// main.js
import { recruit } from "./recruit.js";
import { findEnemy, attackEnemy } from "./war.js";
import { updateUI } from "./ui.js";
import {
  useHpPack,
  useLoyaltyPack,
  useExpPack,
  setActiveGeneral,
  sellGeneral,
} from "./general.js";
import { state } from "./state.js";
import {
  buyFood,
  buyStone,
  buyHpPack,
  buyLoyaltyPack,
  buyExpPack,
} from "./store.js";
import { developAtk, developDef } from "./develop.js";

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
  // 武將按鈕事件代理
  // ===============================
  const generalsList = document.getElementById("generalsList");
  generalsList.addEventListener("click", (e) => {
    const btn = e.target;
    const index = parseInt(btn.dataset.index);
    if (isNaN(index)) return;

    let msg = "";

    if (btn.classList.contains("btn-hp")) msg = useHpPack(index);
    else if (btn.classList.contains("btn-loyalty")) msg = useLoyaltyPack(index);
    else if (btn.classList.contains("btn-exp")) msg = useExpPack(index);
    else if (btn.classList.contains("btn-active")) msg = setActiveGeneral(index);
    else if (btn.classList.contains("btn-sell")) msg = sellGeneral(index);

    refreshUI(msg);
  });

  // ===============================
  // UI 刷新函式
  // ===============================
  function refreshUI(msg = "") {
    updateUI(msg);
  }

  // ===============================
  // 招募按鈕
  // ===============================
  document.getElementById("btnRecruit")?.addEventListener("click", () =>
    refreshUI(recruit())
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