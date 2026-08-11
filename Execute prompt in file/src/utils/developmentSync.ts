export const DEVELOPMENT_SYNC_EVENT = 'rms-development-sync';

const SHARED_KEYS = [
  'rms_users',
  'rms_categories',
  'rms_menu_items',
  'rms_inventory',
  'rms_tables',
  'rms_customers',
  'rms_expenses',
  'rms_settings',
  'rms_orders',
  'rms_purchases',
  'rms_audit_logs',
];

let lastServerVersion = -1;
const pendingWrites = new Map<string, string>();

function readLocalValues() {
  return Object.fromEntries(
    SHARED_KEYS.flatMap((key) => {
      const value = localStorage.getItem(key);
      return value === null ? [] : [[key, value]];
    }),
  );
}

function applyServerValues(values: Record<string, string>) {
  const changedKeys: string[] = [];

  for (const key of SHARED_KEYS) {
    const value = values[key];
    if (typeof value !== 'string' || pendingWrites.has(key)) continue;
    if (localStorage.getItem(key) !== value) {
      localStorage.setItem(key, value);
      changedKeys.push(key);
    }
  }

  if (changedKeys.length > 0) {
    window.dispatchEvent(new CustomEvent(DEVELOPMENT_SYNC_EVENT, { detail: { keys: changedKeys } }));
  }
}

async function pullServerValues() {
  try {
    const response = await fetch(`/api/dev-sync?version=${lastServerVersion}`, { cache: 'no-store' });
    if (response.status === 204) return;
    if (!response.ok) return;

    const snapshot = await response.json();
    lastServerVersion = snapshot.version;
    applyServerValues(snapshot.values || {});
  } catch {
    // The development server may be restarting; the next poll will retry.
  }
}

export function syncDevelopmentValue(key: string, value: string) {
  if (!import.meta.env.DEV || !SHARED_KEYS.includes(key)) return;

  pendingWrites.set(key, value);
  void fetch('/api/dev-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  })
    .then(async (response) => {
      if (!response.ok) return;
      const result = await response.json();
      lastServerVersion = Math.max(lastServerVersion, result.version);
    })
    .catch(() => {
      // Keep the local change if the development server is temporarily unavailable.
    })
    .finally(() => {
      if (pendingWrites.get(key) === value) pendingWrites.delete(key);
    });
}

export function startDevelopmentSync(): () => void {
  if (!import.meta.env.DEV) return () => {};

  let active = true;
  let intervalId: number | undefined;

  void fetch('/api/dev-sync/bootstrap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: readLocalValues() }),
  })
    .then(async (response) => {
      if (!response.ok || !active) return;
      const snapshot = await response.json();
      lastServerVersion = snapshot.version;
      applyServerValues(snapshot.values || {});
    })
    .catch(() => {
      // The app remains usable with localStorage if shared development sync is unavailable.
    })
    .finally(() => {
      if (active) intervalId = window.setInterval(pullServerValues, 1000);
    });

  return () => {
    active = false;
    if (intervalId !== undefined) window.clearInterval(intervalId);
  };
}
