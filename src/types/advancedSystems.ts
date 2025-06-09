// 고급 스토리텔링 시스템 타입 정의

// === 1. 캐릭터 메모리 시스템 ===
export interface CharacterMemory {
  id: string;
  characterId: string;
  eventType: 'choice' | 'action' | 'dialogue' | 'combat' | 'discovery' | 'achievement';
  title: string;
  description: string;
  details: Record<string, any>; // 유연한 데이터 저장
  location?: string;
  npcInvolved?: string[];
  timestamp: Date;
  importance: 'trivial' | 'minor' | 'moderate' | 'major' | 'critical';
  tags: string[];
  storyContext?: string; // 스토리 상황 컨텍스트
}

export interface MemoryQuery {
  tags?: string[];
  eventType?: string;
  npcInvolved?: string;
  location?: string;
  importance?: string;
  timeRange?: { start: Date; end: Date };
  limit?: number;
}

// === 2. 동적 스토리 분기 시스템 ===
export interface StoryBranch {
  id: string;
  title: string;
  description: string;
  conditions: StoryCondition[];
  consequences: StoryConsequence[];
  isActive: boolean;
  priority: number;
  worldId: string;
  act: number;
  chapter?: number;
}

export interface StoryCondition {
  type: 'memory' | 'reputation' | 'emotion' | 'stat' | 'item' | 'quest' | 'choice';
  target: string; // 확인할 대상 (NPC ID, 세력 이름, 스탯 이름 등)
  operator: 'equals' | 'greater' | 'less' | 'contains' | 'exists' | 'not_exists';
  value: any;
  weight: number; // 조건의 중요도
}

export interface StoryConsequence {
  type: 'unlock_branch' | 'modify_reputation' | 'modify_emotion' | 'add_memory' | 'start_quest' | 'modify_stat';
  target: string;
  value: any;
  description: string;
}

export interface ActiveStoryState {
  characterId: string;
  currentAct: number;
  currentChapter: number;
  activeBranches: string[];
  completedBranches: string[];
  pendingConsequences: StoryConsequence[];
  storyFlags: Record<string, any>;
}

// === 3. 감정 시스템 ===
export interface NPCEmotion {
  npcId: string;
  npcName: string;
  emotions: {
    happiness: number;    // 행복 (-100 ~ 100)
    anger: number;        // 분노 (-100 ~ 100)
    fear: number;         // 공포 (-100 ~ 100)
    trust: number;        // 신뢰 (-100 ~ 100)
    respect: number;      // 존경 (-100 ~ 100)
    love: number;         // 애정 (-100 ~ 100)
    hostility: number;    // 적대감 (-100 ~ 100)
    curiosity: number;    // 호기심 (-100 ~ 100)
  };
  dominantEmotion: string;
  emotionIntensity: number; // 0-100, 감정의 강도
  lastInteraction: Date;
  interactionHistory: EmotionEvent[];
}

export interface EmotionEvent {
  id: string;
  characterId: string;
  npcId: string;
  eventType: 'dialogue' | 'combat' | 'help' | 'betray' | 'gift' | 'insult' | 'praise' | 'save' | 'harm';
  emotionChanges: Partial<NPCEmotion['emotions']>;
  description: string;
  timestamp: Date;
  context?: string;
}

export interface EmotionRule {
  worldId: string;
  eventType: string;
  baseEmotionChanges: Partial<NPCEmotion['emotions']>;
  conditions?: Record<string, any>;
  description: string;
}

// === 4. 평판 시스템 ===
export interface FactionReputation {
  characterId: string;
  factionId: string;
  factionName: string;
  reputation: number; // -1000 ~ 1000
  reputationLevel: ReputationLevel;
  standing: string; // 현재 지위/칭호
  benefits: string[]; // 현재 받는 혜택들
  penalties: string[]; // 현재 받는 제재들
  history: ReputationEvent[];
  isKnown: boolean; // 해당 세력이 플레이어를 아는지
}

export type ReputationLevel = 
  | 'revered'      // 숭배받는 (800-1000)
  | 'exalted'      // 고귀한 (600-799)
  | 'honored'      // 명예로운 (400-599) 
  | 'friendly'     // 우호적 (200-399)
  | 'neutral'      // 중립 (-199-199)
  | 'unfriendly'   // 비우호적 (-399 to -200)
  | 'hostile'      // 적대적 (-599 to -400)
  | 'hated'        // 증오받는 (-799 to -600)
  | 'nemesis';     // 천적 (-1000 to -800)

export interface ReputationEvent {
  id: string;
  characterId: string;
  factionId: string;
  eventType: 'quest_completion' | 'faction_mission' | 'betrayal' | 'alliance' | 'combat' | 'diplomacy';
  reputationChange: number;
  description: string;
  location?: string;
  npcsInvolved?: string[];
  timestamp: Date;
  publicityLevel: 'secret' | 'private' | 'local' | 'regional' | 'global';
}

export interface FactionRelation {
  factionId: string;
  alliedFactions: string[];
  enemyFactions: string[];
  neutralFactions: string[];
  relationshipModifiers: Record<string, number>; // 다른 세력과의 관계가 평판에 미치는 영향
}

// === 5. 사이드 퀘스트 시스템 ===
export interface SideQuest {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'faction' | 'exploration' | 'collection' | 'mystery' | 'romance' | 'revenge';
  difficulty: 'trivial' | 'easy' | 'moderate' | 'hard' | 'extreme';
  timeLimit?: Date;
  
  // 퀘스트 조건
  prerequisites: QuestPrerequisite[];
  objectives: QuestObjective[];
  
  // 보상
  rewards: QuestReward[];
  
  // 상태
  status: 'available' | 'active' | 'completed' | 'failed' | 'cancelled';
  progress: Record<string, number>; // objective ID -> progress percentage
  
  // 메타데이터
  giver?: string; // NPC ID
  location?: string;
  worldId: string;
  priority: number;
  isRepeatable: boolean;
  cooldownDays?: number;
  
  // 스토리 연동
  affectedFactions?: string[];
  affectedNPCs?: string[];
  unlocksBranches?: string[];
  requiredMemories?: string[];
  
  // 시간 정보
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date;
}

export interface QuestPrerequisite {
  type: 'level' | 'reputation' | 'item' | 'skill' | 'memory' | 'quest' | 'emotion';
  target: string;
  value: any;
  description: string;
}

export interface QuestObjective {
  id: string;
  description: string;
  type: 'kill' | 'collect' | 'deliver' | 'talk' | 'explore' | 'craft' | 'survive' | 'protect' | 'persuade';
  target?: string;
  quantity?: number;
  currentProgress: number;
  isCompleted: boolean;
  isOptional: boolean;
  hint?: string;
}

export interface QuestReward {
  type: 'experience' | 'gold' | 'item' | 'reputation' | 'skill' | 'title' | 'access';
  value: any;
  description: string;
  factionId?: string; // 평판 보상의 경우
}

// === 통합 시스템 ===
export interface AdvancedGameState {
  characterId: string;
  memories: CharacterMemory[];
  storyState: ActiveStoryState;
  npcEmotions: Record<string, NPCEmotion>;
  reputations: Record<string, FactionReputation>;
  sideQuests: Record<string, SideQuest>;
  
  // 캐시된 데이터
  lastUpdated: Date;
  sessionFlags: Record<string, any>;
}

// === API 응답 타입 ===
export interface MemoryResponse {
  memories: CharacterMemory[];
  totalCount: number;
  relevantContext?: string;
}

export interface StoryAnalysis {
  availableBranches: StoryBranch[];
  recommendations: string[];
  currentContext: string;
  nextSuggestedActions: string[];
}

export interface EmotionSummary {
  overallMood: string;
  keyRelationships: Array<{
    npcName: string;
    relationship: string;
    emotionSummary: string;
  }>;
  recentChanges: EmotionEvent[];
}

export interface ReputationSummary {
  standings: Array<{
    factionName: string;
    level: ReputationLevel;
    standing: string;
    trend: 'rising' | 'falling' | 'stable';
  }>;
  opportunities: string[];
  warnings: string[];
}

export interface QuestSummary {
  activeQuests: SideQuest[];
  availableQuests: SideQuest[];
  recentCompletions: SideQuest[];
  recommendations: string[];
} 