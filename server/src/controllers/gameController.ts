import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { claudeService } from '../services/claudeService';
import { Character, GameState } from '../types/game';

const prisma = new PrismaClient();

// 임시로 사용자 ID를 고정값으로 사용 (추후 인증 시스템 구현 시 변경)
const TEMP_USER_ID = 'temp-user-1';

export const gameController = {
  // 캐릭터 생성
  async createCharacter(req: Request, res: Response) {
    try {
      const { name, job, stats } = req.body;

      // 사용자가 없으면 생성
      await prisma.user.upsert({
        where: { id: TEMP_USER_ID },
        update: {},
        create: { id: TEMP_USER_ID }
      });

      // 캐릭터 생성
      const character = await prisma.character.create({
        data: {
          name,
          job,
          health: stats.health,
          maxHealth: stats.health,
          mana: stats.mana,
          maxMana: stats.mana,
          strength: stats.strength,
          intelligence: stats.intelligence,
          dexterity: stats.dexterity,
          constitution: stats.constitution,
          userId: TEMP_USER_ID
        }
      });

      // 게임 상태 생성
      const gameState = await prisma.gameState.create({
        data: {
          userId: TEMP_USER_ID,
          characterId: character.id,
          gameStatus: 'playing'
        }
      });

      res.json({
        success: true,
        data: {
          character,
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
      const { characterId, userChoice } = req.body;

      // 캐릭터와 게임 상태 조회
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

      const storyResponse = await claudeService.generateStory({
        character: characterData,
        currentStage: character.gameState.currentStage,
        storyHistory,
        userChoice
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

        // 새로운 아이템 추가
        if (changes.newItems && changes.newItems.length > 0) {
          console.log('📦 새로운 아이템 추가:', changes.newItems);
          
          for (const itemName of changes.newItems) {
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