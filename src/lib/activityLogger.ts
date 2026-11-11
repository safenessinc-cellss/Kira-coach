import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ActivityLog } from '../types';

const LOCAL_STORAGE_LOGS_KEY = 'kira_activity_logs_cache';

export async function logActivity(
  userId: string,
  action: ActivityLog['action'],
  metadata: Record<string, any> = {},
  userEmail?: string,
  userRole?: string
): Promise<void> {
  const cleanMetadata: Record<string, any> = {};
  for (const [key, value] of Object.entries(metadata)) {
    // Strictly prevent logging journal text, messages, passwords or PII
    if (['content', 'text', 'password', 'token', 'notes', 'private'].includes(key.toLowerCase())) {
      continue;
    }
    cleanMetadata[key] = value;
  }

  const logPayload = {
    userId,
    userEmail: userEmail || 'unknown@safeness.inc',
    userRole: userRole || 'user',
    action,
    metadata: cleanMetadata,
    timestamp: new Date().toISOString()
  };

  // Local storage cache backup
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
    const existing: any[] = raw ? JSON.parse(raw) : [];
    existing.unshift({ id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`, ...logPayload });
    if (existing.length > 200) existing.pop();
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(existing));
  } catch (e) {
    // Ignore storage quota
  }

  // Cloud Firestore record
  try {
    if (db) {
      await addDoc(collection(db, 'activity_logs'), {
        ...logPayload,
        createdAt: serverTimestamp()
      });
    }
  } catch (err) {
    console.warn('[ActivityLogger] Cloud write skipped, stored in local audit cache.', err);
  }
}

export function getLocalActivityLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
