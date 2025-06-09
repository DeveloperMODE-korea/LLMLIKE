export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: AdminPermission[];
  lastLogin: Date;
  isActive: boolean;
}

export interface AdminPermission {
  resource: string;
  actions: string[];
}

export interface PlayerStats {
  totalPlayers: number;
  activePlayers: number;
  newPlayersToday: number;
  averageSessionTime: number;
  totalSessions: number;
}

export interface ServerStats {
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  requestsPerSecond: number;
  errorRate: number;
}

export interface GameContentStats {
  totalStories: number;
  totalQuests: number;
  totalNPCs: number;
  totalItems: number;
  popularStoryPaths: StoryPath[];
  questCompletionRates: QuestStats[];
}

export interface StoryPath {
  id: string;
  title: string;
  playCount: number;
  completionRate: number;
  averageRating: number;
}

export interface QuestStats {
  questId: string;
  questName: string;
  startedCount: number;
  completedCount: number;
  completionRate: number;
  averageTime: number;
}

export interface PlayerManagement {
  id: string;
  username: string;
  characterName: string;
  level: number;
  experience: number;
  gold: number;
  lastActive: Date;
  status: 'online' | 'offline' | 'banned' | 'suspended';
  playtime: number;
  joinDate: Date;
}

export interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: Date;
  isRead: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ContentEdit {
  id: string;
  type: 'story' | 'quest' | 'npc' | 'item' | 'world';
  title: string;
  lastModified: Date;
  modifiedBy: string;
  status: 'draft' | 'review' | 'published' | 'archived';
}

export interface GameBalance {
  experienceMultiplier: number;
  goldMultiplier: number;
  dropRates: { [itemType: string]: number };
  levelingCurve: number[];
  skillBalancing: { [skillId: string]: SkillBalance };
}

export interface SkillBalance {
  damage: number;
  manaCost: number;
  cooldown: number;
  effectiveness: number;
}

export interface AdminDashboardData {
  playerStats: PlayerStats;
  serverStats: ServerStats;
  contentStats: GameContentStats;
  recentAlerts: SystemAlert[];
  recentPlayers: PlayerManagement[];
  systemHealth: 'healthy' | 'warning' | 'critical';
} 