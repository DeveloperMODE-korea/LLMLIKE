import React, { useCallback } from 'react';
import { Shield, Settings } from 'lucide-react';
import { useGameState, useAdminMode, useGameActions } from '../stores/gameStore';
import { AdminUser } from '../types/admin';
import WorldManager from '../data/worldSettings';

interface AppLayoutProps {
  children: React.ReactNode;
  adminUser: AdminUser | null;
  onAdminLogin: (user: AdminUser) => void;
  onAdminLogout: () => void;
}

/**
 * AppLayout component containing header, footer and main layout structure
 * Extracted from App.tsx for better separation of concerns
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  adminUser,
  onAdminLogin,
  onAdminLogout
}) => {
  const gameState = useGameState();
  const isAdminMode = useAdminMode();
  const { setAdminMode } = useGameActions();

  const handleAdminToggle = useCallback(() => {
    if (!isAdminMode) {
      const password = prompt('관리자 비밀번호를 입력하세요:');
      if (password === 'admin123') {
        const admin: AdminUser = {
          id: '1',
          username: 'admin',
          email: 'admin@rpg.com',
          role: 'super_admin',
          permissions: [],
          lastLogin: new Date(),
          isActive: true
        };
        onAdminLogin(admin);
        setAdminMode(true);
      } else if (password !== null) {
        alert('잘못된 비밀번호입니다.');
      }
    } else {
      onAdminLogout();
      setAdminMode(false);
    }
  }, [isAdminMode, onAdminLogin, onAdminLogout, setAdminMode]);

  return (
    <div className="min-h-screen bg-animated text-gray-100 flex flex-col">
      {/* Header */}
      <header className="relative bg-slate-900/90 backdrop-blur-xl border-b border-purple-500/30 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-blue-600/10"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between p-4">
            
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <h1 className="text-4xl font-bold neon-text">
                  LLM<span className="text-yellow-400 text-glow">LIKE</span>
                </h1>
                <p className="text-purple-200 text-sm font-medium">AI가 만드는 텍스트 로그라이크 어드벤처</p>
              </div>
              
              {/* World Display */}
              {gameState?.worldId && (
                <div className="glass-effect px-4 py-2 rounded-xl border border-purple-500/30">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-200 font-medium text-sm">
                      🌍 {WorldManager.getCurrentWorld().name}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Admin Button */}
            <div className="flex items-center space-x-3">
              {!isAdminMode ? (
                <button
                  onClick={handleAdminToggle}
                  className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600/80 to-purple-700/80 hover:from-purple-500 hover:to-purple-600 px-4 py-2 rounded-xl transition-all duration-300 border border-purple-500/30 hover:border-purple-400/50 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  title="관리자 모드"
                >
                  <Shield className="w-4 h-4 group-hover:animate-pulse" />
                  <span className="font-medium">관리자</span>
                </button>
              ) : (
                <button
                  onClick={handleAdminToggle}
                  className="group flex items-center space-x-2 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-500 hover:to-red-600 px-4 py-2 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-400/50 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  title="게임 모드로 돌아가기"
                >
                  <Settings className="w-4 h-4 group-hover:animate-spin" />
                  <span className="font-medium">게임 모드</span>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-60"></div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative bg-slate-900/90 backdrop-blur-xl border-t border-purple-500/30 shadow-2xl mt-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5"></div>
        
        <div className="container mx-auto relative z-10 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            
            {/* Copyright Info */}
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-300 font-medium">
                © 2025 <span className="text-purple-400 font-bold">LLMLIKE</span>
              </p>
              <p className="text-sm text-gray-400">
                Claude API 기반 텍스트 로그라이크 어드벤처
              </p>
            </div>
            
            {/* Status Display */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">AI 서비스 운영 중</span>
              </div>
              
              {gameState && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">게임 진행 중</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 opacity-60"></div>
      </footer>
    </div>
  );
};

export default AppLayout; 