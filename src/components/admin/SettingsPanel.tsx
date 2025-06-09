import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  Globe, 
  Database, 
  Bell,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import { AdminUser } from '../../types/admin';

interface SettingsPanelProps {
  adminUser: AdminUser;
  onRefresh: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ adminUser, onRefresh }) => {
  const [activeSection, setActiveSection] = useState<'general' | 'users' | 'game' | 'notifications'>('general');
  const [showAddUser, setShowAddUser] = useState(false);

  // 게임 설정 상태
  const [gameSettings, setGameSettings] = useState({
    experienceMultiplier: 1.0,
    goldMultiplier: 1.0,
    maxLevel: 50,
    startingGold: 100,
    enablePvP: false,
    maintenanceMode: false
  });

  // 알림 설정 상태
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    systemAlerts: true,
    playerAlerts: false,
    criticalOnly: false
  });

  const mockAdminUsers = [
    { id: '1', username: 'admin', email: 'admin@rpg.com', role: 'super_admin' as const, isActive: true },
    { id: '2', username: 'moderator1', email: 'mod1@rpg.com', role: 'moderator' as const, isActive: true },
    { id: '3', username: 'writer1', email: 'writer@rpg.com', role: 'admin' as const, isActive: false }
  ];

  const handleSaveSettings = () => {
    console.log('Saving settings...');
    // TODO: API 호출
  };

  const handleResetSettings = () => {
    if (confirm('설정을 기본값으로 초기화하시겠습니까?')) {
      setGameSettings({
        experienceMultiplier: 1.0,
        goldMultiplier: 1.0,
        maxLevel: 50,
        startingGold: 100,
        enablePvP: false,
        maintenanceMode: false
      });
    }
  };

  const AddUserModal: React.FC = () => {
    if (!showAddUser) return null;

    const [newUser, setNewUser] = useState({
      username: '',
      email: '',
      password: '',
      role: 'moderator' as const
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleCreate = () => {
      console.log('Creating new admin user:', newUser);
      setShowAddUser(false);
      setNewUser({ username: '', email: '', password: '', role: 'moderator' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-white mb-4">새 관리자 추가</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">사용자명</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">이메일</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">역할</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              >
                <option value="moderator">모더레이터</option>
                <option value="admin">관리자</option>
                {adminUser.role === 'super_admin' && (
                  <option value="super_admin">슈퍼 관리자</option>
                )}
              </select>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleCreate}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
            >
              생성
            </button>
            <button
              onClick={() => setShowAddUser(false)}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">설정</h1>
          <p className="text-gray-400">게임 설정 및 관리자 권한</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleSaveSettings}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>저장</span>
          </button>
          <button 
            onClick={handleResetSettings}
            className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>초기화</span>
          </button>
        </div>
      </div>

      {/* 섹션 탭 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-1 mb-6">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveSection('general')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeSection === 'general'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>일반</span>
          </button>
          
          <button
            onClick={() => setActiveSection('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeSection === 'users'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>관리자</span>
          </button>
          
          <button
            onClick={() => setActiveSection('game')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeSection === 'game'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>게임</span>
          </button>
          
          <button
            onClick={() => setActiveSection('notifications')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeSection === 'notifications'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>알림</span>
          </button>
        </div>
      </div>

      {/* 섹션 내용 */}
      {activeSection === 'general' && (
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-4">서버 설정</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">서버 이름</label>
                <input
                  type="text"
                  defaultValue="RPG 게임 서버"
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">최대 접속자</label>
                <input
                  type="number"
                  defaultValue="1000"
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'users' && (
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">관리자 목록</h2>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>관리자 추가</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {mockAdminUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.role === 'super_admin' ? 'bg-red-900 text-red-300' :
                      user.role === 'admin' ? 'bg-purple-900 text-purple-300' :
                      'bg-blue-900 text-blue-300'
                    }`}>
                      {user.role}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.isActive ? 'bg-green-900 text-green-300' : 'bg-gray-900 text-gray-300'
                    }`}>
                      {user.isActive ? '활성' : '비활성'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-400 hover:text-blue-300 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSection === 'game' && (
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-4">게임 밸런스</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">경험치 배율</label>
                <input
                  type="number"
                  step="0.1"
                  value={gameSettings.experienceMultiplier}
                  onChange={(e) => setGameSettings({...gameSettings, experienceMultiplier: parseFloat(e.target.value)})}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">골드 배율</label>
                <input
                  type="number"
                  step="0.1"
                  value={gameSettings.goldMultiplier}
                  onChange={(e) => setGameSettings({...gameSettings, goldMultiplier: parseFloat(e.target.value)})}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">최대 레벨</label>
                <input
                  type="number"
                  value={gameSettings.maxLevel}
                  onChange={(e) => setGameSettings({...gameSettings, maxLevel: parseInt(e.target.value)})}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">시작 골드</label>
                <input
                  type="number"
                  value={gameSettings.startingGold}
                  onChange={(e) => setGameSettings({...gameSettings, startingGold: parseInt(e.target.value)})}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={gameSettings.enablePvP}
                  onChange={(e) => setGameSettings({...gameSettings, enablePvP: e.target.checked})}
                  className="rounded bg-slate-700 border-slate-600"
                />
                <span className="text-sm text-gray-300">PvP 활성화</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={gameSettings.maintenanceMode}
                  onChange={(e) => setGameSettings({...gameSettings, maintenanceMode: e.target.checked})}
                  className="rounded bg-slate-700 border-slate-600"
                />
                <span className="text-sm text-gray-300">점검 모드</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-white mb-4">알림 설정</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailAlerts}
                  onChange={(e) => setNotificationSettings({...notificationSettings, emailAlerts: e.target.checked})}
                  className="rounded bg-slate-700 border-slate-600"
                />
                <span className="text-sm text-gray-300">이메일 알림</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.systemAlerts}
                  onChange={(e) => setNotificationSettings({...notificationSettings, systemAlerts: e.target.checked})}
                  className="rounded bg-slate-700 border-slate-600"
                />
                <span className="text-sm text-gray-300">시스템 알림</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.playerAlerts}
                  onChange={(e) => setNotificationSettings({...notificationSettings, playerAlerts: e.target.checked})}
                  className="rounded bg-slate-700 border-slate-600"
                />
                <span className="text-sm text-gray-300">플레이어 알림</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={notificationSettings.criticalOnly}
                  onChange={(e) => setNotificationSettings({...notificationSettings, criticalOnly: e.target.checked})}
                  className="rounded bg-slate-700 border-slate-600"
                />
                <span className="text-sm text-gray-300">중요 알림만</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <AddUserModal />
    </div>
  );
};

export default SettingsPanel; 