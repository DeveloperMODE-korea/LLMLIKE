import { PrismaClient } from '@prisma/client';
import { CharacterService } from './CharacterService';
import { StoryService } from './StoryService';
import { claudeService } from './claudeService';

/**
 * Dependency Injection Container
 * Manages service instances and their dependencies
 */
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.initializeServices();
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private initializeServices(): void {
    // Initialize Prisma client
    const prisma = new PrismaClient();
    this.services.set('prisma', prisma);

    // Initialize services with dependencies
    const characterService = new CharacterService(prisma);
    const storyService = new StoryService(prisma, claudeService);

    this.services.set('characterService', characterService);
    this.services.set('storyService', storyService);
    this.services.set('claudeService', claudeService);
  }

  getService<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }

  // Convenience getters
  get characterService(): CharacterService {
    return this.getService<CharacterService>('characterService');
  }

  get storyService(): StoryService {
    return this.getService<StoryService>('storyService');
  }

  get prisma(): PrismaClient {
    return this.getService<PrismaClient>('prisma');
  }

  // Cleanup method for tests
  async cleanup(): Promise<void> {
    const prisma = this.getService<PrismaClient>('prisma');
    await prisma.$disconnect();
  }
}

// Export singleton instance
export const container = DIContainer.getInstance(); 