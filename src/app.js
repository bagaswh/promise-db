import {
  Database
} from './db';

let database = Object.create(Database);

let db = database.init('tokopedia-giveaway', 3, upgradeDB => {
  let objectStores = [{
    objectStoreName: 'followers',
    options: {
      keyPath: 'id',
      autoIncrement: true
    },
    indexes: [{
      indexName: 'name',
      indexKey: 'name',
      options: {
        unique: false,
        multiple: true
      }
    }]
  }, {
    objectStoreName: 'workspaces',
    options: {
      keyPath: 'name'
    }
  }];

  objectStores.forEach(objectStore => {
    let os = upgradeDB.createObjectStore(objectStore.objectStoreName, objectStore.options);
    if (objectStore.indexes) {
      objectStore.indexes.forEach(index => {
        os.createIndex(index.indexName, index.indexKey, index.options);
      });
    }
  });

});

db.then(dbInstance => {
  //dbInstance.addData('workspaces', {
  //name: 'oyoyoy',
  //scenarios: [{
  //scenarioName: 'tungpo'
  //}]
  //});
  //dbInstance.addData('followers', 'lolez');
  dbInstance.deleteDatabase('tokopedia-giveaway');
});

//let db = createDatabase();
//db.then(async dbInstance => {
//await dbInstance.deleteDataByKey('test-objectstore-6969', 2);
//await dbInstance.deleteDataByIndex('test-objectstore-6969', 'name', 'sigile');
//await dbInstance.getAllData('test-objectstore-6969').then(data => console.log(data));
//console.log(dbInstance);
//dbInstance.deleteDatabase('data6969').then(fullfilled => console.log('successfully deleted'));
//});