import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';
import { Character, StoryEvent } from '../types/game';

const prisma = new PrismaClient();

interface StoryGenerationRequest {
  character: Character;
  currentStage: number;
  storyHistory: StoryEvent[];
  userChoice?: string;
}

interface StoryGenerationResponse {
  content: string;
  choices: {
    id: number;
    text: string;
    consequence?: string;
  }[];
  type: '이야기' | '전투' | '보물' | '상점' | '휴식';
  enemyId?: string;
  characterChanges?: {
    health?: number;
    mana?: number;
    gold?: number;
    experience?: number;
    newItems?: any[];
    newSkills?: {
      name: string;
      description: string;
      manaCost: number;
      damage?: number;
      healing?: number;
      effects?: any;
    }[];
  };
}

export class ClaudeService {
  private getAnthropicClient(): Anthropic {
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY 환경변수가 설정되지 않았습니다. .env 파일에 Claude API 키를 설정해주세요.');
    }
    
    return new Anthropic({
      apiKey: apiKey,
    });
  }

  // 더 이상 사용자별 API 키를 사용하지 않음
  async getUserApiKey(userId: string): Promise<string | null> {
    return process.env.CLAUDE_API_KEY || null;
  }

  // 더 이상 사용자별 API 키를 저장하지 않음 (호환성을 위해 유지)
  async setUserApiKey(userId: string, apiKey: string): Promise<void> {
    // 공통 API 키 사용으로 인해 더 이상 필요하지 않음
    console.log('공통 API 키를 사용합니다. 사용자별 API 키 설정은 무시됩니다.');
  }

  private generateSystemPrompt(character: Character, storyHistory: StoryEvent[]): string {
    const historyContext = storyHistory.length > 0 
      ? `\n\n이전 스토리:\n${storyHistory.map(event => 
          `${event.stageNumber}단계: ${event.content}\n선택: ${event.selectedChoice !== undefined ? event.choices[event.selectedChoice]?.text : '없음'}\n결과: ${event.result || '진행중'}`
        ).join('\n\n')}`
      : '';

    return `당신은 텍스트 로그라이크 RPG의 게임 마스터입니다.

**캐릭터 정보:**
- 이름: ${character.name}
- 직업: ${character.job}
- 레벨: ${character.level}
- 체력: ${character.health}/${character.maxHealth}
- 마나: ${character.mana}/${character.maxMana}
- 힘: ${character.strength}, 지능: ${character.intelligence}, 민첩: ${character.dexterity}, 체질: ${character.constitution}
- 골드: ${character.gold}
- 경험치: ${character.experience}

**게임 규칙:**
1. 매 턴마다 흥미진진한 이야기를 생성해주세요
2. 플레이어에게 2-4개의 선택지를 제공해주세요
3. 이벤트 타입: 이야기, 전투, 보물, 상점, 휴식 중 하나
4. 캐릭터의 직업과 능력치를 고려한 이벤트 생성
5. 100단계까지 진행되는 장대한 모험
6. 한국어로 응답해주세요
7. **중요**: 스킬 사용, 전투, 휴식 등으로 캐릭터 상태가 변한다면 characterChanges에 반드시 포함해주세요!

**레벨업 시스템:**
- 경험치가 (현재 레벨 × 100)에 도달하면 자동으로 레벨업됩니다
- 현재 경험치: ${character.experience}/${character.level * 100}
- 레벨업까지 필요한 경험치: ${(character.level * 100) - character.experience}
- **주의**: 레벨업은 백엔드에서 자동 처리되므로 characterChanges에서 level은 변경하지 마세요

**경험치 획득 가이드:**
- 몬스터 처치: 10-30 경험치
- 퀘스트 완료: 20-50 경험치
- 특별한 발견: 15-25 경험치
- 어려운 상황 해결: 25-40 경험치
- **중요**: 경험치는 절대로 감소하지 않습니다! 현재 경험치(${character.experience})보다 높은 값만 설정하세요

**스킬 시스템:**
- 현재 보유 스킬: ${character.skills.map(skill => `${skill.name}(${skill.manaCost} MP)`).join(', ') || '없음'}
- 스킬 습득: 상점에서 구매, 트레이너에게 학습, 특별한 이벤트로 획득 가능
- 스킬 사용: 마나 소모로 강력한 효과 발동

**새로운 스킬 추가 시:**
- newSkills 배열에 스킬 정보 포함
- 예시: "newSkills": [{"name": "마법 화살", "description": "기본적인 마법 공격", "manaCost": 8, "damage": 25}]

**스킬 비용:**
- 화염구: 10 MP
- 얼음화살: 8 MP
- 치유술: 12 MP
- 번개 화살: 15 MP

**캐릭터 상태 변경 계산 규칙:**
- 현재 체력: ${character.health}/${character.maxHealth}
- 현재 마나: ${character.mana}/${character.maxMana}
- 현재 골드: ${character.gold}
- 현재 경험치: ${character.experience}

**응답 형식 (JSON):**
{
  "content": "이야기 내용 (200-400자)",
  "choices": [
    {"id": 1, "text": "선택지 1"},
    {"id": 2, "text": "선택지 2"},
    {"id": 3, "text": "선택지 3"}
  ],
  "type": "이야기|전투|보물|상점|휴식",
  "enemyId": "적이 있을 경우 적 ID (옵션)",
  "characterChanges": {
    "health": 새로운_체력값,
    "mana": 새로운_마나값,
    "gold": 새로운_골드값,
    "experience": 새로운_경험치값,
    "newItems": ["새로운 아이템들"],
    "newSkills": [
      {
        "name": "스킬명",
        "description": "스킬 설명",
        "manaCost": 마나_소모량,
        "damage": 공격력(옵션),
        "healing": 치유량(옵션),
        "effects": {"특수효과": "값"}
      }
    ]
  }
}

**characterChanges 계산 예시:**
- 25 HP 피해를 받았다면: "health": ${Math.max(0, character.health - 25)}
- 10 MP 마나를 사용했다면: "mana": ${Math.max(0, character.mana - 10)}
- 20 골드를 얻었다면: "gold": ${character.gold + 20}
- 15 경험치를 얻었다면: "experience": ${character.experience + 15}
- 휴식으로 마나 회복(+10): "mana": ${Math.min(character.maxMana, character.mana + 10)}

**중요한 주의사항:**
- 변경된 수치만 포함하세요 (변경되지 않았다면 해당 필드 생략)
- health는 0 이하로 떨어질 수 없고, ${character.maxHealth}를 초과할 수 없습니다
- mana는 0 이하로 떨어질 수 없고, ${character.maxMana}를 초과할 수 없습니다
- 골드와 경험치는 0 이하로 떨어질 수 없습니다
- 정확한 수치 계산을 위해 현재 값에서 변화량을 더하거나 빼서 새로운 값을 구하세요${historyContext}

다음 단계의 이야기를 생성해주세요.`;
  }

  async generateStory(request: StoryGenerationRequest, userId: string): Promise<StoryGenerationResponse> {
    // 공통 API 키 사용
    const anthropic = this.getAnthropicClient();
    const systemPrompt = this.generateSystemPrompt(request.character, request.storyHistory);

    let userMessage = `현재 ${request.currentStage + 1}단계입니다.`;
    
    if (request.userChoice) {
      userMessage += ` 플레이어가 "${request.userChoice}"를 선택했습니다.`;
    }

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1000,
        temperature: 0.8,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Claude API로부터 예상치 못한 응답 형식을 받았습니다.');
      }

      // JSON 파싱
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Claude API 응답에서 JSON을 찾을 수 없습니다.');
      }

      const parsedResponse: StoryGenerationResponse = JSON.parse(jsonMatch[0]);
      
      // 유효성 검사
      if (!parsedResponse.content || !parsedResponse.choices || !parsedResponse.type) {
        throw new Error('Claude API 응답 형식이 올바르지 않습니다.');
      }

      return parsedResponse;

    } catch (error) {
      console.error('Claude API 오류:', error);
      
      if (error instanceof Error) {
        throw new Error(`Claude API 요청 실패: ${error.message}`);
      }
      
      throw new Error('Claude API 요청 중 알 수 없는 오류가 발생했습니다.');
    }
  }

  async testApiKey(apiKey?: string): Promise<boolean> {
    try {
      // 공통 API 키 사용
      const anthropic = this.getAnthropicClient();
      
      await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 10,
        messages: [
          {
            role: 'user',
            content: 'Test message'
          }
        ]
      });

      return true;
    } catch (error) {
      console.error('API 키 테스트 실패:', error);
      return false;
    }
  }
}

export const claudeService = new ClaudeService(); 