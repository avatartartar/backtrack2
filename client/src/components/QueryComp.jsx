
import React, { useEffect, useContext, useRef, useState } from 'react';
import { useData } from './DataContext.jsx';
import { useDispatch, useSelector } from "react-redux";

import { setResults } from '../features/slice.js';
import dexdb from './dexdb.js';


const QueryComp = () => {

const {
  sqlFile,
  sqlDb,
  setSqlDb,
  sqlDbBool,
  setSqlDbBool,
  tracksTableBool,
  setTracksTableBool,
  // results,
  // setResults
} = useData();
}

QueryComp.makeTempTables = async (db) => {
  const { tracks, albums, artists } = useSelector(state => state.query);
  console.log('makeTempTables invoked');
  const typeOptions = ['tracks', 'albums', 'artists'];
      const typeMap = { tracks, albums, artists };
  typeMap.forEach( async (typeObject) => {
    try {
      console.log('trying to create allTime and byYear tables');
    // Appending the CREATE TABLE statement to our allTime query
    const allTimeQuery = `CREATE TABLE ${typeObject.name}_allTime AS ${typeObject.allTime}`;
    await db.exec(allTimeQuery);
    console.log(`Created table "${typeObject.name}_allTime".`);
    await db.exec(typeObject.joinTopYears);
    console.log(`Created table "${typeObject.name}_allTime".`);
  } catch (error) {
    console.error(`Error creating table "${typeObject.name}_allTime":`, error.message);
  }
}
  );
}

QueryComp.viewTempTables = async (db) => {
  const tempTables = [
    'tracks_allTime',
    'albums_allTime',
    'artists_allTime',
    'top_tracks_by_year',
    'top_albums_by_year',
    'top_artists_by_year',
  ]
  tempTables.forEach( async (tableName) => {
  try {
    const result = await db.exec(`SELECT * FROM ${tableName};`);
    if (result.length === 0) {
      // The query succeeded but returned no results,
      // meaning the table exists but is empty.
      console.log(`Table "${tableName}" is empty.`);
    } else {
      console.log(`Contents of table "${tableName}":`);
      console.table(result[0].values);
    }
  } catch (error) {
    console.error(`Error viewing table "${tableName}":`, error.message);
  }
  })
};

QueryComp.dropTempTables = (sqlDb) => {
  const tempTables = [
    'tracks_allTime',
    'albums_allTime',
    'artists_allTime',
    'top_tracks_by_year',
    'top_albums_by_year',
    'top_artists_by_year',
  ]
  tempTables.forEach((tableName) => {
  try {
    sqlDb.exec(`DROP TABLE ${tableName};`);
    console.log(`Dropped table "${tableName}".`);
  } catch (error) {
    console.error(`Error dropping table "${tableName}":`, error.message);
  }
})
};

QueryComp.executeFilter = async (type, month, chosenYear, sqlDb, dispatch) => {
  let res;
  console.log('type, year, month', type, month);
  console.log('chosenYear', chosenYear);
  const typeObject = typeMap[type];
  if (chosenYear === 2024) {
      if (month) {
          return null;
      }
      res = await sqlDb.exec(typeObject.allTime);
      }
  else {
      if (!month) {
          res = await sqlDb.exec(typeObject.byYear(chosenYear));
      } else {
          res = await sqlDb.exec(typeObject.byYearByMonth(chosenYear, month));
      }
  }
  dispatch(setResults(res));
};

QueryComp.executeLiveQuery = async (localQuery, sqlDb, dispatch, setLastLocalQuery) => {
  try {
      setLastLocalQuery(localQuery);
      const res = await sqlDb.exec(localQuery);
      dispatch(setResults(res));

  } catch (error) {
      console.error('Error executing query:', error);
      alert('Error executing query. Check the console for more details.');
  }
};

export const {
  makeTempTables,
  viewTempTables,
  dropTempTables,
  executeFilter,
  executeLiveQuery
} = QueryComp;

export default QueryComp;
