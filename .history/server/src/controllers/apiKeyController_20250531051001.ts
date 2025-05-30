import { Request, Response } from 'express';
import { claudeService } from '../services/claudeService';

// 임시로 사용자 ID를 고정값으로 사용 (추후 인증 시스템 구현 시 변경)
const TEMP_USER_ID = 'temp-user-1';

export const apiKeyController = {
  // API 키 설정
  async setApiKey(req: Request, res: Response) {
    try {
      const { apiKey } = req.body;

      if (!apiKey || typeof apiKey !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'API 키가 필요합니다.'
        });
      }

      // API 키 유효성 검사
      const isValid = await claudeService.testApiKey(apiKey);
      
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: '유효하지 않은 API 키입니다.'
        });
      }

      // DB에 저장
      await claudeService.setUserApiKey(TEMP_USER_ID, apiKey);

      res.json({
        success: true,
        message: 'API 키가 성공적으로 설정되었습니다.'
      });

    } catch (error) {
      console.error('API 키 설정 오류:', error);
      res.status(500).json({
        success: false,
        message: 'API 키 설정 중 오류가 발생했습니다.'
      });
    }
  },

  // API 키 존재 여부 확인
  async checkApiKey(req: Request, res: Response) {
    try {
      const apiKey = await claudeService.getUserApiKey(TEMP_USER_ID);
      
      res.json({
        success: true,
        hasApiKey: !!apiKey
      });

    } catch (error) {
      console.error('API 키 확인 오류:', error);
      res.status(500).json({
        success: false,
        message: 'API 키 확인 중 오류가 발생했습니다.'
      });
    }
  },

  // API 키 테스트
  async testApiKey(req: Request, res: Response) {
    try {
      const { apiKey } = req.body;

      if (!apiKey || typeof apiKey !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'API 키가 필요합니다.'
        });
      }

      const isValid = await claudeService.testApiKey(apiKey);

      res.json({
        success: true,
        isValid
      });

    } catch (error) {
      console.error('API 키 테스트 오류:', error);
      res.status(500).json({
        success: false,
        message: 'API 키 테스트 중 오류가 발생했습니다.'
      });
    }
  }
}; 