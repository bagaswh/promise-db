const TRANSACTION_MODE_READWRITE = 'readwrite';
const TRANSACTION_MODE_READONLY = 'readonly';
export const Database = {
  db: null,

  __promisifyRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = function (e) {
        resolve(e.target.result);
      };
      request.onerror = function (e) {
        reject(e.target.error);
      };
    });
  },

  __promisifyOpenRequest(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = function (e) {
        resolve(e.target.result);
      };
      request.onerror = function (e) {
        reject(e.target.error);
      };
      request.onblocked = function (e) {
        reject(e.target.error);
      };
    });
  },

  init(dbName, dbVersion, upgradeDB) {
    return new Promise((resolve, reject) => {
      let openDBReq = window.indexedDB.open(dbName, dbVersion);
      let self = this;
      openDBReq.onupgradeneeded = function (e) {
        upgradeDB(e.target.result);
        self.db = e.target.result;

        e.target.transaction.oncomplete = function (e) {
          resolve(self);
        };
      };
      openDBReq.onsuccess = function (e) {
        self.db = e.target.result;
        resolve(self);
      };
      openDBReq.onerror = function (e) {
        reject(e.target.error);
      };
    });
  },

  deleteDatabase(dbName) {
    let deleteDBReq = window.indexedDB.deleteDatabase(dbName);
    return this.__promisifyOpenRequest(deleteDBReq);
  },

  _getTransaction(objectStoreList, mode) {
    return this.db.transaction(objectStoreList, mode);
  },

  _getObjectStore(objectStoreName, mode) {
    let transaction = this._getTransaction(objectStoreName, mode);
    return transaction.objectStore(objectStoreName);
  },

  addData(objectStoreName, value) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READWRITE
    );
    let request = objectStore.add(value);
    return this.__promisifyRequest(request);
  },

  async modifyDataByKey(objectStoreName, key, value) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READWRITE
    );
    let request = objectStore.get(key);
    return await this.__promisifyRequest(request).then(result => {
      if (result !== undefined) {
        // proceeds to modify
        request = objectStore.put(value);
        return this.__promisifyRequest(request);
      } else {
        // data exists, deny modification to prevent inserting data
        //return Promise.reject();
      }

    });
  },

  deleteDataByKey(objectStoreName, key) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READWRITE
    );
    let request = objectStore.delete(key);
    return this.__promisifyRequest(request);
  },

  deleteDataByIndex(objectStoreName, indexName, indexKey) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READWRITE
    );
    let index = objectStore.index(indexName);
    let request = index.get(indexKey);
    return this.__promisifyRequest(request);
  },

  getDataByKey(objectStoreName, key) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READONLY
    );
    let request = objectStore.get(key);
    return this.__promisifyRequest(request);
  },

  getDataByIndex(objectStoreName, indexName, indexKey) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READONLY
    );
    let index = objectStore.index(indexName);
    let request = index.get(indexKey);
    return this.__promisifyRequest(request);
  },

  getAllData(objectStoreName) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READONLY
    );
    let request = objectStore.getAll();
    return this.__promisifyRequest(request);
  }
};