export function weightedRandom(pool) {
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const item of pool) {
    rand -= item.weight;
    if (rand < 0) return item;
  }
  return pool[pool.length - 1];
}

//階級戰力隨機工具
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}