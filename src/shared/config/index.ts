// 🔧 통합 설정 시스템 - 모든 환경변수와 설정을 중앙 관리

import { AppConfig, WorldSettingId } from '../types';

// ======================
// 🌍 Environment Variables
// ======================

const getEnvVar = (key: string, defaultValue?: string): string => {
  if (typeof window !== 'undefined') {
    // 클라이언트 환경
    return (import.meta.env as any)[key] || defaultValue || '';
  } else {
    // 서버 환경
    return process.env[key] || defaultValue || '';
  }
};

const isDevelopment = () => {
  if (typeof window !== 'undefined') {
    return import.meta.env.DEV;
  }
  return process.env.NODE_ENV === 'development';
};

const isProduction = () => {
  if (typeof window !== 'undefined') {
    return import.meta.env.PROD;
  }
  return process.env.NODE_ENV === 'production';
};

// ======================
// 🔧 Application Configuration
// ======================

export const appConfig: AppConfig = {
  api: {
    baseUrl: getEnvVar('VITE_API_URL', 'http://localhost:3001/api'),
    timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '30000')),
    retryAttempts: parseInt(getEnvVar('VITE_API_RETRY_ATTEMPTS', '3')),
  },
  game: {
    guestModeLimit: parseInt(getEnvVar('VITE_GUEST_MODE_LIMIT', '10')),
    autoSaveInterval: parseInt(getEnvVar('VITE_AUTO_SAVE_INTERVAL', '30000')), // 30초
    defaultWorldId: getEnvVar('VITE_DEFAULT_WORLD_ID', 'dimensional_rift') as WorldSettingId,
  },
  ai: {
    provider: getEnvVar('VITE_AI_PROVIDER', 'claude') as 'claude' | 'openai',
    model: getEnvVar('VITE_AI_MODEL', 'claude-3-haiku-20240307'),
    maxTokens: parseInt(getEnvVar('VITE_AI_MAX_TOKENS', '4000')),
  },
};

// ======================
// 🎮 Game Constants
// ======================

export const gameConstants = {
  // 레벨링 시스템
  EXPERIENCE_PER_LEVEL: 100,
  MAX_LEVEL: 100,
  
  // 전투 시스템
  CRITICAL_HIT_CHANCE: 0.1, // 10%
  CRITICAL_HIT_MULTIPLIER: 2.0,
  
  // 경제 시스템
  DEATH_PENALTY_GOLD: 0.1, // 10% 골드 손실
  DEATH_PENALTY_EXPERIENCE: 0.05, // 5% 경험치 손실
  
  // 시간 시스템
  GAME_HOURS_PER_REAL_MINUTE: 2,
  DAY_CYCLE_HOURS: 24,
  
  // 관계 시스템
  MIN_RELATIONSHIP: -100,
  MAX_RELATIONSHIP: 100,
  RELATIONSHIP_DECAY_RATE: 0.1, // 일당 감소율
  
  // 퀘스트 시스템
  MAX_ACTIVE_SIDE_QUESTS: 10,
  QUEST_EXPIRY_DAYS: 7,
  
  // 메모리 시스템
  MAX_MEMORIES_PER_CHARACTER: 1000,
  MEMORY_IMPORTANCE_THRESHOLD: 5, // 5 이상만 AI에 전달
};

// ======================
// 🔐 Security Configuration
// ======================

export const securityConfig = {
  jwt: {
    secret: getEnvVar('JWT_SECRET', 'your-super-secret-jwt-key-change-this-in-production'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'),
  },
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15분
    maxRequests: isDevelopment() ? 1000 : 100, // 개발/프로덕션 구분
  },
};

// ======================
// 🗄️ Database Configuration
// ======================

export const databaseConfig = {
  connectionString: getEnvVar('DATABASE_URL', 'postgresql://user:password@localhost:5432/gamedb'),
  poolSize: parseInt(getEnvVar('DB_POOL_SIZE', '10')),
  connectionTimeout: parseInt(getEnvVar('DB_CONNECTION_TIMEOUT', '10000')),
  ssl: isProduction() ? { rejectUnauthorized: false } : false,
};

// ======================
// 🤖 AI Service Configuration
// ======================

export const aiConfig = {
  claude: {
    apiKey: getEnvVar('CLAUDE_API_KEY', ''),
    baseURL: 'https://api.anthropic.com',
    version: '2023-06-01',
    maxTokens: appConfig.ai.maxTokens,
    temperature: 0.7,
    topP: 0.9,
  },
  openai: {
    apiKey: getEnvVar('OPENAI_API_KEY', ''),
    baseURL: 'https://api.openai.com/v1',
    model: 'gpt-4',
    maxTokens: appConfig.ai.maxTokens,
    temperature: 0.7,
  },
};

// ======================
// 📊 Monitoring & Logging
// ======================

export const monitoringConfig = {
  logging: {
    level: isDevelopment() ? 'debug' : 'info',
    enableConsole: isDevelopment(),
    enableFile: isProduction(),
    maxFileSize: '10MB',
    maxFiles: 5,
  },
  analytics: {
    enabled: isProduction(),
    trackingId: getEnvVar('ANALYTICS_TRACKING_ID', ''),
  },
  sentry: {
    enabled: isProduction(),
    dsn: getEnvVar('SENTRY_DSN', ''),
    environment: isDevelopment() ? 'development' : 'production',
  },
};

// ======================
// 🚀 Feature Flags
// ======================

export const featureFlags = {
  // 개발 중인 기능들
  ENABLE_VOICE_NARRATION: getEnvVar('FEATURE_VOICE_NARRATION', 'false') === 'true',
  ENABLE_MULTIPLAYER: getEnvVar('FEATURE_MULTIPLAYER', 'false') === 'true',
  ENABLE_MARKETPLACE: getEnvVar('FEATURE_MARKETPLACE', 'false') === 'true',
  
  // 실험적 기능들
  EXPERIMENTAL_AI_VOICE: getEnvVar('EXPERIMENTAL_AI_VOICE', 'false') === 'true',
  EXPERIMENTAL_AUTO_QUESTS: getEnvVar('EXPERIMENTAL_AUTO_QUESTS', 'false') === 'true',
  
  // 관리자 기능들
  ADMIN_DEBUG_MODE: getEnvVar('ADMIN_DEBUG_MODE', 'false') === 'true',
  ADMIN_DIRECT_DB_ACCESS: getEnvVar('ADMIN_DIRECT_DB_ACCESS', 'false') === 'true',
};

// ======================
// 🌍 World-Specific Configuration
// ======================

export const worldConfigs = {
  dimensional_rift: {
    aiModel: 'claude-3-haiku-20240307',
    storyComplexity: 'medium',
    combatIntensity: 'balanced',
  },
  cyberpunk_2187: {
    aiModel: 'claude-3-5-haiku-20241022',
    storyComplexity: 'high',
    combatIntensity: 'tactical',
  },
  dark_finance: {
    aiModel: 'claude-3-5-haiku-20241022',
    storyComplexity: 'very_high',
    combatIntensity: 'low',
  },
  classic_fantasy: {
    aiModel: 'claude-3-haiku-20240307',
    storyComplexity: 'medium',
    combatIntensity: 'high',
  },
} as const;

// ======================
// 🔄 Runtime Configuration
// ======================

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = { ...appConfig };
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  getConfig(): AppConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    console.log('🔧 Configuration updated:', updates);
  }

  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // API URL 검증
    if (!this.config.api.baseUrl) {
      errors.push('API Base URL이 설정되지 않았습니다.');
    }

    // AI 설정 검증
    if (!aiConfig.claude.apiKey && !aiConfig.openai.apiKey) {
      errors.push('AI API 키가 설정되지 않았습니다.');
    }

    // 게임 설정 검증
    if (this.config.game.guestModeLimit < 1) {
      errors.push('게스트 모드 제한이 올바르지 않습니다.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// ======================
// 🔍 Development Helpers
// ======================

export const devTools = {
  logConfig() {
    if (isDevelopment()) {
      console.group('🔧 Current Configuration');
      console.log('App Config:', appConfig);
      console.log('Game Constants:', gameConstants);
      console.log('Feature Flags:', featureFlags);
      console.log('World Configs:', worldConfigs);
      console.groupEnd();
    }
  },

  validateEnvironment() {
    const requiredEnvVars = [
      'VITE_API_URL',
      'CLAUDE_API_KEY',
      'DATABASE_URL',
    ];

    const missingVars = requiredEnvVars.filter(varName => !getEnvVar(varName));
    
    if (missingVars.length > 0) {
      console.warn('⚠️ Missing environment variables:', missingVars);
      return false;
    }
    
    console.log('✅ All required environment variables are set');
    return true;
  },
};

// 개발 모드에서만 설정 정보 출력
if (isDevelopment()) {
  devTools.logConfig();
  devTools.validateEnvironment();
}

// 설정 검증
const configManager = ConfigManager.getInstance();
const validation = configManager.validateConfig();
if (!validation.isValid) {
  console.error('❌ Configuration validation failed:', validation.errors);
}

// Export
export default appConfig;
export { ConfigManager, devTools, isDevelopment, isProduction }; 