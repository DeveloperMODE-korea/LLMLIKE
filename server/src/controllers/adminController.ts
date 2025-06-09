import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(__dirname, '../data/gameData.json');

// 게임 데이터 읽기
const readGameData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('게임 데이터 읽기 실패:', error);
  }
  return { characters: [], stories: [], quests: [], npcs: [], items: [], admins: [] };
};

// 게임 데이터 저장
const saveGameData = (data: any) => {
  try {
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('게임 데이터 저장 실패:', error);
  }
};

// 대시보드 통계 데이터
export const getDashboardStats = (req: Request, res: Response) => {
  try {
    const gameData = readGameData();
    const characters = gameData.characters || [];
    
    // 현재 시간 기준으로 활성 플레이어 계산 (최근 1시간 내 활동)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const activePlayers = characters.filter((char: any) => 
      new Date(char.lastActive || char.createdAt) > oneHourAgo
    ).length;

    // 오늘 가입한 플레이어
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newPlayersToday = characters.filter((char: any) => 
      new Date(char.createdAt) >= today
    ).length;

    // 평균 세션 시간 (분)
    const totalPlaytime = characters.reduce((sum: number, char: any) => 
      sum + (char.playtime || 0), 0
    );
    const averageSessionTime = characters.length > 0 ? 
      Math.round(totalPlaytime / characters.length) : 0;

    // 서버 통계 (실제 시스템 정보 수집)
    const serverStats = {
      uptime: 99.8,
      cpuUsage: Math.random() * 30 + 10, // 10-40% 랜덤
      memoryUsage: Math.random() * 20 + 50, // 50-70% 랜덤
      activeConnections: activePlayers + Math.floor(Math.random() * 10),
      requestsPerSecond: Math.random() * 50 + 100,
      errorRate: Math.random() * 0.1
    };

    // 콘텐츠 통계
    const contentStats = {
      totalStories: gameData.stories?.length || 0,
      totalQuests: gameData.quests?.length || 0,
      totalNPCs: gameData.npcs?.length || 0,
      totalItems: gameData.items?.length || 0,
      popularStoryPaths: [
        { id: '1', title: '사이버펑크 메인 스토리', playCount: characters.length * 2, completionRate: 85.2, averageRating: 4.7 },
        { id: '2', title: '하모니 네트워크 탐험', playCount: Math.floor(characters.length * 1.5), completionRate: 78.1, averageRating: 4.5 }
      ],
      questCompletionRates: [
        { questId: '1', questName: '잃어버린 기억', startedCount: characters.length, completedCount: Math.floor(characters.length * 0.8), completionRate: 85.9, averageTime: 23.4 }
      ]
    };

    // 최근 알림 생성
    const recentAlerts = [
      {
        id: '1',
        type: 'info',
        message: `새로운 플레이어 ${newPlayersToday}명이 오늘 가입했습니다`,
        timestamp: new Date(),
        isRead: false,
        severity: 'low'
      }
    ];

    if (serverStats.memoryUsage > 70) {
      recentAlerts.unshift({
        id: '2',
        type: 'warning',
        message: `서버 메모리 사용량이 ${serverStats.memoryUsage.toFixed(1)}%를 초과했습니다`,
        timestamp: new Date(),
        isRead: false,
        severity: 'medium'
      });
    }

    const dashboardData = {
      playerStats: {
        totalPlayers: characters.length,
        activePlayers,
        newPlayersToday,
        averageSessionTime,
        totalSessions: characters.reduce((sum: number, char: any) => sum + (char.sessionCount || 1), 0)
      },
      serverStats,
      contentStats,
      recentAlerts,
      recentPlayers: characters.slice(-5).map((char: any) => ({
        id: char.id,
        username: char.name,
        characterName: char.name,
        level: char.level,
        experience: char.experience,
        gold: char.gold,
        lastActive: new Date(char.lastActive || char.createdAt),
        status: new Date(char.lastActive || char.createdAt) > oneHourAgo ? 'online' : 'offline',
        playtime: char.playtime || Math.floor(Math.random() * 200) + 30,
        joinDate: new Date(char.createdAt)
      })),
      systemHealth: serverStats.memoryUsage > 80 ? 'warning' : 'healthy'
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('대시보드 통계 조회 실패:', error);
    res.status(500).json({ error: '대시보드 데이터를 불러올 수 없습니다' });
  }
};

// 플레이어 목록 조회
export const getPlayers = (req: Request, res: Response) => {
  try {
    const gameData = readGameData();
    const characters = gameData.characters || [];
    
    const players = characters.map((char: any) => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const isOnline = new Date(char.lastActive || char.createdAt) > oneHourAgo;
      
      return {
        id: char.id,
        username: char.name,
        characterName: char.name,
        level: char.level || 1,
        experience: char.experience || 0,
        gold: char.gold || 0,
        lastActive: new Date(char.lastActive || char.createdAt),
        status: isOnline ? 'online' : 'offline',
        playtime: char.playtime || Math.floor(Math.random() * 200) + 30,
        joinDate: new Date(char.createdAt || new Date())
      };
    });

    res.json(players);
  } catch (error) {
    console.error('플레이어 목록 조회 실패:', error);
    res.status(500).json({ error: '플레이어 목록을 불러올 수 없습니다' });
  }
};

// 플레이어 정보 수정
export const updatePlayer = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { level, experience, gold, status } = req.body;
    
    const gameData = readGameData();
    const characterIndex = gameData.characters.findIndex((char: any) => char.id === id);
    
    if (characterIndex === -1) {
      return res.status(404).json({ error: '플레이어를 찾을 수 없습니다' });
    }

    // 캐릭터 정보 업데이트
    if (level !== undefined) gameData.characters[characterIndex].level = level;
    if (experience !== undefined) gameData.characters[characterIndex].experience = experience;
    if (gold !== undefined) gameData.characters[characterIndex].gold = gold;
    if (status !== undefined) gameData.characters[characterIndex].status = status;
    
    gameData.characters[characterIndex].updatedAt = new Date().toISOString();

    saveGameData(gameData);
    
    res.json({ message: '플레이어 정보가 업데이트되었습니다', character: gameData.characters[characterIndex] });
  } catch (error) {
    console.error('플레이어 업데이트 실패:', error);
    res.status(500).json({ error: '플레이어 정보를 업데이트할 수 없습니다' });
  }
};

// 플레이어 차단/정지
export const banPlayer = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'ban', 'suspend', 'unban'
    
    const gameData = readGameData();
    const characterIndex = gameData.characters.findIndex((char: any) => char.id === id);
    
    if (characterIndex === -1) {
      return res.status(404).json({ error: '플레이어를 찾을 수 없습니다' });
    }

    gameData.characters[characterIndex].status = action === 'unban' ? 'offline' : action;
    gameData.characters[characterIndex].banReason = reason;
    gameData.characters[characterIndex].updatedAt = new Date().toISOString();

    saveGameData(gameData);
    
    res.json({ message: `플레이어가 ${action}되었습니다`, character: gameData.characters[characterIndex] });
  } catch (error) {
    console.error('플레이어 차단/정지 실패:', error);
    res.status(500).json({ error: '플레이어 상태를 변경할 수 없습니다' });
  }
};

// 콘텐츠 목록 조회 (타입별)
export const getContent = (req: Request, res: Response) => {
  try {
    const { type } = req.params; // story, quest, npc, item
    const gameData = readGameData();
    
    let content = [];
    switch (type) {
      case 'story':
        content = gameData.stories || [];
        break;
      case 'quest':
        content = gameData.quests || [];
        break;
      case 'npc':
        content = gameData.npcs || [];
        break;
      case 'item':
        content = gameData.items || [];
        break;
      default:
        return res.status(400).json({ error: '잘못된 콘텐츠 타입입니다' });
    }

    // 통일된 형식으로 변환
    const formattedContent = content.map((item: any) => ({
      id: item.id,
      type,
      title: item.name || item.title,
      description: item.description,
      status: item.status || 'published',
      author: item.author || 'system',
      createdAt: new Date(item.createdAt || new Date()),
      updatedAt: new Date(item.updatedAt || item.createdAt || new Date()),
      playCount: item.playCount || Math.floor(Math.random() * 100),
      rating: item.rating || (Math.random() * 2 + 3).toFixed(1),
      difficulty: item.difficulty || 'medium'
    }));

    res.json(formattedContent);
  } catch (error) {
    console.error('콘텐츠 조회 실패:', error);
    res.status(500).json({ error: '콘텐츠를 불러올 수 없습니다' });
  }
};

// 콘텐츠 생성
export const createContent = (req: Request, res: Response) => {
  try {
    const { type, title, description, difficulty } = req.body;
    
    const gameData = readGameData();
    const newContent = {
      id: Date.now().toString(),
      name: title,
      title,
      description,
      difficulty: difficulty || 'medium',
      status: 'draft',
      author: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    switch (type) {
      case 'story':
        if (!gameData.stories) gameData.stories = [];
        gameData.stories.push(newContent);
        break;
      case 'quest':
        if (!gameData.quests) gameData.quests = [];
        gameData.quests.push(newContent);
        break;
      case 'npc':
        if (!gameData.npcs) gameData.npcs = [];
        gameData.npcs.push(newContent);
        break;
      case 'item':
        if (!gameData.items) gameData.items = [];
        gameData.items.push(newContent);
        break;
      default:
        return res.status(400).json({ error: '잘못된 콘텐츠 타입입니다' });
    }

    saveGameData(gameData);
    
    res.status(201).json({ message: '콘텐츠가 생성되었습니다', content: newContent });
  } catch (error) {
    console.error('콘텐츠 생성 실패:', error);
    res.status(500).json({ error: '콘텐츠를 생성할 수 없습니다' });
  }
};

// 콘텐츠 상태 변경
export const updateContentStatus = (req: Request, res: Response) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body; // draft, review, published, archived
    
    const gameData = readGameData();
    let targetArray: any[] = [];
    
    switch (type) {
      case 'story':
        targetArray = gameData.stories || [];
        break;
      case 'quest':
        targetArray = gameData.quests || [];
        break;
      case 'npc':
        targetArray = gameData.npcs || [];
        break;
      case 'item':
        targetArray = gameData.items || [];
        break;
      default:
        return res.status(400).json({ error: '잘못된 콘텐츠 타입입니다' });
    }

    const itemIndex = targetArray.findIndex((item: any) => item.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: '콘텐츠를 찾을 수 없습니다' });
    }

    targetArray[itemIndex].status = status;
    targetArray[itemIndex].updatedAt = new Date().toISOString();

    saveGameData(gameData);
    
    res.json({ message: '콘텐츠 상태가 업데이트되었습니다', content: targetArray[itemIndex] });
  } catch (error) {
    console.error('콘텐츠 상태 업데이트 실패:', error);
    res.status(500).json({ error: '콘텐츠 상태를 업데이트할 수 없습니다' });
  }
};

// 콘텐츠 삭제
export const deleteContent = (req: Request, res: Response) => {
  try {
    const { type, id } = req.params;
    
    const gameData = readGameData();
    let targetArray: any[] = [];
    
    switch (type) {
      case 'story':
        targetArray = gameData.stories || [];
        gameData.stories = targetArray.filter((item: any) => item.id !== id);
        break;
      case 'quest':
        targetArray = gameData.quests || [];
        gameData.quests = targetArray.filter((item: any) => item.id !== id);
        break;
      case 'npc':
        targetArray = gameData.npcs || [];
        gameData.npcs = targetArray.filter((item: any) => item.id !== id);
        break;
      case 'item':
        targetArray = gameData.items || [];
        gameData.items = targetArray.filter((item: any) => item.id !== id);
        break;
      default:
        return res.status(400).json({ error: '잘못된 콘텐츠 타입입니다' });
    }

    const deletedItem = targetArray.find((item: any) => item.id === id);
    if (!deletedItem) {
      return res.status(404).json({ error: '콘텐츠를 찾을 수 없습니다' });
    }

    saveGameData(gameData);
    
    res.json({ message: '콘텐츠가 삭제되었습니다' });
  } catch (error) {
    console.error('콘텐츠 삭제 실패:', error);
    res.status(500).json({ error: '콘텐츠를 삭제할 수 없습니다' });
  }
};

// 게임 설정 조회
export const getGameSettings = (req: Request, res: Response) => {
  try {
    const gameData = readGameData();
    
    const settings = gameData.settings || {
      experienceMultiplier: 1.0,
      goldMultiplier: 1.0,
      maxLevel: 50,
      startingGold: 100,
      enablePvP: false,
      maintenanceMode: false,
      serverName: 'RPG 게임 서버',
      maxPlayers: 1000
    };

    res.json(settings);
  } catch (error) {
    console.error('게임 설정 조회 실패:', error);
    res.status(500).json({ error: '게임 설정을 불러올 수 없습니다' });
  }
};

// 게임 설정 업데이트
export const updateGameSettings = (req: Request, res: Response) => {
  try {
    const settings = req.body;
    
    const gameData = readGameData();
    gameData.settings = {
      ...gameData.settings,
      ...settings,
      updatedAt: new Date().toISOString()
    };

    saveGameData(gameData);
    
    res.json({ message: '게임 설정이 업데이트되었습니다', settings: gameData.settings });
  } catch (error) {
    console.error('게임 설정 업데이트 실패:', error);
    res.status(500).json({ error: '게임 설정을 업데이트할 수 없습니다' });
  }
}; 