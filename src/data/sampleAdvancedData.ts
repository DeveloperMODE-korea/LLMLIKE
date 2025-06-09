// 고급 시스템 테스트용 샘플 데이터
import { advancedSystemsService } from '../services/advancedSystemsService';

export async function createSampleAdvancedData(characterId: string) {
  try {
    console.log('Creating sample advanced systems data...');

    // === 1. 샘플 메모리 생성 ===
    await advancedSystemsService.addMemory(characterId, {
      eventType: 'dialogue',
      title: '신비한 상인과의 만남',
      description: '코퍼레이트 플라자에서 이상한 임플란트를 파는 상인을 만났다. 그는 나에게 "신경망의 비밀"에 대해 알고 있다고 했다.',
      importance: 'major',
      tags: ['상인', '임플란트', '신경망', '비밀'],
      npcInvolved: ['mysterious_merchant'],
      location: '코퍼레이트 플라자',
      details: { npcName: '신비한 상인', merchantType: 'cyber_enhancer' }
    });

    await advancedSystemsService.addMemory(characterId, {
      eventType: 'combat',
      title: '데이터 헌터와의 전투',
      description: '언더시티에서 데이터 헌터 무리와 치열한 전투를 벌였다. 그들이 노리던 암호화된 파일을 지켜냈다.',
      importance: 'major',
      tags: ['전투', '데이터헌터', '암호화파일', '언더시티'],
      npcInvolved: ['data_hunters'],
      location: '언더시티',
      details: { combatResult: 'victory', lootGained: '암호화된 데이터' }
    });

    await advancedSystemsService.addMemory(characterId, {
      eventType: 'discovery',
      title: '하모니 네트워크의 흔적 발견',
      description: '미드 레벨 시티의 폐허에서 하모니 네트워크의 고대 통신 장비를 발견했다. 외계 기술의 흔적이 남아있었다.',
      importance: 'critical',
      tags: ['하모니네트워크', '외계기술', '고대장비', '발견'],
      location: '미드 레벨 시티',
      details: { artifactType: 'communication_device', alienTech: true }
    });

    // === 2. 샘플 감정 관계 생성 ===
    await advancedSystemsService.updateNPCEmotion(characterId, 'mysterious_merchant', {
      eventType: 'dialogue',
      emotionChanges: {
        trust: 25,
        curiosity: 40,
        respect: 15
      },
      description: '신비한 상인과의 첫 만남 - 서로에 대한 호기심',
      context: '코퍼레이트 플라자'
    });

    await advancedSystemsService.updateNPCEmotion(characterId, 'data_hunter_leader', {
      eventType: 'combat',
      emotionChanges: {
        hostility: 60,
        anger: 45,
        respect: 20
      },
      description: '데이터 헌터 리더와의 치열한 전투',
      context: '언더시티'
    });

    await advancedSystemsService.updateNPCEmotion(characterId, 'ai_companion', {
      eventType: 'help',
      emotionChanges: {
        trust: 70,
        love: 50,
        respect: 60
      },
      description: 'AI 동료가 위험한 상황에서 나를 구해줌',
      context: '데이터 스페이스'
    });

    // === 3. 샘플 평판 생성 ===
    await advancedSystemsService.updateReputation(characterId, 'synthesists', {
      eventType: 'faction_mission',
      reputationChange: 150,
      description: '신테시스트를 위한 중요한 임무 완료',
      location: '코퍼레이트 플라자',
      npcsInvolved: ['synthesist_leader'],
      publicityLevel: 'regional'
    });

    await advancedSystemsService.updateReputation(characterId, 'purists', {
      eventType: 'betrayal',
      reputationChange: -100,
      description: '퓨어리스트의 계획을 신테시스트에게 누설',
      location: '미드 레벨 시티',
      npcsInvolved: ['purist_agent'],
      publicityLevel: 'local'
    });

    await advancedSystemsService.updateReputation(characterId, 'nexus_corp', {
      eventType: 'quest_completion',
      reputationChange: 75,
      description: '넥서스 코퍼레이션의 데이터 복구 임무 성공',
      location: '코퍼레이트 플라자',
      publicityLevel: 'private'
    });

    // === 4. 샘플 사이드 퀘스트 생성 ===
    await advancedSystemsService.createSideQuest(characterId, {
      title: '잃어버린 기억',
      description: '신비한 상인이 당신의 과거와 관련된 중요한 정보를 가지고 있다고 했습니다. 그의 요청을 들어주고 진실을 알아내세요.',
      type: 'mystery',
      difficulty: 'moderate',
      worldId: 'cyberpunk_2187',
      priority: 90,
      giver: 'mysterious_merchant',
      location: '코퍼레이트 플라자',
      affectedNPCs: ['mysterious_merchant', 'ai_companion'],
      objectives: [
        {
          id: 'obj_1',
          description: '상인과 재차 대화하기',
          type: 'talk',
          target: 'mysterious_merchant',
          currentProgress: 0,
          isCompleted: false,
          isOptional: false
        },
        {
          id: 'obj_2', 
          description: '고대 데이터 조각 3개 수집',
          type: 'collect',
          target: 'ancient_data_fragment',
          quantity: 3,
          currentProgress: 1,
          isCompleted: false,
          isOptional: false,
          hint: '언더시티의 폐허에서 찾을 수 있다'
        }
      ],
      rewards: [
        {
          type: 'experience',
          value: 500,
          description: '500 경험치'
        },
        {
          type: 'item',
          value: 'memory_core',
          description: '기억 저장 코어'
        },
        {
          type: 'reputation',
          value: 50,
          description: '신테시스트 평판 +50',
          factionId: 'synthesists'
        }
      ],
      prerequisites: [],
      status: 'active'
    });

    await advancedSystemsService.createSideQuest(characterId, {
      title: '하모니 네트워크의 신호',
      description: '발견한 외계 통신 장비에서 미약한 신호가 감지됩니다. 이 신호의 근원을 찾아보세요.',
      type: 'exploration',
      difficulty: 'hard',
      worldId: 'cyberpunk_2187',
      priority: 95,
      location: '데이터 스페이스',
      affectedFactions: ['synthesists', 'balancers'],
      objectives: [
        {
          id: 'obj_h1',
          description: '신호 분석을 위한 고급 스캐너 구하기',
          type: 'collect',
          target: 'advanced_scanner',
          currentProgress: 0,
          isCompleted: false,
          isOptional: false
        },
        {
          id: 'obj_h2',
          description: '데이터 스페이스 깊은 곳 탐험',
          type: 'explore',
          target: 'deep_dataspace',
          currentProgress: 0,
          isCompleted: false,
          isOptional: false,
          hint: '위험한 ICE 프로그램들이 있으니 주의하세요'
        },
        {
          id: 'obj_h3',
          description: '외계 신호의 근원 찾기',
          type: 'explore',
          target: 'alien_signal_source',
          currentProgress: 0,
          isCompleted: false,
          isOptional: true
        }
      ],
      rewards: [
        {
          type: 'experience',
          value: 1000,
          description: '1000 경험치'
        },
        {
          type: 'item',
          value: 'harmony_communicator',
          description: '하모니 통신기 (전설급 아이템)'
        },
        {
          type: 'access',
          value: 'harmony_network_contact',
          description: '하모니 네트워크와의 첫 접촉'
        }
      ],
      prerequisites: [
        {
          type: 'item',
          target: 'communication_device',
          value: 1,
          description: '외계 통신 장비 보유'
        }
      ],
      status: 'available'
    });

    await advancedSystemsService.createSideQuest(characterId, {
      title: '데이터 헌터의 복수',
      description: '당신이 물리친 데이터 헌터들의 동료들이 복수를 계획하고 있습니다. 그들의 계획을 저지하세요.',
      type: 'revenge',
      difficulty: 'hard',
      worldId: 'cyberpunk_2187',
      priority: 85,
      location: '언더시티',
      affectedNPCs: ['data_hunter_leader', 'underground_informant'],
      timeLimit: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
      objectives: [
        {
          id: 'obj_r1',
          description: '정보원으로부터 적들의 계획 파악',
          type: 'talk',
          target: 'underground_informant',
          currentProgress: 0,
          isCompleted: false,
          isOptional: false
        },
        {
          id: 'obj_r2',
          description: '데이터 헌터 5명 처치',
          type: 'kill',
          target: 'data_hunter',
          quantity: 5,
          currentProgress: 2,
          isCompleted: false,
          isOptional: false
        },
        {
          id: 'obj_r3',
          description: '리더를 생포하기 (선택)',
          type: 'survive',
          target: 'data_hunter_leader',
          currentProgress: 0,
          isCompleted: false,
          isOptional: true,
          hint: '살려두면 더 많은 정보를 얻을 수 있습니다'
        }
      ],
      rewards: [
        {
          type: 'experience',
          value: 750,
          description: '750 경험치'
        },
        {
          type: 'gold',
          value: 2000,
          description: '2000 크레딧'
        },
        {
          type: 'reputation',
          value: -25,
          description: '언더시티 범죄조직 평판 -25',
          factionId: 'underground_syndicates'
        }
      ],
      prerequisites: [],
      status: 'active'
    });

    console.log('Sample advanced systems data created successfully!');
    
    return {
      success: true,
      message: '고급 시스템 샘플 데이터가 성공적으로 생성되었습니다!'
    };

  } catch (error) {
    console.error('Error creating sample data:', error);
    return {
      success: false,
      message: '샘플 데이터 생성 중 오류가 발생했습니다.'
    };
  }
}

// 게임 시작 시 자동으로 샘플 데이터 생성하는 함수
export async function initializeAdvancedSystems(characterId: string) {
  // 이미 데이터가 있는지 확인
  try {
    const existing = await advancedSystemsService.getMemories(characterId, { limit: 1 });
    if (existing.memories.length > 0) {
      console.log('Advanced systems data already exists for character:', characterId);
      return { success: true, message: '기존 고급 시스템 데이터를 사용합니다.' };
    }

    // 데이터가 없으면 샘플 데이터 생성
    return await createSampleAdvancedData(characterId);
  } catch (error) {
    console.error('Error initializing advanced systems:', error);
    return { success: false, message: '고급 시스템 초기화 실패' };
  }
} 