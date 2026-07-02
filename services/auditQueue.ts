import { post, type AuditEvent } from './api/audit';

const DB_NAME = 'validador_deis';
const DB_VERSION = 1;
const STORE_NAME = 'audit_queue';

export const TTL_DAYS = 7;
export const MAX_SIZE = 500;

interface QueuedItem {
  id: string;
  payload: AuditEvent;
  attempts: number;
  last_attempt_at: number;
  expires_at: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function txAll<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T> | Promise<T>): Promise<T> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const req = fn(store);
    if (req instanceof IDBRequest) {
      req.onsuccess = () => resolve(req.result as T);
      req.onerror = () => reject(req.error);
    } else {
      req.then(resolve).catch(reject);
    }
  });
}

export async function enqueue(event: AuditEvent): Promise<void> {
  const now = Date.now();
  const item: QueuedItem = {
    id: `${now}-${Math.random().toString(36).slice(2, 10)}`,
    payload: event,
    attempts: 0,
    last_attempt_at: 0,
    expires_at: now + TTL_DAYS * 24 * 3600 * 1000,
  };
  try {
    await txAll('readwrite', store => store.add(item));
  } catch {
    // Si IndexedDB no esta disponible (modo privado, etc), descartamos
    // silenciosamente: la auditoria es best-effort y no debe romper la UX.
  }
  await prune();
}

export async function flush(): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;
  let items: QueuedItem[] = [];
  try {
    items = (await txAll<QueuedItem[]>('readonly', store => store.getAll())) ?? [];
  } catch {
    return { sent, failed };
  }
  const now = Date.now();
  for (const item of items) {
    if (item.expires_at < now) {
      try { await txAll('readwrite', store => store.delete(item.id)); } catch { /* ignore */ }
      failed++;
      continue;
    }
    try {
      await post(item.payload);
      try { await txAll('readwrite', store => store.delete(item.id)); } catch { /* ignore */ }
      sent++;
    } catch {
      item.attempts++;
      item.last_attempt_at = now;
      try { await txAll('readwrite', store => store.put(item)); } catch { /* ignore */ }
      failed++;
    }
  }
  return { sent, failed };
}

export async function count(): Promise<number> {
  try {
    return (await txAll<number>('readonly', store => store.count())) ?? 0;
  } catch {
    return 0;
  }
}

export async function prune(): Promise<number> {
  let removed = 0;
  let items: QueuedItem[] = [];
  try {
    items = (await txAll<QueuedItem[]>('readonly', store => store.getAll())) ?? [];
  } catch {
    return 0;
  }
  const now = Date.now();
  // Eliminar expirados
  for (const item of items) {
    if (item.expires_at < now) {
      try { await txAll('readwrite', store => store.delete(item.id)); } catch { /* ignore */ }
      removed++;
    }
  }
  // Si aun supera el maximo, eliminar los mas viejos (FIFO)
  let remaining: QueuedItem[] = [];
  try {
    remaining = (await txAll<QueuedItem[]>('readonly', store => store.getAll())) ?? [];
  } catch {
    return removed;
  }
  if (remaining.length > MAX_SIZE) {
    remaining.sort((a, b) => a.last_attempt_at - b.last_attempt_at);
    const toRemove = remaining.slice(0, remaining.length - MAX_SIZE);
    for (const item of toRemove) {
      try { await txAll('readwrite', store => store.delete(item.id)); } catch { /* ignore */ }
      removed++;
    }
  }
  return removed;
}

export async function clear(): Promise<void> {
  try {
    await txAll('readwrite', store => store.clear());
  } catch { /* ignore */ }
}
