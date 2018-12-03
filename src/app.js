import {
  Database
} from './db';

let database = Object.create(Database);

async function createDatabase() {
  return await database.init('___test-d__ata-1269', 1, upgradeDB => {
    let objectStore = upgradeDB
      .createObjectStore('test-objectstore-6969', {
        keyPath: 'id',
        autoIncrement: true
      })
    objectStore.createIndex('name', 'name', {
      unique: false
    });
  });
}

let db = createDatabase();
db.then(async dbInstance => {
  //await dbInstance.deleteDataByKey('test-objectstore-6969', 2);
  await dbInstance.deleteDataByIndex('test-objectstore-6969', 'name', 'sigile');
  await dbInstance.getAllData('test-objectstore-6969').then(data => console.log(data));
});