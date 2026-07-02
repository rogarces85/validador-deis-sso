import { useEffect, useState, useCallback } from 'react';
import { actual } from '../services/api/reglas';

const DB_NAME = 'validador_deis_rules';
const STORE_NAME = 'rules_version';
const KEY_CURRENT = 'current';

interface VersionRecord {
  version_semver: string;
  total_reglas: number;
  publicado_en: string;
  cached_at: number;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
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

async function readCurrentVersion(): Promise<VersionRecord | null> {
  try {
    const db = await openDb();
    return await new Promise<VersionRecord | null>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(KEY_CURRENT);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function writeCurrentVersion(rec: VersionRecord): Promise<void> {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ id: KEY_CURRENT, ...rec });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch { /* ignore */ }
}

export interface UseRulesVersion {
  currentVersion: string | null;
  latestVersion: string | null;
  latestTotal: number | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  applyLatest: () => Promise<void>;
  hasUpdate: boolean;
}

function compareSemver(a: string, b: string): number {
  const pa = a.match(/^(\d+)\.(\d+)\.(\d+)/);
  const pb = b.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!pa || !pb) return 0;
  for (let i = 1; i <= 3; i++) {
    const ai = parseInt(pa[i], 10);
    const bi = parseInt(pb[i], 10);
    if (ai > bi) return 1;
    if (ai < bi) return -1;
  }
  return 0;
}

const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutos

export function useRulesVersion(): UseRulesVersion {
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [latestTotal, setLatestTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cached, latest] = await Promise.all([
        readCurrentVersion(),
        actual().catch(() => null),
      ]);
      if (cached) setCurrentVersion(cached.version_semver);
      if (latest) {
        setLatestVersion(latest.version_semver);
        setLatestTotal(latest.total_reglas);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyLatest = useCallback(async () => {
    if (!latestVersion) return;
    await writeCurrentVersion({
      version_semver: latestVersion,
      total_reglas: latestTotal ?? 0,
      publicado_en: new Date().toISOString(),
      cached_at: Date.now(),
    });
    setCurrentVersion(latestVersion);
  }, [latestVersion, latestTotal]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  const hasUpdate = !!currentVersion && !!latestVersion && compareSemver(latestVersion, currentVersion) > 0;

  return { currentVersion, latestVersion, latestTotal, loading, error, refresh, applyLatest, hasUpdate };
}
