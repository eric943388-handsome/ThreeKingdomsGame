// originalEliteWarriorPool.js
export const originalElitePool = [
  { 
    name: "呂布", atk: 50, hp: 120, maxHp: 120, loyalty: 80, 
    weight: 1,
    skills: [
      { name: "狂暴", type: "passive", multiplier: 1.5, target: "atk" }
    ] 
  },
  { 
    name: "貂蟬", atk: 10, hp: 40, maxHp: 40, loyalty: 100, 
    weight: 5,
    skills: [
      { name: "魅惑", type: "passive", multiplier: 1.1, target: "def" }
    ] 
  },
  { 
    name: "張遼", atk: 45, hp: 100, maxHp: 100, loyalty: 100, 
    weight: 2,
    skills: [
      { name: "激勵", type: "passive", multiplier: 1.3, target: "def" }
    ] 
  },
  { 
    name: "典韋", atk: 45, hp: 110, maxHp: 110, loyalty: 85, 
    weight: 2,
    skills: [
      { name: "左手的鋼鐵戟", type: "passive", multiplier: 1.15, target: "atk" },
      { name: "右手的鐵盾", type: "passive", multiplier: 1.15, target: "def" }
    ]
  },
  { 
    name: "黃忠", atk: 40, hp: 95, maxHp: 95, loyalty: 100, 
    weight: 5,
    skills: [
      { name: "強弓", type: "passive", multiplier: 1.1, target: "atk" }
    ]
  },
  // 可以依需求繼續新增更多高級武將
];