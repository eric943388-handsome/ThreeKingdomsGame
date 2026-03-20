export const state = {
  gold: 100,
  food: 100,
  stone: 100,
  attack: 20,
  defense: 10,
  territory: 5,
  generals: [],
  hpPacks: 0,
  loyaltyPacks: 0,
  expPacks: 0,
  currentEnemy: null
};

export function resetGame() {
  state.gold = 100;
  state.food = 100;
  state.stone = 100;
  state.attack = 20;
  state.defense = 10;
  state.territory = 5;
  state.generals = [];
  state.hpPacks = 0;
  state.loyaltyPacks = 0;
  state.expPacks = 0;
  state.currentEnemy = null;
}