import { getAll, save } from '../utils/storage';

const KEY = 'rms_audit_logs';

export const auditService = {
  log(action: string, description: string, userId?: string) {
    const logs = getAll<any>(KEY);
    logs.unshift({ id: `aud_${Date.now()}`, action, description, userId, timestamp: new Date().toISOString() });
    save(KEY, logs.slice(0, 500));
  },
  getAll() { return getAll<any>(KEY); },
};
