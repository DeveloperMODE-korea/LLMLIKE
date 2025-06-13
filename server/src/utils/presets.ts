/**
 * Game presets and world-specific configurations
 */

export interface StatsMapping {
  health: number;
  mana: number;
  strength: number;
  intelligence: number;
  dexterity: number;
  constitution: number;
}

/**
 * Maps world-specific stats to standard character structure
 * @param stats Raw stats from world settings
 * @param worldId World identifier
 * @returns Mapped stats for character creation
 */
export function mapStatsToWorld(stats: any, worldId: string): StatsMapping {
  if (worldId === 'cyberpunk_2187') {
    // Cyberpunk 2187 stat mapping with improved scaling
    return {
      health: stats.body || 100,
      mana: stats.neural || 50,
      strength: Math.floor((stats.body || 100) / 5),
      intelligence: Math.floor((stats.technical || 50) / 4),
      dexterity: Math.floor((stats.reflex || 50) / 4),
      constitution: Math.floor(((stats.cool || 50) + (stats.reputation || 50)) / 8)
    };
  }
  
  // Default dimensional rift mapping
  return {
    health: stats.health || 100,
    mana: stats.mana || 50,
    strength: stats.strength || 10,
    intelligence: stats.intelligence || 10,
    dexterity: stats.dexterity || 10,
    constitution: stats.constitution || 10
  };
}

/**
 * Gets starting items for a job in specific world
 * @param job Character job/class
 * @param worldId World identifier
 * @returns Array of starting item names
 */
export function getStartingItems(job: string, worldId: string): string[] {
  const itemMap: { [key: string]: { [key: string]: string[] } } = {
    'dimensional_rift': {
      '⚔️ 전사': ['강철 장검', '철제 방패', '사슬 갑옷', '치유 포션 3개'],
      '🔮 마법사': ['마법 지팡이', '마법서', '마법사 로브', '마나 포션 5개'],
      '🗡️ 도적': ['단검 두 자루', '가죽 갑옷', '도적 도구', '독 바른 화살 10개'],
      '✨ 성직자': ['성스러운 메이스', '성직자 로브', '성스러운 방패', '축복받은 물 5개']
    },
    'cyberpunk_2187': {
      '🕶️ 네트러너': ['군사급 사이버덱', '뉴럴 부스터 임플란트', 'ICE 브레이커 프로그램들', '스텔스 코드 라이브러리'],
      '⚡ 테크-사무라이': ['단분자 검 (Monomolecular Blade)', '서브더멀 아머 (피부 아래 방어구)', '타이탄늄 골격 프레임', '어드레날린 부스터'],
      '📺 미디어 해커': ['홀로캠 드론 (은밀 촬영용)', '뉴럴 스트리밍 임플란트', '암호화 커뮤니케이터', '위조 ID 컬렉션'],
      '🧬 바이오-엔지니어': ['포터블 유전자 시퀀서', '생체 샘플 보관함', '바이오 해킹 키트', '면역 부스터 칵테일'],
      '🎵 로커보이': ['뉴럴 링크 기타 (생각으로 연주)', '홀로그래픽 무대 시스템', '저항군 연락망', '불법 방송 장비'],
      '🚗 놈매드 드라이버': ['개조된 호버카 (Modded Hoverbike)', '서바이벌 키트', '레이더 재머', '무선 해킹 도구']
    }
  };

  return itemMap[worldId]?.[job] || [];
}

/**
 * Gets starting skills for a job in specific world
 * @param job Character job/class
 * @param worldId World identifier
 * @returns Array of starting skill names
 */
export function getStartingSkills(job: string, worldId: string): string[] {
  const skillMap: { [key: string]: { [key: string]: string[] } } = {
    'dimensional_rift': {
      '⚔️ 전사': ['베기', '방어'],
      '🔮 마법사': ['화염구', '얼음화살'],
      '🗡️ 도적': ['기습', '회피'],
      '✨ 성직자': ['치유', '천벌']
    },
    'cyberpunk_2187': {
      '🕶️ 네트러너': ['해킹', '데이터 조작', 'AI 소통'],
      '⚡ 테크-사무라이': ['근접 전투', '사격', '사이보그 제어'],
      '📺 미디어 해커': ['미디어 조작', '정보 수집', '소셜 엔지니어링'],
      '🧬 바이오-엔지니어': ['생체 해킹', '유전자 조작', '의학'],
      '🎵 로커보이': ['카리스마', '공연', '선동'],
      '🚗 놈매드 드라이버': ['운전', '생존', '기계 수리']
    }
  };

  return skillMap[worldId]?.[job] || [];
} 