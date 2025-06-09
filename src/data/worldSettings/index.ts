// 세계관 관리 시스템

import { WorldSetting, WorldSettingId } from './types';
import { DIMENSIONAL_RIFT_WORLD } from './dimensionalRift';
import { CYBERPUNK_2187_WORLD } from './cyberpunk2187';

// 다크 파이낸스 세계관 (임시로 여기에 정의)
const DARK_FINANCE_WORLD: WorldSetting = {
  id: 'dark_finance',
  name: '🌑 다크 파이낸스: 그림자 거래소',
  description: '2024년 현재, AI와 빅데이터가 지배하는 하이퍼 금융 시대. 공개 시장과 그림자 시장이 동시에 존재하며, 당신은 이 금융 생태계에서 생존해야 합니다.',
  genre: '금융 스릴러',
  backgroundStory: `2008년 금융위기 이후, 금융 시장은 표면적으로는 규제가 강화되었지만, 실제로는 더욱 복잡하고 은밀한 구조로 진화했습니다.

2024년 현재, 전 세계 금융은 7인의 익명 조직 "그림자 위원회(Shadow Council)"에 의해 조종되고 있으며, AI 알고리즘과 빅데이터가 시장을 지배하는 하이퍼 금융 시대가 도래했습니다.`,

  classes: [
    {
      id: 'retail_ant',
      name: '🐜 개미 투자자',
      subtitle: '작지만 끈질긴 생존자',
      description: '500만원부터 시작하는 개인투자자. 큰 세력들의 먹잇감이 되기 쉽지만, 때로는 운과 끈기로 대박을 터뜨리기도 합니다.',
      detailedDescription: '개미투자자는 제한된 자본과 정보를 가지고 있지만, 온라인 커뮤니티를 통한 집단 지성과 감정적 투자 성향으로 때로는 예상치 못한 결과를 만들어냅니다.',
      baseStats: { capital: 500, information: 30, network: 45, technical: 25, psychology: 70, reputation: 20 },
      startingSkills: ['기본 차트 분석', '커뮤니티 활동', '감정 관리']
    },
    {
      id: 'day_trader',
      name: '⚡ 데이 트레이더',
      subtitle: '번개같은 단기 매매의 달인',
      description: '5천만원부터 시작하는 단기 매매 전문가. 차트 분석과 빠른 판단력으로 하루에도 수십 번의 거래를 합니다.',
      detailedDescription: '데이 트레이더는 극도의 스트레스 속에서도 냉정한 판단력을 유지하며, 알고리즘과의 속도 경쟁에서 살아남는 전문가입니다.',
      baseStats: { capital: 5000, information: 75, network: 40, technical: 85, psychology: 90, reputation: 60 },
      startingSkills: ['차트 분석', '빠른 매매', '위험 관리']
    },
    {
      id: 'quant_analyst',
      name: '🤖 퀀트 애널리스트',
      subtitle: '수학적 모델링의 천재',
      description: '1억원부터 시작하는 알고리즘 트레이딩 전문가. 복잡한 수학 모델로 시장을 예측하고 자동화된 거래를 운용합니다.',
      detailedDescription: '퀀트 애널리스트는 수학과 컴퓨터 공학의 천재로, 시장 패턴을 수식으로 분석하여 AI보다도 정교한 예측 모델을 구축합니다.',
      baseStats: { capital: 10000, information: 95, network: 35, technical: 95, psychology: 60, reputation: 70 },
      startingSkills: ['알고리즘 개발', '데이터 분석', '시스템 프로그래밍']
    },
    {
      id: 'fund_manager',
      name: '💼 펀드 매니저',
      subtitle: '거대 자본의 지휘관',
      description: '100억원부터 시작하는 기관투자 전문가. 연기금과 보험사의 자금을 운용하며 시장에 큰 영향력을 행사합니다.',
      detailedDescription: '펀드 매니저는 막대한 자금을 운용하며 시장 전체에 영향을 미칠 수 있는 거래를 집행합니다. 성과 압박과 벤치마크 추적의 스트레스 속에서 살아갑니다.',
      baseStats: { capital: 100000, information: 85, network: 90, technical: 70, psychology: 80, reputation: 85 },
      startingSkills: ['포트폴리오 관리', '리스크 관리', '기관 거래']
    },
    {
      id: 'market_manipulator',
      name: '🕷️ 시세 조작자',
      subtitle: '시장을 움직이는 거미',
      description: '1천억원부터 시작하는 작전 세력. 다수의 계좌를 통한 분산 매매로 특정 종목의 주가를 인위적으로 조작합니다.',
      detailedDescription: '시세 조작자는 합법과 불법의 경계선에서 활동하며, 거래량 조작과 허위 정보 유포로 개미투자자들을 유인하는 위험한 존재입니다.',
      baseStats: { capital: 1000000, information: 70, network: 95, technical: 80, psychology: 95, reputation: -50 },
      startingSkills: ['시장 조작', '다계좌 관리', '정보 조작']
    },
    {
      id: 'shadow_council',
      name: '👑 그림자 의회 의원',
      subtitle: '세계 금융의 진정한 지배자',
      description: '10조원부터 시작하는 글로벌 금융 조종자. 각국 정부 정책에 영향력을 행사하며 전 세계 시장을 동시에 조작합니다.',
      detailedDescription: '그림자 의회 의원은 인류 역사상 가장 강력한 금융 권력을 가진 존재로, 한 나라의 경제를 붕괴시키거나 글로벌 위기를 조성할 수 있는 절대적 권력을 보유합니다.',
      baseStats: { capital: 100000000, information: 100, network: 100, technical: 90, psychology: 100, reputation: 100 },
      startingSkills: ['글로벌 조작', '정치 조작', '경제 지배']
    }
  ],

  statNames: {
    capital: '자본',
    information: '정보력',
    network: '인맥',
    technical: '기술력',
    psychology: '심리전',
    reputation: '명성도'
  },
  
  regions: [
    {
      name: '🏢 여의도 금융지구',
      levelRange: [1, 30],
      description: '대한민국 금융의 심장부. 차가운 유리탑들이 즐비하고, 정장 입은 사람들이 바쁘게 오가는 곳.',
      atmosphere: '첨단 기술과 전통적 금융이 만나는 곳에서 모든 거래가 실시간으로 이루어집니다.',
      keyFeatures: ['증권사 본사들이 밀집된 금융 허브', '블룸버그 터미널과 로이터 단말기'],
      majorNPCs: [
        {
          name: '김상현',
          role: '대형 증권사 팀장',
          description: '20년 경력의 베테랑 트레이더',
          personality: '냉정하고 현실적이며, 신입들에게는 엄격함'
        }
      ]
    }
  ],

  storyArcs: [
    {
      name: '💰 Act I: 입문 (Market Entry)',
      levelRange: [1, 25],
      description: '금융 시장에 첫 발을 들여놓으며 시장의 기본 원리와 숨겨진 어둠을 발견하는 단계.',
      keyEvents: ['첫 투자와 첫 손실의 경험', '온라인 커뮤니티에서 만난 의문스러운 정보'],
      climax: '첫 번째 내부 정보와 도덕적 딜레마 직면'
    }
  ],

  gameSystems: [
    {
      name: '💸 명성 시스템',
      description: '선택에 따라 화이트/그레이/블랙 명성이 변화하는 도덕성 기반 시스템',
      mechanics: ['화이트 명성: 정당한 방법으로 얻은 존경', '블랙 명성: 불법적 수단으로 얻은 악명']
    }
  ],

  promptTemplate: {
    systemPrompt: '당신은 다크 파이낸스 세계관의 마스터 네러레이터입니다.',
    characterPrompts: {
      '개미투자자': '제한된 자본과 정보의 한계를 강조하세요.',
      '데이트레이더': '극도의 스트레스와 빠른 판단력을 반영하세요.'
    },
    regionPrompts: {
      '여의도 금융지구': '첨단 기술과 전통적 금융이 만나는 분위기를 연출하세요.'
    }
  },

  atmosphere: {
    timeOfDay: {
      '새벽': '프리마켓이 열리기 전 고요한 시간...',
      '정오': '오전 거래가 마감되고 점심시간...'
    },
    weatherEffects: ['상승장: 시장이 활기차고 투자자들의 기분도 좋아집니다'],
    seasonalChanges: ['결산시즌: 기업들의 실적 발표로 시장이 들썩입니다']
  },

  specialEvents: [
    {
      name: '📉 플래시 크래시',
      description: '몇 분 만에 시장이 30% 폭락하는 극한 상황',
      triggerConditions: ['AI 알고리즘 오작동'],
      outcomes: ['막대한 손실과 기회']
    }
  ]
};

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
      description: '선행과 악행에 따른 명예도 변화',
      mechanics: ['선행: 명예도 상승', '악행: 명예도 하락']
    }
  ],

  promptTemplate: {
    systemPrompt: '당신은 고전 판타지 세계의 마스터 네러레이터입니다.',
    characterPrompts: { '전사': '용맹함과 명예를 중시하는 전사의 특성을 반영하세요.' },
    regionPrompts: { '왕국의 성': '웅장하고 위엄 있는 분위기를 연출하세요.' }
  },

  atmosphere: {
    timeOfDay: { '새벽': '첫 닭이 울며 새로운 하루가 시작됩니다...' },
    weatherEffects: ['맑은 날씨: 모험하기 좋은 날씨입니다'],
    seasonalChanges: ['봄: 새로운 생명이 돋아나는 계절입니다']
  },

  specialEvents: [
    {
      name: '🐉 드래곤 출현',
      description: '고대 드래곤이 잠에서 깨어남',
      triggerConditions: ['고대 보물 발견'],
      outcomes: ['대규모 전투', '전설적 보상']
    }
  ]
};

// 모든 세계관 등록
export const WORLD_SETTINGS: Record<WorldSettingId, WorldSetting> = {
  dimensional_rift: DIMENSIONAL_RIFT_WORLD,
  cyberpunk_2187: CYBERPUNK_2187_WORLD,
  dark_finance: DARK_FINANCE_WORLD,
  classic_fantasy: CLASSIC_FANTASY_WORLD,
  // 추후 추가될 세계관들
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
    return WORLD_SETTINGS[currentWorldSetting];
  }

  /**
   * 세계관 변경
   */
  static setCurrentWorld(worldId: WorldSettingId): void {
    if (WORLD_SETTINGS[worldId]) {
      currentWorldSetting = worldId;
      console.log(`🌍 세계관 변경됨: ${WORLD_SETTINGS[worldId].name}`);
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
    console.log('🌍 WORLD_SETTINGS:', WORLD_SETTINGS);
    const availableWorlds = Object.entries(WORLD_SETTINGS)
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