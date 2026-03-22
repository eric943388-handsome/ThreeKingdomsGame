import { state } from "./state.js";

// ===============================
// 朝貢系統
// ===============================
export function handleTribute() {
  const t = state.territory;

  // ❌ 不在10關就不觸發
  if (t <= 0 || t % 10 !== 0) return null;

  // ❌ 已領過就不再觸發
  if (state.claimedTributes.has(t)) return null;

  state.claimedTributes.add(t);

  let msg = "";

  // ===============================
  // 固定關卡獎勵
  // ===============================
  if (t === 10) {
    msg = "🏰 初入亂世，諸侯初次納貢！🎁 獲得 1 高級武將卷";
    state.eliteScrolls += 1;
  }

  else if (t === 20) {
    msg = "🏰 威名漸起，諸侯敬畏！ 🎁獲得300金!";
    state.gold += 300;
  }

  else if (t === 30) {
    msg = "🏰 群雄震動，四方俯首！🎁獲得 2 高級武將卷!";
    state.eliteScrolls += 2;
  }

  else if (t === 40) {
    msg = "🏰 霸業已成，逐鹿中原！🎁獲得400金，300石頭，1 高級武將卷!!!";
    state.gold += 400;
    state.stone += 300;
    state.eliteScrolls += 1;
  }


  return msg;
}