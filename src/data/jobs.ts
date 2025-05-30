import { Job, JobDetails, Skill } from '../types/game';

const warriorSkills: Skill[] = [
  {
    id: 'slash',
    name: '베기',
    description: '기본적인 검술 공격으로 적당한 피해를 줍니다.',
    manaCost: 0,
    damage: 10,
  },
  {
    id: 'defend',
    name: '방어',
    description: '방패를 들어올려 받는 피해를 줄입니다.',
    manaCost: 5,
    effects: ['1턴 동안 받는 피해 50% 감소'],
  }
];

const mageSkills: Skill[] = [
  {
    id: 'fireball',
    name: '화염구',
    description: '적에게 불덩이를 날립니다.',
    manaCost: 10,
    damage: 15,
  },
  {
    id: 'frostbolt',
    name: '얼음화살',
    description: '적을 둔화시키는 얼음 화살을 발사합니다.',
    manaCost: 8,
    damage: 10,
    effects: ['1턴 동안 적 둔화'],
  }
];

const rogueSkills: Skill[] = [
  {
    id: 'backstab',
    name: '기습',
    description: '그림자에서 치명타로 공격합니다.',
    manaCost: 8,
    damage: 18,
  },
  {
    id: 'evade',
    name: '회피',
    description: '적의 공격을 피합니다.',
    manaCost: 5,
    effects: ['1턴 동안 50% 확률로 공격 회피'],
  }
];

const clericSkills: Skill[] = [
  {
    id: 'smite',
    name: '천벌',
    description: '신성한 힘으로 적을 공격합니다.',
    manaCost: 8,
    damage: 12,
  },
  {
    id: 'heal',
    name: '치유',
    description: '자신의 체력을 회복합니다.',
    manaCost: 10,
    healing: 15,
  }
];

export const JOB_DETAILS: Record<Job, JobDetails> = {
  [Job.WARRIOR]: {
    name: Job.WARRIOR,
    description: '무기와 방어구의 달인인 전사는 전투에 특화된 강인한 전사입니다.',
    startingStats: {
      health: 120,
      mana: 30,
      strength: 12,
      intelligence: 6,
      dexterity: 8,
      constitution: 10
    },
    startingSkills: warriorSkills
  },
  [Job.MAGE]: {
    name: Job.MAGE,
    description: '비전 마법을 다루는 마법사는 강력한 주문으로 적을 제압합니다.',
    startingStats: {
      health: 70,
      mana: 120,
      strength: 5,
      intelligence: 14,
      dexterity: 7,
      constitution: 6
    },
    startingSkills: mageSkills
  },
  [Job.ROGUE]: {
    name: Job.ROGUE,
    description: '은신과 정확성의 달인인 도적은 그림자에서 치명타를 가합니다.',
    startingStats: {
      health: 90,
      mana: 60,
      strength: 8,
      intelligence: 8,
      dexterity: 14,
      constitution: 7
    },
    startingSkills: rogueSkills
  },
  [Job.CLERIC]: {
    name: Job.CLERIC,
    description: '신성한 마법을 사용하는 성직자는 치유와 공격 마법을 모두 다룹니다.',
    startingStats: {
      health: 100,
      mana: 90,
      strength: 7,
      intelligence: 10,
      dexterity: 6,
      constitution: 9
    },
    startingSkills: clericSkills
  }
};