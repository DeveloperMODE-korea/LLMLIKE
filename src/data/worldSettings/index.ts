// 세계관 관리 시스템

import { WorldSetting, WorldSettingId } from './types';
import { DIMENSIONAL_RIFT_WORLD } from './dimensionalRift';

// 모든 세계관 등록
export const WORLD_SETTINGS: Record<WorldSettingId, WorldSetting> = {
  dimensional_rift: DIMENSIONAL_RIFT_WORLD,
  // 추후 추가될 세계관들
  cyberpunk_2187: {} as WorldSetting, // TODO: 구현 예정
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
    return Object.entries(WORLD_SETTINGS)
      .filter(([_, world]) => world.id) // 구현된 세계관만 필터링
      .map(([id, world]) => ({
        id: id as WorldSettingId,
        name: world.name,
        description: world.description
      }));
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