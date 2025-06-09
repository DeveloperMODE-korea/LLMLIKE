import React, { useState, useEffect } from 'react';
import { Character } from '../types/game';
import { 
  CharacterMemory, 
  NPCEmotion, 
  FactionReputation, 
  SideQuest,
  EmotionSummary,
  ReputationSummary,
  QuestSummary,
  StoryAnalysis
} from '../types/advancedSystems';
import { advancedSystemsService } from '../services/advancedSystemsService';
import { 
  Brain, 
  Heart, 
  Users, 
  Scroll, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  Star,
  Lightbulb,
  MapPin,
  Calendar
} from 'lucide-react';

interface AdvancedSystemsDashboardProps {
  character: Character;
}

const AdvancedSystemsDashboard: React.FC<AdvancedSystemsDashboardProps> = ({ character }) => {
  const [memories, setMemories] = useState<CharacterMemory[]>([]);
  const [emotions, setEmotions] = useState<NPCEmotion[]>([]);
  const [emotionSummary, setEmotionSummary] = useState<EmotionSummary | null>(null);
  const [reputations, setReputations] = useState<FactionReputation[]>([]);
  const [reputationSummary, setReputationSummary] = useState<ReputationSummary | null>(null);
  const [sideQuests, setSideQuests] = useState<SideQuest[]>([]);
  const [questSummary, setQuestSummary] = useState<QuestSummary | null>(null);
  const [storyAnalysis, setStoryAnalysis] = useState<StoryAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'memories' | 'emotions' | 'reputation' | 'quests'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, [character.id]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // 병렬로 모든 데이터 로드
      const [
        memoriesData,
        emotionsData, 
        reputationsData,
        questsData,
        analysisData
      ] = await Promise.all([
        advancedSystemsService.getMemories(character.id, { limit: 20 }),
        advancedSystemsService.getNPCEmotions(character.id),
        advancedSystemsService.getReputations(character.id),
        advancedSystemsService.getSideQuests(character.id),
        advancedSystemsService.analyzeStory(character.id)
      ]);
      
      setMemories(memoriesData.memories);
      setEmotions(emotionsData.emotions);
      setEmotionSummary(emotionsData.summary);
      setReputations(reputationsData.reputations);
      setReputationSummary(reputationsData.summary);
      setSideQuests(questsData.quests);
      setQuestSummary(questsData.summary);
      setStoryAnalysis(analysisData);
      
    } catch (error) {
      console.error('Failed to load advanced systems data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 감정 아이콘 가져오기
  const getEmotionIcon = (emotion: string) => {
    const icons: Record<string, string> = {
      happiness: '😊',
      anger: '😠',
      fear: '😨',
      trust: '🤝',
      respect: '🙏',
      love: '❤️',
      hostility: '⚔️',
      curiosity: '🤔',
      neutral: '😐'
    };
    return icons[emotion] || '😐';
  };

  // 평판 레벨 색상
  const getReputationColor = (level: string) => {
    const colors: Record<string, string> = {
      revered: 'text-yellow-300 bg-yellow-900',
      exalted: 'text-purple-300 bg-purple-900',
      honored: 'text-blue-300 bg-blue-900',
      friendly: 'text-green-300 bg-green-900',
      neutral: 'text-gray-300 bg-gray-700',
      unfriendly: 'text-orange-300 bg-orange-900',
      hostile: 'text-red-300 bg-red-900',
      hated: 'text-red-400 bg-red-800',
      nemesis: 'text-red-500 bg-red-700'
    };
    return colors[level] || colors.neutral;
  };

  // 트렌드 아이콘
  const getTrendIcon = (trend: string) => {
    if (trend === 'rising') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'falling') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  // 퀘스트 상태 아이콘
  const getQuestStatusIcon = (status: string) => {
    const icons: Record<string, JSX.Element> = {
      available: <Circle className="w-4 h-4 text-blue-400" />,
      active: <Clock className="w-4 h-4 text-yellow-400" />,
      completed: <CheckCircle className="w-4 h-4 text-green-400" />,
      failed: <AlertTriangle className="w-4 h-4 text-red-400" />
    };
    return icons[status] || icons.available;
  };

  if (loading) {
    return (
      <div className="bg-slate-700 border border-slate-600 rounded-lg p-6 h-full">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          <span className="ml-2 text-gray-300">고급 시스템 로드 중...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-700 border border-slate-600 rounded-lg p-3 h-full flex flex-col">
      {/* 탭 네비게이션 - 개선된 디자인 */}
      <div className="flex space-x-0 mb-3 bg-slate-800 rounded-lg p-1">
        {[
          { key: 'overview', label: '개요', icon: <Star className="w-4 h-4" /> },
          { key: 'memories', label: '기억', icon: <Brain className="w-4 h-4" /> },
          { key: 'emotions', label: '관계', icon: <Heart className="w-4 h-4" /> },
          { key: 'reputation', label: '평판', icon: <Users className="w-4 h-4" /> },
          { key: 'quests', label: '퀘스트', icon: <Scroll className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 text-sm flex-1 justify-center ${
              activeTab === tab.key
                ? 'bg-purple-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-slate-600'
            }`}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="flex-1 overflow-y-auto">
        
        {/* === 개요 탭 === */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* 스토리 분석 */}
            {storyAnalysis && (
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  스토리 분석
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">현재 상황</h4>
                    <p className="text-sm text-gray-400">{storyAnalysis.currentContext}</p>
                  </div>
                  
                  {storyAnalysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">추천 사항</h4>
                      <ul className="space-y-1">
                        {storyAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-blue-300 flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {storyAnalysis.nextSuggestedActions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">다음 행동 제안</h4>
                      <ul className="space-y-1">
                        {storyAnalysis.nextSuggestedActions.map((action, index) => (
                          <li key={index} className="text-sm text-yellow-300 flex items-start">
                            <span className="text-yellow-400 mr-2">→</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 요약 통계 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-300 mb-2">기억 & 관계</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">총 기억:</span>
                    <span className="text-white">{memories.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">알고 있는 NPC:</span>
                    <span className="text-white">{emotions.length}</span>
                  </div>
                  {emotionSummary && (
                    <div className="text-xs text-gray-500 mt-2">
                      {emotionSummary.overallMood}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-green-300 mb-2">평판 & 퀘스트</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">알려진 세력:</span>
                    <span className="text-white">{reputations.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">활성 퀘스트:</span>
                    <span className="text-white">{sideQuests.filter(q => q.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">완료 퀘스트:</span>
                    <span className="text-white">{sideQuests.filter(q => q.status === 'completed').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === 기억 탭 === */}
        {activeTab === 'memories' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-purple-300">캐릭터 기억</h3>
              <span className="text-sm text-gray-400">{memories.length}개의 기록</span>
            </div>
            
            {memories.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500">아직 기록된 기억이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {memories.map((memory) => (
                  <div key={memory.id} className="bg-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white">{memory.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          memory.importance === 'critical' ? 'bg-red-900 text-red-300' :
                          memory.importance === 'major' ? 'bg-orange-900 text-orange-300' :
                          memory.importance === 'moderate' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {memory.importance}
                        </span>
                        <span className="text-xs text-gray-500">{memory.eventType}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-2">{memory.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {memory.tags.map((tag, index) => (
                        <span key={index} className="bg-slate-700 text-xs px-2 py-1 rounded text-gray-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center">
                        {memory.location && (
                          <>
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="mr-3">{memory.location}</span>
                          </>
                        )}
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(memory.timestamp).toLocaleDateString()}</span>
                      </div>
                      {memory.npcInvolved && memory.npcInvolved.length > 0 && (
                        <span>관련 NPC: {memory.npcInvolved.join(', ')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === 감정/관계 탭 === */}
        {activeTab === 'emotions' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-red-300">NPC 관계</h3>
              <span className="text-sm text-gray-400">{emotions.length}명과 상호작용</span>
            </div>
            
            {emotions.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500">아직 만난 NPC가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {emotions.map((emotion) => (
                  <div key={emotion.npcId} className="bg-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{getEmotionIcon(emotion.dominantEmotion)}</span>
                        <div>
                          <h4 className="font-semibold text-white">{emotion.npcName}</h4>
                          <p className="text-sm text-gray-400">
                            {emotion.dominantEmotion} (강도: {emotion.emotionIntensity})
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(emotion.lastInteraction).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {/* 감정 막대 그래프 */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(emotion.emotions).map(([emotionName, value]) => (
                        <div key={emotionName} className="flex items-center">
                          <span className="w-16 text-gray-400">{emotionName}:</span>
                          <div className="flex-1 mx-2 bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                value > 0 ? 'bg-green-500' : value < 0 ? 'bg-red-500' : 'bg-gray-500'
                              }`}
                              style={{ width: `${Math.abs(value)}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-gray-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === 평판 탭 === */}
        {activeTab === 'reputation' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-blue-300">세력 평판</h3>
              <span className="text-sm text-gray-400">{reputations.length}개 세력</span>
            </div>
            
            {reputations.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500">아직 알려진 세력이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reputations.map((rep) => (
                  <div key={rep.factionId} className="bg-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{rep.factionName}</h4>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 rounded text-xs mr-2 ${getReputationColor(rep.reputationLevel)}`}>
                            {rep.standing}
                          </span>
                          {reputationSummary?.standings.find(s => s.factionName === rep.factionName) && 
                            getTrendIcon(reputationSummary.standings.find(s => s.factionName === rep.factionName)!.trend)
                          }
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{rep.reputation}</div>
                        <div className="text-xs text-gray-400">/ 1000</div>
                      </div>
                    </div>
                    
                    {/* 평판 프로그레스 바 */}
                    <div className="mb-3">
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            rep.reputation >= 200 ? 'bg-green-500' :
                            rep.reputation >= 0 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.max(5, ((rep.reputation + 1000) / 2000) * 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* 혜택과 제재 */}
                    {rep.benefits.length > 0 && (
                      <div className="mb-2">
                        <h5 className="text-xs font-semibold text-green-300 mb-1">혜택:</h5>
                        <ul className="text-xs text-green-400 space-y-1">
                          {rep.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {rep.penalties.length > 0 && (
                      <div>
                        <h5 className="text-xs font-semibold text-red-300 mb-1">제재:</h5>
                        <ul className="text-xs text-red-400 space-y-1">
                          {rep.penalties.map((penalty, index) => (
                            <li key={index}>• {penalty}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === 퀘스트 탭 === */}
        {activeTab === 'quests' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-yellow-300">사이드 퀘스트</h3>
              <span className="text-sm text-gray-400">{sideQuests.length}개 퀘스트</span>
            </div>
            
            {sideQuests.length === 0 ? (
              <div className="text-center py-8">
                <Scroll className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <p className="text-gray-500">아직 퀘스트가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sideQuests.map((quest) => (
                  <div key={quest.id} className="bg-slate-800 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {getQuestStatusIcon(quest.status)}
                        <h4 className="font-semibold text-white ml-2">{quest.title}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          quest.difficulty === 'extreme' ? 'bg-red-900 text-red-300' :
                          quest.difficulty === 'hard' ? 'bg-orange-900 text-orange-300' :
                          quest.difficulty === 'moderate' ? 'bg-yellow-900 text-yellow-300' :
                          'bg-green-900 text-green-300'
                        }`}>
                          {quest.difficulty}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          quest.status === 'completed' ? 'bg-green-900 text-green-300' :
                          quest.status === 'active' ? 'bg-blue-900 text-blue-300' :
                          quest.status === 'failed' ? 'bg-red-900 text-red-300' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {quest.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-300 mb-3">{quest.description}</p>
                    
                    {/* 목표들 */}
                    {quest.objectives && quest.objectives.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-xs font-semibold text-gray-300 mb-2">목표:</h5>
                        <div className="space-y-1">
                          {quest.objectives.map((objective) => (
                            <div key={objective.id} className="flex items-center text-sm">
                              {objective.isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                              ) : (
                                <Circle className="w-4 h-4 text-gray-400 mr-2" />
                              )}
                              <span className={objective.isCompleted ? 'text-green-300 line-through' : 'text-gray-300'}>
                                {objective.description}
                              </span>
                              {objective.quantity && (
                                <span className="ml-auto text-xs text-gray-500">
                                  {objective.currentProgress}/{objective.quantity}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* 보상 */}
                    {quest.rewards && quest.rewards.length > 0 && (
                      <div className="mb-2">
                        <h5 className="text-xs font-semibold text-yellow-300 mb-1">보상:</h5>
                        <div className="flex flex-wrap gap-1">
                          {quest.rewards.map((reward, index) => (
                            <span key={index} className="bg-yellow-900 text-yellow-300 text-xs px-2 py-1 rounded">
                              {reward.description}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span className="bg-slate-700 px-2 py-1 rounded">{quest.type}</span>
                        {quest.location && (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {quest.location}
                          </div>
                        )}
                      </div>
                      {quest.timeLimit && (
                        <div className="flex items-center text-orange-400">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(quest.timeLimit).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSystemsDashboard; 