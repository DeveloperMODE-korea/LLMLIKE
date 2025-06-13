import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGameState } from '../stores/gameStore';

/**
 * Guest mode hook for handling guest user limitations
 * Provides guest mode state and limitation handlers
 */
export const useGuestMode = () => {
  const { user } = useAuth();
  const gameState = useGameState();
  const [showGuestLimitModal, setShowGuestLimitModal] = useState(false);

  const isGuestMode = user?.id === 'guest';
  const guestActionCount = parseInt(localStorage.getItem('guestActionCount') || '0');
  const GUEST_LIMIT = 10;

  const checkGuestLimit = useCallback(() => {
    if (!isGuestMode) return true;
    
    if (guestActionCount >= GUEST_LIMIT) {
      setShowGuestLimitModal(true);
      return false;
    }
    
    // Increment guest action count
    localStorage.setItem('guestActionCount', (guestActionCount + 1).toString());
    return true;
  }, [isGuestMode, guestActionCount]);

  const handleSignUpRedirect = useCallback(() => {
    setShowGuestLimitModal(false);
    // Navigate to auth page - handled by parent component
  }, []);

  const handleGuestRestart = useCallback(() => {
    localStorage.removeItem('guestActionCount');
    localStorage.removeItem('guestGameState');
    setShowGuestLimitModal(false);
    // Reset game state - handled by parent component
  }, []);

  return {
    isGuestMode,
    showGuestLimitModal,
    guestActionsLeft: Math.max(0, GUEST_LIMIT - guestActionCount),
    checkGuestLimit,
    handleSignUpRedirect,
    handleGuestRestart,
    setShowGuestLimitModal
  };
}; 