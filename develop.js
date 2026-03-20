// develop.js
import { state } from "./state.js";
import { updateUI } from "./ui.js";

export function developAtk() {
  if (state.food < 20) {
    updateUI("糧食不足！");
    return;
  }
  state.food -= 20;
  state.attack += 5;
  updateUI("兵力提升！");
}

export function developDef() {
  if (state.stone < 20) {
    updateUI("石頭不足！");
    return;
  }
  state.stone -= 20;
  state.defense += 5;
  updateUI("國防提升！");
}