export function weightedRandom(pool) {
  const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const item of pool) {
    rand -= item.weight;
    if (rand < 0) return item;
  }
  return pool[pool.length - 1];
}