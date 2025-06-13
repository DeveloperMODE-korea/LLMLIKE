import { AuthResponse, LoginData, RegisterData, User } from '../types/auth';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AuthService {
  private token: string | null = null;

  constructor() {
    // 로컬 저장소에서 토큰 복원
    this.token = localStorage.getItem('authToken');
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        username: data.username,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '회원가입에 실패했습니다.');
    }

    const authData = result.data;
    this.setToken(authData.token);
    return authData;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || '로그인에 실패했습니다.');
    }

    const authData = result.data;
    this.setToken(authData.token);
    return authData;
  }

  async getProfile(): Promise<User> {
    if (!this.token) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        this.logout();
      }
      throw new Error(result.error || '프로필 조회에 실패했습니다.');
    }

    return result.data;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // API 요청에 사용할 headers 가져오기
  getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }
}

export const authService = new AuthService(); 