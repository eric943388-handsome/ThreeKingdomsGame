// develop.js
import { state } from "./state.js";
import { updateUI } from "./ui.js";

export function developAtk() {
  if (state.food < 20) {
    return "糧食不足！";
  }
  state.food -= 20;
  state.attack += 5;
  return "兵力提升！";
}

export function developDef() {
  if (state.stone < 40) {
    return "石頭不足！";
  }
  state.stone -= 40;
  state.defense += 5;
  return "國防提升！";
}