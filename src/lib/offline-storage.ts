/**
 * Offline Diagnosis & Local Storage Manager (IndexedDB)
 * Allows farmers in remote fields with zero internet connectivity
 * to save plant scans locally and sync whenever a connection is detected.
 */

export interface OfflineDiagnosisRecord {
  id: string;
  timestamp: number;
  crop: string;
  plantPart: string;
  thumbnailDataUrl: string;
  topDisease: string;
  confidence: number;
  status: 'confirmed' | 'uncertain' | 'synced';
  syncedToServer: boolean;
}

const DB_NAME = 'kishan_rakshak_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'diagnoses';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported in this environment'));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('syncedToServer', 'syncedToServer', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDiagnosisOffline(record: OfflineDiagnosisRecord): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Fallback to localStorage:', e);
    // LocalStorage fallback
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('kr_offline_diagnoses') || '[]');
      existing.unshift(record);
      localStorage.setItem('kr_offline_diagnoses', JSON.stringify(existing.slice(0, 30)));
    }
  }
}

export async function getOfflineDiagnoses(): Promise<OfflineDiagnosisRecord[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const sorted = (req.result as OfflineDiagnosisRecord[]).sort((a, b) => b.timestamp - a.timestamp);
        resolve(sorted);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('kr_offline_diagnoses') || '[]');
    }
    return [];
  }
}
