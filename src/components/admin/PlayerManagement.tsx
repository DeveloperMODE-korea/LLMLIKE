import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Edit3, 
  Ban, 
  UserCheck, 
  UserX,
  MoreVertical,
  Calendar,
  Clock,
  Coins,
  TrendingUp,
  Eye,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { AdminDashboardData, PlayerManagement as PlayerData } from '../../types/admin';
import { adminService } from '../../services/adminService';

interface PlayerManagementProps {
  data: AdminDashboardData;
  onRefresh: () => void;
}

const PlayerManagement: React.FC<PlayerManagementProps> = ({ data, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'banned' | 'suspended'>('all');
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [loading, setLoading] = useState(false);

  // 플레이어 목록 로드
  const loadPlayers = async () => {
    try {
      setLoading(true);
      const playersData = await adminService.getPlayers();
      setPlayers(playersData);
    } catch (error) {
      console.error('플레이어 목록 로딩 실패:', error);
      // 에러 발생 시 빈 배열 사용
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 플레이어 목록 로드
  React.useEffect(() => {
    loadPlayers();
  }, []);

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.characterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || player.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-900/20';
      case 'offline': return 'text-gray-400 bg-gray-900/20';
      case 'banned': return 'text-red-400 bg-red-900/20';
      case 'suspended': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'online': return '온라인';
      case 'offline': return '오프라인';
      case 'banned': return '차단됨';
      case 'suspended': return '정지됨';
      default: return '알 수 없음';
    }
  };

  const formatPlaytime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    return `${hours}시간`;
  };

  const formatLastActive = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}시간 전`;
    return `${Math.floor(diffInMinutes / 1440)}일 전`;
  };

  const handlePlayerAction = async (player: PlayerData, action: 'edit' | 'ban' | 'unban' | 'suspend' | 'view') => {
    switch (action) {
      case 'edit':
        setSelectedPlayer(player);
        setShowEditModal(true);
        break;
      case 'ban':
        if (confirm(`${player.username}을 차단하시겠습니까?`)) {
          try {
            await adminService.banPlayer(player.id, 'ban', '관리자에 의한 차단');
            await loadPlayers(); // 목록 새로고침
          } catch (error) {
            console.error('플레이어 차단 실패:', error);
            alert('플레이어 차단에 실패했습니다.');
          }
        }
        break;
      case 'unban':
        if (confirm(`${player.username}의 차단을 해제하시겠습니까?`)) {
          try {
            await adminService.banPlayer(player.id, 'unban');
            await loadPlayers(); // 목록 새로고침
          } catch (error) {
            console.error('플레이어 차단 해제 실패:', error);
            alert('플레이어 차단 해제에 실패했습니다.');
          }
        }
        break;
      case 'suspend':
        if (confirm(`${player.username}을 정지하시겠습니까?`)) {
          try {
            await adminService.banPlayer(player.id, 'suspend', '관리자에 의한 정지');
            await loadPlayers(); // 목록 새로고침
          } catch (error) {
            console.error('플레이어 정지 실패:', error);
            alert('플레이어 정지에 실패했습니다.');
          }
        }
        break;
      case 'view':
        setSelectedPlayer(player);
        // TODO: 플레이어 상세 정보 모달
        break;
    }
  };

  const PlayerEditModal: React.FC = () => {
    if (!selectedPlayer || !showEditModal) return null;

    const [editData, setEditData] = useState({
      level: selectedPlayer.level,
      experience: selectedPlayer.experience,
      gold: selectedPlayer.gold,
      status: selectedPlayer.status
    });

    const handleSave = async () => {
      try {
        await adminService.updatePlayer(selectedPlayer.id, editData);
        await loadPlayers(); // 목록 새로고침
        setShowEditModal(false);
        setSelectedPlayer(null);
      } catch (error) {
        console.error('플레이어 업데이트 실패:', error);
        alert('플레이어 정보 업데이트에 실패했습니다.');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-white mb-4">플레이어 편집</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">레벨</label>
              <input
                type="number"
                value={editData.level}
                onChange={(e) => setEditData({...editData, level: parseInt(e.target.value)})}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">경험치</label>
              <input
                type="number"
                value={editData.experience}
                onChange={(e) => setEditData({...editData, experience: parseInt(e.target.value)})}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">골드</label>
              <input
                type="number"
                value={editData.gold}
                onChange={(e) => setEditData({...editData, gold: parseInt(e.target.value)})}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">상태</label>
              <select
                value={editData.status}
                onChange={(e) => setEditData({...editData, status: e.target.value as any})}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              >
                <option value="online">온라인</option>
                <option value="offline">오프라인</option>
                <option value="suspended">정지됨</option>
                <option value="banned">차단됨</option>
              </select>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
            >
              저장
            </button>
            <button
              onClick={() => setShowEditModal(false)}
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
          <h1 className="text-2xl font-bold text-white">플레이어 관리</h1>
          <p className="text-gray-400">사용자 계정 및 캐릭터 관리</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => { loadPlayers(); onRefresh(); }}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? '로딩 중...' : '새로고침'}
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">총 플레이어</p>
              <p className="text-2xl font-bold text-white">{data.playerStats.totalPlayers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">활성 플레이어</p>
              <p className="text-2xl font-bold text-green-400">{data.playerStats.activePlayers}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">신규 가입</p>
              <p className="text-2xl font-bold text-purple-400">{data.playerStats.newPlayersToday}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">평균 세션</p>
              <p className="text-2xl font-bold text-yellow-400">{data.playerStats.averageSessionTime}분</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="사용자명 또는 캐릭터명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-8 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">모든 상태</option>
              <option value="online">온라인</option>
              <option value="offline">오프라인</option>
              <option value="suspended">정지됨</option>
              <option value="banned">차단됨</option>
            </select>
          </div>
        </div>
      </div>

      {/* 플레이어 목록 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">플레이어</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">레벨</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">경험치</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">골드</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">플레이 시간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">마지막 활동</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{player.characterName}</div>
                      <div className="text-sm text-gray-400">@{player.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{player.level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{player.experience.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-yellow-400">
                      <Coins className="w-4 h-4 mr-1" />
                      {player.gold.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">{formatPlaytime(player.playtime)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">{formatLastActive(player.lastActive)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(player.status)}`}>
                      {getStatusText(player.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handlePlayerAction(player, 'view')}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePlayerAction(player, 'edit')}
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                        title="편집"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      {player.status === 'banned' ? (
                        <button
                          onClick={() => handlePlayerAction(player, 'unban')}
                          className="text-green-400 hover:text-green-300 transition-colors"
                          title="차단 해제"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePlayerAction(player, 'ban')}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="차단"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-400">
          총 {filteredPlayers.length}명의 플레이어
        </p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">
            이전
          </button>
          <button className="px-3 py-1 bg-purple-600 text-white rounded">
            1
          </button>
          <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors">
            다음
          </button>
        </div>
      </div>

      {/* 편집 모달 */}
      <PlayerEditModal />
    </div>
  );
};

export default PlayerManagement; 