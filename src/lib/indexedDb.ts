/**
 * Sri Balaji Real Estate — Native IndexedDB Storage Service
 * Step 13: Client-side persistence for local drafts and user preferences.
 * 
 * Strict Architectural Guarantees:
 * - Operates entirely locally within the browser origin.
 * - Does not modify or replace static property datasets.
 * - Non-blocking asynchronous transactions with graceful memory fallback.
 * - Safe against private browsing mode, disabled storage, and quota limits.
 */

import { EnquiryData, PropertyFilterTab } from '../types/property';

const DB_NAME = 'SriBalajiRealEstateDB';
const DB_VERSION = 1;

// Object Store Names
export const STORES = {
  PREFERENCES: 'user_preferences',
  ENQUIRY_DRAFTS: 'enquiry_drafts'
} as const;

export interface UserPreferences {
  activeTab?: PropertyFilterTab;
  sortBy?: 'featured' | 'price-asc' | 'price-desc';
  lastVisited?: string;
}

// In-memory fallback if IndexedDB is blocked or disabled
const memoryStore: Record<string, Record<string, any>> = {
  [STORES.PREFERENCES]: {},
  [STORES.ENQUIRY_DRAFTS]: {}
};

let dbPromise: Promise<IDBDatabase | null> | null = null;

/**
 * Initializes and returns the IndexedDB database instance.
 * Handles schema creation, version upgrades, and error recovery safely.
 */
export const getDB = (): Promise<IDBDatabase | null> => {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store 1: User discovery preferences (key-value)
        if (!db.objectStoreNames.contains(STORES.PREFERENCES)) {
          db.createObjectStore(STORES.PREFERENCES, { keyPath: 'key' });
        }

        // Store 2: Temporary consultation enquiry draft (key-value)
        if (!db.objectStoreNames.contains(STORES.ENQUIRY_DRAFTS)) {
          db.createObjectStore(STORES.ENQUIRY_DRAFTS, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (e) => {
        console.warn('[IndexedDB] Database access blocked or unavailable, using graceful fallback:', e);
        resolve(null);
      };

      request.onblocked = () => {
        console.warn('[IndexedDB] Database upgrade blocked by another active tab.');
        resolve(null);
      };
    } catch (err) {
      console.warn('[IndexedDB] Initialization exception caught:', err);
      resolve(null);
    }
  });

  return dbPromise;
};

// Generic read operation
async function getItem<T>(storeName: string, key: string): Promise<T | null> {
  try {
    const db = await getDB();
    if (!db) {
      return memoryStore[storeName]?.[key] ?? null;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);

        req.onsuccess = () => {
          resolve(req.result ? (req.result.value as T) : null);
        };

        req.onerror = () => {
          resolve(memoryStore[storeName]?.[key] ?? null);
        };
      } catch {
        resolve(memoryStore[storeName]?.[key] ?? null);
      }
    });
  } catch {
    return memoryStore[storeName]?.[key] ?? null;
  }
}

// Generic write operation
async function setItem<T>(storeName: string, key: string, value: T): Promise<void> {
  memoryStore[storeName][key] = value;
  try {
    const db = await getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.put({ key, id: key, value, updatedAt: new Date().toISOString() });

        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
        tx.onabort = () => resolve();
      } catch {
        resolve();
      }
    });
  } catch {
    // Graceful silent fallback
  }
}

// Generic delete operation
async function removeItem(storeName: string, key: string): Promise<void> {
  delete memoryStore[storeName][key];
  try {
    const db = await getDB();
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.delete(key);

        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  } catch {}
}

/* ==============================================================================
   Domain Operations for Sri Balaji Real Estate
============================================================================== */

const PREF_KEY = 'user_filter_settings';
const ENQUIRY_DRAFT_KEY = 'consultation_form_draft';

/**
 * Loads user property filter preferences from IndexedDB
 */
export async function loadUserPreferences(): Promise<UserPreferences | null> {
  return getItem<UserPreferences>(STORES.PREFERENCES, PREF_KEY);
}

/**
 * Saves user property filter preferences to IndexedDB
 */
export async function saveUserPreferences(prefs: UserPreferences): Promise<void> {
  return setItem<UserPreferences>(STORES.PREFERENCES, PREF_KEY, prefs);
}

/**
 * Loads saved consultation enquiry draft from IndexedDB
 */
export async function loadEnquiryDraft(): Promise<Partial<EnquiryData> | null> {
  return getItem<Partial<EnquiryData>>(STORES.ENQUIRY_DRAFTS, ENQUIRY_DRAFT_KEY);
}

/**
 * Persists consultation enquiry draft to IndexedDB
 */
export async function saveEnquiryDraft(draft: Partial<EnquiryData>): Promise<void> {
  // Never save empty draft
  if (!draft.fullName && !draft.phone && !draft.message && !draft.preferredLocality) {
    return;
  }
  return setItem<Partial<EnquiryData>>(STORES.ENQUIRY_DRAFTS, ENQUIRY_DRAFT_KEY, draft);
}

/**
 * Clears consultation enquiry draft upon successful submission
 */
export async function clearEnquiryDraft(): Promise<void> {
  return removeItem(STORES.ENQUIRY_DRAFTS, ENQUIRY_DRAFT_KEY);
}
