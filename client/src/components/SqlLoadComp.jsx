import React, { useState, useEffect, useRef, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import initSqlJs from 'sql.js';
import SQLWasm from '/node_modules/sql.js/dist/sql-wasm.wasm';

import { saveAs } from 'file-saver';

import { useData } from './DataContext.jsx';

import { setJson } from '../features/slice.js';

const SqlLoadComp = () => {

// useContext is a hook for sharing data between components without having to explicitly pass a prop through every level of the tree.
// it works by creating a context object and passing it to the useContext hook.
// every component that needs access to the context object must be wrapped in the <DataContext.Provider> component.
// we do that in SqlParentComp.jsx

// in this case, it returns the sqlFile and setSqlFile values
// which are null at first.
// if and when a sqlFile is dropped onto the site, the setSqlFile function is invoked
// updating the sqlFIle variable to the dropped-in file.
// the sqlFile variable in each component that invokes it via useContext immediately receives the updated variable, i.e. the file.
  const {
    sqlFile,
    db,
    setDb,
    dbBool,
    setDbBool,
    // restuls,
    // setResults
  } = useData();


  // this is the json data of the parsed spotify data from ImportComp.jsx, which was stored in the redux store
  const {
    data: reduxJson,
    status: status,
    error: error
  } = useSelector(state => state.json);


  // local state to store the SQL.js database.
  // storing in the redux store was causing an error and is
  // not optimal bc the db is large and would be duplicated on each page refresh if stored in the redux store
  // or so it seems

  // const binaryArray = newDb.export();
  // db.userDatabases.add({ data: binaryArray }).then(() => {
  //   console.log('Database stored in IndexedDB using Dexie');
  // }).catch((error) => {
  //   console.error('Error storing database:', error);
  // });

  const dispatch = useDispatch();

  // if the db file that we generate is dropped onto the site, this useEffect is invoked.
  // it loads that file into the SQL.js database and sets the db local state to that database.
  useEffect(() => {
    const loadSqlFile = async () => {
      if (sqlFile) {
        try {
          // initializes a SQL.js instance asynchronously using the initSqlJs function.
          const SQL = await initSqlJs({ locateFile: () => SQLWasm });
          // creates a new database with the sqlFile binary data
          const newDb = new SQL.Database(sqlFile); // Load the binary data
          // sets the db local state to the database
          setDb(newDb)
          setDbBool(true);
          console.log('db set in SqlLoadComp.jsx');
          dispatch(setJson([]));
        } catch (error) {
          console.error('Error processing SQL file:', error);
        }
      }
    };

    loadSqlFile();
  }, [sqlFile]); // Adds sqlFile as a dependency, i.e. the effect only runs when sqlFile changes

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
      console.log(`${durationFromFirstToLast} to finish Table`);
    }
  };

  // sets to true when the table is created
  // when true, the SqlResults component is rendered

  const saveJsonAsFile = () => {
    const selectedData = reduxJson
    const selectedDataBlob = new Blob([JSON.stringify(selectedData)], { type: 'application/json' });
    const selectedDataUrl = URL.createObjectURL(selectedDataBlob);
    const selectedDataLink = document.createElement('a');
    selectedDataLink.href = selectedDataUrl;
    selectedDataLink.download = `${selectedData.name}.json`;
    document.body.appendChild(selectedDataLink);
    selectedDataLink.click();
  }

  const makeSql = async() => {
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
      const newDb = new SQL.Database();
      addInterval('to initialize the sql database');

        // Check that reduxJson is defined and has at least one element
    if (reduxJson && reduxJson.length > 0) {
      // Create columns from the keys of the first element in the array
      // i.e., the names of the fields in the JSON data
      const columns = Object.keys(reduxJson[0]).join(', ');
      // Create the table using the columns variable for the field names
      newDb.run(`CREATE TABLE sessions (${columns})`);

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
        const keys = Object.keys(row);
        const values = Object.values(row).map((value, index) => {
          // null values need to be inserted as the string 'NULL'
          // undefined values would cause an error
          if (value === null) {
            return 'NULL';
            // if the value is a string:
          } else if (typeof value === 'string') {
            if (keys[index] === 'spotify_track_uri') {
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
          newDb.run(`INSERT INTO sessions (${keys.join(', ')}) VALUES (${values})`);
          priorPriorRow = priorRow; // Update the prior row to the current row
          priorRow = row; // Update the prior row to the current row
        } catch (error) {
          // console.error(`Error inserting record: ${JSON.stringify(row)}`, error);
          errorRecords.push(row); // Add the record to the errorRecords array
        }
      });
      const countNotAdded = errorRecords.length + duplicateCount + nullCount;
      const rowCount = newDb.exec("SELECT COUNT(*) as count FROM sessions");
      addInterval('to insert the rows');
      // executes a SQL query to count the rows in the sessions table

      // creating a map to rename the columns
      const fieldMap = {
        "conn_country": "country",
        "episode_name": "episode_name",
        "episode_show_name": "episode_show_name",
        "incognito_mode": "incognito_mode",
        "ip_addr_decrypted": "ip_addr",
        "master_metadata_album_album_name": "album_name",
        "master_metadata_album_artist_name": "artist_name",
        "master_metadata_track_name": "track_name",
        "ms_played": "ms_played",
        "offline": "offline",
        "offline_timestamp": "offline_timestamp",
        "platform": "platform",
        "reason_end": "reason_end",
        "reason_start": "reason_start",
        "shuffle": "shuffle",
        "skipped": "skipped",
        "spotify_episode_uri": "episode_uri",
        "spotify_track_uri": "track_uri",
        "ts": "ts",
        "user_agent_decrypted": "user_agent",
        "username": "username"
      }
      // Renames the columns to be more readable
      for (let key in fieldMap) {
        try {
          newDb.run(`ALTER TABLE sessions RENAME COLUMN ${key} TO ${fieldMap[key]}`);
        } catch (error) {
          console.error(`Error renaming column ${key} to ${fieldMap[key]}`, error);
        }
      }
      addInterval('to rename the columns');
      // Updates the db local state after inserting the data and renaming the columns
      // setDb(newDb)


      const sqlBinary = newDb.export();
      // octet-stream means binary file type
      const sqlData = new Blob([sqlBinary], { type: 'application/octet-stream' });
      // asks the user where to save the file
      let errorCount = 0;

      // Save the SQL.js database to Dexie
      // pickup from there
      dexdb.sqlBinary.add({ data: sqlBinary }).then((id) => {
      console.log("SQL.js database saved in Dexie with id:", id);
      }).catch((error) => {
      console.error("Error during Dexie operation:", error);
      }
      );
      setDb(newDb)


      setDbBool(true);
      dispatch(setJson([]));

      // logging the duration of the table creation/population process to the console
      addInterval();

      // clears the redux store of the json data, freeing up tons of memory


      console.log(reduxJson.length,`rows originally in my_spotify_data.zip`);
      console.log(rowCount[0].values[0][0], 'rows added to Table');
      console.log(countNotAdded,`rows not added to Table. ${errorRecords.length} rows with errors, ${duplicateCount} duplicate rows, ${nullCount} null rows`);

    }

  } catch (err) {
    console.error(err);
  }
};

// if/when reduxJson changes, makeSql is called
useEffect(() => {
  if (reduxJson && reduxJson.length > 0) {
    // saveJsonAsFile();
    addInterval('to invoke makeSql');
    console.log('invoking makeSql');
    makeSql();
  }
}, [reduxJson]); // Adds reduxJson as a dependency, i.e. only runs when reduxJson changes


  return null;
}

export default SqlLoadComp
