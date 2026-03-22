import { warriorPool } from "./warriorPool.js";
import { eliteWarriorPool } from "./eliteWarriorPool.js";

// ⭐ 新增：原始資料表（很關鍵）
import { originalWarriorPool } from "./originalWarriorPool.js";
import { originalElitePool } from "./originalElitePool.js";

function findOriginal(name, pool) {
  return pool.find(g => g.name === name);
}

export function returnGeneralToPool(general) {
  if (!general) return;

  let original;

  if (general.skills && general.skills.length > 0) {
    original = findOriginal(general.name, originalElitePool);
    if (original && !eliteWarriorPool.some(g => g.name === general.name)) {
      eliteWarriorPool.push({ ...original }); // ⭐ 用原始資料
    }
  } else {
    original = findOriginal(general.name, originalWarriorPool);
    if (original && !warriorPool.some(g => g.name === general.name)) {
      warriorPool.push({ ...original }); // ⭐ 用原始資料
    }
  }
}