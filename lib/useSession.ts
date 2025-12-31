import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getStoredToken, 
  getTokenTimeRemaining, 
  getTokenExpirationDate,
  isTokenExpiringSoon 
} from '@/lib/tokenUtils';

export interface SessionStatus {
  isActive: boolean;
  timeRemaining: number;
  expirationDate: Date | null;
  isExpiringSoon: boolean;
  formattedTimeRemaining: string;
}

/**
 * Hook to monitor JWT session status
 */
export function useSession(): SessionStatus {
  const { token } = useAuth();
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    isActive: false,
    timeRemaining: 0,
    expirationDate: null,
    isExpiringSoon: false,
    formattedTimeRemaining: '0s',
  });

  useEffect(() => {
    const updateSessionStatus = () => {
      const storedToken = getStoredToken();
      
      if (!storedToken || !token) {
        setSessionStatus({
          isActive: false,
          timeRemaining: 0,
          expirationDate: null,
          isExpiringSoon: false,
          formattedTimeRemaining: '0s',
        });
        return;
      }

      const timeRemaining = getTokenTimeRemaining(storedToken);
      const expirationDate = getTokenExpirationDate(storedToken);
      const expiringSoon = isTokenExpiringSoon(storedToken);

      setSessionStatus({
        isActive: timeRemaining > 0,
        timeRemaining,
        expirationDate,
        isExpiringSoon: expiringSoon,
        formattedTimeRemaining: formatTime(timeRemaining),
      });
    };

    updateSessionStatus();
    const interval = setInterval(updateSessionStatus, 1000);

    return () => clearInterval(interval);
  }, [token]);

  return sessionStatus;
}

function formatTime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}
