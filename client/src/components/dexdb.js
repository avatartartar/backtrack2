// dexdb.js

import Dexie from 'dexie';
console.log('dexDB: initializing dexie db');

const dexdb = new Dexie('backtrackDb');
dexdb.version(1).stores({
    sqlDbBinary:`
      ++id,
      data
    `,
})
const tokenDb = new Dexie('tokenDb');
tokenDb.version(1).stores({
  token: 'name,value'
});

// the below code is for deleting the database, which is useful if we want to
// reuse the same database name and version number
// to use, uncomment deleteDb(), and comment out the db initializaing code above.

const deleteDb = (name) => {
  return new Promise((resolve, reject) => {
    const req = window.indexedDB.deleteDatabase(name);
    req.onsuccess = () => {
      console.log('Deleted database successfully');
      resolve();
    };
    req.onerror = () => {
      console.log('Error deleting database');
      reject(req.error);
    };
  });
}

// deleteDb('backtrackDb')

export {dexdb, tokenDb, deleteDb};
export default dexdb;
