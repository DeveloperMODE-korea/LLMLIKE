// 캐릭터 아바타 시스템
export interface AvatarData {
  id: string;
  name: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  icon: string;
  pattern: 'tech' | 'magic' | 'stealth' | 'nature' | 'combat' | 'social';
  description: string;
}

export interface WorldAvatars {
  [jobId: string]: AvatarData;
}

// 차원의 균열 세계관 아바타
export const DIMENSIONAL_RIFT_AVATARS: WorldAvatars = {
  'warrior': {
    id: 'warrior',
    name: '⚔️ 전사',
    backgroundColor: 'from-red-900 to-orange-800',
    primaryColor: '#dc2626',
    secondaryColor: '#f59e0b',
    icon: '⚔️',
    pattern: 'combat',
    description: '강철의 의지를 가진 수호자'
  },
  'mage': {
    id: 'mage',
    name: '🔮 마법사',
    backgroundColor: 'from-blue-900 to-purple-800',
    primaryColor: '#2563eb',
    secondaryColor: '#7c3aed',
    icon: '🔮',
    pattern: 'magic',
    description: '비전 마법의 탐구자'
  },
  'rogue': {
    id: 'rogue',
    name: '🗡️ 도적',
    backgroundColor: 'from-gray-900 to-slate-700',
    primaryColor: '#374151',
    secondaryColor: '#6b7280',
    icon: '🗡️',
    pattern: 'stealth',
    description: '그림자 속의 암살자'
  },
  'cleric': {
    id: 'cleric',
    name: '✨ 성직자',
    backgroundColor: 'from-yellow-600 to-amber-500',
    primaryColor: '#d97706',
    secondaryColor: '#f59e0b',
    icon: '✨',
    pattern: 'magic',
    description: '신성한 빛의 전달자'
  }
};

// 사이버펑크 2187 세계관 아바타
export const CYBERPUNK_2187_AVATARS: WorldAvatars = {
  'netrunner': {
    id: 'netrunner',
    name: '🕶️ 네트러너',
    backgroundColor: 'from-cyan-900 to-blue-800',
    primaryColor: '#0891b2',
    secondaryColor: '#06b6d4',
    icon: '🕶️',
    pattern: 'tech',
    description: '사이버스페이스의 유령'
  },
  'techsamurai': {
    id: 'techsamurai',
    name: '⚡ 테크-사무라이',
    backgroundColor: 'from-red-900 to-pink-800',
    primaryColor: '#dc2626',
    secondaryColor: '#ec4899',
    icon: '⚡',
    pattern: 'combat',
    description: '크롬으로 단련된 전사'
  },
  'mediahacker': {
    id: 'mediahacker',
    name: '📺 미디어 해커',
    backgroundColor: 'from-purple-900 to-indigo-800',
    primaryColor: '#7c3aed',
    secondaryColor: '#3730a3',
    icon: '📺',
    pattern: 'social',
    description: '진실을 전하는 디지털 혁명가'
  },
  'bioengineer': {
    id: 'bioengineer',
    name: '🧬 바이오-엔지니어',
    backgroundColor: 'from-green-900 to-emerald-800',
    primaryColor: '#059669',
    secondaryColor: '#10b981',
    icon: '🧬',
    pattern: 'nature',
    description: '생명을 설계하는 창조자'
  },
  'rockerboy': {
    id: 'rockerboy',
    name: '🎵 로커보이',
    backgroundColor: 'from-orange-900 to-red-800',
    primaryColor: '#ea580c',
    secondaryColor: '#dc2626',
    icon: '🎵',
    pattern: 'social',
    description: '반체제의 목소리'
  },
  'nomaddriver': {
    id: 'nomaddriver',
    name: '🚗 놈매드 드라이버',
    backgroundColor: 'from-yellow-800 to-orange-700',
    primaryColor: '#d97706',
    secondaryColor: '#ea580c',
    icon: '🚗',
    pattern: 'nature',
    description: '도로 위의 자유인'
  }
};

// 세계관별 아바타 매핑
export const WORLD_AVATARS: { [worldId: string]: WorldAvatars } = {
  'dimensional_rift': DIMENSIONAL_RIFT_AVATARS,
  'cyberpunk_2187': CYBERPUNK_2187_AVATARS
};

// 직업 이름으로 아바타 가져오기
export function getAvatarByJobName(jobName: string, worldId: string): AvatarData | null {
  const worldAvatars = WORLD_AVATARS[worldId];
  if (!worldAvatars) return null;

  // 직업 이름에서 아이콘과 실제 이름 분리
  const cleanJobName = jobName.replace(/[🕶️⚡📺🧬🎵🚗⚔️🔮🗡️✨]/g, '').trim().toLowerCase();
  
  // 매핑 테이블
  const jobMapping: { [key: string]: string } = {
    // 차원의 균열
    '전사': 'warrior',
    '마법사': 'mage', 
    '도적': 'rogue',
    '성직자': 'cleric',
    // 사이버펑크
    '네트러너': 'netrunner',
    '테크-사무라이': 'techsamurai',
    '미디어 해커': 'mediahacker',
    '바이오-엔지니어': 'bioengineer',
    '로커보이': 'rockerboy',
    '놈매드 드라이버': 'nomaddriver'
  };

  const avatarId = jobMapping[cleanJobName];
  return avatarId ? worldAvatars[avatarId] || null : null;
}

// 패턴별 CSS 클래스 생성
export function getPatternClasses(pattern: string): string {
  const patterns: { [key: string]: string } = {
    'tech': 'bg-gradient-to-br opacity-20',
    'magic': 'bg-gradient-to-tr opacity-25',
    'stealth': 'bg-gradient-to-bl opacity-15',
    'nature': 'bg-gradient-to-tl opacity-30',
    'combat': 'bg-gradient-to-r opacity-25',
    'social': 'bg-gradient-to-l opacity-20'
  };
  
  return patterns[pattern] || patterns['tech'];
} 