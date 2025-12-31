'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredToken, getTokenExpirationDate, getTokenTimeRemaining } from '@/lib/tokenUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Shield, CheckCircle } from 'lucide-react';

export function SessionInfo() {
  const { user, token } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!token) return;

    const updateSessionInfo = () => {
      const storedToken = getStoredToken();
      if (storedToken) {
        setTimeRemaining(getTokenTimeRemaining(storedToken));
        setExpirationDate(getTokenExpirationDate(storedToken));
      }
    };

    updateSessionInfo();
    const interval = setInterval(updateSessionInfo, 1000); // Update every second

    return () => clearInterval(interval);
  }, [token]);

  if (!user || !token) return null;

  const formatTimeRemaining = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getStatusColor = (): string => {
    if (timeRemaining < 300) return 'text-red-600'; // Less than 5 minutes
    if (timeRemaining < 3600) return 'text-yellow-600'; // Less than 1 hour
    return 'text-green-600';
  };

  const getStatusBadge = (): string => {
    if (timeRemaining < 300) return 'destructive';
    if (timeRemaining < 3600) return 'secondary';
    return 'default';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Session Information
        </CardTitle>
        <CardDescription>Your current authentication session</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Status</span>
          </div>
          <Badge variant={getStatusBadge() as any}>Active</Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Time Remaining</span>
          </div>
          <span className={`text-sm font-mono ${getStatusColor()}`}>
            {formatTimeRemaining(timeRemaining)}
          </span>
        </div>

        {expirationDate && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Expires: {expirationDate.toLocaleString()}
            </p>
          </div>
        )}

        {timeRemaining < 300 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              ⚠️ Your session is about to expire! Please save your work.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
