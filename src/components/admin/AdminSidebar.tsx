import React from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Server, 
  Settings, 
  Shield, 
  Bell,
  ChevronRight,
  Activity,
  Database,
  Globe,
  Gamepad2
} from 'lucide-react';
import { AdminUser } from '../../types/admin';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: 'overview' | 'players' | 'content' | 'system' | 'settings') => void;
  adminUser: AdminUser;
  notifications: number;
}

interface MenuItem {
  id: 'overview' | 'players' | 'content' | 'system' | 'settings';
  label: string;
  icon: React.ReactNode;
  description: string;
  badge?: number;
  requiresPermission?: string;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  activeTab, 
  onTabChange, 
  adminUser, 
  notifications 
}) => {
  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      label: '대시보드',
      icon: <BarChart3 className="w-5 h-5" />,
      description: '전체 현황 및 통계'
    },
    {
      id: 'players',
      label: '플레이어 관리',
      icon: <Users className="w-5 h-5" />,
      description: '사용자 계정 및 캐릭터 관리',
      requiresPermission: 'players'
    },
    {
      id: 'content',
      label: '콘텐츠 관리',
      icon: <FileText className="w-5 h-5" />,
      description: '스토리, 퀘스트, NPC 편집',
      requiresPermission: 'content'
    },
    {
      id: 'system',
      label: '시스템 모니터링',
      icon: <Server className="w-5 h-5" />,
      description: '서버 상태 및 성능 모니터링',
      badge: notifications,
      requiresPermission: 'system'
    },
    {
      id: 'settings',
      label: '설정',
      icon: <Settings className="w-5 h-5" />,
      description: '게임 설정 및 관리자 권한',
      requiresPermission: 'settings'
    }
  ];

  const hasPermission = (permission?: string): boolean => {
    if (!permission) return true;
    if (adminUser.role === 'super_admin') return true;
    
    return adminUser.permissions.some(p => 
      p.resource === permission && p.actions.includes('read')
    );
  };

  const getMenuItemClasses = (item: MenuItem): string => {
    const baseClasses = "flex items-center justify-between p-3 rounded-lg transition-all duration-200 group cursor-pointer";
    const isActive = activeTab === item.id;
    const hasAccess = hasPermission(item.requiresPermission);
    
    if (!hasAccess) {
      return `${baseClasses} opacity-50 cursor-not-allowed`;
    }
    
    if (isActive) {
      return `${baseClasses} bg-purple-600 text-white shadow-lg`;
    }
    
    return `${baseClasses} text-gray-300 hover:bg-slate-700 hover:text-white`;
  };

  const handleMenuClick = (item: MenuItem) => {
    if (hasPermission(item.requiresPermission)) {
      onTabChange(item.id);
    }
  };

  return (
    <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
      {/* 로고 및 제목 */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">RPG Admin</h2>
            <p className="text-xs text-gray-400">관리자 콘솔</p>
          </div>
        </div>
      </div>

      {/* 관리자 정보 */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">{adminUser.username}</p>
            <p className="text-xs text-gray-400 capitalize">{adminUser.role.replace('_', ' ')}</p>
          </div>
          <div className="text-green-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <div 
                className={getMenuItemClasses(item)}
                onClick={() => handleMenuClick(item)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.label}
                    </p>
                    <p className="text-xs opacity-75 truncate">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.badge && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                  {activeTab === item.id && (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </div>
              
              {!hasPermission(item.requiresPermission) && (
                <p className="text-xs text-red-400 ml-8 mt-1">
                  권한이 필요합니다
                </p>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* 시스템 정보 */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-300">시스템 상태</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">온라인</span>
            </div>
          </div>
          
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>서버 가동시간</span>
              <span>99.9%</span>
            </div>
            <div className="flex justify-between">
              <span>활성 사용자</span>
              <span>89명</span>
            </div>
            <div className="flex justify-between">
              <span>메모리 사용량</span>
              <span>67.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="p-4 border-t border-slate-700">
        <h3 className="text-xs font-medium text-gray-300 mb-2">빠른 액션</h3>
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-xs text-center transition-colors">
            <Database className="w-4 h-4 mx-auto mb-1" />
            백업
          </button>
          <button className="bg-slate-700 hover:bg-slate-600 p-2 rounded text-xs text-center transition-colors">
            <Globe className="w-4 h-4 mx-auto mb-1" />
            배포
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar; 