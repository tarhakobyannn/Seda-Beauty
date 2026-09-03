import { Booking } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockData';

const DB_NAME = 'SedaBeautyStudioDB';
const DB_VERSION = 1;
const STORE_BOOKINGS = 'bookings';
const LOCAL_STORAGE_BACKUP_KEY = 'seda_beauty_db_bookings_v2';

// Open IndexedDB database with fallback
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_BOOKINGS)) {
        const store = db.createObjectStore(STORE_BOOKINGS, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('branchId', 'branchId', { unique: false });
        store.createIndex('bookingCode', 'bookingCode', { unique: true });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open database'));
    };
  });
}

// Fallback helper for localStorage
function getLocalFallback(): Booking[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return INITIAL_BOOKINGS;
}

function saveLocalFallback(bookings: Booking[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(bookings));
  } catch {
    // ignore
  }
}

// Database Service API
export const StudioDatabase = {
  /**
   * Initializes the database, seeds default records if empty, and returns current records.
   */
  async init(): Promise<Booking[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_BOOKINGS, 'readonly');
        const store = tx.objectStore(STORE_BOOKINGS);
        const request = store.getAll();

        request.onsuccess = async () => {
          let list: Booking[] = request.result || [];
          if (list.length === 0) {
            // Seed from initial bookings or local storage fallback
            const seed = getLocalFallback();
            await StudioDatabase.bulkInsert(seed);
            list = seed;
          }
          saveLocalFallback(list);
          resolve(list);
        };

        request.onerror = () => {
          resolve(getLocalFallback());
        };
      });
    } catch {
      return getLocalFallback();
    }
  },

  /**
   * Fetch all bookings from the database
   */
  async getAll(): Promise<Booking[]> {
    try {
      const db = await openDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_BOOKINGS, 'readonly');
        const store = tx.objectStore(STORE_BOOKINGS);
        const request = store.getAll();

        request.onsuccess = () => {
          const list = request.result || [];
          saveLocalFallback(list);
          resolve(list);
        };

        request.onerror = () => {
          resolve(getLocalFallback());
        };
      });
    } catch {
      return getLocalFallback();
    }
  },

  /**
   * Add a new booking into the database
   */
  async add(booking: Booking): Promise<Booking> {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_BOOKINGS, 'readwrite');
        const store = tx.objectStore(STORE_BOOKINGS);
        const req = store.put(booking);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn('Database write failed, writing to fallback', e);
    }

    // Sync localStorage fallback
    const current = getLocalFallback();
    const updated = [booking, ...current.filter((b) => b.id !== booking.id)];
    saveLocalFallback(updated);

    return booking;
  },

  /**
   * Update status of a booking in database
   */
  async updateStatus(
    id: string,
    status: 'confirmed' | 'completed' | 'cancelled'
  ): Promise<void> {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_BOOKINGS, 'readwrite');
        const store = tx.objectStore(STORE_BOOKINGS);
        const getReq = store.get(id);

        getReq.onsuccess = () => {
          const item = getReq.result as Booking | undefined;
          if (item) {
            item.status = status;
            store.put(item);
          }
          resolve();
        };
        getReq.onerror = () => reject(getReq.error);
      });
    } catch {
      // ignore
    }

    const current = getLocalFallback();
    const updated = current.map((b) => (b.id === id ? { ...b, status } : b));
    saveLocalFallback(updated);
  },

  /**
   * Delete a booking from database
   */
  async delete(id: string): Promise<void> {
    try {
      const db = await openDB();
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_BOOKINGS, 'readwrite');
        const store = tx.objectStore(STORE_BOOKINGS);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
      // ignore
    }

    const current = getLocalFallback();
    const updated = current.filter((b) => b.id !== id);
    saveLocalFallback(updated);
  },

  /**
   * Reset database with default demo data
   */
  async reset(initialData?: Booking[]): Promise<Booking[]> {
    const dataToSeed = initialData || INITIAL_BOOKINGS;
    try {
      const db = await openDB();
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_BOOKINGS, 'readwrite');
        const store = tx.objectStore(STORE_BOOKINGS);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
      // ignore
    }

    await StudioDatabase.bulkInsert(dataToSeed);
    saveLocalFallback(dataToSeed);
    return dataToSeed;
  },

  async bulkInsert(bookings: Booking[]): Promise<void> {
    try {
      const db = await openDB();
      await new Promise<void>((resolve) => {
        const tx = db.transaction(STORE_BOOKINGS, 'readwrite');
        const store = tx.objectStore(STORE_BOOKINGS);
        bookings.forEach((b) => store.put(b));
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch {
      // ignore
    }
  },
};
