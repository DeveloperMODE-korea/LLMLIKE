import { describe, it, expect, vi } from 'vitest';
import { 
  getStatValue,
  isPrimaryResource,
  calculateStatValue,
  getItemIcon,
  getItemType,
  getSkillType,
  getSkillIcon,
  getBarColor,
  calculateExpProgress
} from '../characterStats';
import { Character } from '../../types/game';

// Mock WorldManager
vi.mock('../../data/worldSettings', () => ({
  WorldManager: {
    getCurrentWorld: vi.fn(() => ({
      id: 'dimensional_rift',
      statNames: {
        health: '체력',
        mana: '마나',
        strength: '힘',
        intelligence: '지능',
        dexterity: '민첩',
        constitution: '체질'
      }
    }))
  }
}));

const mockCharacter: Character = {
  id: 'test-char',
  name: 'Test Character',
  job: 'warrior' as any,
  level: 5,
  health: 80,
  maxHealth: 100,
  mana: 30,
  maxMana: 50,
  strength: 15,
  intelligence: 10,
  dexterity: 12,
  constitution: 14,
  inventory: [],
  gold: 500,
  experience: 350,
  skills: []
};

describe('characterStats utility functions', () => {
  describe('getStatValue', () => {
    it('should return correct stat values for dimensional rift world', () => {
      expect(getStatValue(mockCharacter, 'health')).toBe(80);
      expect(getStatValue(mockCharacter, 'strength')).toBe(15);
      expect(getStatValue(mockCharacter, 'nonexistent')).toBe(0);
    });
  });

  describe('isPrimaryResource', () => {
    it('should correctly identify primary resources', () => {
      expect(isPrimaryResource('health')).toBe(true);
      expect(isPrimaryResource('mana')).toBe(true);
      expect(isPrimaryResource('body')).toBe(true);
      expect(isPrimaryResource('neural')).toBe(true);
      expect(isPrimaryResource('strength')).toBe(false);
      expect(isPrimaryResource('intelligence')).toBe(false);
    });
  });

  describe('calculateStatValue', () => {
    it('should calculate stat values with percentage', () => {
      const result = calculateStatValue(mockCharacter, 'health');
      expect(result.current).toBe(80);
      expect(result.max).toBe(100);
      expect(result.percentage).toBe(80);
    });

    it('should handle stats without max values', () => {
      const result = calculateStatValue(mockCharacter, 'strength');
      expect(result.current).toBe(15);
      expect(result.max).toBe(15);
      expect(result.percentage).toBe(100);
    });
  });

  describe('getItemIcon', () => {
    it('should return correct icons for item types', () => {
      expect(getItemIcon('강철 검')).toBe('⚔️');
      expect(getItemIcon('철제 방패')).toBe('🛡️');
      expect(getItemIcon('치유 물약')).toBe('🧪');
      expect(getItemIcon('가죽 갑옷')).toBe('👕');
      expect(getItemIcon('unknown item')).toBe('📦');
    });
  });

  describe('getItemType', () => {
    it('should return correct Korean item types', () => {
      expect(getItemType({ name: '강철 검', type: 'weapon' })).toBe('무기');
      expect(getItemType({ name: '가죽 갑옷', type: 'armor' })).toBe('방어구');
      expect(getItemType({ name: '치유 물약', type: 'consumable' })).toBe('소모품');
      expect(getItemType({ name: 'unknown', type: 'unknown' })).toBe('일반 아이템');
    });
  });

  describe('getSkillType', () => {
    it('should return correct Korean skill types', () => {
      expect(getSkillType({ name: '해킹' })).toBe('해킹 스킬');
      expect(getSkillType({ name: '공격' })).toBe('전투 스킬');
      expect(getSkillType({ name: '방어' })).toBe('방어 스킬');
      expect(getSkillType({ name: '치유' })).toBe('회복 스킬');
      expect(getSkillType({ name: 'unknown' })).toBe('특수 스킬');
    });
  });

  describe('getSkillIcon', () => {
    it('should return correct icons for skill types', () => {
      expect(getSkillIcon({ name: '해킹' })).toBe('💻');
      expect(getSkillIcon({ name: '공격' })).toBe('⚔️');
      expect(getSkillIcon({ name: '방어' })).toBe('🛡️');
      expect(getSkillIcon({ name: '치유' })).toBe('💚');
      expect(getSkillIcon({ name: 'unknown' })).toBe('⭐');
    });
  });

  describe('getBarColor', () => {
    it('should return correct color classes for stat bars', () => {
      expect(getBarColor('health')).toBe('from-red-500 to-red-400');
      expect(getBarColor('body')).toBe('from-red-500 to-red-400');
      expect(getBarColor('mana')).toBe('from-blue-500 to-blue-400');
      expect(getBarColor('neural')).toBe('from-blue-500 to-blue-400');
      expect(getBarColor('strength')).toBe('from-green-500 to-green-400');
    });
  });

  describe('calculateExpProgress', () => {
    it('should calculate experience progress correctly', () => {
      const result = calculateExpProgress(mockCharacter);
      expect(result.toNext).toBe(500); // level 5 * 100
      expect(result.progress).toBe(70); // 350 / 500 * 100
    });

    it('should handle level 1 character', () => {
      const level1Char = { ...mockCharacter, level: 1, experience: 50 };
      const result = calculateExpProgress(level1Char);
      expect(result.toNext).toBe(100);
      expect(result.progress).toBe(50);
    });
  });
}); 