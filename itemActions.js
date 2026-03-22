// itemActions.js
import { state } from "./state.js";

export function sellItem(type) {
  let msg = "";

  switch (type) {
    case "hp":
      if (state.hpPacks <= 0) return "沒有補包";
      state.hpPacks--;
      state.gold += 25;
      msg = "出售補包 +25金";
      break;

    case "loyalty":
      if (state.loyaltyPacks <= 0) return "沒有封侯令";
      state.loyaltyPacks--;
      state.gold += 40;
      msg = "出售封侯令 +40金";
      break;

    case "exp":
      if (state.expPacks <= 0) return "沒有經驗禮包";
      state.expPacks--;
      state.gold += 50;
      msg = "出售經驗禮包 +50金";
      break;
  }

  return msg;
}