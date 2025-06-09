import { Request, Response } from 'express';
import { randomUUID } from 'crypto';

// 메모리 저장소 (실제 구현에서는 데이터베이스 사용)
const characterMemories: Map<string, any[]> = new Map();
const npcEmotions: Map<string, any> = new Map();
const factionReputations: Map<string, any[]> = new Map();
const sideQuests: Map<string, any[]> = new Map();
const storyStates: Map<string, any> = new Map();

export class AdvancedSystemsController {

  // === 1. 캐릭터 메모리 시스템 ===
  
  async addMemory(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      const memoryData = req.body;
      
      const memory = {
        id: randomUUID(),
        characterId,
        ...memoryData,
        timestamp: new Date()
      };
      
      if (!characterMemories.has(characterId)) {
        characterMemories.set(characterId, []);
      }
      
      characterMemories.get(characterId)!.push(memory);
      
      res.json({ success: true, memory });
    } catch (error) {
      console.error('Error adding memory:', error);
      res.status(500).json({ error: 'Failed to add memory' });
    }
  }
  
  async getMemories(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      const { tags, eventType, npcInvolved, importance, limit = 50 } = req.query;
      
      let memories = characterMemories.get(characterId) || [];
      
      // 필터링
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags.map(String) : [String(tags)];
        memories = memories.filter(m => 
          tagArray.some((tag: string) => m.tags?.includes(tag))
        );
      }
      
      if (eventType) {
        memories = memories.filter(m => m.eventType === eventType);
      }
      
      if (npcInvolved) {
        memories = memories.filter(m => 
          m.npcInvolved?.includes(npcInvolved)
        );
      }
      
      if (importance) {
        memories = memories.filter(m => m.importance === importance);
      }
      
      // 최신순 정렬 후 제한
      memories = memories
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, Number(limit));
      
      // 관련 컨텍스트 생성
      const relevantContext = this.generateMemoryContext(memories);
      
      res.json({
        memories,
        totalCount: memories.length,
        relevantContext
      });
    } catch (error) {
      console.error('Error getting memories:', error);
      res.status(500).json({ error: 'Failed to get memories' });
    }
  }
  
  private generateMemoryContext(memories: any[]): string {
    if (memories.length === 0) return '';
    
    const importantMemories = memories.filter(m => 
      ['major', 'critical'].includes(m.importance)
    );
    
    const recentMemories = memories.slice(0, 5);
    
    let context = '최근 중요한 사건들:\n';
    importantMemories.forEach(m => {
      context += `- ${m.title}: ${m.description}\n`;
    });
    
    context += '\n최근 활동:\n';
    recentMemories.forEach(m => {
      context += `- ${m.title} (${m.eventType})\n`;
    });
    
    return context;
  }

  // === 2. 감정 시스템 ===
  
  async updateNPCEmotion(req: Request, res: Response) {
    try {
      const { characterId, npcId } = req.params;
      const { eventType, emotionChanges, description, context } = req.body;
      
      const emotionKey = `${characterId}_${npcId}`;
      let npcEmotion = npcEmotions.get(emotionKey);
      
      if (!npcEmotion) {
        npcEmotion = {
          npcId,
          npcName: `NPC_${npcId}`,
          emotions: {
            happiness: 0, anger: 0, fear: 0, trust: 0,
            respect: 0, love: 0, hostility: 0, curiosity: 0
          },
          dominantEmotion: 'neutral',
          emotionIntensity: 0,
          lastInteraction: new Date(),
          interactionHistory: []
        };
      }
      
      // 감정 변화 적용
      Object.keys(emotionChanges).forEach(emotion => {
        if (emotion in npcEmotion.emotions) {
          npcEmotion.emotions[emotion] = Math.max(-100, 
            Math.min(100, npcEmotion.emotions[emotion] + emotionChanges[emotion])
          );
        }
      });
      
      // 지배적 감정 계산
      const emotions = npcEmotion.emotions;
      const maxEmotion = Object.keys(emotions).reduce((a, b) => 
        Math.abs(emotions[a]) > Math.abs(emotions[b]) ? a : b
      );
      npcEmotion.dominantEmotion = maxEmotion;
      npcEmotion.emotionIntensity = Math.abs(emotions[maxEmotion]);
      npcEmotion.lastInteraction = new Date();
      
      // 상호작용 기록 추가
      const emotionEvent = {
        id: randomUUID(),
        characterId,
        npcId,
        eventType,
        emotionChanges,
        description,
        timestamp: new Date(),
        context
      };
      
      npcEmotion.interactionHistory.push(emotionEvent);
      
      // 최근 10개 기록만 유지
      if (npcEmotion.interactionHistory.length > 10) {
        npcEmotion.interactionHistory = npcEmotion.interactionHistory.slice(-10);
      }
      
      npcEmotions.set(emotionKey, npcEmotion);
      
      res.json({ success: true, npcEmotion });
    } catch (error) {
      console.error('Error updating NPC emotion:', error);
      res.status(500).json({ error: 'Failed to update NPC emotion' });
    }
  }
  
  async getNPCEmotions(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      
      const characterEmotions: any[] = [];
      
      npcEmotions.forEach((emotion, key) => {
        if (key.startsWith(`${characterId}_`)) {
          characterEmotions.push(emotion);
        }
      });
      
      // 감정 요약 생성
      const emotionSummary = this.generateEmotionSummary(characterEmotions);
      
      res.json({
        emotions: characterEmotions,
        summary: emotionSummary
      });
    } catch (error) {
      console.error('Error getting NPC emotions:', error);
      res.status(500).json({ error: 'Failed to get NPC emotions' });
    }
  }
  
  private generateEmotionSummary(emotions: any[]): any {
    if (emotions.length === 0) {
      return {
        overallMood: '아직 만난 NPC가 없습니다',
        keyRelationships: [],
        recentChanges: []
      };
    }
    
    const keyRelationships = emotions.map(e => ({
      npcName: e.npcName,
      relationship: this.getRelationshipStatus(e.emotions),
      emotionSummary: `${e.dominantEmotion} (강도: ${e.emotionIntensity})`
    }));
    
    const recentChanges = emotions
      .flatMap(e => e.interactionHistory || [])
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
    
    const overallMood = this.calculateOverallMood(emotions);
    
    return {
      overallMood,
      keyRelationships,
      recentChanges
    };
  }
  
  private getRelationshipStatus(emotions: any): string {
    const trust = emotions.trust || 0;
    const love = emotions.love || 0;
    const hostility = emotions.hostility || 0;
    
    if (love > 50) return '연인/가족';
    if (trust > 30 && hostility < -20) return '신뢰하는 친구';
    if (trust > 10) return '우호적';
    if (hostility > 30) return '적대적';
    if (hostility > 50) return '원수';
    return '중립적';
  }
  
  private calculateOverallMood(emotions: any[]): string {
    if (emotions.length === 0) return '중립적';
    
    let totalPositive = 0;
    let totalNegative = 0;
    
    emotions.forEach(e => {
      totalPositive += (e.emotions.happiness || 0) + (e.emotions.trust || 0) + (e.emotions.love || 0);
      totalNegative += (e.emotions.anger || 0) + (e.emotions.fear || 0) + (e.emotions.hostility || 0);
    });
    
    const averagePositive = totalPositive / emotions.length;
    const averageNegative = totalNegative / emotions.length;
    
    if (averagePositive > 30) return '긍정적 - 대부분의 사람들이 당신을 좋아합니다';
    if (averageNegative > 30) return '부정적 - 많은 사람들이 당신을 불편해합니다';
    return '중립적 - 다양한 반응을 보이고 있습니다';
  }

  // === 3. 평판 시스템 ===
  
  async updateReputation(req: Request, res: Response) {
    try {
      const { characterId, factionId } = req.params;
      const { eventType, reputationChange, description, location, npcsInvolved, publicityLevel } = req.body;
      
      if (!factionReputations.has(characterId)) {
        factionReputations.set(characterId, []);
      }
      
      const reputations = factionReputations.get(characterId)!;
      let factionRep = reputations.find(r => r.factionId === factionId);
      
      if (!factionRep) {
        factionRep = {
          characterId,
          factionId,
          factionName: this.getFactionName(factionId),
          reputation: 0,
          reputationLevel: 'neutral',
          standing: '일반인',
          benefits: [],
          penalties: [],
          history: [],
          isKnown: false
        };
        reputations.push(factionRep);
      }
      
      // 평판 변화 적용
      factionRep.reputation = Math.max(-1000, 
        Math.min(1000, factionRep.reputation + reputationChange)
      );
      
      // 평판 레벨 업데이트
      factionRep.reputationLevel = this.getReputationLevel(factionRep.reputation);
      factionRep.standing = this.getStanding(factionRep.reputationLevel);
      factionRep.benefits = this.getBenefits(factionRep.reputationLevel);
      factionRep.penalties = this.getPenalties(factionRep.reputationLevel);
      factionRep.isKnown = true;
      
      // 평판 이벤트 기록
      const reputationEvent = {
        id: randomUUID(),
        characterId,
        factionId,
        eventType,
        reputationChange,
        description,
        location,
        npcsInvolved,
        timestamp: new Date(),
        publicityLevel
      };
      
      factionRep.history.push(reputationEvent);
      
      res.json({ success: true, reputation: factionRep });
    } catch (error) {
      console.error('Error updating reputation:', error);
      res.status(500).json({ error: 'Failed to update reputation' });
    }
  }
  
  async getReputations(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      
      const reputations = factionReputations.get(characterId) || [];
      const summary = this.generateReputationSummary(reputations);
      
      res.json({
        reputations,
        summary
      });
    } catch (error) {
      console.error('Error getting reputations:', error);
      res.status(500).json({ error: 'Failed to get reputations' });
    }
  }
  
  private getReputationLevel(reputation: number): string {
    if (reputation >= 800) return 'revered';
    if (reputation >= 600) return 'exalted';
    if (reputation >= 400) return 'honored';
    if (reputation >= 200) return 'friendly';
    if (reputation >= -199) return 'neutral';
    if (reputation >= -399) return 'unfriendly';
    if (reputation >= -599) return 'hostile';
    if (reputation >= -799) return 'hated';
    return 'nemesis';
  }
  
  private getStanding(level: string): string {
    const standings: Record<string, string> = {
      'revered': '전설적 영웅',
      'exalted': '명예 시민',
      'honored': '신뢰받는 동맹',
      'friendly': '친근한 지인',
      'neutral': '일반인',
      'unfriendly': '요주의 인물',
      'hostile': '적대 세력',
      'hated': '공공의 적',
      'nemesis': '절대악'
    };
    return standings[level] || '알 수 없음';
  }
  
  private getBenefits(level: string): string[] {
    const benefits: Record<string, string[]> = {
      'revered': ['특별 할인 90%', '비밀 정보 접근', '최고급 서비스', '무료 숙박'],
      'exalted': ['특별 할인 70%', '중요 정보 접근', '우선 서비스'],
      'honored': ['할인 50%', '일반 정보 접근', '친화적 대우'],
      'friendly': ['할인 25%', '기본 정보 접근'],
      'neutral': [],
      'unfriendly': [],
      'hostile': [],
      'hated': [],
      'nemesis': []
    };
    return benefits[level] || [];
  }
  
  private getPenalties(level: string): string[] {
    const penalties: Record<string, string[]> = {
      'revered': [],
      'exalted': [],
      'honored': [],
      'friendly': [],
      'neutral': [],
      'unfriendly': ['가격 할증 25%', '냉대'],
      'hostile': ['가격 할증 50%', '서비스 거부', '감시'],
      'hated': ['가격 할증 100%', '대부분 서비스 거부', '적극적 방해'],
      'nemesis': ['완전한 서비스 거부', '즉시 공격', '현상금']
    };
    return penalties[level] || [];
  }
  
  private getFactionName(factionId: string): string {
    const factionNames: Record<string, string> = {
      'synthesists': '신테시스트',
      'purists': '퓨어리스트',
      'balancers': '밸런서',
      'nexus_corp': '넥서스 코퍼레이션',
      'quantum_dynamics': '퀀텀 다이나믹스',
      'bio_renaissance': '바이오 르네상스'
    };
    return factionNames[factionId] || factionId;
  }
  
  private generateReputationSummary(reputations: any[]): any {
    const standings = reputations.map(r => ({
      factionName: r.factionName,
      level: r.reputationLevel,
      standing: r.standing,
      trend: this.calculateTrend(r.history)
    }));
    
    const opportunities = this.getOpportunities(reputations);
    const warnings = this.getWarnings(reputations);
    
    return { standings, opportunities, warnings };
  }
  
  private calculateTrend(history: any[]): 'rising' | 'falling' | 'stable' {
    if (history.length < 2) return 'stable';
    
    const recent = history.slice(-3);
    const totalChange = recent.reduce((sum, event) => sum + event.reputationChange, 0);
    
    if (totalChange > 50) return 'rising';
    if (totalChange < -50) return 'falling';
    return 'stable';
  }
  
  private getOpportunities(reputations: any[]): string[] {
    const opportunities: string[] = [];
    
    reputations.forEach(r => {
      if (r.reputationLevel === 'friendly') {
        opportunities.push(`${r.factionName}에서 더 큰 임무를 받을 수 있습니다`);
      }
      if (r.reputationLevel === 'honored') {
        opportunities.push(`${r.factionName}의 특별 혜택을 이용할 수 있습니다`);
      }
    });
    
    return opportunities;
  }
  
  private getWarnings(reputations: any[]): string[] {
    const warnings: string[] = [];
    
    reputations.forEach(r => {
      if (r.reputationLevel === 'hostile') {
        warnings.push(`${r.factionName}이 당신을 적대시합니다`);
      }
      if (r.reputationLevel === 'hated') {
        warnings.push(`${r.factionName}이 당신을 매우 위험하게 여깁니다`);
      }
    });
    
    return warnings;
  }

  // === 4. 사이드 퀘스트 시스템 ===
  
  async createSideQuest(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      const questData = req.body;
      
      const quest = {
        id: randomUUID(),
        ...questData,
        status: 'available',
        progress: {},
        createdAt: new Date()
      };
      
      if (!sideQuests.has(characterId)) {
        sideQuests.set(characterId, []);
      }
      
      sideQuests.get(characterId)!.push(quest);
      
      res.json({ success: true, quest });
    } catch (error) {
      console.error('Error creating side quest:', error);
      res.status(500).json({ error: 'Failed to create side quest' });
    }
  }
  
  async getSideQuests(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      const { status, type } = req.query;
      
      let quests = sideQuests.get(characterId) || [];
      
      if (status) {
        quests = quests.filter(q => q.status === status);
      }
      
      if (type) {
        quests = quests.filter(q => q.type === type);
      }
      
      const questSummary = this.generateQuestSummary(quests);
      
      res.json({
        quests,
        summary: questSummary
      });
    } catch (error) {
      console.error('Error getting side quests:', error);
      res.status(500).json({ error: 'Failed to get side quests' });
    }
  }
  
  async updateQuestProgress(req: Request, res: Response) {
    try {
      const { characterId, questId } = req.params;
      const { objectiveId, progress } = req.body;
      
      const quests = sideQuests.get(characterId) || [];
      const quest = quests.find(q => q.id === questId);
      
      if (!quest) {
        return res.status(404).json({ error: 'Quest not found' });
      }
      
      quest.progress[objectiveId] = progress;
      
      // 목표 완료 확인
      const objective = quest.objectives.find((obj: any) => obj.id === objectiveId);
      if (objective && progress >= 100) {
        objective.isCompleted = true;
      }
      
      // 퀘스트 완료 확인
      const allCompleted = quest.objectives.every((obj: any) => 
        obj.isCompleted || obj.isOptional
      );
      
      if (allCompleted && quest.status === 'active') {
        quest.status = 'completed';
        quest.completedAt = new Date();
      }
      
      res.json({ success: true, quest });
    } catch (error) {
      console.error('Error updating quest progress:', error);
      res.status(500).json({ error: 'Failed to update quest progress' });
    }
  }
  
  private generateQuestSummary(quests: any[]): any {
    const activeQuests = quests.filter(q => q.status === 'active');
    const availableQuests = quests.filter(q => q.status === 'available');
    const recentCompletions = quests
      .filter(q => q.status === 'completed')
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 5);
    
    const recommendations = this.getQuestRecommendations(quests);
    
    return {
      activeQuests,
      availableQuests,
      recentCompletions,
      recommendations
    };
  }
  
  private getQuestRecommendations(quests: any[]): string[] {
    const recommendations: string[] = [];
    
    const availableQuests = quests.filter(q => q.status === 'available');
    
    availableQuests.forEach(q => {
      if (q.difficulty === 'easy') {
        recommendations.push(`"${q.title}" - 쉬운 퀘스트로 시작해보세요`);
      }
      if (q.type === 'faction') {
        recommendations.push(`"${q.title}" - 세력 평판을 올릴 수 있습니다`);
      }
    });
    
    return recommendations.slice(0, 3);
  }

  // === 5. 스토리 분석 시스템 ===
  
  async analyzeStory(req: Request, res: Response) {
    try {
      const { characterId } = req.params;
      
      const memories = characterMemories.get(characterId) || [];
      const emotions = Array.from(npcEmotions.values()).filter(e => 
        e.npcId && e.npcId.includes(characterId)
      );
      const reputations = factionReputations.get(characterId) || [];
      const quests = sideQuests.get(characterId) || [];
      
      const analysis = {
        availableBranches: this.getAvailableStoryBranches(memories, emotions, reputations),
        recommendations: this.getStoryRecommendations(memories, emotions, reputations, quests),
        currentContext: this.generateCurrentContext(memories, emotions, reputations),
        nextSuggestedActions: this.getSuggestedActions(memories, emotions, reputations, quests)
      };
      
      res.json(analysis);
    } catch (error) {
      console.error('Error analyzing story:', error);
      res.status(500).json({ error: 'Failed to analyze story' });
    }
  }
  
  private getAvailableStoryBranches(memories: any[], emotions: any[], reputations: any[]): any[] {
    // 간단한 스토리 분기 로직 예시
    const branches: any[] = [];
    
    if (memories.some(m => m.eventType === 'combat' && m.importance === 'major')) {
      branches.push({
        id: 'warrior_path',
        title: '전투의 길',
        description: '당신의 전투 경험을 바탕으로 새로운 도전이 기다립니다',
        priority: 80
      });
    }
    
    if (reputations.some(r => r.reputationLevel === 'honored')) {
      branches.push({
        id: 'diplomatic_path',
        title: '외교의 길',
        description: '높은 평판을 바탕으로 중요한 협상 기회가 생겼습니다',
        priority: 90
      });
    }
    
    return branches.sort((a, b) => b.priority - a.priority);
  }
  
  private getStoryRecommendations(memories: any[], emotions: any[], reputations: any[], quests: any[]): string[] {
    const recommendations: string[] = [];
    
    if (memories.length < 5) {
      recommendations.push('더 많은 활동을 통해 스토리를 발전시켜보세요');
    }
    
    if (emotions.length === 0) {
      recommendations.push('NPC들과 상호작용하여 관계를 구축해보세요');
    }
    
    if (reputations.length === 0) {
      recommendations.push('다양한 세력과 접촉하여 평판을 쌓아보세요');
    }
    
    const activeQuests = quests.filter(q => q.status === 'active');
    if (activeQuests.length === 0) {
      recommendations.push('새로운 퀘스트를 시작해보세요');
    }
    
    return recommendations;
  }
  
  private generateCurrentContext(memories: any[], emotions: any[], reputations: any[]): string {
    let context = '현재 상황:\n';
    
    if (memories.length > 0) {
      const recentMemory = memories[memories.length - 1];
      context += `최근: ${recentMemory.title}\n`;
    }
    
    if (emotions.length > 0) {
      const positiveRelations = emotions.filter(e => 
        (e.emotions.trust || 0) > 20 || (e.emotions.love || 0) > 20
      );
      context += `우호적 관계: ${positiveRelations.length}명\n`;
    }
    
    if (reputations.length > 0) {
      const goodRep = reputations.filter(r => 
        ['friendly', 'honored', 'exalted', 'revered'].includes(r.reputationLevel)
      );
      context += `우호적 세력: ${goodRep.length}개\n`;
    }
    
    return context;
  }
  
  private getSuggestedActions(memories: any[], emotions: any[], reputations: any[], quests: any[]): string[] {
    const actions: string[] = [];
    
    if (quests.some(q => q.status === 'active')) {
      actions.push('진행 중인 퀘스트를 완료하세요');
    }
    
    if (emotions.some(e => Math.abs(e.emotions.hostility || 0) > 30)) {
      actions.push('적대적인 NPC와의 관계를 개선해보세요');
    }
    
    if (reputations.some(r => r.reputationLevel === 'unfriendly')) {
      actions.push('손상된 세력 평판을 회복해보세요');
    }
    
    actions.push('새로운 지역을 탐험해보세요');
    
    return actions;
  }
} 