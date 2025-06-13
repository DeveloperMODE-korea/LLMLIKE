// 🎯 통합 타입 시스템 - 모든 모듈에서 공유하는 타입 정의

// ======================
// 🌍 World & Game Types
// ======================

export interface BaseStats {
  [key: string]: number;
}

export interface Character {
  id: string;
  name: string;
  job: string;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stats: BaseStats;
  gold: number;
  experience: number;
  userId: string;
  worldId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameState {
  id: string;
  characterId: string;
  currentStage: number;
  gameStatus: 'playing' | 'completed' | 'paused';
  worldContext: WorldContext;
  advancedSystems: AdvancedSystemsData;
  waitingForApi: boolean;
  currentEvent?: GameEvent;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorldContext {
  worldId: string;
  currentRegion: string;
  timeOfDay: string;
  weather: string;
  season: string;
}

// ======================
// 🧠 Advanced Systems
// ======================

export interface AdvancedSystemsData {
  memories: Memory[];
  relationships: NPCRelationship[];
  reputations: FactionReputation[];
  sideQuests: SideQuest[];
}

export interface Memory {
  id: string;
  characterId: string;
  content: string;
  importance: number; // 1-10
  category: 'combat' | 'dialogue' | 'discovery' | 'achievement';
  tags: string[];
  createdAt: Date;
}

export interface NPCRelationship {
  id: string;
  characterId: string;
  npcName: string;
  relationship: number; // -100 to 100
  lastInteraction: Date;
  relationshipType: 'hostile' | 'neutral' | 'friendly' | 'ally';
  history: string[];
}

export interface FactionReputation {
  id: string;
  characterId: string;
  factionName: string;
  reputation: number; // -100 to 100
  standing: 'enemy' | 'unfriendly' | 'neutral' | 'friendly' | 'allied';
  achievements: string[];
}

export interface SideQuest {
  id: string;
  characterId: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  progress: number; // 0-100
  objectives: QuestObjective[];
  rewards: QuestReward[];
  dueDate?: Date;
}

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  type: 'kill' | 'collect' | 'talk' | 'reach' | 'survive';
}

export interface QuestReward {
  type: 'experience' | 'gold' | 'item' | 'reputation';
  amount: number;
  description: string;
}

// ======================
// 🎮 Game Events
// ======================

export interface GameEvent {
  id: string;
  type: 'story' | 'combat' | 'dialogue' | 'discovery' | 'guestLimit';
  title: string;
  content: string;
  choices: Choice[];
  metadata?: {
    enemyId?: string;
    npcId?: string;
    itemId?: string;
    worldContext?: Partial<WorldContext>;
  };
}

export interface Choice {
  id: number;
  text: string;
  consequences?: {
    statsChange?: Partial<BaseStats>;
    relationshipChange?: { npcName: string; change: number }[];
    reputationChange?: { factionName: string; change: number }[];
    itemsGained?: string[];
    itemsLost?: string[];
  };
}

// ======================
// 🌍 World Settings
// ======================

export interface WorldSetting {
  id: string;
  name: string;
  description: string;
  genre: string;
  backgroundStory: string;
  version: string;
  
  classes: CharacterClass[];
  statNames: { [key: string]: string };
  regions: Region[];
  storyArcs: StoryArc[];
  gameSystems: GameSystem[];
  
  prompts: {
    systemPrompt: string;
    characterPrompts: { [className: string]: string };
    regionPrompts: { [regionName: string]: string };
  };
  
  atmosphere: {
    timeOfDay: { [time: string]: string };
    weatherEffects: string[];
    seasonalChanges: string[];
  };
  
  specialEvents: SpecialEvent[];
}

export interface CharacterClass {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  detailedDescription: string;
  baseStats: BaseStats;
  startingSkills: string[];
}

export interface Region {
  name: string;
  levelRange: [number, number];
  description: string;
  atmosphere: string;
  keyFeatures: string[];
  majorNPCs: NPC[];
}

export interface NPC {
  name: string;
  role: string;
  description: string;
  personality: string;
}

export interface StoryArc {
  name: string;
  levelRange: [number, number];
  description: string;
  keyEvents: string[];
  climax: string;
}

export interface GameSystem {
  name: string;
  description: string;
  mechanics: string[];
}

export interface SpecialEvent {
  name: string;
  description: string;
  triggerConditions: string[];
  outcomes: string[];
}

// ======================
// 🔐 Authentication
// ======================

export interface User {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
  createdAt: Date;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  username: string;
}

// ======================
// 🔧 Configuration
// ======================

export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  game: {
    guestModeLimit: number;
    autoSaveInterval: number;
    defaultWorldId: string;
  };
  ai: {
    provider: 'claude' | 'openai';
    model: string;
    maxTokens: number;
  };
}

// ======================
// 🛠️ Utility Types
// ======================

export type WorldSettingId = 'dimensional_rift' | 'cyberpunk_2187' | 'dark_finance' | 'classic_fantasy' | 'steampunk_empire' | 'space_odyssey';

export type APIResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

export type GamePhase = 'character_creation' | 'world_selection' | 'playing' | 'paused' | 'completed';

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// ======================
// 🔄 Event System
// ======================

export interface GameEvent_Internal {
  type: string;
  payload: any;
  timestamp: Date;
  source: string;
}

export interface EventSubscription {
  id: string;
  eventType: string;
  callback: (event: GameEvent_Internal) => void;
}

// Export all types
export type * from './index'; 