export const eliteWarriorPool = [
  {
    id: "luBu", name: "呂布",
    atk: 50, hp: 120, maxHp: 120, def: 20, loyalty: 80,
    weight: 1,
    level: 1, exp: 0, expToNext: 120,
    upgrades: { times: 0 },
    skills: [
      {
        id: "berserk",
        name: "戰神之怒",
        desc: "戰鬥中攻擊力提升 50%",
        type: "passive",
        effect: { target: "atk", multiply: 1.5 }
      }
    ]
  },

  {
    id: "diaoChan", name: "貂蟬",
    atk: 10, hp: 40, maxHp: 40, def: 5, loyalty: 100,
    weight: 5,
    level: 1, exp: 0, expToNext: 80,
    upgrades: { times: 0 },
    skills: [
      {
        id: "charm",
        name: "沉魚落雁",
        desc: "提升防禦力 10%",
        type: "passive",
        effect: { target: "def", multiply: 1.1 }
      }
    ]
  },

  {
    id: "zhangLiao", name: "于禁",
    atk: 45, hp: 100, maxHp: 100, def: 25, loyalty: 100,
    weight: 2,
    level: 1, exp: 0, expToNext: 110,
    upgrades: { times: 0 },
    skills: [
      {
        id: "inspire",
        name: "堅守陣地",
        desc: "提升全軍防禦力 30%",
        type: "passive",
        effect: { target: "def", multiply: 1.3 }
      }
    ]
  },

  {
    id: "dianWei", name: "典韋",
    atk: 45, hp: 110, maxHp: 110, def: 30, loyalty: 85,
    weight: 2,
    level: 1, exp: 0, expToNext: 130,
    upgrades: { times: 0 },
    skills: [
      {
        id: "axe",
        name: "左手的鋼鐵戟",
        desc: "攻擊力提升 15%",
        type: "passive",
        effect: { target: "atk", multiply: 1.15 }
      },
      {
        id: "shield",
        name: "右手的鐵盾",
        desc: "防禦力提升 15%",
        type: "passive",
        effect: { target: "def", multiply: 1.15 }
      }
    ]
  },

  {
    id: "huangZhong", name: "黃忠",
    atk: 40, hp: 95, maxHp: 95, def: 15, loyalty: 100,
    weight: 5,
    level: 1, exp: 0, expToNext: 100,
    upgrades: { times: 0 },
    skills: [
      {
        id: "archer",
        name: "強弓",
        desc: "攻擊力提升 10%",
        type: "passive",
        effect: { target: "atk", multiply: 1.1 }
      }
    ]
  }
];