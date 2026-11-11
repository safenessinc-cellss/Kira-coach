import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { logActivity } from '../lib/activityLogger';
import { ActivityLog } from '../types';

export function useActivityLogger() {
  const { user } = useAuth();

  const record = useCallback(
    async (action: ActivityLog['action'], metadata?: Record<string, any>) => {
      if (!user) return;
      await logActivity(user.uid, action, metadata, user.email, user.role);
    },
    [user]
  );

  return { logAction: record };
}
