import { recruit } from "./recruit.js";
import { findEnemy, attackEnemy } from "./war.js";
import { updateUI } from "./ui.js";
import { useHpPack, useLoyaltyPack, useExpPack } from "./useitems.js";
import { state } from "./state.js";
import { buyFood, buyStone, buyHpPack, buyLoyaltyPack, buyExpPack } from "./store.js";
import { developAtk, developDef } from "./develop.js";

document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      pages.forEach(p => p.style.display = "none");
      document.getElementById(btn.dataset.target).style.display = "flex";
    });
  });

  function refreshUI(msg = "") {
    updateUI(msg);
    const generalsList = document.getElementById("generalsList");
    generalsList.querySelectorAll(".btn-hp").forEach(btn => btn.onclick = () => refreshUI(useHpPack(btn.dataset.index)));
    generalsList.querySelectorAll(".btn-loyalty").forEach(btn => btn.onclick = () => refreshUI(useLoyaltyPack(btn.dataset.index)));
    generalsList.querySelectorAll(".btn-exp").forEach(btn => btn.onclick = () => refreshUI(useExpPack(btn.dataset.index)));
  }

  // --- 招募 ---
  document.getElementById("btnRecruit")?.addEventListener("click", () => refreshUI(recruit()));

  // --- 戰鬥 ---
  document.getElementById("btnFind")?.addEventListener("click", () => refreshUI(findEnemy()));
  document.getElementById("btnAttack")?.addEventListener("click", () => refreshUI(attackEnemy()));

  // --- 商店 ---
  document.getElementById("btnBuyFood")?.addEventListener("click", () => refreshUI(buyFood()));
  document.getElementById("btnBuyStone")?.addEventListener("click", () => refreshUI(buyStone()));
  document.getElementById("btnBuyHpPack")?.addEventListener("click", () => refreshUI(buyHpPack()));
  document.getElementById("btnBuyLoyaltyPack")?.addEventListener("click", () => refreshUI(buyLoyaltyPack()));
  document.getElementById("btnBuyExpPack")?.addEventListener("click", () => refreshUI(buyExpPack()));

  // --- 發展 ---
  document.getElementById("btnDevelopAtk")?.addEventListener("click", () => refreshUI(developAtk()));
  document.getElementById("btnDevelopDef")?.addEventListener("click", () => refreshUI(developDef()));

  refreshUI("開始你的三國之旅！");
  document.getElementById("developPage").style.display = "flex";
});