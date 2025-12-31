// JWT Token utilities for session management

export interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}

/**
 * Decode JWT token without verification (client-side only for expiration check)
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  // Check if token expires in the next 5 minutes (300 seconds)
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Check if token will expire soon (within 5 minutes)
 */
export const isTokenExpiringSoon = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const fiveMinutes = 5 * 60;
  return decoded.exp - currentTime < fiveMinutes;
};

/**
 * Get token expiration time as Date object
 */
export const getTokenExpirationDate = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return new Date(decoded.exp * 1000);
};

/**
 * Get time remaining until token expires (in seconds)
 */
export const getTokenTimeRemaining = (token: string): number => {
  const decoded = decodeToken(token);
  if (!decoded) return 0;

  const currentTime = Math.floor(Date.now() / 1000);
  return Math.max(0, decoded.exp - currentTime);
};

/**
 * Store token in localStorage
 */
export const storeToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_token_timestamp', Date.now().toString());
};

/**
 * Get token from localStorage
 */
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_token_timestamp');
};

/**
 * Check if stored token is valid and not expired
 */
export const isStoredTokenValid = (): boolean => {
  const token = getStoredToken();
  if (!token) return false;
  return !isTokenExpired(token);
};
