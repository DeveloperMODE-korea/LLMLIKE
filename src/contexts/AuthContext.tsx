import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginData, RegisterData } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true, // 초기화 중에는 로딩 상태로 설정
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 앱 시작 시 토큰 확인
  useEffect(() => {
    const initializeAuth = async () => {
      // 게스트 모드 확인
      const isGuestMode = localStorage.getItem('guestMode') === 'true';
      if (isGuestMode) {
        const guestUser = {
          id: 'guest',
          email: 'guest@example.com',
          username: 'Guest User'
        };
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: guestUser, token: 'guest-token' } 
        });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      const token = authService.getToken();
      if (token) {
        try {
          const user = await authService.getProfile();
          
          // 기존 로그인된 사용자라면 게스트 모드 플래그 제거
          localStorage.removeItem('guestMode');
          console.log('🔄 기존 로그인 토큰 검증 성공! 게스트 모드 플래그 제거됨');
          
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user, token } 
          });
        } catch (error) {
          console.log('토큰 검증 실패, 로그아웃 처리:', error);
          // 토큰이 유효하지 않으면 로그아웃
          authService.logout();
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        // 토큰이 없으면 로그아웃 상태로 설정
        dispatch({ type: 'LOGOUT' });
      }
      
      // 초기화 완료 후 로딩 상태 해제
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const result = await authService.login(data);
      
      // 로그인 성공 시 게스트 모드 플래그 제거
      localStorage.removeItem('guestMode');
      console.log('🎉 로그인 성공! 게스트 모드 플래그 제거됨');
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: result.user, token: result.token } 
      });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : '로그인에 실패했습니다.' 
      });
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const result = await authService.register(data);
      
      // 회원가입 성공 시 게스트 모드 플래그 제거
      localStorage.removeItem('guestMode');
      console.log('🎉 회원가입 성공! 게스트 모드 플래그 제거됨');
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: result.user, token: result.token } 
      });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : '회원가입에 실패했습니다.' 
      });
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider 
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 