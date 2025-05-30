const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/game';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!data.success) {
        throw new Error(data.message || '알 수 없는 오류가 발생했습니다.');
      }

      return data.data as T;
    } catch (error) {
      console.error('API 요청 오류:', error);
      throw error;
    }
  }

  // API 키 관리
  async setApiKey(apiKey: string): Promise<void> {
    return this.request('/api-key/set', {
      method: 'POST',
      body: JSON.stringify({ apiKey }),
    });
  }

  async checkApiKey(): Promise<{ hasApiKey: boolean }> {
    return this.request('/api-key/check');
  }

  async testApiKey(apiKey: string): Promise<{ isValid: boolean }> {
    return this.request('/api-key/test', {
      method: 'POST',
      body: JSON.stringify({ apiKey }),
    });
  }

  // 캐릭터 관리
  async createCharacter(characterData: {
    name: string;
    job: string;
    stats: {
      health: number;
      mana: number;
      strength: number;
      intelligence: number;
      dexterity: number;
      constitution: number;
    };
  }): Promise<any> {
    return this.request('/character', {
      method: 'POST',
      body: JSON.stringify(characterData),
    });
  }

  // 게임 상태 관리
  async getGameState(characterId: string): Promise<any> {
    return this.request(`/gamestate/${characterId}`);
  }

  // 스토리 생성
  async generateStory(data: {
    characterId: string;
    userChoice?: string;
  }): Promise<any> {
    return this.request('/story/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 선택지 제출
  async submitChoice(data: {
    storyEventId: string;
    choiceId: number;
  }): Promise<any> {
    return this.request('/choice/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 헬스 체크
  async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL.replace('/api/game', '')}/health`);
    return response.json();
  }
}

export const apiService = new ApiService(); 