import React, { useState } from 'react';
import { 
  FileText, 
  Target, 
  Users, 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Search,
  Filter,
  Upload,
  Download,
  Copy,
  Star,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { AdminDashboardData } from '../../types/admin';

interface ContentManagementProps {
  data: AdminDashboardData;
  onRefresh: () => void;
}

type ContentType = 'story' | 'quest' | 'npc' | 'item';
type ContentStatus = 'draft' | 'review' | 'published' | 'archived';

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  description: string;
  status: ContentStatus;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  playCount?: number;
  rating?: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
}

const ContentManagement: React.FC<ContentManagementProps> = ({ data, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<ContentType>('story');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ContentStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 모킹 데이터
  const mockContent: ContentItem[] = [
    {
      id: '1',
      type: 'story',
      title: '사이버펑크 메인 스토리: 네온 시티의 비밀',
      description: '플레이어가 네온 시티의 어두운 비밀을 파헤치는 메인 스토리라인',
      status: 'published',
      author: 'admin',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10'),
      playCount: 432,
      rating: 4.7,
      difficulty: 'medium'
    },
    {
      id: '2',
      type: 'quest',
      title: '잃어버린 기억',
      description: '플레이어의 과거를 찾아가는 개인 퀘스트',
      status: 'published',
      author: 'writer1',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-15'),
      playCount: 156,
      rating: 4.5,
      difficulty: 'easy'
    },
    {
      id: '3',
      type: 'npc',
      title: '신비한 상인',
      description: '하모니 네트워크와 연결된 의문의 상인',
      status: 'review',
      author: 'designer2',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-15'),
      difficulty: 'medium'
    },
    {
      id: '4',
      type: 'item',
      title: '양자 단검',
      description: '차원을 가르는 희귀 무기',
      status: 'draft',
      author: 'designer1',
      createdAt: new Date('2024-03-20'),
      updatedAt: new Date('2024-03-20'),
      difficulty: 'hard'
    }
  ];

  const filteredContent = mockContent.filter(item => {
    const matchesType = item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesType && matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: ContentStatus): string => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-900/20';
      case 'review': return 'text-yellow-400 bg-yellow-900/20';
      case 'draft': return 'text-blue-400 bg-blue-900/20';
      case 'archived': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusText = (status: ContentStatus): string => {
    switch (status) {
      case 'published': return '배포됨';
      case 'review': return '검토중';
      case 'draft': return '초안';
      case 'archived': return '보관됨';
      default: return '알 수 없음';
    }
  };

  const getStatusIcon = (status: ContentStatus) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-4 h-4" />;
      case 'review': return <Clock className="w-4 h-4" />;
      case 'draft': return <Edit3 className="w-4 h-4" />;
      case 'archived': return <Package className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty?: string): string => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-orange-400';
      case 'expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'story': return <FileText className="w-5 h-5" />;
      case 'quest': return <Target className="w-5 h-5" />;
      case 'npc': return <Users className="w-5 h-5" />;
      case 'item': return <Package className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: ContentType): string => {
    switch (type) {
      case 'story': return '스토리';
      case 'quest': return '퀘스트';
      case 'npc': return 'NPC';
      case 'item': return '아이템';
    }
  };

  const handleContentAction = (item: ContentItem, action: 'edit' | 'delete' | 'view' | 'publish' | 'archive') => {
    switch (action) {
      case 'edit':
        console.log('Editing content:', item.id);
        break;
      case 'delete':
        if (confirm(`${item.title}을 삭제하시겠습니까?`)) {
          console.log('Deleting content:', item.id);
        }
        break;
      case 'view':
        console.log('Viewing content:', item.id);
        break;
      case 'publish':
        if (confirm(`${item.title}을 배포하시겠습니까?`)) {
          console.log('Publishing content:', item.id);
        }
        break;
      case 'archive':
        if (confirm(`${item.title}을 보관하시겠습니까?`)) {
          console.log('Archiving content:', item.id);
        }
        break;
    }
  };

  const CreateContentModal: React.FC = () => {
    if (!showCreateModal) return null;

    const [newContent, setNewContent] = useState({
      type: activeTab,
      title: '',
      description: '',
      difficulty: 'easy' as const
    });

    const handleCreate = () => {
      console.log('Creating new content:', newContent);
      setShowCreateModal(false);
      setNewContent({ type: activeTab, title: '', description: '', difficulty: 'easy' });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-2xl">
          <h3 className="text-lg font-semibold text-white mb-4">새 {getTypeLabel(activeTab)} 생성</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">제목</label>
              <input
                type="text"
                value={newContent.title}
                onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                placeholder="콘텐츠 제목을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">설명</label>
              <textarea
                value={newContent.description}
                onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white h-24"
                placeholder="콘텐츠 설명을 입력하세요"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">난이도</label>
              <select
                value={newContent.difficulty}
                onChange={(e) => setNewContent({...newContent, difficulty: e.target.value as any})}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              >
                <option value="easy">쉬움</option>
                <option value="medium">보통</option>
                <option value="hard">어려움</option>
                <option value="expert">전문가</option>
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
              onClick={() => setShowCreateModal(false)}
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
          <h1 className="text-2xl font-bold text-white">콘텐츠 관리</h1>
          <p className="text-gray-400">스토리, 퀘스트, NPC, 아이템 편집</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>새 {getTypeLabel(activeTab)}</span>
          </button>
          <button 
            onClick={onRefresh}
            className="bg-slate-600 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">스토리</p>
              <p className="text-2xl font-bold text-purple-400">{data.contentStats.totalStories}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">퀘스트</p>
              <p className="text-2xl font-bold text-blue-400">{data.contentStats.totalQuests}</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">NPC</p>
              <p className="text-2xl font-bold text-green-400">{data.contentStats.totalNPCs}</p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">아이템</p>
              <p className="text-2xl font-bold text-yellow-400">{data.contentStats.totalItems}</p>
            </div>
            <Package className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-1 mb-6">
        <div className="flex space-x-1">
          {(['story', 'quest', 'npc', 'item'] as ContentType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeTab === type
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              {getTypeIcon(type)}
              <span>{getTypeLabel(type)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="제목 또는 설명으로 검색..."
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
              <option value="published">배포됨</option>
              <option value="review">검토중</option>
              <option value="draft">초안</option>
              <option value="archived">보관됨</option>
            </select>
          </div>
        </div>
      </div>

      {/* 콘텐츠 목록 */}
      <div className="grid gap-4">
        {filteredContent.map((item) => (
          <div key={item.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {getTypeIcon(item.type)}
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1">{getStatusText(item.status)}</span>
                  </span>
                </div>
                
                <p className="text-gray-400 mb-3">{item.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>작성자: {item.author}</span>
                                  <span>생성: {(item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt)).toLocaleDateString()}</span>
                <span>수정: {(item.updatedAt instanceof Date ? item.updatedAt : new Date(item.updatedAt)).toLocaleDateString()}</span>
                  {item.difficulty && (
                    <span className={`font-medium ${getDifficultyColor(item.difficulty)}`}>
                      난이도: {item.difficulty}
                    </span>
                  )}
                  {item.playCount && (
                    <span>플레이: {item.playCount}회</span>
                  )}
                  {item.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span>{item.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleContentAction(item, 'view')}
                  className="text-blue-400 hover:text-blue-300 transition-colors p-2"
                  title="미리보기"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleContentAction(item, 'edit')}
                  className="text-purple-400 hover:text-purple-300 transition-colors p-2"
                  title="편집"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                {item.status === 'draft' || item.status === 'review' ? (
                  <button
                    onClick={() => handleContentAction(item, 'publish')}
                    className="text-green-400 hover:text-green-300 transition-colors p-2"
                    title="배포"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleContentAction(item, 'archive')}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors p-2"
                    title="보관"
                  >
                    <Package className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleContentAction(item, 'delete')}
                  className="text-red-400 hover:text-red-300 transition-colors p-2"
                  title="삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {getTypeIcon(activeTab)}
          </div>
          <p className="text-gray-400">해당하는 {getTypeLabel(activeTab)}이 없습니다.</p>
        </div>
      )}

      {/* 생성 모달 */}
      <CreateContentModal />
    </div>
  );
};

export default ContentManagement; 