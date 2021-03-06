const TRANSACTION_MODE_READWRITE = 'readwrite';
const TRANSACTION_MODE_READONLY = 'readonly';

function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = e => {
      resolve(e.target.result);
    };
    request.onerror = e => {
      reject(e.target.error);
    };
  });
}

function promisifyOpenRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = e => {
      resolve(e.target.result);
    };
    request.onerror = e => {
      reject(e.target.error);
    };
    request.onblocked = e => {
      reject(e);
    };
  });
}

export const Database = {
  db: null,

  init(dbName, dbVersion, upgradeDB) {
    return new Promise((resolve, reject) => {
      let openDBReq = window.indexedDB.open(dbName, dbVersion);
      openDBReq.onupgradeneeded = e => {
        upgradeDB(e.target.result);
        this.db = e.target.result;

        e.target.transaction.oncomplete = e => {
          resolve(this);
        };
      };
      openDBReq.onsuccess = e => {
        this.db = e.target.result;
        resolve(this);
      };
      openDBReq.onerror = e => {
        reject(e.target.error);
      };
    });
  },

  deleteDatabase(dbName) {
    let deleteDBReq = window.indexedDB.deleteDatabase(dbName);
    return promisifyOpenRequest(deleteDBReq);
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
    return promisifyRequest(request);
  },

  async modifyDataByKey(objectStoreName, value, key) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READWRITE
    );
    let request = objectStore.get(key);
    return await promisifyRequest(request).then(result => {
      if (result !== undefined) {
        // proceeds to modify
        request = objectStore.put(value, key);
        return promisifyRequest(request);
      }

      // data does not exist, deny modification to prevent inserting data
      return Promise.reject();
    });
  },

  async modifyDataByIndex(objectStoreName, indexName, indexKey, value) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READWRITE
    );
    let index = objectStore.index(indexName);
    let request = index.get(indexKey);
    return await promisifyRequest(request).then(async result => {
      if (result !== undefined) {
        // proceeds to modify
        // getting object-store
        request = objectStore.get(result.keyPath);
        return await promisifyRequest(request).then(result => {
          if (result !== undefined) {
            request = objectStore.put(value);
            return promisifyRequest(request);
          }

          return Promise.reject();
        });
      }

      // data does not exist, deny modification to prevent inserting data
      return Promise.reject();
    });
  },

  deleteDataByKey(objectStoreName, key) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READWRITE
    );
    let request = objectStore.delete(key);
    return promisifyRequest(request);
  },

  async deleteDataByIndex(objectStoreName, indexName, indexKey) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READWRITE
    );
    let index = objectStore.index(indexName);
    let request = index.get(indexKey);
    return await promisifyRequest(request).then(data => {
      if (data !== undefined) {
        request = objectStore.delete(data[objectStore.keyPath]);
        return promisifyRequest(request);
      }
    });
  },

  getDataByKey(objectStoreName, key) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READONLY
    );
    let request = objectStore.get(key);
    return promisifyRequest(request);
  },

  getDataByIndex(objectStoreName, indexName, indexKey) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READONLY
    );
    let index = objectStore.index(indexName);
    let request = index.get(indexKey);
    return promisifyRequest(request);
  },

  getAllData(objectStoreName) {
    let objectStore = this._getObjectStore(
      objectStoreName,
      TRANSACTION_MODE_READONLY
    );
    let request = objectStore.getAll();
    return promisifyRequest(request);
  }
};
