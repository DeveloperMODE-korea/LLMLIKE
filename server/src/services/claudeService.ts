import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';
import { Character, StoryEvent, GameState } from '../types/game';

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
}

export class ClaudeService {
  private getAnthropicClient(apiKey: string): Anthropic {
    return new Anthropic({
      apiKey: apiKey,
    });
  }

  async getUserApiKey(userId: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { claudeApiKey: true }
    });
    
    return user?.claudeApiKey || process.env.DEFAULT_CLAUDE_API_KEY || null;
  }

  async setUserApiKey(userId: string, apiKey: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { claudeApiKey: apiKey }
    });
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

**응답 형식 (JSON):**
{
  "content": "이야기 내용 (200-400자)",
  "choices": [
    {"id": 1, "text": "선택지 1"},
    {"id": 2, "text": "선택지 2"},
    {"id": 3, "text": "선택지 3"}
  ],
  "type": "이야기|전투|보물|상점|휴식",
  "enemyId": "적이 있을 경우 적 ID (옵션)"
}${historyContext}

다음 단계의 이야기를 생성해주세요.`;
  }

  async generateStory(request: StoryGenerationRequest, userId: string): Promise<StoryGenerationResponse> {
    const apiKey = await this.getUserApiKey(userId);
    
    if (!apiKey) {
      throw new Error('Claude API 키가 설정되지 않았습니다. API 키를 먼저 설정해주세요.');
    }

    const anthropic = this.getAnthropicClient(apiKey);
    const systemPrompt = this.generateSystemPrompt(request.character, request.storyHistory);

    let userMessage = `현재 ${request.currentStage + 1}단계입니다.`;
    
    if (request.userChoice) {
      userMessage += ` 플레이어가 "${request.userChoice}"를 선택했습니다.`;
    }

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
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

  async testApiKey(apiKey: string): Promise<boolean> {
    try {
      const anthropic = this.getAnthropicClient(apiKey);
      
      await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
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