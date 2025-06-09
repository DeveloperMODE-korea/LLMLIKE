export interface Character {
  id: string;
  name: string;
  job: Job;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  strength: number;
  intelligence: number;
  dexterity: number;
  constitution: number;
  inventory: Item[];
  gold: number;
  experience: number;
  skills: Skill[];
}

export enum Job {
  WARRIOR = '전사',
  MAGE = '마법사',
  ROGUE = '도적',
  CLERIC = '성직자'
}

export interface JobDetails {
  name: Job;
  description: string;
  startingStats: {
    health: number;
    mana: number;
    strength: number;
    intelligence: number;
    dexterity: number;
    constitution: number;
  };
  startingSkills: Skill[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: '무기' | '방어구' | '포션' | '스크롤' | '열쇠' | '기타';
  effects?: {
    [stat: string]: number;
  };
  value: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  damage?: number;
  healing?: number;
  effects?: string[];
}

export interface GameState {
  character: Character;
  currentStage: number;
  storyHistory: StoryEvent[];
  gameStatus: 'menu' | 'creating' | 'playing' | 'paused' | 'ended';
  currentEvent?: StoryEvent;
  waitingForApi: boolean;
  worldId?: string; // 선택된 세계관 ID
}

export interface StoryEvent {
  id: string;
  stageNumber: number;
  content: string;
  choices: Choice[];
  type: '이야기' | '전투' | '보물' | '상점' | '휴식' | 'guestLimit';
  enemyId?: string;
  result?: string;
  selectedChoice?: number;
}

export interface Choice {
  id: number;
  text: string;
  consequence?: string;
}

export interface Enemy {
  id: string;
  name: string;
  level: number;
  health: number;
  damage: number;
  description: string;
  loot?: Item[];
  gold?: number;
  experience: number;
}