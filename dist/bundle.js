/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db */ \"./src/db.js\");\n\n\nlet database = Object.create(_db__WEBPACK_IMPORTED_MODULE_0__[\"Database\"]);\n\nasync function createDatabase() {\n  return await database.init('___test-d__ata-1269', 1, upgradeDB => {\n    upgradeDB\n      .createObjectStore('test-objectstore-6969', {\n        keyPath: 'id',\n        autoIncrement: true\n      })\n    //.createIndex('test-index', 'test-index', {\n    //unique: false\n    //});\n  });\n}\n\nlet db = createDatabase();\ndb.then(async dbInstance => {\n  //await dbInstance.addData('test-objectstore-6969', {\n  //name: 'sianjeg'\n  //});\n  await dbInstance.modifyDataByKey('test-objectstore-6969', 2, {\n    id: 2,\n    name: 'sigile'\n  }).then(fullfilled => {\n    console.log('success modifying');\n  }, rejected => {\n    console.log('failed modifying', rejected);\n  });\n\n  await dbInstance.getAllData('test-objectstore-6969').then(data => console.log(data));\n});\n\n//# sourceURL=webpack:///./src/app.js?");

/***/ }),

/***/ "./src/db.js":
/*!*******************!*\
  !*** ./src/db.js ***!
  \*******************/
/*! exports provided: Database */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Database\", function() { return Database; });\nconst TRANSACTION_MODE_READWRITE = 'readwrite';\nconst TRANSACTION_MODE_READONLY = 'readonly';\nconst Database = {\n  db: null,\n\n  __promisifyRequest(request) {\n    return new Promise((resolve, reject) => {\n      request.onsuccess = function (e) {\n        resolve(e.target.result);\n      };\n      request.onerror = function (e) {\n        reject(e.target.error);\n      };\n    });\n  },\n\n  __promisifyOpenRequest(request) {\n    return new Promise((resolve, reject) => {\n      request.onsuccess = function (e) {\n        resolve(e.target.result);\n      };\n      request.onerror = function (e) {\n        reject(e.target.error);\n      };\n      request.onblocked = function (e) {\n        reject(e.target.error);\n      };\n    });\n  },\n\n  init(dbName, dbVersion, upgradeDB) {\n    return new Promise((resolve, reject) => {\n      let openDBReq = window.indexedDB.open(dbName, dbVersion);\n      let self = this;\n      openDBReq.onupgradeneeded = function (e) {\n        upgradeDB(e.target.result);\n        self.db = e.target.result;\n\n        e.target.transaction.oncomplete = function (e) {\n          resolve(self);\n        };\n      };\n      openDBReq.onsuccess = function (e) {\n        self.db = e.target.result;\n        resolve(self);\n      };\n      openDBReq.onerror = function (e) {\n        reject(e.target.error);\n      };\n    });\n  },\n\n  deleteDatabase(dbName) {\n    let deleteDBReq = window.indexedDB.deleteDatabase(dbName);\n    return this.__promisifyOpenRequest(deleteDBReq);\n  },\n\n  _getTransaction(objectStoreList, mode) {\n    return this.db.transaction(objectStoreList, mode);\n  },\n\n  _getObjectStore(objectStoreName, mode) {\n    let transaction = this._getTransaction(objectStoreName, mode);\n    return transaction.objectStore(objectStoreName);\n  },\n\n  addData(objectStoreName, value) {\n    let objectStore = this._getObjectStore(\n      objectStoreName,\n      TRANSACTION_MODE_READWRITE\n    );\n    let request = objectStore.add(value);\n    return this.__promisifyRequest(request);\n  },\n\n  async modifyDataByKey(objectStoreName, key, value) {\n    let objectStore = this._getObjectStore(\n      objectStoreName,\n      TRANSACTION_MODE_READWRITE\n    );\n    let request = objectStore.get(key);\n    return await this.__promisifyRequest(request).then(result => {\n      if (result !== undefined) {\n        // proceeds to modify\n        request = objectStore.put(value);\n        return this.__promisifyRequest(request);\n      }\n\n      // data does not exist, deny modification to prevent inserting data\n      return Promise.reject();\n    });\n  },\n\n  deleteDataByKey(objectStoreName, key) {\n    let objectStore = this._getObjectStore(\n      objectStoreName,\n      TRANSACTION_MODE_READWRITE\n    );\n    let request = objectStore.delete(key);\n    return this.__promisifyRequest(request);\n  },\n\n  deleteDataByIndex(objectStoreName, indexName, indexKey) {\n    let objectStore = this._getObjectStore(\n      objectStoreName,\n      TRANSACTION_MODE_READWRITE\n    );\n    let index = objectStore.index(indexName);\n    let request = index.get(indexKey);\n    return this.__promisifyRequest(request);\n  },\n\n  getDataByKey(objectStoreName, key) {\n    let objectStore = this._getObjectStore(\n      objectStoreName,\n      TRANSACTION_MODE_READONLY\n    );\n    let request = objectStore.get(key);\n    return this.__promisifyRequest(request);\n  },\n\n  getDataByIndex(objectStoreName, indexName, indexKey) {\n    let objectStore = this._getObjectStore(\n      objectStoreName,\n      TRANSACTION_MODE_READONLY\n    );\n    let index = objectStore.index(indexName);\n    let request = index.get(indexKey);\n    return this.__promisifyRequest(request);\n  },\n\n  getAllData(objectStoreName) {\n    let objectStore = this._getObjectStore(\n      objectStoreName,\n      TRANSACTION_MODE_READONLY\n    );\n    let request = objectStore.getAll();\n    return this.__promisifyRequest(request);\n  }\n};\n\n//# sourceURL=webpack:///./src/db.js?");

/***/ })

/******/ });