// 세계관 시스템 타입 정의

export interface WorldRegion {
  name: string;
  levelRange: [number, number];
  description: string;
  atmosphere: string;
  keyFeatures: string[];
  majorNPCs: WorldNPC[];
}

export interface WorldNPC {
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

export interface WorldClass {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  detailedDescription: string;
  baseStats: {
    [key: string]: number; // 세계관별로 다른 능력치 사용 가능
  };
  startingSkills: string[];
  icon?: string;
}

export interface WorldSetting {
  id: string;
  name: string;
  description: string;
  genre: string;
  backgroundStory: string;
  
  // 세계관별 고유 직업들
  classes: WorldClass[];
  
  // 세계관별 능력치 시스템
  statNames: {
    [key: string]: string; // 예: { health: '체력', mana: '마나' } 또는 { neural: '뉴럴', chrome: '크롬' }
  };
  
  // 지역들
  regions: WorldRegion[];
  
  // 스토리 아크들
  storyArcs: StoryArc[];
  
  // 독창적인 게임 시스템들
  gameSystems: GameSystem[];
  
  // Claude AI 프롬프트 템플릿
  promptTemplate: {
    systemPrompt: string;
    characterPrompts: {
      [key: string]: string; // 전사, 마법사, 도적, 성직자별 프롬프트
    };
    regionPrompts: {
      [key: string]: string; // 지역별 특별 프롬프트
    };
  };
  
  // 분위기와 톤
  atmosphere: {
    timeOfDay: {
      [key: string]: string; // 새벽, 정오, 석양, 심야별 묘사
    };
    weatherEffects: string[];
    seasonalChanges: string[];
  };
  
  // 특별 이벤트들
  specialEvents: {
    name: string;
    description: string;
    triggerConditions: string[];
    outcomes: string[];
  }[];
}

export type WorldSettingId = 'dimensional_rift' | 'cyberpunk_2187' | 'dark_finance' | 'classic_fantasy' | 'steampunk_empire' | 'space_odyssey'; 