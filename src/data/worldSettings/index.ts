// 세계관 관리 시스템

import { WorldSetting, WorldSettingId } from './types';
import { DIMENSIONAL_RIFT_WORLD } from './dimensionalRift';
import { CYBERPUNK_2187_WORLD } from './cyberpunk2187';
import { DARK_FINANCE_WORLD } from './darkFinance';

// 고전 판타지 세계관 (간소화된 버전만 여기에 유지)
const CLASSIC_FANTASY_WORLD: WorldSetting = {
  id: 'classic_fantasy',
  name: '🏰 고전 판타지',
  description: '검과 마법이 지배하는 전통적인 판타지 세계. 영웅들의 모험이 펼쳐지는 곳.',
  genre: '판타지',
  backgroundStory: '고대부터 전해내려오는 마법과 검의 세계...',
  
  classes: [
    {
      id: 'warrior',
      name: '⚔️ 전사',
      subtitle: '용맹한 검술의 달인',
      description: '강력한 검술과 방어력으로 적을 무찌르는 근접 전투의 전문가입니다.',
      detailedDescription: '전사는 최전방에서 적과 맞서는 용감한 전투원입니다.',
      baseStats: { strength: 90, agility: 60, intelligence: 40, vitality: 85, mana: 30, charisma: 55 },
      startingSkills: ['검술', '방어', '전투 기술']
    }
  ],

  statNames: { strength: '힘', agility: '민첩', intelligence: '지능', vitality: '체력', mana: '마나', charisma: '매력' },
  
  regions: [
    {
      name: '🏰 왕국의 성',
      levelRange: [1, 20],
      description: '기사들과 영주들이 다스리는 곳',
      atmosphere: '웅장한 성과 신비로운 분위기',
      keyFeatures: ['왕좌의 방', '기사단 훈련장'],
      majorNPCs: [
        {
          name: '아서 왕',
          role: '왕국의 군주',
          description: '지혜로운 왕',
          personality: '공정하고 용감함'
        }
      ]
    }
  ],

  storyArcs: [
    {
      name: '🗡️ Act I: 모험의 시작',
      levelRange: [1, 20],
      description: '영웅으로서의 첫 걸음',
      keyEvents: ['첫 퀘스트', '동료와의 만남'],
      climax: '첫 번째 던전 클리어'
    }
  ],

  gameSystems: [
    {
      name: '⭐ 명예 시스템',
      description: '선한 행동으로 명예도를 쌓는 시스템',
      mechanics: ['선한 행동 +10 명예', '악한 행동 -20 명예']
    }
  ],

  promptTemplate: {
    systemPrompt: '당신은 고전 판타지 세계관의 마스터입니다.',
    characterPrompts: {
      '전사': '용감하고 명예를 중시하는 캐릭터입니다.'
    },
    regionPrompts: {
      '왕국의 성': '중세 기사도 문화가 지배하는 웅장한 분위기입니다.'
    }
  },

  atmosphere: {
    timeOfDay: {
      '새벽': '새벽빛이 성벽을 비춥니다...',
      '정오': '태양이 중천에 떠있습니다...'
    },
    weatherEffects: ['맑은 날씨: 모든 이가 기분 좋아 보입니다'],
    seasonalChanges: ['봄: 새로운 모험의 계절이 시작됩니다']
  },

  specialEvents: [
    {
      name: '🐉 용의 출현',
      description: '고대 용이 깨어나 마을을 위협합니다',
      triggerConditions: ['레벨 20 이상'],
      outcomes: ['용 퇴치', '마을 파괴']
    }
  ]
};

// 세계관 컬렉션
export const worldSettings: Record<WorldSettingId, WorldSetting> = {
  dimensional_rift: DIMENSIONAL_RIFT_WORLD,
  cyberpunk_2187: CYBERPUNK_2187_WORLD,
  dark_finance: DARK_FINANCE_WORLD,
  classic_fantasy: CLASSIC_FANTASY_WORLD,
  steampunk_empire: {} as WorldSetting, // TODO: 구현 예정
  space_odyssey: {} as WorldSetting, // TODO: 구현 예정
};

// 현재 활성화된 세계관 (기본값: 차원의 균열)
let currentWorldSetting: WorldSettingId = 'dimensional_rift';

/**
 * 세계관 관리자 클래스
 */
export class WorldManager {
  /**
   * 현재 세계관 가져오기
   */
  static getCurrentWorld(): WorldSetting {
    return worldSettings[currentWorldSetting];
  }

  /**
   * 세계관 변경
   */
  static setCurrentWorld(worldId: WorldSettingId): void {
    if (worldSettings[worldId]) {
      currentWorldSetting = worldId;
      console.log(`🌍 세계관 변경됨: ${worldSettings[worldId].name}`);
    } else {
      console.error(`❌ 존재하지 않는 세계관: ${worldId}`);
    }
  }

  /**
   * 현재 세계관 ID 가져오기
   */
  static getCurrentWorldId(): WorldSettingId {
    return currentWorldSetting;
  }

  /**
   * 사용 가능한 모든 세계관 목록
   */
  static getAvailableWorlds(): Array<{ id: WorldSettingId; name: string; description: string }> {
    console.log('🌍 worldSettings:', worldSettings);
    const availableWorlds = Object.entries(worldSettings)
      .filter(([_, world]) => world.id) // 구현된 세계관만 필터링
      .map(([id, world]) => ({
        id: id as WorldSettingId,
        name: world.name,
        description: world.description
      }));
    console.log('🌍 Available worlds:', availableWorlds);
    return availableWorlds;
  }

  /**
   * 현재 레벨에 적합한 지역 찾기
   */
  static getCurrentRegion(level: number) {
    const currentWorld = this.getCurrentWorld();
    return currentWorld.regions.find(region => 
      level >= region.levelRange[0] && level <= region.levelRange[1]
    ) || currentWorld.regions[0]; // 기본값은 첫 번째 지역
  }

  /**
   * 현재 레벨에 적합한 스토리 아크 찾기
   */
  static getCurrentStoryArc(level: number) {
    const currentWorld = this.getCurrentWorld();
    return currentWorld.storyArcs.find(arc => 
      level >= arc.levelRange[0] && level <= arc.levelRange[1]
    ) || currentWorld.storyArcs[0]; // 기본값은 첫 번째 아크
  }

  /**
   * 캐릭터 직업에 맞는 프롬프트 가져오기
   */
  static getCharacterPrompt(job: string): string {
    const currentWorld = this.getCurrentWorld();
    return currentWorld.promptTemplate.characterPrompts[job] || '';
  }

  /**
   * 지역에 맞는 프롬프트 가져오기
   */
  static getRegionPrompt(regionName: string): string {
    const currentWorld = this.getCurrentWorld();
    return currentWorld.promptTemplate.regionPrompts[regionName] || '';
  }

  /**
   * 시간대별 분위기 묘사 가져오기
   */
  static getTimeOfDayDescription(timeOfDay: string): string {
    const currentWorld = this.getCurrentWorld();
    return currentWorld.atmosphere.timeOfDay[timeOfDay] || '';
  }

  /**
   * 세계관 시스템 프롬프트 생성
   */
  static generateSystemPrompt(characterJob: string, characterLevel: number): string {
    const currentWorld = this.getCurrentWorld();
    const region = this.getCurrentRegion(characterLevel);
    const storyArc = this.getCurrentStoryArc(characterLevel);
    
    const basePrompt = currentWorld.promptTemplate.systemPrompt;
    const characterPrompt = this.getCharacterPrompt(characterJob);
    const regionPrompt = this.getRegionPrompt(region.name);
    
    return `${basePrompt}

**현재 상황:**
- 세계관: ${currentWorld.name}
- 현재 지역: ${region.name} (레벨 ${region.levelRange[0]}-${region.levelRange[1]})
- 스토리 아크: ${storyArc.name}
- 지역 특성: ${region.atmosphere}

${characterPrompt}

${regionPrompt}

**특별 시스템들:**
${currentWorld.gameSystems.map(system => `- ${system.name}: ${system.description}`).join('\n')}`;
  }
}

// 기본 내보내기
export type { WorldSettingId, WorldSetting } from './types';
export default WorldManager; 