import {
  Database
} from './db';

let database = Object.create(Database);

async function createDatabase() {
  return await database.init('test-data-121', 26, upgradeDB => {
    upgradeDB
      .createObjectStore('test-objectstore-6969', {
        keyPath: 'id',
        autoIncrement: true
      })
    //.createIndex('test-index', 'test-index', {
    //unique: false
    //});
  });
}

let db = createDatabase();
db.then(async dbInstance => {
  //await dbInstance.addData('test-objectstore-6969', {
  //name: 'sianjeg'
  //});
  //dbInstance.getAllData('test-objectstore-6969').then(data => console.log(data));
  dbInstance.modifyDataByKey('test-objectstore-6969', 10);
});