import {
  Database
} from './db';

let database = Object.create(Database);

async function createDatabase() {
  return await database.init('___test-d__ata-1269', 1, upgradeDB => {
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
  await dbInstance.modifyDataByKey('test-objectstore-6969', 2, {
    id: 2,
    name: 'sigile'
  }).then(fullfilled => {
    console.log('success modifying');
  }, rejected => {
    console.log('failed modifying', rejected);
  });

  await dbInstance.getAllData('test-objectstore-6969').then(data => console.log(data));
});