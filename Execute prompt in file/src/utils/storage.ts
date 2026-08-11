import { syncDevelopmentValue } from './developmentSync';

export function getAll<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getById<T extends { id: string }>(key: string, id: string): T | null {
  const items = getAll<T>(key);
  return items.find((i) => i.id === id) || null;
}

export function save<T>(key: string, items: T[]): void {
  const value = JSON.stringify(items);
  localStorage.setItem(key, value);
  syncDevelopmentValue(key, value);
}

export function create<T extends { id: string }>(key: string, item: Omit<T, 'id'>): T {
  const items = getAll<T>(key);
  const newItem = { ...item, id: `${key}_${Date.now()}_${Math.random().toString(36).slice(2)}` } as T;
  items.push(newItem);
  save(key, items);
  return newItem;
}

export function update<T extends { id: string }>(key: string, id: string, changes: Partial<T>): T | null {
  const items = getAll<T>(key);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...changes };
  save(key, items);
  return items[idx];
}

export function remove(key: string, id: string): boolean {
  const items = getAll<{ id: string }>(key);
  const filtered = items.filter((i) => i.id !== id);
  if (filtered.length === items.length) return false;
  save(key, filtered);
  return true;
}

export function getSingle<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setSingle<T>(key: string, value: T): void {
  const serialized = JSON.stringify(value);
  localStorage.setItem(key, serialized);
  syncDevelopmentValue(key, serialized);
}
