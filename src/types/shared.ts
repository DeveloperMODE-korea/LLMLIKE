/**
 * Shared types for LLMLIKE game
 * Used across frontend and backend to maintain consistency
 */

// Core character interface
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

// Game state interface
export interface GameState {
  character: Character;
  currentStage: number;
  storyHistory: StoryEvent[];
  gameStatus: 'menu' | 'creating' | 'playing' | 'paused' | 'ended';
  currentEvent?: StoryEvent;
  waitingForApi: boolean;
  worldId?: string;
}

// Job enumeration
export enum Job {
  WARRIOR = '전사',
  MAGE = '마법사',
  ROGUE = '도적',
  CLERIC = '성직자'
}

// Item interface
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

// Skill interface
export interface Skill {
  id: string;
  name: string;
  description: string;
  manaCost: number;
  damage?: number;
  healing?: number;
  effects?: string[];
}

// Story event interface
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

// Choice interface
export interface Choice {
  id: number;
  text: string;
  consequence?: string;
}

// Enemy interface
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

// Advanced systems interfaces
export interface CharacterMemory {
  id: string;
  title: string;
  description: string;
  tags: string[];
  importance: 'minor' | 'moderate' | 'major' | 'critical';
  eventType: string;
  location?: string;
  npcInvolved?: string[];
  timestamp: Date;
}

export interface NPCEmotion {
  npcId: string;
  npcName: string;
  dominantEmotion: string;
  emotionIntensity: number;
  emotions: Record<string, number>;
  lastInteraction: Date;
}

export interface FactionReputation {
  factionId: string;
  factionName: string;
  reputation: number;
  reputationLevel: string;
  standing: string;
  benefits: string[];
  penalties: string[];
}

export interface SideQuest {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
  status: 'available' | 'active' | 'completed' | 'failed';
  objectives?: QuestObjective[];
  rewards?: QuestReward[];
  location?: string;
  timeLimit?: Date;
}

export interface QuestObjective {
  id: string;
  description: string;
  isCompleted: boolean;
  quantity?: number;
  currentProgress?: number;
}

export interface QuestReward {
  type: 'item' | 'gold' | 'experience' | 'reputation';
  description: string;
  amount?: number;
}

// Summary interfaces for advanced systems
export interface EmotionSummary {
  overallMood: string;
  relationships: Array<{
    npcName: string;
    relationship: string;
    trend: 'improving' | 'declining' | 'stable';
  }>;
}

export interface ReputationSummary {
  overallStanding: string;
  standings: Array<{
    factionName: string;
    level: string;
    trend: 'rising' | 'falling' | 'stable';
  }>;
  opportunities: string[];
  warnings: string[];
}

export interface QuestSummary {
  activeCount: number;
  completedCount: number;
  failedCount: number;
  recommendations: string[];
}

export interface StoryAnalysis {
  currentContext: string;
  recommendations: string[];
  nextSuggestedActions: string[];
  availableBranches: Array<{
    title: string;
    description: string;
    requirements: string[];
  }>;
} 