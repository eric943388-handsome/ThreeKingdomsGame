import { state } from "./state.js";

/**
 * 道具池，每個道具都有：
 * - name: 道具名稱
 * - weight: 權重
 * - apply: 套用效果函式
 * - msg: 回傳 UI 訊息
 */
export const itemPool = [
  {
    name: "補包",
    weight: 3,
    apply: (generalIndex = null) => {
      if (generalIndex !== null && state.generals[generalIndex]) {
        const g = state.generals[generalIndex];
        g.hp = g.maxHp;
        return `${g.name} 血量已恢復！`;
      } else {
        state.hpPacks++;
        return "補包 x1";
      }
    }
  },
  {
    name: "封侯令",
    weight: 4,
    apply: (generalIndex = null) => {
      if (generalIndex !== null && state.generals[generalIndex]) {
        const g = state.generals[generalIndex];
        g.loyalty = Math.min(100, g.loyalty + 10);
        return `${g.name} 主公英明! 忠誠度提升！`;
      } else {
        state.loyaltyPacks++;
        return "封侯令 x1";
      }
    }
  },
  {
    name: "經驗禮包",
    weight: 3,
    apply: (generalIndex = null) => {
      if (generalIndex !== null && state.generals[generalIndex]) {
        const g = state.generals[generalIndex];
        g.atk += 10;
        g.maxHp += 10;
        g.hp = Math.min(g.hp + 10, g.maxHp);
        return `${g.name} 使用經驗禮包，攻擊 +10，最大血量 +10`;
      } else {
        state.expPacks++;
        return "經驗禮包 x1";
      }
    }
  },
  {
    name: "金幣",
    weight: 0.8,
    apply: () => {
      state.gold += 200;
      return "金幣 x200";
    }
  },
  {
    name: "石頭",
    weight: 5,
    apply: () => {
      state.stone += 50;
      return "石頭 x50";
    }
  },
  {
    name: "糧食",
    weight: 5,
    apply: () => {
      state.food += 50;
      return "糧食 x50";
    }
  },
  // ===== 新增高級武將卷 =====
  {
    name: "高級武將卷",
    weight: 0.8,  // 可調整掉落機率
    apply: () => {
      state.eliteScrolls++;
      return "💎 高級武將卷 x1";
    }
  }
];

/**
 * 抽取道具並套用效果
 * @param {number|null} generalIndex 若是作用於武將則傳入 index
 */
import { weightedRandom } from "./utils.js";

export function getRandomItem(generalIndex = null) {
  const item = weightedRandom(itemPool);
  return item.apply(generalIndex);
}