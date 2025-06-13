import { useEffect, useState } from 'react';
import { useGameState } from '../stores/gameStore';

/**
 * Game timer hook for tracking API wait time
 * Shows elapsed time while waiting for API response
 */
export const useGameTimer = () => {
  const gameState = useGameState();
  const [waitTime, setWaitTime] = useState<number | null>(null);

  useEffect(() => {
    if (!gameState?.waitingForApi) {
      setWaitTime(null);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      setWaitTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState?.waitingForApi]);

  return waitTime;
}; 