import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import initSqlJs from 'sql.js';
import SQLWasm from '/node_modules/sql.js/dist/sql-wasm.wasm';

import { saveAs } from 'file-saver';

import dexdb from './dexdb.js'; // Dexie instance

import { useData } from './DataContext.jsx';

import { setJson } from '../features/slice.js';

import { makeClientTables, viewClientTables, syncTrackUris, fillTopRecordsViaApi } from '../features/querySlice.js';

const SqlLoadComp = () => {
  const {
    sqlDb,
    setSqlDb,
    sqlDbBool,
    setSqlDbBool,
    tracksTableBool,
    setTracksTableBool,
  } = useData();

  const dispatch = useDispatch();

  // this is the json data of the parsed spotify data from ImportComp.jsx, which was stored in the redux store
  const {
    data: reduxJson,
    status: status,
    error: error
  } = useSelector(state => state.json);


  // an array to store the intervals in addInterval
  let intervals = [];
  // addInterval:
  // allows us to see the time it takes to run each step of the sql process.
  // works by invoking it with a label, which counts as an interval and is logged to the console.
  // invoke with no argument to log to the console the total time to run the process.
  const addInterval = (label) => {
    const currentDate = new Date().getTime();
    intervals = [...intervals, { time: currentDate, label }];
    const lastInterval = intervals[intervals.length - 1].time;
    if (label && intervals.length >= 2) {
      const durationBetweenIntervals = lastInterval - intervals[intervals.length - 2].time;
      const duration = durationBetweenIntervals > 1000 ? `${durationBetweenIntervals / 1000} seconds` : `${durationBetweenIntervals}ms`;
      console.log(`${duration} ${intervals[intervals.length - 1].label}`);
    }
    if (!label) {
      const firstInterval = intervals[0].time;
      const durationFromFirstToLast = (lastInterval - firstInterval) / 1000;
      console.log(`${durationFromFirstToLast} seconds to finish making all Tables and save to Dexie`);
    }
};

  // const saveJsonAsFile = () => {
  //   const selectedData = reduxJson
  //   const selectedDataBlob = new Blob([JSON.stringify(selectedData)], { type: 'application/json' });
  //   const selectedDataUrl = URL.createObjectURL(selectedDataBlob);
  //   const selectedDataLink = document.createElement('a');
  //   selectedDataLink.href = selectedDataUrl;
  //   selectedDataLink.download = `${selectedData.name}.json`;
  //   document.body.appendChild(selectedDataLink);
  //   selectedDataLink.click();
  // }

  // called when a spotify history zip file is uploaded
  const makeSqlDb = async() => {
    // Check that reduxJson is defined and has at least one element
    if (!reduxJson || reduxJson.length === 0) {
      // If not, exit the function
      return;
    }

    // from the sql.js docs
    // "sql.js needs to fetch its wasm file, so we cannot immediately instantiate the database
    // without any configuration, initSqlJs will fetch the wasm files directly from the same path as the js"
    try {
      // initializes a SQL.js instance asynchronously using the initSqlJs function.
      // the SQLWasm data file is provided to us by the sql.js library.
      // and is needed to instantiate the SQL.js object.
      const SQL = await initSqlJs({ locateFile: () => SQLWasm });
      // addInterval('to load the wasm file');

      // creates a new empty database
      const newSqlDb = new SQL.Database();
      addInterval('to initialize the sql database');

        // Check that reduxJson is defined and has at least one element
    if (reduxJson && reduxJson.length > 0) {
      // Create columns from the keys of the first element in the array
      // i.e., the names of the fields in the JSON data
      const columns = Object.keys(reduxJson[0]).join(', ');
      // Create the table using the columns variable for the field names
      newSqlDb.run(`CREATE TABLE sessions (${columns})`);

      let errorRecords = []; // Array to store records that cause errors

      let priorRow = null; // Variable to store the previous row
      let priorPriorRow = null; // Variable to store the previous row

      let rowIndex = null; // Variable to store the current row
      let duplicateCount = 0; // Variable to store the number of duplicate rows
      let nullCount = 0; // Variable to store the number of rows with null values

      // Insert each json object into the table as a row
      addInterval('to create the columns');

      reduxJson.forEach(row => {
        rowIndex++;
        const filteredKeys = Object.keys(row).filter(key => !key.includes('episode'));
        const filteredValues = filteredKeys.map(key => {
          let value = row[key];
          // null values need to be inserted as the string 'NULL'
          // undefined values would cause an error
          if (value === null) {
            return 'NULL';
            // if the value is a string:
          } else if (typeof value === 'string') {
            if (key === 'spotify_track_uri') {
              value = value.substring(14); // Remove the first 14 characters from the track uri (spotify:track:)
            }
            return `'${value.replace("'", "''")}'`; // Escape single quotes in string values
          } else {
            return value;
          }
          // joining the values array into a string separated by commas
        }).join(', ');

        // If the track name of the current row is the same as the track name of the prior row, skip this row
        // This is to prevent duplicate rows from being inserted, which I saw in my spotify data when importing in supabase
        if (priorPriorRow){
          if(row.master_metadata_track_name === priorRow.master_metadata_track_name &&
            priorRow.master_metadata_track_name === priorPriorRow.master_metadata_track_name) {
          duplicateCount++;
          // console.log(`Skipping ${row.master_metadata_track_name} at row ${rowIndex}. Duplicate`);
          return;
        }
        if (row.master_metadata_track_name === null && row.master_metadata_album_album_name === null) {
          nullCount++;
          return;
        }
      }

        try {
          // Inserts one row into the sessions table, using the keys array for the field names
          // and the values array for the values
          newSqlDb.run(`INSERT INTO sessions (${filteredKeys.join(', ')}) VALUES (${filteredValues})`);
          priorPriorRow = priorRow; // Update the prior row to the current row
          priorRow = row; // Update the prior row to the current row
        } catch (error) {
          // console.error(`Error inserting record: ${JSON.stringify(row)}`, error);
          errorRecords.push(row); // Add the record to the errorRecords array
        }
      });
      const countNotAdded = errorRecords.length + duplicateCount + nullCount;
      const rowCount = newSqlDb.exec("SELECT COUNT(*) as count FROM sessions");
      addInterval('to insert the rows');
      // executes a SQL query to count the rows in the sessions table

      // creating a map to rename the columns
      const fieldMap = {
        "ts": "ts",
        "master_metadata_track_name": "track_name",
        "master_metadata_album_artist_name": "artist_name",
        "master_metadata_album_album_name": "album_name",
        "ms_played": "ms_played",
        "reason_start": "reason_start",
        "reason_end": "reason_end",
        "spotify_track_uri": "track_uri",
        "platform": "platform",
        "ip_addr_decrypted": "ip_addr",
        "user_agent_decrypted": "user_agent",
        "conn_country": "country",
        "incognito_mode": "incognito_mode",
        "offline": "offline",
        "offline_timestamp": "offline_timestamp",
        "shuffle": "shuffle",
        "skipped": "skipped",
        "username": "username"
      }
      // Renames the columns to be more readable
      for (let key in fieldMap) {
        try {
          newSqlDb.run(`ALTER TABLE sessions RENAME COLUMN ${key} TO ${fieldMap[key]}`);
        } catch (error) {
          console.error(`Error renaming column ${key} to ${fieldMap[key]}`, error);
        }
      }

      const renameColumnsInSessions = async () => {
        try {
          // Rename track_uri to og_track_uri
          newSqlDb.run(`
            ALTER TABLE sessions RENAME COLUMN track_uri TO og_track_uri;
          `);

          // Add a new column track_uri for the synced_track_uri
          newSqlDb.exec(`
            ALTER TABLE sessions ADD COLUMN track_uri TEXT;
            ALTER TABLE sessions ADD COLUMN album_uri TEXT;
            ALTER TABLE sessions ADD COLUMN artist_uri TEXT;
            ALTER TABLE sessions ADD COLUMN top_bool BOOLEAN;
            ALTER TABLE sessions ADD COLUMN preview_url TEXT;
            ALTER TABLE sessions ADD COLUMN image_url TEXT;
            ALTER TABLE sessions ADD COLUMN explicit TEXT;
            ALTER TABLE sessions ADD COLUMN popularity TEXT;
            ALTER TABLE sessions ADD COLUMN duration_ms TEXT;
            ALTER TABLE sessions ADD COLUMN release_date TEXT;
          `);

          console.log('Sessions table columns renamed and new column added.');
          return false;
        } catch (error) {
          console.error('Error renaming columns in sessions table:', error);
          return true;
        }
      };
      const renameColumnsSuccess = await renameColumnsInSessions();
      addInterval('to rename columns in sessions table');
      const syncTrackUrisSuccess = await dispatch(syncTrackUris(newSqlDb));
      // if (syncTrackUrisSuccess) {
      //   console.log('syncTrackUrisSuccess failed in SQLoad');
      //   return; }
      console.log('syncTrackUrisSuccess complete in SQLoad');
      console.log('clientTables created.');
      addInterval('to sync track uris');

      const tracksSuccess = await createAndAlterTracksTable(newSqlDb);
      if (tracksSuccess) { return; }
      console.log('Tracks table created and altered.');
      addInterval('to create and alter tracks table');


      // const ogTrackUriDropped = await dropOgTrackUriFromSessions(newSqlDb);
      // if (ogTrackUriDropped) { return; }
      // console.log('Og track_uri dropped from sessions.');

      const dropOgTrackUriSuccess = await dropColumnFromTable(newSqlDb, 'sessions', 'og_track_uri');
      addInterval('to drop og_track_uri from sessions');


      const albumsSuccess = await createAndAlterAlbumsTable(newSqlDb);
      if (albumsSuccess) { return; }
      console.log('Albums table created and altered.');
      addInterval('to create and alter albums table');

      // const artistsSuccess = await createAndAlterArtistsTable(newSqlDb);
      // if (artistsSuccess) { return; }
      // console.log('Artists table created and altered.');

      console.log('Now creating allTime and by_year tables...');
      try {
        // eslint says await doesn’t have any effect on dispatch below, but that’s incorrect. when await is not on the dispatch, the rest of the code below continues async. this causes the by_year tables - which are currently taking way too long to run; i think they can be optimized - to not get stored in the dexie db.
        // perhaps eslint is assuming that function dispatched doesn’t return a promise?
        await dispatch(makeClientTables(newSqlDb));
        addInterval('to create allTime and by_year tables');
      } catch (error) {
        console.error('Error creating allTime and by_year tables:', error);
      }
      // try {
      //   await dispatch(fillTopRecordsViaApi(newSqlDb));
      //   addInterval('to fill top records via API');
      //   console.log('Top records filled via API.');
      // } catch (error) {
      //   console.error('Error filling top records via API:', error);
      // }
      try {
        // uncomment the line below to view the client tables in the console
        // await dispatch(viewClientTables(newSqlDb));

        // VACUUM reclaims unused space, as SQLite doesn't automatically give it back.
        // rather, it keeps it for future use.
        // the unvacuumed size apparently does not get stored in the dexie db.
        // (but i'm not so sure, as a couple of times the size was such it looked like it did. )
        // its taking up space in memory, but not in the db.
        // still, vacuum goes vroom vroom
        console.log('VACUUMing...');
        await newSqlDb.run('VACUUM');
        addInterval('to vacuum');
        // addInterval('to setSqlDb after vacuuming');

        const sqlDbBinary = await newSqlDb.export();
        console.log('clientTables created.');
        addInterval('to export sqlDb');


        console.log("sqlDbBinary size:", (sqlDbBinary.length)/1000000, "MB");
        try {
          await dexdb.sqlDbBinary.add({ data: sqlDbBinary });
          console.log('sqlDb creation complete. site fully functional for user. all that remains is to save the sqlDb to dexie');
          setSqlDb(newSqlDb);
          addInterval();

          setTracksTableBool(true);
          // setSqlDb(newSqlDb);
          addInterval('to set sqlDb');

          setSqlDbBool(true);
          dispatch(setJson([]));
          console.log('sqlDbBinary database saved in Dexie/IndexedDb');
          addInterval('to add sqlDbBinary to dexie');
          console.log(reduxJson.length,`rows originally in my_spotify_data.zip`);
          console.log(countNotAdded,`rows dropped: ${errorRecords.length} rows with errors, ${duplicateCount} duplicate rows, ${nullCount} null rows`);
          console.log(rowCount[0].values[0][0], 'rows added to Table');
        } catch (error) {
          console.error("Error during Dexie operation:", error);
        }
      } catch (error) {
        console.error('Error creating client tables:', error);
      }
    }
    } catch (error) {
      console.error(error);
    }
  };

const createAndAlterTracksTable = async (dbArg) => {
  try {
    await dbArg.run(`
      CREATE TABLE tracks AS
      SELECT DISTINCT track_uri, album_uri, top_bool
      FROM sessions;
    `);
    // not working yet... 2024-01-31_03-06-AM
    // this will be used to populate the all_uris column
    // that way, we can have a place to store of all the uris for a track (surprisingly, some tracks have more than one uri)
    // whle normalizing the data to only have one uri per track in the track_uri field in each table.
// console.log('Tracks table altered. Now updating...');
// try {
//     await dbArg.exec(`
//       UPDATE tracks
//       SET all_uris = (
//         ( SELECT GROUP_CONCAT(unique_og_track_uri, char(10)) FROM ( SELECT DISTINCT og_track_uri as unique_og_track_uri FROM sessions WHERE track_uri = s.track_uri ) ) AS all_uris FROM (SELECT DISTINCT track_uri, track_name FROM sessions order by ts desc) s LIMIT 100;
//     `);
//     console.log('Tracks table updated.');
//       } catch (error) {
//         console.error('Error updating tracks table:', error);
//       }
// console.log('Tracks table updated. Now adding columns...');
    // adding the columns that the API will populate
    // await dbArg.exec(`
    //   ALTER TABLE tracks ADD COLUMN preview_url TEXT;
    //   ALTER TABLE tracks ADD COLUMN image_url TEXT;
    //   ALTER TABLE tracks ADD COLUMN all_uris TEXT;
    //   ALTER TABLE tracks ADD COLUMN explicit TEXT;
    //   ALTER TABLE tracks ADD COLUMN popularity TEXT;
    //   ALTER TABLE tracks ADD COLUMN duration_ms TEXT;
    //   ALTER TABLE tracks ADD COLUMN release_date TEXT;
    // `);

    console.log('Tracks table created and altered.');
    return false; // return false to indicate success, rather than returning nothing
  } catch (error) {
    console.error('Error creating and altering tracks table:', error);
    return true; // true to indicate failure
  }
};

  const createAndAlterAlbumsTable = async (dbArg) => {
    try {
        await dbArg.run(`
        CREATE TABLE albums AS
        SELECT
          album_name,
          artist_name,
          top_bool,
          MIN(track_uri) AS rep_track_uri
        FROM
          sessions
        WHERE
          artist_name IS NOT NULL AND
          album_name IS NOT NULL
        GROUP BY
          album_name,
          artist_name
      `);
    } catch (error) {
      console.error('Error creating albums table:', error);
      return true; // true to indicate failure
    }
      // try {
      //   await dbArg.exec(`
      //     ALTER TABLE albums ADD COLUMN album_uri TEXT;
      //     ALTER TABLE albums ADD COLUMN artist_uri TEXT;
      //     ALTER TABLE albums ADD COLUMN image_url TEXT
      //   `);
      //   return false; // return false to indicate success, rather than returning nothing
      // } catch (error) {
      //   console.error('Error adding new columns to albums table:', error);
      //   return true; // true to indicate failure
      // }
    }

    // const createAndAlterArtistsTable = async (dbArg) => {
    //   try {
    //       await dbArg.run(`
    //       CREATE TABLE artists AS
    //       SELECT
    //         artist_name,
    //         top_bool,
    //         MIN(track_uri) AS rep_track_uri
    //       FROM
    //         sessions
    //       WHERE
    //         artist_name IS NOT NULL
    //       GROUP BY
    //         artist_name
    //     `);
    //   }
    //   catch (error) {
    //     console.error('Error creating artists table:', error);
    //     return true; // true to indicate failure
    //   }
    //     try {
    //       await dbArg.exec(`
    //       ALTER TABLE artists ADD COLUMN artist_uri TEXT;
    //       ALTER TABLE artists ADD COLUMN genres TEXT;
    //       `);

    //       console.log('Artists table created and altered.');
    //       return false; // return false to indicate success, rather than returning nothing
    //     } catch (error) {
    //       console.error('Error adding new columns to artists table:', error);
    //       return true; // true to indicate failure
    //     }
    //   }


// Updates the sqlDb local state after inserting the data and renaming the columns
const dropColumnFromTable = async (dbArg, tableName, columnName) => {
  try {
    // Get the column names
    const result = await dbArg.exec(`PRAGMA table_info(${tableName})`);
    const columnNames = await result[0].values.map(value => value[1]);

    // Remove the unwanted column
    const filteredColumnNames = await columnNames.filter(name => name !== columnName);

    // Construct the SQL query
    const query = `
      ALTER TABLE ${tableName} RENAME TO temp_${tableName};
      CREATE TABLE ${tableName} AS SELECT ${filteredColumnNames.join(', ')} FROM temp_${tableName};
      DROP TABLE temp_${tableName};
    `;

    // Execute the query
    await dbArg.exec(query);

    console.log(`Column "${columnName}" dropped from table "${tableName}".`);
  } catch (error) {
    console.error(`Error dropping column "${columnName}" from table "${tableName}":`, error);
  }    finally {
    console.log('Finally: Dropping temp table...');
    await dbArg.exec(`DROP TABLE IF EXISTS temp_${tableName}`);
  }
};


// if/when reduxJson changes, makeSqlDb is called
useEffect(() => {
  if (reduxJson && reduxJson.length > 0) {
    // saveJsonAsFile();
    addInterval('to invoke makeSqlDb');
    console.log('invoking makeSqlDb');
    makeSqlDb();
  }
}, [reduxJson]); // Adds reduxJson as a dependency, i.e. only runs when reduxJson changes
  return null;
}

export default SqlLoadComp
