// ===============================
// 📦 模組載入
// ===============================
import { recruit } from "./recruit.js";
import { findEnemy, attackEnemy } from "./war.js";
import { updateUI, showIntro, initGeneralModal } from "./ui.js";
import { state } from "./state.js";
import { itemPool } from "./itemPool.js";
import { sellGeneral, setActiveGeneral } from "./general.js";
import {
  buyFood,
  buyStone,
  buyHpPack,
  buyLoyaltyPack,
  buyExpPack
} from "./store.js";
import { developAtk, developDef } from "./develop.js";
import { useEliteScroll } from "./eliteRecruit.js";
import { sellItem } from "./itemActions.js";

// ===============================
// 🚀 初始化入口
// ===============================
document.addEventListener("DOMContentLoaded", initApp);

// ===============================
// 🧠 主初始化
// ===============================
function initApp() {
  initTabs();
  initUI();
  initGenerals();
  initActionBar();
  initIntro();
  initModal();

  document.getElementById("developPage").style.display = "flex";
  updateUI("開始你的三國之旅！");
}

// ===============================
// 📑 分頁切換
// ===============================
function initTabs() {
  const pages = document.querySelectorAll(".page");

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      pages.forEach(p => (p.style.display = "none"));
      document.getElementById(btn.dataset.target).style.display = "flex";
    });
  });
}

// ===============================
// 🎮 UI 操作（按鈕事件綁定）
// ===============================
function initUI() {
  document.getElementById("btnRecruit")?.addEventListener("click", () =>
    updateUI(recruit())
  );

  document.getElementById("btnEliteRecruit")?.addEventListener("click", () =>
    updateUI(useEliteScroll())
  );

  document.getElementById("btnFind")?.addEventListener("click", () =>
    updateUI(findEnemy())
  );

  document.getElementById("btnAttack")?.addEventListener("click", () =>
    updateUI(attackEnemy())
  );

  document.getElementById("btnDevelopAtk")?.addEventListener("click", () =>
    updateUI(developAtk())
  );

  document.getElementById("btnDevelopDef")?.addEventListener("click", () =>
    updateUI(developDef())
  );

  document.getElementById("btnBuyFood")?.addEventListener("click", () =>
    updateUI(buyFood())
  );

  document.getElementById("btnBuyStone")?.addEventListener("click", () =>
    updateUI(buyStone())
  );

  document.getElementById("btnBuyHpPack")?.addEventListener("click", () =>
    updateUI(buyHpPack())
  );

  document.getElementById("btnBuyLoyaltyPack")?.addEventListener("click", () =>
    updateUI(buyLoyaltyPack())
  );

  document.getElementById("btnBuyExpPack")?.addEventListener("click", () =>
    updateUI(buyExpPack())
  );

  document.getElementById("topItems")?.addEventListener("click", (e) => {
    const type = e.target.dataset.sell;
    if (!type) return;
    updateUI(sellItem(type));
  });
}

// ===============================
// 🧑 武將系統
// ===============================
function initGenerals() {
  const generalsList = document.getElementById("generalsList");

  // 道具選單對應表
  const itemMap = {
    hp: "補包",
    loyalty: "封侯令",
    exp: "經驗禮包"
  };

  generalsList.addEventListener("click", (e) => {
    let index;
    let msg = ""; // 外層 msg，供整個流程使用
    let btn = null;

    console.log("===== 點擊武將卡測試 =====");
    console.log("點擊元素 e.target:", e.target);

    // ⭐ 道具模式 → 點整張卡
    if (state.actionMode) {
      const card = e.target.closest(".general-card");
      console.log("closest .general-card:", card);
      if (!card) return;
      index = Array.from(card.parentNode.children).indexOf(card);
      console.log("選中武將索引 (道具模式):", index);
    } 
    // ⭐ 一般模式 → 點按鈕
    else {
      btn = e.target.closest("button");
      console.log("closest button:", btn);
      console.log("state.actionMode:", state.actionMode);

      if (!btn) {
        // 直接點卡也印出索引，方便檢查
        const card = e.target.closest(".general-card");
        if (card) {
          index = Array.from(card.parentNode.children).indexOf(card);
          console.log("選中武將索引 (直接點卡):", index);
        } else {
          console.log("未點到 button 或卡片");
          return;
        }
      } else {
        index = parseInt(btn.dataset.index);
        if (isNaN(index)) return;
        console.log("選中武將索引 (按鈕模式):", index);
      }
    }

    // =========================
    // 🎯 道具模式
    // =========================
    if (state.actionMode) {
      const type = state.selectedItem;
      if (itemMap[type]) {
        const item = itemPool.find(i => i.name === itemMap[type]);
        if (!item) return;

        // 傳入 index 和使用數量
        const msg = item.apply(index, state.selectedCount);
        console.log("使用道具訊息:", msg);

        // 用完道具直接退出模式並顯示訊息
        exitActionMode(msg);
        return;
      }
    }

    // =========================
    // ⚔ 出戰 / 🪙 出售 / 普通點卡
    // =========================
    if (btn) {
      if (btn.classList.contains("btn-active")) {
        msg = setActiveGeneral(index);
      } else if (btn.classList.contains("btn-sell")) {
        msg = sellGeneral(index);
      }
    } else {
      // 直接點卡 → 開啟武將 modal
      const g = state.generals[index];

      if (!g) return;

      msg = `開啟武將卡: ${g.name}`;
      console.log(msg);

      initGeneralModal(g); // ✅ 傳物件
    }

    updateUI(msg);
  });

  window.bindGeneralClick = () => {};
}

// ===============================
// 🧪 ActionBar
// ===============================
function initActionBar() {
  const itemSelect = document.getElementById("itemSelect");
  const itemCount = document.getElementById("itemCount");

  itemSelect?.addEventListener("change", (e) => {
    state.selectedItem = e.target.value;
  });

  itemCount?.addEventListener("input", (e) => {
    state.selectedCount = Math.max(1, parseInt(e.target.value || 1));
  });

  // 進入道具模式
  document.getElementById("btnUseItemMode")?.addEventListener("click", () => {
    state.actionMode = true;
    document.getElementById("actionBar").style.display = "block";
    document.body.classList.add("action-mode-active");
    updateUI("🎯 道具模式：請點選武將使用道具");
  });

  // 取消道具模式
  document.getElementById("closeActionBar")?.addEventListener("click", () => {
    exitActionMode();
  });
}

// ===============================
// 🎬 Intro
// ===============================
function initIntro() {
  showIntro();
}

// ===============================
// 🪟 Modal
// ===============================
function initModal() {
}

// ===============================
// 🚪 退出道具模式（可接收訊息）
// ===============================
function exitActionMode(msg = "已退出道具模式") {
  state.actionMode = false;
  document.getElementById("actionBar").style.display = "none";
  document.body.classList.remove("action-mode-active");
  updateUI(msg);
}

// 掛全域
window.exitActionMode = exitActionMode;