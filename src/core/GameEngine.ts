// 🎮 게임 엔진 - 모든 게임 로직의 중앙 관리자

import { EventEmitter } from 'events';
import { 
  GameState, 
  Character, 
  GameEvent, 
  Choice, 
  WorldSettingId,
  AdvancedSystemsData,
  LoadingState,
  GameEvent_Internal 
} from '../shared/types';
import { appConfig, gameConstants } from '../shared/config';
import { StateManager } from './StateManager';
import { WorldManager } from './WorldManager';
import { ApiService } from '../services/ApiService';

/**
 * 🎯 게임 엔진 클래스
 * - 모든 게임 로직의 중앙 관리자
 * - 이벤트 기반 아키텍처로 모듈 간 통신
 * - 상태 관리, 세이브/로드, AI 호출 등 모든 핵심 기능 담당
 */
export class GameEngine extends EventEmitter {
  private static instance: GameEngine;
  private stateManager: StateManager;
  private worldManager: WorldManager;
  private apiService: ApiService;
  private gameState: GameState | null = null;
  private loadingState: LoadingState = 'idle';
  private isGuestMode: boolean = false;

  private constructor() {
    super();
    this.stateManager = StateManager.getInstance();
    this.worldManager = WorldManager.getInstance();
    this.apiService = ApiService.getInstance();
    this.setupEventListeners();
  }

  /**
   * 싱글톤 인스턴스 가져오기
   */
  static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  // ======================
  // 🎮 Core Game Methods
  // ======================

  /**
   * 게임 초기화
   */
  async initialize(): Promise<void> {
    try {
      console.log('🎮 GameEngine 초기화 시작...');
      
      // 게스트 모드 확인
      this.isGuestMode = localStorage.getItem('guestMode') === 'true';
      
      // 저장된 게임 상태 로드 시도
      if (!this.isGuestMode) {
        await this.loadGameState();
      }

      this.emit('engine:initialized');
      console.log('✅ GameEngine 초기화 완료');
    } catch (error) {
      console.error('❌ GameEngine 초기화 실패:', error);
      this.emit('engine:error', error);
    }
  }

  /**
   * 새 게임 시작
   */
  async startNewGame(character: Character, worldId: WorldSettingId): Promise<void> {
    try {
      this.setLoading('loading');
      this.emit('game:starting');

      console.log('🎮 새 게임 시작:', { character: character.name, worldId });

      // 캐릭터 생성 API 호출
      const createResult = await this.apiService.createCharacter({
        name: character.name,
        job: character.job,
        stats: character.stats,
        worldId
      });

      // 게임 상태 초기화
      this.gameState = {
        id: createResult.gameState?.id || 'game-state-1',
        characterId: createResult.character.id,
        currentStage: 0,
        gameStatus: 'playing',
        worldContext: {
          worldId,
          currentRegion: this.worldManager.getStartingRegion(worldId),
          timeOfDay: 'morning',
          weather: 'clear',
          season: 'spring'
        },
        advancedSystems: {
          memories: [],
          relationships: [],
          reputations: [],
          sideQuests: []
        },
        waitingForApi: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // 캐릭터 정보 업데이트
      character.id = createResult.character.id;
      character.worldId = worldId;

      // 상태 저장
      this.stateManager.updateCharacter(character);
      this.stateManager.updateGameState(this.gameState);

      // 첫 번째 스토리 이벤트 생성
      await this.generateNextStory();

      this.setLoading('success');
      this.emit('game:started', { character, gameState: this.gameState });

    } catch (error) {
      this.setLoading('error');
      console.error('❌ 새 게임 시작 실패:', error);
      this.emit('game:error', error);
    }
  }

  /**
   * 선택지 처리
   */
  async processChoice(choiceId: number): Promise<void> {
    if (!this.gameState || !this.gameState.currentEvent) {
      throw new Error('게임 상태 또는 현재 이벤트가 없습니다.');
    }

    try {
      this.setLoading('loading');
      this.emit('choice:processing', choiceId);

      const choice = this.gameState.currentEvent.choices.find(c => c.id === choiceId);
      if (!choice) {
        throw new Error(`유효하지 않은 선택지 ID: ${choiceId}`);
      }

      console.log('🎯 선택지 처리:', choice.text);

      // 게스트 모드 특별 처리
      if (this.gameState.currentEvent.type === 'guestLimit') {
        await this.handleGuestLimitChoice(choiceId);
        return;
      }

      // 선택지 결과 적용
      await this.applyChoiceConsequences(choice);

      // 다음 스토리 생성
      await this.generateNextStory(choice.text);

      // 스테이지 증가
      this.gameState.currentStage++;
      this.gameState.updatedAt = new Date();

      // 상태 저장
      this.stateManager.updateGameState(this.gameState);

      this.setLoading('success');
      this.emit('choice:processed', { choice, gameState: this.gameState });

    } catch (error) {
      this.setLoading('error');
      console.error('❌ 선택지 처리 실패:', error);
      this.emit('choice:error', error);
    }
  }

  /**
   * 다음 스토리 생성
   */
  private async generateNextStory(userChoice?: string): Promise<void> {
    if (!this.gameState) {
      throw new Error('게임 상태가 없습니다.');
    }

    try {
      console.log('📖 스토리 생성 시작...');

      // 게스트 모드 체크
      if (this.isGuestMode && this.gameState.currentStage >= appConfig.game.guestModeLimit) {
        this.gameState.currentEvent = this.createGuestLimitEvent();
        this.emit('story:generated', this.gameState.currentEvent);
        return;
      }

      // 고급 시스템 데이터 수집
      const character = this.stateManager.getCharacter();
      if (!character) {
        throw new Error('캐릭터 정보가 없습니다.');
      }

      const advancedData = await this.collectAdvancedSystemsData(character.id);

      // API 호출을 위한 데이터 준비
      const storyData = {
        characterId: character.id,
        userChoice,
        characterMemories: advancedData.memories,
        npcRelationships: advancedData.relationships,
        factionReputations: advancedData.reputations,
        activeSideQuests: advancedData.sideQuests,
        gameContext: {
          stage: this.gameState.currentStage,
          worldContext: this.gameState.worldContext,
          character: this.stateManager.getCharacterSnapshot()
        }
      };

      // AI 스토리 생성 호출
      const response = await this.apiService.generateStory(storyData);

      // 스토리 이벤트 생성
      this.gameState.currentEvent = {
        id: `event-${Date.now()}`,
        type: response.type || 'story',
        title: response.title || '새로운 상황',
        content: response.content,
        choices: response.choices || [],
        metadata: response.metadata
      };

      // 메모리 자동 기록
      if (response.content) {
        await this.recordMemory(character.id, response.content, 'discovery');
      }

      this.emit('story:generated', this.gameState.currentEvent);
      console.log('✅ 스토리 생성 완료');

    } catch (error) {
      console.error('❌ 스토리 생성 실패:', error);
      
      // 폴백 스토리 생성
      this.gameState.currentEvent = this.createFallbackEvent();
      this.emit('story:fallback', this.gameState.currentEvent);
    }
  }

  // ======================
  // 🔄 State Management
  // ======================

  /**
   * 게임 상태 로드
   */
  private async loadGameState(): Promise<void> {
    try {
      const character = this.stateManager.getCharacter();
      if (character) {
        const serverGameState = await this.apiService.getGameState(character.id);
        if (serverGameState) {
          this.gameState = serverGameState;
          this.emit('state:loaded', this.gameState);
        }
      }
    } catch (error) {
      console.warn('⚠️ 게임 상태 로드 실패 (새 게임 시작 가능):', error);
    }
  }

  /**
   * 게임 상태 저장
   */
  async saveGameState(): Promise<void> {
    if (!this.gameState || this.isGuestMode) return;

    try {
      this.stateManager.updateGameState(this.gameState);
      this.emit('state:saved', this.gameState);
    } catch (error) {
      console.error('❌ 게임 상태 저장 실패:', error);
      this.emit('state:save-error', error);
    }
  }

  // ======================
  // 🧠 Advanced Systems
  // ======================

  /**
   * 고급 시스템 데이터 수집
   */
  private async collectAdvancedSystemsData(characterId: string): Promise<AdvancedSystemsData> {
    try {
      // 실제 구현에서는 advancedSystemsService 호출
      return {
        memories: [],
        relationships: [],
        reputations: [],
        sideQuests: []
      };
    } catch (error) {
      console.warn('⚠️ 고급 시스템 데이터 수집 실패:', error);
      return {
        memories: [],
        relationships: [],
        reputations: [],
        sideQuests: []
      };
    }
  }

  /**
   * 메모리 기록
   */
  private async recordMemory(
    characterId: string, 
    content: string, 
    category: 'combat' | 'dialogue' | 'discovery' | 'achievement'
  ): Promise<void> {
    try {
      const importance = this.calculateMemoryImportance(content, category);
      
      if (importance >= gameConstants.MEMORY_IMPORTANCE_THRESHOLD) {
        // 메모리 저장 API 호출 (실제 구현 시)
        console.log('📝 중요한 메모리 기록:', { content, importance });
      }
    } catch (error) {
      console.warn('⚠️ 메모리 기록 실패:', error);
    }
  }

  /**
   * 메모리 중요도 계산
   */
  private calculateMemoryImportance(content: string, category: string): number {
    let importance = 3; // 기본값

    // 카테고리별 가중치
    const categoryWeights = {
      achievement: 3,
      combat: 2,
      dialogue: 1,
      discovery: 2
    };

    importance += categoryWeights[category as keyof typeof categoryWeights] || 0;

    // 키워드 기반 중요도 추가
    const importantKeywords = ['죽음', '승리', '발견', '비밀', '보상', '실패'];
    importantKeywords.forEach(keyword => {
      if (content.includes(keyword)) importance += 1;
    });

    return Math.min(importance, 10);
  }

  // ======================
  // 🎯 Helper Methods
  // ======================

  /**
   * 선택지 결과 적용
   */
  private async applyChoiceConsequences(choice: Choice): Promise<void> {
    if (!choice.consequences) return;

    const character = this.stateManager.getCharacter();
    if (!character) return;

    // 스탯 변화 적용
    if (choice.consequences.statsChange) {
      Object.entries(choice.consequences.statsChange).forEach(([stat, change]) => {
        if (character.stats[stat] !== undefined) {
          character.stats[stat] += change;
        }
      });
      this.stateManager.updateCharacter(character);
    }

    // 관계도 변화, 명성 변화, 아이템 획득/손실 등도 여기서 처리
    // (실제 구현 시 advancedSystemsService 호출)
  }

  /**
   * 게스트 제한 이벤트 생성
   */
  private createGuestLimitEvent(): GameEvent {
    return {
      id: 'guest-limit-event',
      type: 'guestLimit',
      title: '🎮 게스트 모드 제한',
      content: `게스트 모드에서는 ${appConfig.game.guestModeLimit}단계까지만 플레이할 수 있습니다. 더 많은 모험을 경험하려면 회원가입을 해주세요!`,
      choices: [
        { id: 1, text: '회원가입하고 모험 계속하기' },
        { id: 2, text: '게스트 모드 재시작' }
      ]
    };
  }

  /**
   * 폴백 이벤트 생성
   */
  private createFallbackEvent(): GameEvent {
    return {
      id: 'fallback-event',
      type: 'story',
      title: '⚠️ 연결 문제',
      content: 'AI 서비스와의 연결에 문제가 발생했습니다. 기본 이벤트로 진행합니다.',
      choices: [
        { id: 1, text: '계속 진행하기' },
        { id: 2, text: '다시 시도하기' }
      ]
    };
  }

  /**
   * 게스트 제한 선택지 처리
   */
  private async handleGuestLimitChoice(choiceId: number): Promise<void> {
    if (choiceId === 1) {
      // 회원가입으로 리다이렉트
      localStorage.removeItem('guestMode');
      this.emit('guest:signup-redirect');
    } else if (choiceId === 2) {
      // 게스트 모드 재시작
      this.emit('guest:restart');
    }
  }

  /**
   * 로딩 상태 설정
   */
  private setLoading(state: LoadingState): void {
    this.loadingState = state;
    this.emit('loading:changed', state);
  }

  /**
   * 이벤트 리스너 설정
   */
  private setupEventListeners(): void {
    // 자동 저장 설정
    setInterval(() => {
      this.saveGameState();
    }, appConfig.game.autoSaveInterval);

    // 브라우저 종료 시 저장
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.saveGameState();
      });
    }
  }

  // ======================
  // 🔍 Getters
  // ======================

  getGameState(): GameState | null {
    return this.gameState;
  }

  getLoadingState(): LoadingState {
    return this.loadingState;
  }

  isGameActive(): boolean {
    return this.gameState?.gameStatus === 'playing';
  }

  getCurrentStage(): number {
    return this.gameState?.currentStage || 0;
  }

  getCurrentEvent(): GameEvent | undefined {
    return this.gameState?.currentEvent;
  }
}

// Export
export default GameEngine; 