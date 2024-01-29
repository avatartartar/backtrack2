// dexdb.js

import Dexie from 'dexie';
console.log('dexDB: initializing dexie db');

const dexdb = new Dexie('backtrackDb');
dexdb.version(1).stores({
    sessionsBinary:`
      ++id,
      data
    `,
})

// the below code is for deleting the database, which is useful if we want to
// reuse the same database name and version number
// to use, uncomment the below code, and comment out the above code
// const DBDeleteRequest = window.indexedDB.deleteDatabase("backtrackDb");

// DBDeleteRequest.onerror = function(event) {
//   console.log("Error deleting database.");
// };

// DBDeleteRequest.onsuccess = function(event) {
//   console.log("Database deleted successfully");

//   console.log(event.result); // should be undefined
// };

// dexdb.open().catch((error) => {
//   console.error('Error opening Dexie database:', error);
// });

export default dexdb;
