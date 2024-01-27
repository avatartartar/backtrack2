// db.js

import Dexie from 'dexie';

const db = new Dexie('backtrackDb');
db.version(1).stores({
  userDatabase: '++id'
});
