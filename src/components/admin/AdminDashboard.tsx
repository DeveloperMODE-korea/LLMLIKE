import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Server, 
  FileText, 
  Settings, 
  BarChart3, 
  Shield, 
  Bell, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { AdminDashboardData, AdminUser } from '../../types/admin';
import { adminService } from '../../services/adminService';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './DashboardOverview';
import PlayerManagement from './PlayerManagement';
import ContentManagement from './ContentManagement';
import SystemMonitoring from './SystemMonitoring';
import SettingsPanel from './SettingsPanel';

interface AdminDashboardProps {
  adminUser: AdminUser;
  onLogout: () => void;
}

type ActiveTab = 'overview' | 'players' | 'content' | 'system' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(0);

  // 모든 필요한 데이터를 가져오는 함수
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출 (AdminService에서 날짜 변환 처리됨)
      const dashboardData = await adminService.getDashboardStats();
      
      // 안전한 배열 처리와 날짜 재검증
      if (!dashboardData.recentAlerts || !Array.isArray(dashboardData.recentAlerts)) {
        dashboardData.recentAlerts = [];
      } else {
        // 날짜가 제대로 변환되었는지 재확인
        dashboardData.recentAlerts = dashboardData.recentAlerts.map((alert: any) => ({
          ...alert,
          timestamp: alert.timestamp instanceof Date ? alert.timestamp : new Date(alert.timestamp || new Date())
        }));
      }
      
      if (!dashboardData.recentPlayers || !Array.isArray(dashboardData.recentPlayers)) {
        dashboardData.recentPlayers = [];
      } else {
        // 날짜가 제대로 변환되었는지 재확인
        dashboardData.recentPlayers = dashboardData.recentPlayers.map((player: any) => ({
          ...player,
          lastActive: player.lastActive instanceof Date ? player.lastActive : new Date(player.lastActive || new Date()),
          joinDate: player.joinDate instanceof Date ? player.joinDate : new Date(player.joinDate || new Date())
        }));
      }
      
      setDashboardData(dashboardData);
      setNotifications(dashboardData.recentAlerts.filter((alert: any) => !alert.isRead).length);
    } catch (error) {
      console.error('대시보드 데이터 로딩 실패:', error);
      
      // 에러 발생 시 기본 데이터 제공
      const fallbackData: AdminDashboardData = {
        playerStats: {
          totalPlayers: 0,
          activePlayers: 0,
          newPlayersToday: 0,
          averageSessionTime: 0,
          totalSessions: 0
        },
        serverStats: {
          uptime: 99.9,
          cpuUsage: 0,
          memoryUsage: 0,
          activeConnections: 0,
          requestsPerSecond: 0,
          errorRate: 0
        },
        contentStats: {
          totalStories: 0,
          totalQuests: 0,
          totalNPCs: 0,
          totalItems: 0,
          popularStoryPaths: [],
          questCompletionRates: []
        },
        recentAlerts: [
          { id: '1', type: 'error', message: '대시보드 데이터를 불러올 수 없습니다', timestamp: new Date(), isRead: false, severity: 'high' }
        ],
        recentPlayers: [],
        systemHealth: 'warning'
      };
      
      setDashboardData(fallbackData);
      setNotifications(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // 30초마다 데이터 새로고침
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSystemHealthColor = () => {
    if (!dashboardData) return 'text-gray-400';
    switch (dashboardData.systemHealth) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSystemHealthIcon = () => {
    if (!dashboardData) return <Activity className="w-4 h-4" />;
    switch (dashboardData.systemHealth) {
      case 'healthy': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <XCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const renderActiveTabContent = () => {
    if (loading || !dashboardData) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">데이터를 불러오는 중...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <DashboardOverview data={dashboardData} onRefresh={fetchDashboardData} />;
      case 'players':
        return <PlayerManagement data={dashboardData} onRefresh={fetchDashboardData} />;
      case 'content':
        return <ContentManagement data={dashboardData} onRefresh={fetchDashboardData} />;
      case 'system':
        return <SystemMonitoring data={dashboardData} onRefresh={fetchDashboardData} />;
      case 'settings':
        return <SettingsPanel adminUser={adminUser} onRefresh={fetchDashboardData} />;
      default:
        return <DashboardOverview data={dashboardData} onRefresh={fetchDashboardData} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* 사이드바 */}
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        adminUser={adminUser}
        notifications={notifications}
      />
      
      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 헤더 */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">관리자 대시보드</h1>
            <div className={`flex items-center space-x-2 ${getSystemHealthColor()}`}>
              {getSystemHealthIcon()}
              <span className="text-sm font-medium">시스템 상태: {dashboardData?.systemHealth || '확인 중'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* 알림 버튼 */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
            
            {/* 사용자 정보 */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{adminUser.username}</p>
                <p className="text-xs text-gray-400">{adminUser.role}</p>
              </div>
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
            </div>
            
            {/* 로그아웃 버튼 */}
            <button 
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              로그아웃
            </button>
          </div>
        </header>
        
        {/* 콘텐츠 영역 */}
        <main className="flex-1 overflow-hidden bg-slate-900">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard; 