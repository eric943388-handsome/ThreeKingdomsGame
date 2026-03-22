// itemPool.js
import { state } from "./state.js";
import { weightedRandom } from "./utils.js";

export const itemPool = [
  {
    name: "補包",
    weight: 3,
    apply: (generalIndex = null) => {
      if (generalIndex !== null) {
        if (state.hpPacks <= 0) return "沒有補包！";

        const g = state.generals[generalIndex];
        if (!g) return "武將不存在！";

        state.hpPacks--;
        g.hp = g.maxHp;
        return `${g.name} 血量已恢復！`;
      }

      state.hpPacks++;
      return "補包 x1";
    }
  },

  {
    name: "封侯令",
    weight: 4,
    apply: (generalIndex = null) => {
      if (generalIndex !== null) {
        if (state.loyaltyPacks <= 0) return "沒有封侯令！";

        const g = state.generals[generalIndex];
        if (!g) return "武將不存在！";

        state.loyaltyPacks--;
        g.loyalty = Math.min(100, g.loyalty + 10);
        return `${g.name} 忠誠提升！`;
      }

      state.loyaltyPacks++;
      return "封侯令 x1";
    }
  },

  {
    name: "經驗禮包",
    weight: 3,
    apply: (generalIndex = null) => {
      if (generalIndex !== null) {
        if (state.expPacks <= 0) return "沒有經驗禮包！";

        const g = state.generals[generalIndex];
        if (!g) return "武將不存在！";

        state.expPacks--;
        g.atk += 10;
        g.maxHp += 10;
        g.hp = Math.min(g.hp + 10, g.maxHp);

        return `${g.name} 攻擊+10 / 血量+10`;
      }

      state.expPacks++;
      return "經驗禮包 x1";
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

  {
    name: "高級武將卷",
    weight: 0.8,
    apply: () => {
      state.eliteScrolls++;
      return "💎 高級武將卷 x1";
    }
  }
];

// 抽道具
export function getRandomItem(generalIndex = null) {
  const item = weightedRandom(itemPool);
  return item.apply(generalIndex);
}