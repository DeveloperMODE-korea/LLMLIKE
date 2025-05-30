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
      const storyHistory = character.gameState.storyEvents.map(event => ({
        id: event.id,
        stageNumber: event.stageNumber,
        content: event.content,
        choices: event.choices as any,
        type: event.type as any,
        enemyId: event.enemyId || undefined,
        result: event.result || undefined,
        selectedChoice: event.selectedChoice || undefined
      }));

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
          currentStage: character.gameState.currentStage + 1
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