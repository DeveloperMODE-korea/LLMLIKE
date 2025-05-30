import { Request, Response } from 'express';
import { claudeService } from '../services/claudeService';

export const apiKeyController = {
  // API 키 설정 (공통 API 키 사용으로 더 이상 필요하지 않음)
  async setApiKey(req: Request, res: Response) {
    try {
      res.json({
        success: true,
        message: '공통 API 키를 사용합니다. 개발자가 설정한 API 키가 사용됩니다.'
      });
    } catch (error) {
      console.error('API 키 설정 오류:', error);
      res.status(500).json({
        success: false,
        message: 'API 키 설정 중 오류가 발생했습니다.'
      });
    }
  },

  // API 키 존재 여부 확인 (환경변수에서 확인)
  async checkApiKey(req: Request, res: Response) {
    try {
      const apiKey = process.env.CLAUDE_API_KEY;
      
      res.json({
        success: true,
        hasApiKey: !!apiKey,
        isCommonKey: true,
        message: apiKey ? '공통 API 키가 설정되어 있습니다.' : 'API 키가 설정되지 않았습니다.'
      });
    } catch (error) {
      console.error('API 키 확인 오류:', error);
      res.status(500).json({
        success: false,
        message: 'API 키 확인 중 오류가 발생했습니다.'
      });
    }
  },

  // API 키 테스트 (공통 API 키 테스트)
  async testApiKey(req: Request, res: Response) {
    try {
      const isValid = await claudeService.testApiKey();

      res.json({
        success: true,
        isValid,
        message: isValid ? '공통 API 키가 정상 작동합니다.' : '공통 API 키에 문제가 있습니다.'
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