// ===============================
// itemPool.js（道具系統核心）
// ===============================

import { state } from "./state.js";
import { weightedRandom } from "./utils.js";

/**
 * 🎯 道具設計原則：
 * 1. 使用道具時「不浪費」
 * 2. 只會補到上限，不會超用
 * 3. 回傳實際使用結果
 */

// ===============================
// 📦 道具池
// ===============================
export const itemPool = [

  // =========================
  // 🧪 補包（回滿血）
  // =========================
  {
    name: "補包",
    weight: 3,

    apply: (generalIndex = null, count = 1) => {

      // ===== 用在武將身上 =====
      if (generalIndex !== null) {
        const g = state.generals[generalIndex];
        if (!g) return "武將不存在！";

        // ❌ 已滿血 → 不消耗
        if (g.hp >= g.maxHp) {
          return `${g.name} 血量已滿，不需要補包`;
        }

        // ✔ 最多只需要 1 個（回滿）
        const useCount = Math.min(count, state.hpPacks, 1);

        if (useCount <= 0) return "沒有補包！";

        state.hpPacks -= useCount;
        g.hp = g.maxHp;

        return `使用 ${useCount} 個補包｜${g.name} 血量回滿 (${g.hp}/${g.maxHp})`;
      }

      // ===== 抽到補包 =====
      state.hpPacks++;
      return "補包 +1";
    }
  },

  // =========================
  // 🎖 封侯令（忠誠提升）
  // =========================
  {
    name: "封侯令",
    weight: 4,

    apply: (generalIndex = null, count = 1) => {

      if (generalIndex !== null) {
        const g = state.generals[generalIndex];
        if (!g) return "武將不存在！";

        // ❌ 已滿忠誠
        if (g.loyalty >= 100) {
          return `${g.name} 忠誠已滿，不需要封侯令`;
        }

        // 每個 +10 忠誠
        const need = 100 - g.loyalty;

        // 最多需要幾個
        const maxNeed = Math.ceil(need / 10);

        // 實際可用數量
        const useCount = Math.min(count, maxNeed, state.loyaltyPacks);

        if (useCount <= 0) return "沒有封侯令！";

        const before = g.loyalty;

        state.loyaltyPacks -= useCount;
        g.loyalty = Math.min(100, g.loyalty + useCount * 10);

        const actualUsed = Math.ceil((g.loyalty - before) / 10);

        return `使用 ${actualUsed} 個封侯令｜${g.name} 忠誠 ${before} → ${g.loyalty}`;
      }

      state.loyaltyPacks++;
      return "封侯令 +1";
    }
  },

  // =========================
  // 📦 經驗禮包
  // =========================
  {
    name: "經驗禮包",
    weight: 3,

    apply: (generalIndex = null, count = 1) => {

      if (generalIndex !== null) {
        const g = state.generals[generalIndex];
        if (!g) return "武將不存在！";

        const useCount = Math.min(count, state.expPacks);

        if (useCount <= 0) return "沒有經驗禮包！";

        state.expPacks -= useCount;

        g.atk += 10 * useCount;
        g.maxHp += 10 * useCount;
        g.hp = Math.min(g.hp + 10 * useCount, g.maxHp);
        g.upgrades.times += useCount;

        return `${g.name} 使用 ${useCount} 個經驗禮包｜攻擊+${10 * useCount} / 血量+${10 * useCount}`;
      }

      state.expPacks++;
      return "經驗禮包 +1";
    }
  },

  // =========================
  // 💰 金幣
  // =========================
  {
    name: "金幣",
    weight: 0.8,
    apply: () => {
      state.gold += 200;
      return "金幣 +200";
    }
  },

  // =========================
  // 🪨 石頭
  // =========================
  {
    name: "石頭",
    weight: 5,
    apply: () => {
      state.stone += 50;
      return "石頭 +50";
    }
  },

  // =========================
  // 🌾 糧食
  // =========================
  {
    name: "糧食",
    weight: 5,
    apply: () => {
      state.food += 50;
      return "糧食 +50";
    }
  },

  // =========================
  // 💎 高級武將卷
  // =========================
  {
    name: "高級武將卷",
    weight: 0.8,
    apply: () => {
      state.eliteScrolls++;
      return "💎 高級武將卷 +1";
    }
  }
];

// ===============================
// 🎲 抽道具
// ===============================
export function getRandomItem(generalIndex = null) {
  const item = weightedRandom(itemPool);
  return item.apply(generalIndex);
}