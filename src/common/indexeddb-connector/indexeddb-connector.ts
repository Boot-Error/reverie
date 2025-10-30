export class IndexedDBService {
  private static instance: IndexedDBService;

  private dbName: string;
  private version: number;
  private upgradeCallback: (db: IDBDatabase) => void;
  private db: IDBDatabase;

  private constructor(
    dbName: string,
    version: number,
    upgradeCallback: (db: IDBDatabase) => void,
  ) {
    this.dbName = dbName;
    this.version = version;
    this.upgradeCallback = upgradeCallback;
  }

  /**
   * Get the singleton instance
   * @param {string} dbName - Database name
   * @param {number} version - Database version (used for migrations)
   * @param {function} upgradeCallback - Callback to create/upgrade object stores
   */
  public static getInstance(
    dbName = 'AppDB',
    version = 1,
    upgradeCallback = null,
  ) {
    if (!IndexedDBService.instance) {
      IndexedDBService.instance = new IndexedDBService(
        dbName,
        version,
        upgradeCallback,
      );
    }
    return IndexedDBService.instance;
  }
  /**
   * Initialize the database connection
   * @returns {Promise<IDBDatabase>}
   */
  async init() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        this.db = event.target?.result;
        if (this.upgradeCallback) {
          this.upgradeCallback(this.db);
        } else {
          // Default store if no upgrade callback is provided
          if (!this.db.objectStoreNames.contains('items')) {
            this.db.createObjectStore('items', {
              keyPath: 'id',
              autoIncrement: true,
            });
          }
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(`IndexedDB error: ${event.target.errorCode}`);
      };
    });
  }

  /**
   * Add or update an item
   * @param {string} storeName
   * @param {object} item
   */
  async put(storeName, item) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(item);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Get an item by key
   * @param {string} storeName
   * @param {IDBValidKey} key
   */
  async get(storeName, key) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Get all items
   * @param {string} storeName
   */
  async getAll(storeName) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Delete an item by key
   * @param {string} storeName
   * @param {IDBValidKey} key
   */
  async delete(storeName, key) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Clear a store
   * @param {string} storeName
   */
  async clear(storeName) {
    const db = await this.init();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }
}
