# 🌍 LLMLIKE 세계관 시스템 가이드

## 📋 개요
LLMLIKE에 **모듈화된 세계관 시스템**이 구축되었습니다! 이제 "차원의 균열" 세계관이 완전히 구현되었고, 추후 사이버펑크, 스팀펑크, 우주 오디세이 등 다양한 세계관을 쉽게 추가할 수 있습니다.

---

## 🎮 현재 구현된 기능들

### ✅ **완전히 구현됨**
1. **차원의 균열 세계관** - 완전한 설정과 프롬프트 템플릿
2. **세계관 관리 시스템** - WorldManager 클래스
3. **모듈화된 구조** - 새로운 세계관 쉽게 추가 가능
4. **동적 프롬프트 생성** - 레벨/직업/지역에 따른 맞춤형 프롬프트
5. **세계관 선택 UI** - WorldSelector 컴포넌트

---

## 🏗️ 파일 구조

```
src/data/worldSettings/
├── types.ts                 # 세계관 시스템 타입 정의
├── dimensionalRift.ts       # 차원의 균열 세계관 설정
├── index.ts                 # 세계관 관리자 및 통합 인터페이스
└── [미래 세계관들]
    ├── cyberpunk2187.ts     # TODO: 사이버펑크 세계관
    ├── steampunkEmpire.ts   # TODO: 스팀펑크 세계관
    └── spaceOdyssey.ts      # TODO: 우주 오디세이 세계관

src/components/
└── WorldSelector.tsx        # 세계관 선택 UI 컴포넌트
```

---

## 🚀 사용 방법

### **1. 현재 세계관 사용하기**
```typescript
import WorldManager from '../data/worldSettings';

// 현재 세계관 정보 가져오기
const currentWorld = WorldManager.getCurrentWorld();
console.log(currentWorld.name); // "🌟 LLMLIKE: 차원의 균열"

// 레벨에 맞는 지역 찾기
const region = WorldManager.getCurrentRegion(15);
console.log(region.name); // "새벽의 항구 (Dawn Harbor)"

// 캐릭터 직업에 맞는 프롬프트 생성
const prompt = WorldManager.generateSystemPrompt('전사', 15);
```

### **2. 세계관 변경하기**
```typescript
// 세계관 변경
WorldManager.setCurrentWorld('dimensional_rift');

// 사용 가능한 세계관 목록
const worlds = WorldManager.getAvailableWorlds();
```

### **3. Claude AI 프롬프트 적용하기**
현재 `server/src/services/claudeService.ts`에서 다음과 같이 수정하면 됩니다:

```typescript
// 기존 하드코딩된 프롬프트 대신
const systemPrompt = WorldManager.generateSystemPrompt(
  character.job,
  character.level
);
```

---

## 🎭 차원의 균열 세계관 상세 정보

### **🏞️ 4개 주요 지역**
1. **새벽의 항구** (1-25레벨) - 평화로운 시작 지역
2. **속삭이는 숲** (26-50레벨) - 시간이 왜곡된 신비한 숲
3. **얼어붙은 왕관 산맥** (51-75레벨) - 고대 드래곤의 무덤
4. **혼돈의 심연** (76-100레벨) - 최종 결전 지역

### **📖 4개 스토리 아크**
1. **항구의 수수께끼** - 신비한 수정과 바다 정령
2. **숲의 시간여행** - 미래의 자신이 남긴 편지
3. **얼음 속의 진실** - 드래곤의 유언과 고대 전쟁
4. **차원의 심판** - 균열의 주인과 최종 결전

### **⚡ 3개 특별 시스템**
1. **차원 공명 시스템** - 감정이 현실에 영향
2. **운명의 책 시스템** - 선택이 미래에 영향
3. **캐릭터 성장 호칭 시스템** - 행동에 따른 특별 능력

---

## 🔧 새로운 세계관 추가하기

### **1단계: 세계관 설정 파일 생성**
```typescript
// src/data/worldSettings/cyberpunk2187.ts
import { WorldSetting } from './types';

export const CYBERPUNK_2187_WORLD: WorldSetting = {
  id: 'cyberpunk_2187',
  name: '🤖 사이버펑크 2187',
  description: '네온사인이 빛나는 미래 도시의 어두운 이면',
  genre: '사이버펑크',
  backgroundStory: `2187년, 거대 기업들이 세계를 지배하는 시대...`,
  
  regions: [
    {
      name: '네온 스트리트',
      levelRange: [1, 25],
      description: '사이버 펑크 거리...',
      // ... 상세 설정
    }
  ],
  
  // ... 나머지 설정들
};
```

### **2단계: 인덱스에 등록**
```typescript
// src/data/worldSettings/index.ts
import { CYBERPUNK_2187_WORLD } from './cyberpunk2187';

export const WORLD_SETTINGS: Record<WorldSettingId, WorldSetting> = {
  dimensional_rift: DIMENSIONAL_RIFT_WORLD,
  cyberpunk_2187: CYBERPUNK_2187_WORLD, // 추가!
  // ...
};
```

### **3단계: 타입 업데이트**
```typescript
// src/data/worldSettings/types.ts
export type WorldSettingId = 
  | 'dimensional_rift' 
  | 'cyberpunk_2187'    // 추가!
  | 'steampunk_empire' 
  | 'space_odyssey';
```

---

## 🎨 Claude AI 프롬프트 활용 예시

### **기본 프롬프트 (자동 생성됨)**
```
당신은 "차원의 균열" 세계관의 마스터 스토리텔러입니다.

**현재 상황:**
- 세계관: 🌟 LLMLIKE: 차원의 균열
- 현재 지역: 새벽의 항구 (레벨 1-25)
- 스토리 아크: 항구의 수수께끼
- 지역 특성: 🌅 평화롭지만 신비로운 기운이 감도는 해안 도시

**전사의 특성 반영:**
- 용맹함과 명예를 중시하는 상황 설정
- 정면 대결과 육체적 도전이 포함된 선택지
- "용감한 [캐릭터명]이여"와 같은 직접적 호명

**새벽의 항구 분위기:**
- 바닷바람과 갈매기 울음소리
- 따뜻하지만 신비로운 기운
- 항구 특유의 활기와 소음

**특별 시스템들:**
- 차원 공명 시스템: 플레이어의 감정이 현실에 영향을 미치는 시스템
- 운명의 책 시스템: 모든 중요한 선택이 기록되어 미래에 영향을 미침
- 캐릭터 성장 호칭 시스템: 행동과 선택에 따른 특별한 호칭과 능력 획득
```

---

## 🛠️ 현재 적용 상태

### ✅ **완료된 부분**
- 차원의 균열 세계관 완전 구현
- WorldManager 클래스 완성
- 세계관별 프롬프트 템플릿 시스템
- UI 컴포넌트 (WorldSelector) 생성

### ⏳ **적용 대기 중**
- claudeService.ts에서 새 프롬프트 시스템 연동
- 프론트엔드에서 세계관 선택 UI 통합
- 백엔드-프론트엔드 세계관 동기화

### 🔄 **수동 적용 방법**
현재는 다음과 같이 수동으로 적용할 수 있습니다:

1. **claudeService.ts** 수정:
```typescript
// 기존 generateSystemPrompt 함수를 다음으로 교체
private generateSystemPrompt(character: Character, storyHistory: StoryEvent[]): string {
  // WorldManager를 사용한 동적 프롬프트 생성
  const basePrompt = WorldManager.generateSystemPrompt(character.job, character.level);
  
  // 캐릭터 정보와 스토리 히스토리 추가
  const characterInfo = `
**캐릭터 정보:**
- 이름: ${character.name}
- 직업: ${character.job}
- 레벨: ${character.level}
- 현재 인벤토리: ${character.inventory?.map(item => item.name).join(', ') || '없음'}`;

  const historyContext = storyHistory.length > 0 
    ? `\n\n이전 스토리:\n${storyHistory.map(event => 
        `${event.stageNumber}단계: ${event.content}`
      ).join('\n\n')}`
    : '';

  return `${basePrompt}\n${characterInfo}${historyContext}`;
}
```

---

## 🌟 미래 확장 계획

### **추가될 세계관들**
1. **🤖 사이버펑크 2187** - 네온사인 미래도시
2. **⚙️ 스팀펑크 제국** - 증기기관 빅토리아 시대
3. **🚀 우주 오디세이** - 은하계 탐험 SF

### **고급 기능들**
- 세계관별 BGM 시스템
- 세계관 믹스 모드 (여러 세계관 조합)
- 플레이어 커스텀 세계관 생성 도구
- 세계관별 성과 시스템

---

## 💡 개발 팁

### **세계관 디자인 원칙**
1. **일관성**: 세계관 내 모든 요소가 논리적으로 연결
2. **깊이**: 단순한 배경이 아닌 살아있는 세계
3. **상호작용**: 플레이어 행동이 세계에 영향을 미침
4. **확장성**: 새로운 스토리와 시스템 추가 가능

### **프롬프트 작성 팁**
1. **구체적 묘사**: 5감을 자극하는 생생한 표현
2. **감정적 연결**: 플레이어와 세계 간의 유대감 형성
3. **선택의 무게**: 모든 선택이 의미있는 결과를 가져옴
4. **예상치 못한 반전**: 적절한 타이밍의 놀라움 요소

---

## 🎊 결론

**LLMLIKE의 세계관 시스템**이 완성되었습니다! 

- ✅ **"차원의 균열"** 세계관 완전 구현
- ✅ **확장 가능한 구조** 구축
- ✅ **동적 프롬프트 생성** 시스템
- ✅ **사용자 친화적 UI** 준비

이제 Claude AI에게 **훨씬 더 몰입감 있고 일관된 스토리**를 생성하도록 할 수 있으며, 새로운 세계관들을 쉽게 추가할 수 있습니다!

**🎮 게이머들에게 진정한 RPG 경험을 선사할 준비가 완료되었습니다!** 