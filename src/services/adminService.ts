const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AdminService {
  private async fetchAPI(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}/admin${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API 요청 실패: ${response.status}`);
    }

    return response.json();
  }

  // 대시보드 통계 조회
  async getDashboardStats() {
    const data = await this.fetchAPI('/dashboard/stats');
    
    // 날짜 문자열을 Date 객체로 안전하게 변환
    if (data.recentAlerts && Array.isArray(data.recentAlerts)) {
      data.recentAlerts = data.recentAlerts.map((alert: any) => ({
        ...alert,
        timestamp: alert.timestamp ? new Date(alert.timestamp) : new Date()
      }));
    } else {
      data.recentAlerts = [];
    }
    
    if (data.recentPlayers && Array.isArray(data.recentPlayers)) {
      data.recentPlayers = data.recentPlayers.map((player: any) => ({
        ...player,
        lastActive: player.lastActive ? new Date(player.lastActive) : new Date(),
        joinDate: player.joinDate ? new Date(player.joinDate) : new Date()
      }));
    } else {
      data.recentPlayers = [];
    }
    
    return data;
  }

  // 플레이어 목록 조회
  async getPlayers() {
    const data = await this.fetchAPI('/players');
    
    // 빈 배열이거나 배열이 아닌 경우 안전하게 처리
    if (!Array.isArray(data)) {
      return [];
    }
    
    // 날짜 문자열을 Date 객체로 안전하게 변환
    return data.map((player: any) => ({
      ...player,
      lastActive: player.lastActive ? new Date(player.lastActive) : new Date(),
      joinDate: player.joinDate ? new Date(player.joinDate) : new Date()
    }));
  }

  // 플레이어 정보 수정
  async updatePlayer(id: string, data: { level?: number; experience?: number; gold?: number; status?: string }) {
    return this.fetchAPI(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // 플레이어 차단/정지
  async banPlayer(id: string, action: 'ban' | 'suspend' | 'unban', reason?: string) {
    return this.fetchAPI(`/players/${id}/ban`, {
      method: 'POST',
      body: JSON.stringify({ action, reason }),
    });
  }

  // 콘텐츠 목록 조회
  async getContent(type: 'story' | 'quest' | 'npc' | 'item') {
    return this.fetchAPI(`/content/${type}`);
  }

  // 콘텐츠 생성
  async createContent(data: { type: string; title: string; description: string; difficulty?: string }) {
    return this.fetchAPI('/content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 콘텐츠 상태 변경
  async updateContentStatus(type: string, id: string, status: string) {
    return this.fetchAPI(`/content/${type}/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // 콘텐츠 삭제
  async deleteContent(type: string, id: string) {
    return this.fetchAPI(`/content/${type}/${id}`, {
      method: 'DELETE',
    });
  }

  // 게임 설정 조회
  async getGameSettings() {
    return this.fetchAPI('/settings');
  }

  // 게임 설정 업데이트
  async updateGameSettings(settings: any) {
    return this.fetchAPI('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

export const adminService = new AdminService(); 