import React from 'react';
import { 
  Users, 
  Activity, 
  FileText, 
  Server, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Star,
  Trophy,
  Target
} from 'lucide-react';
import { AdminDashboardData } from '../../types/admin';

interface DashboardOverviewProps {
  data: AdminDashboardData;
  onRefresh: () => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data, onRefresh }) => {
  const formatUptime = (uptime: number): string => {
    return `${uptime}%`;
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}시간 ${mins}분`;
  };

  const getHealthStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color?: string;
  }> = ({ title, value, subtitle, icon, trend, trendValue, color = 'purple' }) => {
    const colorClasses = {
      purple: 'bg-purple-900/20 border-purple-500/20 text-purple-300',
      blue: 'bg-blue-900/20 border-blue-500/20 text-blue-300',
      green: 'bg-green-900/20 border-green-500/20 text-green-300',
      red: 'bg-red-900/20 border-red-500/20 text-red-300',
      yellow: 'bg-yellow-900/20 border-yellow-500/20 text-yellow-300'
    }[color] || 'bg-purple-900/20 border-purple-500/20 text-purple-300';

    return (
      <div className={`p-4 rounded-lg border ${colorClasses}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {icon}
            <h3 className="text-sm font-medium text-gray-300">{title}</h3>
          </div>
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 text-xs ${
              trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
               trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-white">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">대시보드 개요</h1>
          <p className="text-gray-400">실시간 시스템 현황과 통계</p>
        </div>
        <button 
          onClick={onRefresh}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>새로고침</span>
        </button>
      </div>

      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="총 플레이어"
          value={data.playerStats.totalPlayers.toLocaleString()}
          subtitle="등록된 사용자"
          icon={<Users className="w-5 h-5" />}
          trend="up"
          trendValue="+12%"
          color="blue"
        />
        <StatCard
          title="활성 플레이어"
          value={data.playerStats.activePlayers}
          subtitle="현재 온라인"
          icon={<Activity className="w-5 h-5" />}
          trend="up"
          trendValue="+5%"
          color="green"
        />
        <StatCard
          title="신규 가입자"
          value={data.playerStats.newPlayersToday}
          subtitle="오늘"
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
          trendValue="+23%"
          color="purple"
        />
        <StatCard
          title="서버 가동률"
          value={formatUptime(data.serverStats.uptime)}
          subtitle="지난 30일"
          icon={<Server className="w-5 h-5" />}
          trend="neutral"
          color="green"
        />
      </div>

      {/* 서버 상태 및 성능 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 서버 메트릭 */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Server className="w-5 h-5 mr-2" />
            서버 성능
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">CPU 사용률</span>
                <span className="text-sm font-medium text-white">{data.serverStats.cpuUsage}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${data.serverStats.cpuUsage}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">메모리 사용률</span>
                <span className="text-sm font-medium text-white">{data.serverStats.memoryUsage}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    data.serverStats.memoryUsage > 80 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                    data.serverStats.memoryUsage > 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                    'bg-gradient-to-r from-green-500 to-green-400'
                  }`}
                  style={{ width: `${data.serverStats.memoryUsage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{data.serverStats.activeConnections}</p>
                <p className="text-xs text-gray-400">활성 연결</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{data.serverStats.requestsPerSecond.toFixed(1)}</p>
                <p className="text-xs text-gray-400">요청/초</p>
              </div>
            </div>
          </div>
        </div>

        {/* 게임 콘텐츠 통계 */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            콘텐츠 통계
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{data.contentStats.totalStories}</p>
              <p className="text-xs text-gray-400">스토리</p>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{data.contentStats.totalQuests}</p>
              <p className="text-xs text-gray-400">퀘스트</p>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{data.contentStats.totalNPCs}</p>
              <p className="text-xs text-gray-400">NPC</p>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-white">{data.contentStats.totalItems}</p>
              <p className="text-xs text-gray-400">아이템</p>
            </div>
          </div>
        </div>
      </div>

      {/* 인기 콘텐츠 및 최근 알림 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 인기 스토리 */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            인기 스토리
          </h2>
          <div className="space-y-3">
            {data.contentStats.popularStoryPaths.slice(0, 5).map((story, index) => (
              <div key={story.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white truncate">{story.title}</p>
                    <p className="text-xs text-gray-400">{story.playCount}회 플레이</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">{story.averageRating}</span>
                  </div>
                  <p className="text-xs text-gray-400">{story.completionRate}% 완료</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 알림 */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            최근 알림
          </h2>
          <div className="space-y-3">
            {data.recentAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 bg-slate-700 rounded-lg">
                <div className={`mt-0.5 ${
                  alert.type === 'error' ? 'text-red-400' :
                  alert.type === 'warning' ? 'text-yellow-400' :
                  alert.type === 'success' ? 'text-green-400' :
                  'text-blue-400'
                }`}>
                  {alert.type === 'error' ? <AlertTriangle className="w-4 h-4" /> :
                   alert.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                   alert.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                   <Activity className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{alert.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {(alert.timestamp instanceof Date ? alert.timestamp : new Date(alert.timestamp)).toLocaleTimeString()}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      alert.severity === 'critical' ? 'bg-red-900 text-red-300' :
                      alert.severity === 'high' ? 'bg-orange-900 text-orange-300' :
                      alert.severity === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-blue-900 text-blue-300'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview; 