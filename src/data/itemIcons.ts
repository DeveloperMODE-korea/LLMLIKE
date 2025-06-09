// 아이템 아이콘 시스템
export interface ItemIconData {
  icon: string;
  color: string;
  backgroundColor: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'weapon' | 'armor' | 'consumable' | 'tool' | 'misc' | 'tech' | 'implant';
}

// 아이템 이름으로 아이콘 매핑
export const ITEM_ICONS: { [itemName: string]: ItemIconData } = {
  // === 차원의 균열 세계관 아이템 ===
  
  // 무기류 - 판타지
  '강철 장검': {
    icon: '⚔️',
    color: '#e5e7eb',
    backgroundColor: '#374151',
    rarity: 'common',
    category: 'weapon'
  },
  '마법 지팡이': {
    icon: '🪄',
    color: '#8b5cf6',
    backgroundColor: '#4c1d95',
    rarity: 'uncommon',
    category: 'weapon'
  },
  '단검 두 자루': {
    icon: '🗡️',
    color: '#6b7280',
    backgroundColor: '#1f2937',
    rarity: 'common',
    category: 'weapon'
  },
  '성스러운 메이스': {
    icon: '🔨',
    color: '#fbbf24',
    backgroundColor: '#92400e',
    rarity: 'rare',
    category: 'weapon'
  },

  // 방어구 - 판타지
  '철제 방패': {
    icon: '🛡️',
    color: '#9ca3af',
    backgroundColor: '#4b5563',
    rarity: 'common',
    category: 'armor'
  },
  '사슬 갑옷': {
    icon: '🛡️',
    color: '#d1d5db',
    backgroundColor: '#6b7280',
    rarity: 'uncommon',
    category: 'armor'
  },
  '마법사 로브': {
    icon: '👘',
    color: '#3b82f6',
    backgroundColor: '#1e40af',
    rarity: 'uncommon',
    category: 'armor'
  },
  '가죽 갑옷': {
    icon: '🦺',
    color: '#92400e',
    backgroundColor: '#451a03',
    rarity: 'common',
    category: 'armor'
  },
  '성직자 로브': {
    icon: '👘',
    color: '#fbbf24',
    backgroundColor: '#92400e',
    rarity: 'uncommon',
    category: 'armor'
  },
  '성스러운 방패': {
    icon: '🛡️',
    color: '#fde047',
    backgroundColor: '#a16207',
    rarity: 'rare',
    category: 'armor'
  },

  // 소모품 - 판타지
  '치유 포션 3개': {
    icon: '🧪',
    color: '#ef4444',
    backgroundColor: '#7f1d1d',
    rarity: 'common',
    category: 'consumable'
  },
  '마나 포션 5개': {
    icon: '🧪',
    color: '#3b82f6',
    backgroundColor: '#1e3a8a',
    rarity: 'common',
    category: 'consumable'
  },
  '독 바른 화살 10개': {
    icon: '🏹',
    color: '#16a34a',
    backgroundColor: '#14532d',
    rarity: 'uncommon',
    category: 'weapon'
  },
  '축복받은 물 5개': {
    icon: '💧',
    color: '#06b6d4',
    backgroundColor: '#0e7490',
    rarity: 'rare',
    category: 'consumable'
  },

  // 도구 - 판타지
  '도적 도구': {
    icon: '🗝️',
    color: '#64748b',
    backgroundColor: '#334155',
    rarity: 'common',
    category: 'tool'
  },
  '마법서': {
    icon: '📚',
    color: '#8b5cf6',
    backgroundColor: '#4c1d95',
    rarity: 'uncommon',
    category: 'misc'
  },

  // === 사이버펑크 2187 세계관 아이템 ===
  
  // 사이버웨어/임플란트
  '군사급 사이버덱': {
    icon: '💻',
    color: '#06b6d4',
    backgroundColor: '#0e7490',
    rarity: 'epic',
    category: 'tech'
  },
  '뉴럴 부스터 임플란트': {
    icon: '🧠',
    color: '#8b5cf6',
    backgroundColor: '#5b21b6',
    rarity: 'rare',
    category: 'implant'
  },
  '뉴럴 스트리밍 임플란트': {
    icon: '📡',
    color: '#a855f7',
    backgroundColor: '#6b21a8',
    rarity: 'uncommon',
    category: 'implant'
  },
  '타이탄늄 골격 프레임': {
    icon: '🦴',
    color: '#e5e7eb',
    backgroundColor: '#4b5563',
    rarity: 'legendary',
    category: 'implant'
  },

  // 무기 - 사이버펑크
  '단분자 검 (Monomolecular Blade)': {
    icon: '⚡',
    color: '#ef4444',
    backgroundColor: '#7f1d1d',
    rarity: 'legendary',
    category: 'weapon'
  },

  // 방어구 - 사이버펑크  
  '서브더멀 아머 (피부 아래 방어구)': {
    icon: '🛡️',
    color: '#6366f1',
    backgroundColor: '#312e81',
    rarity: 'epic',
    category: 'armor'
  },

  // 소모품 - 사이버펑크
  '어드레날린 부스터': {
    icon: '💉',
    color: '#ef4444',
    backgroundColor: '#991b1b',
    rarity: 'uncommon',
    category: 'consumable'
  },
  '면역 부스터 칵테일': {
    icon: '🧪',
    color: '#10b981',
    backgroundColor: '#047857',
    rarity: 'uncommon',
    category: 'consumable'
  },

  // 도구 - 사이버펑크
  'ICE 브레이커 프로그램들': {
    icon: '🔓',
    color: '#06b6d4',
    backgroundColor: '#155e75',
    rarity: 'rare',
    category: 'tech'
  },
  '스텔스 코드 라이브러리': {
    icon: '👻',
    color: '#64748b',
    backgroundColor: '#1e293b',
    rarity: 'rare',
    category: 'tech'
  },
  '홀로캠 드론 (은밀 촬영용)': {
    icon: '🚁',
    color: '#8b5cf6',
    backgroundColor: '#5b21b6',
    rarity: 'uncommon',
    category: 'tech'
  },
  '암호화 커뮤니케이터': {
    icon: '📱',
    color: '#06b6d4',
    backgroundColor: '#0e7490',
    rarity: 'uncommon',
    category: 'tech'
  },
  '위조 ID 컬렉션': {
    icon: '🆔',
    color: '#f59e0b',
    backgroundColor: '#92400e',
    rarity: 'rare',
    category: 'misc'
  },
  '포터블 유전자 시퀀서': {
    icon: '🧬',
    color: '#10b981',
    backgroundColor: '#065f46',
    rarity: 'epic',
    category: 'tech'
  },
  '생체 샘플 보관함': {
    icon: '🧪',
    color: '#10b981',
    backgroundColor: '#047857',
    rarity: 'uncommon',
    category: 'misc'
  },
  '바이오 해킹 키트': {
    icon: '🔬',
    color: '#10b981',
    backgroundColor: '#14532d',
    rarity: 'rare',
    category: 'tool'
  },
  '뉴럴 링크 기타 (생각으로 연주)': {
    icon: '🎸',
    color: '#f59e0b',
    backgroundColor: '#92400e',
    rarity: 'epic',
    category: 'misc'
  },
  '홀로그래픽 무대 시스템': {
    icon: '🎭',
    color: '#a855f7',
    backgroundColor: '#6b21a8',
    rarity: 'rare',
    category: 'tech'
  },
  '저항군 연락망': {
    icon: '📻',
    color: '#ef4444',
    backgroundColor: '#7f1d1d',
    rarity: 'rare',
    category: 'misc'
  },
  '불법 방송 장비': {
    icon: '📺',
    color: '#f59e0b',
    backgroundColor: '#92400e',
    rarity: 'uncommon',
    category: 'tech'
  },
  '개조된 호버카 (Modded Hoverbike)': {
    icon: '🏍️',
    color: '#f59e0b',
    backgroundColor: '#92400e',
    rarity: 'epic',
    category: 'misc'
  },
  '서바이벌 키트': {
    icon: '🎒',
    color: '#84cc16',
    backgroundColor: '#365314',
    rarity: 'common',
    category: 'tool'
  },
  '레이더 재머': {
    icon: '📡',
    color: '#ef4444',
    backgroundColor: '#7f1d1d',
    rarity: 'uncommon',
    category: 'tech'
  },
  '무선 해킹 도구': {
    icon: '📟',
    color: '#06b6d4',
    backgroundColor: '#0e7490',
    rarity: 'uncommon',
    category: 'tech'
  }
};

// 퀘스트/획득 아이템들
export const QUEST_ITEM_ICONS: { [itemName: string]: ItemIconData } = {
  '기밀 문서 데이터': {
    icon: '📄',
    color: '#ef4444',
    backgroundColor: '#7f1d1d',
    rarity: 'rare',
    category: 'misc'
  },
  '해킹된 데이터': {
    icon: '💾',
    color: '#06b6d4',
    backgroundColor: '#0e7490',
    rarity: 'uncommon',
    category: 'misc'
  },
  '고대 유물': {
    icon: '🏺',
    color: '#fbbf24',
    backgroundColor: '#92400e',
    rarity: 'legendary',
    category: 'misc'
  },
  '마법 크리스탈': {
    icon: '💎',
    color: '#8b5cf6',
    backgroundColor: '#4c1d95',
    rarity: 'epic',
    category: 'misc'
  }
};

// 모든 아이템 아이콘 통합
export const ALL_ITEM_ICONS = {
  ...ITEM_ICONS,
  ...QUEST_ITEM_ICONS
};

// 아이템 이름으로 아이콘 데이터 가져오기
export function getItemIcon(itemName: string): ItemIconData | null {
  // 정확한 이름 매칭
  if (ALL_ITEM_ICONS[itemName]) {
    return ALL_ITEM_ICONS[itemName];
  }

  // 부분 매칭 (아이템 이름에 키워드가 포함된 경우)
  const lowerItemName = itemName.toLowerCase();
  
  // 키워드 기반 매칭
  if (lowerItemName.includes('포션')) {
    if (lowerItemName.includes('치유') || lowerItemName.includes('체력')) {
      return {
        icon: '🧪',
        color: '#ef4444',
        backgroundColor: '#7f1d1d',
        rarity: 'common',
        category: 'consumable'
      };
    } else if (lowerItemName.includes('마나')) {
      return {
        icon: '🧪',
        color: '#3b82f6',
        backgroundColor: '#1e3a8a',
        rarity: 'common',
        category: 'consumable'
      };
    }
  }

  if (lowerItemName.includes('검') || lowerItemName.includes('blade')) {
    return {
      icon: '⚔️',
      color: '#e5e7eb',
      backgroundColor: '#374151',
      rarity: 'common',
      category: 'weapon'
    };
  }

  if (lowerItemName.includes('방패') || lowerItemName.includes('shield')) {
    return {
      icon: '🛡️',
      color: '#9ca3af',
      backgroundColor: '#4b5563',
      rarity: 'common',
      category: 'armor'
    };
  }

  if (lowerItemName.includes('데이터') || lowerItemName.includes('정보')) {
    return {
      icon: '💾',
      color: '#06b6d4',
      backgroundColor: '#0e7490',
      rarity: 'uncommon',
      category: 'misc'
    };
  }

  // 기본 아이콘
  return {
    icon: '📦',
    color: '#9ca3af',
    backgroundColor: '#4b5563',
    rarity: 'common',
    category: 'misc'
  };
}

// 등급별 색상 가져오기
export function getRarityColors(rarity: string): { borderColor: string; glowColor: string } {
  const colors = {
    common: { borderColor: '#9ca3af', glowColor: '#9ca3af40' },
    uncommon: { borderColor: '#10b981', glowColor: '#10b98140' },
    rare: { borderColor: '#3b82f6', glowColor: '#3b82f640' },
    epic: { borderColor: '#8b5cf6', glowColor: '#8b5cf640' },
    legendary: { borderColor: '#f59e0b', glowColor: '#f59e0b40' }
  };
  
  return colors[rarity as keyof typeof colors] || colors.common;
} 