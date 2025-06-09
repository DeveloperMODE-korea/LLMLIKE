import { 
  CharacterMemory, 
  MemoryQuery, 
  MemoryResponse,
  NPCEmotion,
  EmotionSummary,
  FactionReputation,
  ReputationSummary,
  SideQuest,
  QuestSummary,
  StoryAnalysis
} from '../types/advancedSystems';

const API_BASE = '/api/advanced';

class AdvancedSystemsService {
  
  // === 1. 캐릭터 메모리 API ===
  
  async addMemory(characterId: string, memoryData: Partial<CharacterMemory>): Promise<CharacterMemory> {
    const response = await fetch(`${API_BASE}/characters/${characterId}/memories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memoryData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add memory');
    }
    
    const result = await response.json();
    return result.memory;
  }
  
  async getMemories(characterId: string, query?: MemoryQuery): Promise<MemoryResponse> {
    const queryParams = new URLSearchParams();
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v.toString()));
          } else {
            queryParams.set(key, value.toString());
          }
        }
      });
    }
    
    const response = await fetch(
      `${API_BASE}/characters/${characterId}/memories?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get memories');
    }
    
    return await response.json();
  }

  // === 2. 감정 시스템 API ===
  
  async updateNPCEmotion(
    characterId: string, 
    npcId: string, 
    emotionUpdate: {
      eventType: string;
      emotionChanges: Record<string, number>;
      description: string;
      context?: string;
    }
  ): Promise<NPCEmotion> {
    const response = await fetch(
      `${API_BASE}/characters/${characterId}/emotions/${npcId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emotionUpdate),
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to update NPC emotion');
    }
    
    const result = await response.json();
    return result.npcEmotion;
  }
  
  async getNPCEmotions(characterId: string): Promise<{ emotions: NPCEmotion[], summary: EmotionSummary }> {
    const response = await fetch(
      `${API_BASE}/characters/${characterId}/emotions`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get NPC emotions');
    }
    
    return await response.json();
  }

  // === 3. 평판 시스템 API ===
  
  async updateReputation(
    characterId: string, 
    factionId: string, 
    reputationUpdate: {
      eventType: string;
      reputationChange: number;
      description: string;
      location?: string;
      npcsInvolved?: string[];
      publicityLevel: string;
    }
  ): Promise<FactionReputation> {
    const response = await fetch(
      `${API_BASE}/characters/${characterId}/reputation/${factionId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reputationUpdate),
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to update reputation');
    }
    
    const result = await response.json();
    return result.reputation;
  }
  
  async getReputations(characterId: string): Promise<{ reputations: FactionReputation[], summary: ReputationSummary }> {
    const response = await fetch(
      `${API_BASE}/characters/${characterId}/reputation`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get reputations');
    }
    
    return await response.json();
  }

  // === 4. 사이드 퀘스트 API ===
  
  async createSideQuest(characterId: string, questData: Partial<SideQuest>): Promise<SideQuest> {
    const response = await fetch(`${API_BASE}/characters/${characterId}/quests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create side quest');
    }
    
    const result = await response.json();
    return result.quest;
  }
  
  async getSideQuests(
    characterId: string, 
    filters?: { status?: string; type?: string }
  ): Promise<{ quests: SideQuest[], summary: QuestSummary }> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.set(key, value);
        }
      });
    }
    
    const response = await fetch(
      `${API_BASE}/characters/${characterId}/quests?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get side quests');
    }
    
    return await response.json();
  }
  
  async updateQuestProgress(
    characterId: string, 
    questId: string, 
    progressUpdate: {
      objectiveId: string;
      progress: number;
    }
  ): Promise<SideQuest> {
    const response = await fetch(
      `${API_BASE}/characters/${characterId}/quests/${questId}/progress`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressUpdate),
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to update quest progress');
    }
    
    const result = await response.json();
    return result.quest;
  }

  // === 5. 스토리 분석 API ===
  
  async analyzeStory(characterId: string): Promise<StoryAnalysis> {
    const response = await fetch(
      `${API_BASE}/characters/${characterId}/story-analysis`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to analyze story');
    }
    
    return await response.json();
  }

  // === 편의 메서드들 ===
  
  // 특정 액션을 메모리에 자동으로 기록
  async recordAction(
    characterId: string, 
    actionType: string, 
    title: string, 
    description: string,
    importance: 'trivial' | 'minor' | 'moderate' | 'major' | 'critical' = 'minor',
    tags: string[] = [],
    npcInvolved?: string[],
    location?: string
  ): Promise<CharacterMemory> {
    return this.addMemory(characterId, {
      eventType: 'action' as any,
      title,
      description,
      importance,
      tags,
      npcInvolved,
      location,
      details: { actionType }
    });
  }
  
  // 대화를 메모리와 감정에 자동으로 기록
  async recordDialogue(
    characterId: string,
    npcId: string,
    npcName: string,
    dialogueTitle: string,
    dialogueContent: string,
    emotionChanges: Record<string, number>,
    importance: 'trivial' | 'minor' | 'moderate' | 'major' | 'critical' = 'minor',
    location?: string
  ): Promise<{ memory: CharacterMemory; emotion: NPCEmotion }> {
    
    // 메모리 기록
    const memory = await this.addMemory(characterId, {
      eventType: 'dialogue' as any,
      title: dialogueTitle,
      description: dialogueContent,
      importance,
      tags: ['dialogue', npcName.toLowerCase()],
      npcInvolved: [npcId],
      location,
      details: { npcName }
    });
    
    // 감정 업데이트
    const emotion = await this.updateNPCEmotion(characterId, npcId, {
      eventType: 'dialogue',
      emotionChanges,
      description: `대화: ${dialogueTitle}`,
      context: location
    });
    
    return { memory, emotion };
  }
  
  // 퀘스트 완료를 모든 시스템에 자동으로 기록
  async recordQuestCompletion(
    characterId: string,
    questTitle: string,
    questDescription: string,
    factionId?: string,
    reputationGain?: number,
    npcsInvolved?: string[],
    location?: string
  ): Promise<{
    memory: CharacterMemory;
    reputation?: FactionReputation;
  }> {
    
    // 메모리 기록
    const memory = await this.addMemory(characterId, {
      eventType: 'achievement' as any,
      title: `퀘스트 완료: ${questTitle}`,
      description: questDescription,
      importance: 'major',
      tags: ['quest', 'completion', factionId].filter(Boolean) as string[],
      npcInvolved: npcsInvolved,
      location,
      details: { questTitle, factionId }
    });
    
    let reputation;
    // 평판 업데이트 (해당하는 경우)
    if (factionId && reputationGain) {
      reputation = await this.updateReputation(characterId, factionId, {
        eventType: 'quest_completion',
        reputationChange: reputationGain,
        description: `퀘스트 완료: ${questTitle}`,
        location,
        npcsInvolved,
        publicityLevel: 'local'
      });
    }
    
    return { memory, reputation };
  }

  // 캐릭터의 모든 고급 시스템 데이터를 한번에 가져오기
  async getCharacterData(characterId: string) {
    try {
      const [memoriesResponse, emotionsResponse, reputationsResponse, questsResponse] = await Promise.all([
        this.getMemories(characterId).catch(() => ({ memories: [], summary: null })),
        this.getNPCEmotions(characterId).catch(() => ({ emotions: [], summary: null })),
        this.getReputations(characterId).catch(() => ({ reputations: [], summary: null })),
        this.getSideQuests(characterId).catch(() => ({ quests: [], summary: null }))
      ]);

      return {
        memories: memoriesResponse.memories || [],
        relationships: emotionsResponse.emotions || [],
        reputations: reputationsResponse.reputations || [],
        sideQuests: questsResponse.quests || []
      };
    } catch (error) {
      console.error('캐릭터 고급 시스템 데이터 로딩 실패:', error);
      return {
        memories: [],
        relationships: [],
        reputations: [],
        sideQuests: []
      };
    }
  }
}

export const advancedSystemsService = new AdvancedSystemsService(); 