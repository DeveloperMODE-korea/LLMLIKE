import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { claudeService } from '../services/claudeService';
import { Character, GameState } from '../types/game';

const prisma = new PrismaClient();

// 임시로 사용자 ID를 고정값으로 사용 (추후 인증 시스템 구현 시 변경)
const TEMP_USER_ID = 'temp-user-1';

export const gameController = {
  // 세계관별 능력치를 기존 구조로 매핑
  mapStatsToCharacter(stats: any, worldId: string) {
    console.log('능력치 매핑 시작:', { stats, worldId });

    if (worldId === 'cyberpunk_2187') {
      // 사이버펑크 세계관의 능력치를 기존 구조로 매핑 (개선된 스케일링)
      return {
        health: stats.body || 100,
        mana: stats.neural || 50,
        strength: Math.floor((stats.body || 100) / 5), // 신체/5 (더 높은 힘)
        intelligence: Math.floor((stats.technical || 50) / 4), // 기술력/4 (더 높은 지능)
        dexterity: Math.floor((stats.reflex || 50) / 4), // 반사신경/4 (더 높은 민첩)
        constitution: Math.floor(((stats.cool || 50) + (stats.reputation || 50)) / 8) // 정신력+명성의 평균
      };
    } else {
      // 차원의 균열(기본) 세계관은 그대로 사용
      return {
        health: stats.health || 100,
        mana: stats.mana || 50,
        strength: stats.strength || 10,
        intelligence: stats.intelligence || 10,
        dexterity: stats.dexterity || 10,
        constitution: stats.constitution || 10
      };
    }
  },

  // 세계관별 시작 아이템 가져오기
  getStartingItems(job: string, worldId: string) {
    const itemMap: { [key: string]: { [key: string]: string[] } } = {
      'dimensional_rift': {
        '⚔️ 전사': ['강철 장검', '철제 방패', '사슬 갑옷', '치유 포션 3개'],
        '🔮 마법사': ['마법 지팡이', '마법서', '마법사 로브', '마나 포션 5개'],
        '🗡️ 도적': ['단검 두 자루', '가죽 갑옷', '도적 도구', '독 바른 화살 10개'],
        '✨ 성직자': ['성스러운 메이스', '성직자 로브', '성스러운 방패', '축복받은 물 5개']
      },
      'cyberpunk_2187': {
        '🕶️ 네트러너': ['군사급 사이버덱', '뉴럴 부스터 임플란트', 'ICE 브레이커 프로그램들', '스텔스 코드 라이브러리'],
        '⚡ 테크-사무라이': ['단분자 검 (Monomolecular Blade)', '서브더멀 아머 (피부 아래 방어구)', '타이탄늄 골격 프레임', '어드레날린 부스터'],
        '📺 미디어 해커': ['홀로캠 드론 (은밀 촬영용)', '뉴럴 스트리밍 임플란트', '암호화 커뮤니케이터', '위조 ID 컬렉션'],
        '🧬 바이오-엔지니어': ['포터블 유전자 시퀀서', '생체 샘플 보관함', '바이오 해킹 키트', '면역 부스터 칵테일'],
        '🎵 로커보이': ['뉴럴 링크 기타 (생각으로 연주)', '홀로그래픽 무대 시스템', '저항군 연락망', '불법 방송 장비'],
        '🚗 놈매드 드라이버': ['개조된 호버카 (Modded Hoverbike)', '서바이벌 키트', '레이더 재머', '무선 해킹 도구']
      }
    };

    return itemMap[worldId]?.[job] || [];
  },

  // 세계관별 시작 스킬 가져오기
  getStartingSkills(job: string, worldId: string) {
    const skillMap: { [key: string]: { [key: string]: string[] } } = {
      'dimensional_rift': {
        '⚔️ 전사': ['베기', '방어'],
        '🔮 마법사': ['화염구', '얼음화살'],
        '🗡️ 도적': ['기습', '회피'],
        '✨ 성직자': ['치유', '천벌']
      },
      'cyberpunk_2187': {
        '🕶️ 네트러너': ['해킹', '데이터 조작', 'AI 소통'],
        '⚡ 테크-사무라이': ['근접 전투', '사격', '사이보그 제어'],
        '📺 미디어 해커': ['미디어 조작', '정보 수집', '소셜 엔지니어링'],
        '🧬 바이오-엔지니어': ['생체 해킹', '유전자 조작', '의학'],
        '🎵 로커보이': ['카리스마', '공연', '선동'],
        '🚗 놈매드 드라이버': ['운전', '생존', '기계 수리']
      }
    };

    return skillMap[worldId]?.[job] || [];
  },

  // 캐릭터 생성
  async createCharacter(req: Request, res: Response) {
    try {
      const { name, job, stats, worldId } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: '인증이 필요합니다.'
        });
      }

      console.log('캐릭터 생성 요청:', { name, job, worldId, stats, userId });

      // 게스트 모드 확인
      const isGuestMode = userId === 'guest';
      
      if (isGuestMode) {
        // 게스트 모드: 메모리에서만 처리
        const mappedStats = gameController.mapStatsToCharacter(stats, worldId || 'dimensional_rift');
        
        const guestCharacter = {
          id: 'guest-character',
          name,
          job,
          level: 1,
          health: mappedStats.health,
          maxHealth: mappedStats.health,
          mana: mappedStats.mana,
          maxMana: mappedStats.mana,
          strength: mappedStats.strength,
          intelligence: mappedStats.intelligence,
          dexterity: mappedStats.dexterity,
          constitution: mappedStats.constitution,
          gold: 0,
          experience: 0,
          userId: 'guest',
          items: gameController.getStartingItems(job, worldId || 'dimensional_rift').map((itemName, index) => ({
            id: `guest-item-${index}`,
            name: itemName,
            description: `시작 장비: ${itemName}`,
            type: 'equipment',
            value: 1,
            characterId: 'guest-character'
          })),
          skills: gameController.getStartingSkills(job, worldId || 'dimensional_rift').map((skillName, index) => ({
            id: `guest-skill-${index}`,
            name: skillName,
            description: `기본 스킬: ${skillName}`,
            manaCost: 5,
            damage: skillName.includes('공격') || skillName.includes('베기') || skillName.includes('기습') ? 10 : null,
            healing: skillName.includes('치유') ? 15 : null,
            characterId: 'guest-character'
          })),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const guestGameState = {
          id: 'guest-gamestate',
          currentStage: 0,
          gameStatus: 'playing',
          waitingForApi: false,
          userId: 'guest',
          characterId: 'guest-character',
          storyEvents: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        console.log('게스트 캐릭터 생성 완료 (메모리에서만)');

        res.json({
          success: true,
          data: {
            character: guestCharacter,
            gameState: guestGameState
          }
        });
        return;
      }

      // 일반 모드: 데이터베이스에 저장
      const mappedStats = gameController.mapStatsToCharacter(stats, worldId || 'dimensional_rift');

      console.log('매핑된 능력치:', mappedStats);

      // 캐릭터 생성
      const character = await prisma.character.create({
        data: {
          name,
          job,
          health: mappedStats.health,
          maxHealth: mappedStats.health,
          mana: mappedStats.mana,
          maxMana: mappedStats.mana,
          strength: mappedStats.strength,
          intelligence: mappedStats.intelligence,
          dexterity: mappedStats.dexterity,
          constitution: mappedStats.constitution,
          userId: userId
        }
      });

      console.log('캐릭터 생성 완료:', character.id);

      // 시작 아이템 추가
      const startingItems = gameController.getStartingItems(job, worldId || 'dimensional_rift');
      console.log('시작 아이템 추가:', startingItems);
      
      for (const itemName of startingItems) {
        await prisma.item.create({
          data: {
            name: itemName,
            description: `시작 장비: ${itemName}`,
            type: 'equipment',
            value: 1,
            characterId: character.id
          }
        });
      }

      // 시작 스킬 추가
      const startingSkills = gameController.getStartingSkills(job, worldId || 'dimensional_rift');
      console.log('시작 스킬 추가:', startingSkills);
      
      for (const skillName of startingSkills) {
        await prisma.skill.create({
          data: {
            name: skillName,
            description: `기본 스킬: ${skillName}`,
            manaCost: 5, // 기본 마나 비용
            damage: skillName.includes('공격') || skillName.includes('베기') || skillName.includes('기습') ? 10 : null,
            healing: skillName.includes('치유') ? 15 : null,
            characterId: character.id
          }
        });
      }

      // 게임 상태 생성
      const gameState = await prisma.gameState.create({
        data: {
          userId: userId,
          characterId: character.id,
          gameStatus: 'playing'
        }
      });

      // 생성된 캐릭터 정보를 아이템과 스킬 포함해서 다시 조회
      const fullCharacter = await prisma.character.findUnique({
        where: { id: character.id },
        include: {
          items: true,
          skills: true
        }
      });

      console.log('시작 장비 및 스킬 추가 완료');

      res.json({
        success: true,
        data: {
          character: fullCharacter,
          gameState
        }
      });

    } catch (error) {
      console.error('캐릭터 생성 오류:', error);
      res.status(500).json({
        success: false,
        message: '캐릭터 생성 중 오류가 발생했습니다.'
      });
    }
  },

  // 스토리 생성 (Claude API 사용)
  async generateStory(req: Request, res: Response) {
    try {
      const { 
        characterId, 
        userChoice, 
        characterMemories = [], 
        npcRelationships = [], 
        factionReputations = [], 
        activeSideQuests = [], 
        gameContext = {} 
      } = req.body;

      const userId = req.user?.userId;

      console.log('🎮 스토리 생성 요청 (고급 시스템 포함):', {
        characterId,
        userChoice,
        memoriesCount: characterMemories.length,
        relationshipsCount: npcRelationships.length,
        reputationsCount: factionReputations.length,
        sideQuestsCount: activeSideQuests.length
      });

      // 게스트 모드 확인
      const isGuestMode = userId === 'guest';
      
      if (isGuestMode) {
        // 게스트 모드: Claude Haiku 모델 사용
        console.log('🎮 게스트 모드에서 Claude Haiku 모델로 스토리 생성');
        
        // 간단한 게스트용 캐릭터 데이터 생성
        const guestCharacterData: Character = {
          id: 'guest-character',
          name: 'Guest Player',
          job: 'Adventurer' as any,
          level: 1,
          health: 100,
          maxHealth: 100,
          mana: 50,
          maxMana: 50,
          strength: 10,
          intelligence: 10,
          dexterity: 10,
          constitution: 10,
          inventory: [],
          gold: 100,
          experience: 0,
          skills: []
        };

        try {
          // Claude API로 스토리 생성 (게스트 모드용 Haiku 모델 사용)
          const storyResponse = await claudeService.generateStory({
            character: guestCharacterData,
            currentStage: gameContext.currentStage || 0,
            storyHistory: [],
            userChoice,
            gameContext
          }, userId); // 'guest' userId 전달로 Haiku 모델 사용

          res.json({
            success: true,
            data: {
              storyEvent: {
                id: `guest-story-${Date.now()}`,
                stageNumber: (gameContext.currentStage || 0) + 1,
                content: storyResponse.content,
                choices: storyResponse.choices,
                type: storyResponse.type,
                enemyId: storyResponse.enemyId
              },
              character: null // 게스트 모드에서는 캐릭터 업데이트 없음
            }
          });
          return;
        } catch (error) {
          console.error('게스트 모드 Claude API 오류:', error);
          // Claude API 실패 시 fallback 스토리 사용
        }
        
        // Claude API 실패 시 fallback 스토리
        const fallbackStories = {
          'dimensional_rift': {
            content: `차원의 균열에서 이상한 에너지가 솟아납니다. 당신의 주변이 일렁이며 현실이 왜곡되기 시작합니다. 균열 너머로 다른 차원의 모습이 보이고, 그곳에서 무언가 강력한 존재가 당신을 바라보고 있는 것 같습니다.`,
            choices: [
              { id: 1, text: "균열 속으로 뛰어든다" },
              { id: 2, text: "차원 마법으로 균열을 조사한다" },
              { id: 3, text: "균열을 봉인하려고 시도한다" },
              { id: 4, text: "안전한 거리에서 관찰한다" }
            ]
          },
          'cyberpunk_2187': {
            content: `네온 불빛이 번쩍이는 야간 거리에서 당신은 수상한 움직임을 감지합니다. 해커들의 은밀한 거래가 이루어지고 있는 것 같고, 당신의 사이버웨어가 주변의 디지털 신호를 포착하기 시작합니다.`,
            choices: [
              { id: 1, text: "해킹으로 그들의 대화를 엿듣는다" },
              { id: 2, text: "은밀하게 접근한다" },
              { id: 3, text: "사이버웨어로 주변을 스캔한다" },
              { id: 4, text: "다른 길로 우회한다" }
            ]
          }
        };

        const worldId = gameContext.worldId || 'dimensional_rift';
        const story = (fallbackStories as any)[worldId] || fallbackStories['dimensional_rift'];
        
        const storyEvent = {
          id: `guest-story-${Date.now()}`,
          stageNumber: (gameContext.currentStage || 0) + 1,
          content: story.content,
          choices: story.choices,
          type: '이야기',
          enemyId: null
        };

        res.json({
          success: true,
          data: {
            storyEvent,
            character: null // 게스트 모드에서는 캐릭터 업데이트 없음
          }
        });
        return;
      }

      // 일반 모드: 데이터베이스 조회 및 Claude API 사용
      const character = await prisma.character.findUnique({
        where: { id: characterId },
        include: { 
          items: true,
          skills: true,
          gameState: {
            include: {
              storyEvents: {
                orderBy: { createdAt: 'asc' }
              }
            }
          }
        }
      });

      if (!character || !character.gameState) {
        return res.status(404).json({
          success: false,
          message: '캐릭터 또는 게임 상태를 찾을 수 없습니다.'
        });
      }

      // API 대기 상태로 변경
      await prisma.gameState.update({
        where: { id: character.gameState.id },
        data: { waitingForApi: true }
      });

      // 스토리 히스토리 변환
      const storyHistory = character.gameState.storyEvents.map((event: any) => ({
        id: event.id,
        stageNumber: event.stageNumber,
        content: event.content,
        choices: event.choices as any,
        type: event.type as any,
        enemyId: event.enemyId || undefined,
        result: event.result || undefined,
        selectedChoice: event.selectedChoice || undefined
      })) as any;

      // Claude API로 스토리 생성
      const characterData: Character = {
        id: character.id,
        name: character.name,
        job: character.job as any,
        level: character.level,
        health: character.health,
        maxHealth: character.maxHealth,
        mana: character.mana,
        maxMana: character.maxMana,
        strength: character.strength,
        intelligence: character.intelligence,
        dexterity: character.dexterity,
        constitution: character.constitution,
        inventory: character.items as any,
        gold: character.gold,
        experience: character.experience,
        skills: character.skills as any
      };

      // 고급 시스템 데이터를 포함하여 Claude API 호출
      const storyResponse = await claudeService.generateStory({
        character: characterData,
        currentStage: character.gameState.currentStage,
        storyHistory,
        userChoice,
        // 고급 시스템 컨텍스트 추가
        advancedSystems: {
          characterMemories,
          npcRelationships,
          factionReputations,
          activeSideQuests
        },
        gameContext
      }, TEMP_USER_ID);

      // 새로운 스토리 이벤트 저장
      const newStoryEvent = await prisma.storyEvent.create({
        data: {
          stageNumber: character.gameState.currentStage + 1,
          content: storyResponse.content,
          choices: storyResponse.choices,
          type: storyResponse.type,
          enemyId: storyResponse.enemyId,
          gameStateId: character.gameState.id
        }
      });

      // 캐릭터 상태 업데이트 (Claude API에서 변경사항이 있는 경우)
      let updatedCharacter = character;
      if (storyResponse.characterChanges) {
        const changes = storyResponse.characterChanges;
        console.log('🔄 캐릭터 상태 변경:', changes);
        console.log('📊 변경 전 상태:', {
          health: `${character.health}/${character.maxHealth}`,
          mana: `${character.mana}/${character.maxMana}`,
          gold: character.gold,
          experience: character.experience
        });
        
        const updateData: any = {};
        
        if (changes.health !== undefined) {
          const newHealth = Math.max(0, Math.min(changes.health, character.maxHealth));
          const healthDiff = newHealth - character.health;
          console.log(`💊 체력 변화: ${character.health} → ${newHealth} (${healthDiff >= 0 ? '+' : ''}${healthDiff})`);
          updateData.health = newHealth;
        }
        if (changes.mana !== undefined) {
          const newMana = Math.max(0, Math.min(changes.mana, character.maxMana));
          const manaDiff = newMana - character.mana;
          console.log(`🔮 마나 변화: ${character.mana} → ${newMana} (${manaDiff >= 0 ? '+' : ''}${manaDiff})`);
          updateData.mana = newMana;
        }
        if (changes.gold !== undefined) {
          const newGold = Math.max(0, changes.gold);
          const goldDiff = newGold - character.gold;
          console.log(`💰 골드 변화: ${character.gold} → ${newGold} (${goldDiff >= 0 ? '+' : ''}${goldDiff})`);
          updateData.gold = newGold;
        }
        if (changes.experience !== undefined) {
          const newExp = Math.max(character.experience, changes.experience); // 경험치는 절대 감소하지 않음
          const expDiff = newExp - character.experience;
          
          if (changes.experience < character.experience) {
            console.log(`⚠️  경험치 감소 시도 감지! ${character.experience} → ${changes.experience} (무시됨)`);
            console.log(`✅ 경험치 유지: ${character.experience}`);
          } else {
            console.log(`⭐ 경험치 변화: ${character.experience} → ${newExp} (${expDiff >= 0 ? '+' : ''}${expDiff})`);
          }
          
          updateData.experience = newExp;
        }
        
        // 새로운 스킬 추가
        if (changes.newSkills && changes.newSkills.length > 0) {
          console.log('🎯 새로운 스킬 추가:', changes.newSkills);
          
          for (const skillData of changes.newSkills) {
            await prisma.skill.create({
              data: {
                name: skillData.name,
                description: skillData.description,
                manaCost: skillData.manaCost,
                damage: skillData.damage || null,
                healing: skillData.healing || null,
                effects: skillData.effects || null,
                characterId: characterId
              }
            });
            console.log(`✅ 스킬 추가됨: ${skillData.name} (${skillData.manaCost} MP)`);
          }
        }

        // 새로운 아이템 추가 (중복 체크)
        if (changes.newItems && changes.newItems.length > 0) {
          console.log('📦 새로운 아이템 추가:', changes.newItems);
          
          // 현재 캐릭터의 모든 아이템 조회
          const existingItems = await prisma.item.findMany({
            where: { characterId: characterId },
            select: { name: true }
          });
          
          const existingItemNames = existingItems.map(item => item.name);
          
          for (const itemName of changes.newItems) {
            // 중복 아이템 체크
            if (!existingItemNames.includes(itemName)) {
            await prisma.item.create({
              data: {
                name: itemName,
                description: `획득한 아이템: ${itemName}`,
                type: 'misc', // 기본 타입
                value: 1, // 기본 가치
                characterId: characterId
              }
            });
            console.log(`✅ 아이템 추가됨: ${itemName}`);
            } else {
              console.log(`⚠️ 중복 아이템 스킵: ${itemName} (이미 보유 중)`);
            }
          }
        }
        
        if (Object.keys(updateData).length > 0) {
          updatedCharacter = await prisma.character.update({
            where: { id: characterId },
            data: updateData,
            include: {
              items: true,
              skills: true,
              gameState: {
                include: {
                  storyEvents: {
                    orderBy: { createdAt: 'asc' }
                  }
                }
              }
            }
          });
          
          console.log('✅ 캐릭터 상태 업데이트 완료:', {
            health: `${updatedCharacter.health}/${updatedCharacter.maxHealth}`,
            mana: `${updatedCharacter.mana}/${updatedCharacter.maxMana}`,
            gold: updatedCharacter.gold,
            experience: updatedCharacter.experience
          });

          // 레벨업 체크 및 처리
          const requiredExp = updatedCharacter.level * 100;
          if (updatedCharacter.experience >= requiredExp) {
            const newLevel = updatedCharacter.level + 1;
            const remainingExp = updatedCharacter.experience - requiredExp;
            
            console.log(`🎉 레벨업! 레벨 ${updatedCharacter.level} → ${newLevel}`);
            console.log(`📈 남은 경험치: ${remainingExp}`);
            
            // 레벨업 시 스탯 증가
            const levelUpData = {
              level: newLevel,
              experience: remainingExp,
              maxHealth: updatedCharacter.maxHealth + 20,
              health: updatedCharacter.maxHealth + 20, // 레벨업 시 체력 완전 회복
              maxMana: updatedCharacter.maxMana + 10,
              mana: updatedCharacter.maxMana + 10, // 레벨업 시 마나 완전 회복
              strength: updatedCharacter.strength + 2,
              intelligence: updatedCharacter.intelligence + 2,
              dexterity: updatedCharacter.dexterity + 2,
              constitution: updatedCharacter.constitution + 2
            };
            
            updatedCharacter = await prisma.character.update({
              where: { id: characterId },
              data: levelUpData,
              include: {
                items: true,
                skills: true,
                gameState: {
                  include: {
                    storyEvents: {
                      orderBy: { createdAt: 'asc' }
                    }
                  }
                }
              }
            });
            
            console.log('🚀 레벨업 완료:', {
              level: updatedCharacter.level,
              health: `${updatedCharacter.health}/${updatedCharacter.maxHealth}`,
              mana: `${updatedCharacter.mana}/${updatedCharacter.maxMana}`,
              experience: `${updatedCharacter.experience}/${updatedCharacter.level * 100}`,
              stats: {
                strength: updatedCharacter.strength,
                intelligence: updatedCharacter.intelligence,
                dexterity: updatedCharacter.dexterity,
                constitution: updatedCharacter.constitution
              }
            });
          }
        }
      }

      // 게임 상태 업데이트
      await prisma.gameState.update({
        where: { id: character.gameState.id },
        data: {
          currentStage: character.gameState.currentStage + 1,
          waitingForApi: false
        }
      });

      // 고급 시스템 자동 업데이트
      try {
        // 새로운 이벤트를 메모리에 자동 기록
        if (newStoryEvent.content) {
          const memoryImportance = newStoryEvent.type === '전투' ? 'major' : 
                                   newStoryEvent.type === '보물' ? 'moderate' : 'minor';
          
          console.log('🧠 새로운 메모리 자동 기록:', newStoryEvent.stageNumber);
          
          // 간단한 기억 시스템 - 실제 고급 시스템 API가 구현되면 대체 예정
          // await advancedSystemsService.addMemory(characterId, {
          //   eventType: 'story',
          //   title: `스테이지 ${newStoryEvent.stageNumber}`,
          //   description: newStoryEvent.content.substring(0, 100),
          //   importance: memoryImportance
          // });
        }
      } catch (error) {
        console.warn('고급 시스템 업데이트 실패 (무시됨):', error);
      }

      res.json({
        success: true,
        data: {
          storyEvent: newStoryEvent,
          currentStage: character.gameState.currentStage + 1,
          character: {
            id: updatedCharacter.id,
            name: updatedCharacter.name,
            job: updatedCharacter.job,
            level: updatedCharacter.level,
            health: updatedCharacter.health,
            maxHealth: updatedCharacter.maxHealth,
            mana: updatedCharacter.mana,
            maxMana: updatedCharacter.maxMana,
            strength: updatedCharacter.strength,
            intelligence: updatedCharacter.intelligence,
            dexterity: updatedCharacter.dexterity,
            constitution: updatedCharacter.constitution,
            inventory: updatedCharacter.items,
            gold: updatedCharacter.gold,
            experience: updatedCharacter.experience,
            skills: updatedCharacter.skills
          }
        }
      });

    } catch (error) {
      console.error('스토리 생성 오류:', error);
      
      // API 대기 상태 해제
      if (req.body.characterId) {
        const character = await prisma.character.findUnique({
          where: { id: req.body.characterId },
          include: { gameState: true }
        });
        
        if (character?.gameState) {
          await prisma.gameState.update({
            where: { id: character.gameState.id },
            data: { waitingForApi: false }
          });
        }
      }

      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '스토리 생성 중 오류가 발생했습니다.'
      });
    }
  },

  // 게임 상태 조회
  async getGameState(req: Request, res: Response) {
    try {
      const { characterId } = req.params;

      const character = await prisma.character.findUnique({
        where: { id: characterId },
        include: {
          items: true,
          skills: true,
          gameState: {
            include: {
              storyEvents: {
                orderBy: { createdAt: 'asc' }
              }
            }
          }
        }
      });

      if (!character) {
        return res.status(404).json({
          success: false,
          message: '캐릭터를 찾을 수 없습니다.'
        });
      }

      res.json({
        success: true,
        data: character
      });

    } catch (error) {
      console.error('게임 상태 조회 오류:', error);
      res.status(500).json({
        success: false,
        message: '게임 상태 조회 중 오류가 발생했습니다.'
      });
    }
  },

  // 선택지 제출
  async submitChoice(req: Request, res: Response) {
    try {
      const { storyEventId, choiceId } = req.body;

      const storyEvent = await prisma.storyEvent.update({
        where: { id: storyEventId },
        data: { selectedChoice: choiceId }
      });

      res.json({
        success: true,
        data: storyEvent
      });

    } catch (error) {
      console.error('선택지 제출 오류:', error);
      res.status(500).json({
        success: false,
        message: '선택지 제출 중 오류가 발생했습니다.'
      });
    }
  }
}; 