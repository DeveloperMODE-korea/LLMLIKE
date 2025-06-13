import { describe, it, expect } from 'vitest';
import { mapStatsToWorld, getStartingItems, getStartingSkills } from '../../utils/presets';

describe('presets utility functions', () => {
  describe('mapStatsToWorld', () => {
    it('should map cyberpunk stats correctly', () => {
      const stats = {
        body: 100,
        neural: 60,
        technical: 80,
        reflex: 70,
        cool: 50,
        reputation: 40
      };

      const result = mapStatsToWorld(stats, 'cyberpunk_2187');

      expect(result).toEqual({
        health: 100,
        mana: 60,
        strength: 20, // body/5
        intelligence: 20, // technical/4
        dexterity: 17, // reflex/4
        constitution: 11 // (cool+reputation)/8
      });
    });

    it('should map dimensional rift stats correctly', () => {
      const stats = {
        health: 120,
        mana: 80,
        strength: 15,
        intelligence: 12,
        dexterity: 14,
        constitution: 13
      };

      const result = mapStatsToWorld(stats, 'dimensional_rift');

      expect(result).toEqual({
        health: 120,
        mana: 80,
        strength: 15,
        intelligence: 12,
        dexterity: 14,
        constitution: 13
      });
    });

    it('should use default values for missing stats', () => {
      const result = mapStatsToWorld({}, 'dimensional_rift');

      expect(result).toEqual({
        health: 100,
        mana: 50,
        strength: 10,
        intelligence: 10,
        dexterity: 10,
        constitution: 10
      });
    });
  });

  describe('getStartingItems', () => {
    it('should return correct items for dimensional rift warrior', () => {
      const items = getStartingItems('⚔️ 전사', 'dimensional_rift');
      
      expect(items).toEqual([
        '강철 장검',
        '철제 방패',
        '사슬 갑옷',
        '치유 포션 3개'
      ]);
    });

    it('should return correct items for cyberpunk netrunner', () => {
      const items = getStartingItems('🕶️ 네트러너', 'cyberpunk_2187');
      
      expect(items).toEqual([
        '군사급 사이버덱',
        '뉴럴 부스터 임플란트',
        'ICE 브레이커 프로그램들',
        '스텔스 코드 라이브러리'
      ]);
    });

    it('should return empty array for unknown job/world combination', () => {
      const items = getStartingItems('Unknown Job', 'unknown_world');
      
      expect(items).toEqual([]);
    });
  });

  describe('getStartingSkills', () => {
    it('should return correct skills for dimensional rift mage', () => {
      const skills = getStartingSkills('🔮 마법사', 'dimensional_rift');
      
      expect(skills).toEqual([
        '화염구',
        '얼음화살'
      ]);
    });

    it('should return correct skills for cyberpunk tech-samurai', () => {
      const skills = getStartingSkills('⚡ 테크-사무라이', 'cyberpunk_2187');
      
      expect(skills).toEqual([
        '근접 전투',
        '사격',
        '사이보그 제어'
      ]);
    });

    it('should return empty array for unknown job/world combination', () => {
      const skills = getStartingSkills('Unknown Job', 'unknown_world');
      
      expect(skills).toEqual([]);
    });
  });
}); 