// 즉시 실행되는 로그 - 파일이 로드되는지 확인
console.log('🎯 apiService.ts 파일이 로드되었습니다!');
console.log('🕐 현재 시간:', new Date().toLocaleString());

import { authService } from './authService';

// 환경변수 기반 API URL 설정
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/game`
  : 'http://localhost:3001/api/game';
console.log('🔗 API_BASE_URL 설정됨:', API_BASE_URL);

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
    console.log('🚀 API 요청:', url, options);
    
    // 게스트 모드 확인
    const isGuestMode = localStorage.getItem('guestMode') === 'true';
    let headers: Record<string, string> = {};
    
    if (isGuestMode) {
      // 게스트 모드에서는 특별한 헤더 사용
      headers = {
        'Content-Type': 'application/json',
        'X-Guest-Mode': 'true',
      };
    } else {
      headers = {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders(), // 인증 헤더 자동 추가
      };
    }

    const config: RequestInit = {
      headers: {
        ...headers,
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('📡 fetch 요청 시작:', url);
      const response = await fetch(url, config);
      console.log('📨 응답 수신:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📄 응답 데이터:', data);

      // 백엔드가 success/data 구조를 사용하는 경우 처리
      if (data.success !== undefined) {
        if (!data.success) {
          throw new Error(data.message || '알 수 없는 오류가 발생했습니다.');
        }
        return data.data as T;
      }

      // 백엔드가 직접 데이터를 반환하는 경우 처리
      return data as T;
    } catch (error) {
      console.error('❌ API 요청 오류:', error);
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
    stats: any;
    worldId?: string;
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
    characterMemories?: any[];
    npcRelationships?: any[];
    factionReputations?: any[];
    activeSideQuests?: any[];
    gameContext?: any;
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

  // 새로운 게임 상태 관리 메서드들
  async saveGameState(data: {
    characterId: string;
    gameState: any;
  }): Promise<any> {
    return this.request('/gamestate/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async loadGameState(characterId: string): Promise<any> {
    return this.request(`/gamestate/load/${characterId}`);
  }

  async getUserCharacters(): Promise<any> {
    return this.request('/characters');
  }
}

export const apiService = new ApiService(); 