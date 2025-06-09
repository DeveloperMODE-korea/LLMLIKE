import React from 'react';
import { 
  Server, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Zap,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { AdminDashboardData } from '../../types/admin';

interface SystemMonitoringProps {
  data: AdminDashboardData;
  onRefresh: () => void;
}

const SystemMonitoring: React.FC<SystemMonitoringProps> = ({ data, onRefresh }) => {
  const getHealthColor = (value: number, thresholds: { warning: number; critical: number }): string => {
    if (value >= thresholds.critical) return 'text-red-400';
    if (value >= thresholds.warning) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getHealthIcon = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return <AlertTriangle className="w-4 h-4" />;
    if (value >= thresholds.warning) return <Clock className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">시스템 모니터링</h1>
          <p className="text-gray-400">서버 상태 및 성능 모니터링</p>
        </div>
        <button 
          onClick={onRefresh}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
        >
          새로고침
        </button>
      </div>

      {/* 시스템 상태 개요 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">CPU 사용률</p>
              <p className={`text-2xl font-bold ${getHealthColor(data.serverStats.cpuUsage, { warning: 70, critical: 85 })}`}>
                {data.serverStats.cpuUsage}%
              </p>
            </div>
            <div className={getHealthColor(data.serverStats.cpuUsage, { warning: 70, critical: 85 })}>
              <Cpu className="w-8 h-8" />
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                data.serverStats.cpuUsage >= 85 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                data.serverStats.cpuUsage >= 70 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                'bg-gradient-to-r from-green-500 to-green-400'
              }`}
              style={{ width: `${data.serverStats.cpuUsage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">메모리 사용률</p>
              <p className={`text-2xl font-bold ${getHealthColor(data.serverStats.memoryUsage, { warning: 75, critical: 90 })}`}>
                {data.serverStats.memoryUsage}%
              </p>
            </div>
            <div className={getHealthColor(data.serverStats.memoryUsage, { warning: 75, critical: 90 })}>
              <HardDrive className="w-8 h-8" />
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                data.serverStats.memoryUsage >= 90 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                data.serverStats.memoryUsage >= 75 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                'bg-gradient-to-r from-green-500 to-green-400'
              }`}
              style={{ width: `${data.serverStats.memoryUsage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">서버 가동률</p>
              <p className="text-2xl font-bold text-green-400">{data.serverStats.uptime}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.serverStats.uptime}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 네트워크 및 연결 상태 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Wifi className="w-5 h-5 mr-2" />
            네트워크 상태
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">활성 연결</span>
              <span className="text-lg font-bold text-blue-400">{data.serverStats.activeConnections}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">요청/초</span>
              <span className="text-lg font-bold text-green-400">{data.serverStats.requestsPerSecond.toFixed(1)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">오류율</span>
              <span className={`text-lg font-bold ${data.serverStats.errorRate > 1 ? 'text-red-400' : 'text-green-400'}`}>
                {data.serverStats.errorRate}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            데이터베이스 상태
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">연결 풀</span>
              <span className="text-lg font-bold text-green-400">15/20</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">쿼리/초</span>
              <span className="text-lg font-bold text-blue-400">245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">응답 시간</span>
              <span className="text-lg font-bold text-green-400">12ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 알림 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          시스템 알림
        </h2>
        <div className="space-y-3">
          {data.recentAlerts.map((alert) => (
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
  );
};

export default SystemMonitoring; 