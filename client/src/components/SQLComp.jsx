import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import initSqlJs from 'sql.js';
import SQLWasm from '/node_modules/sql.js/dist/sql-wasm.wasm';

const SQLComp = () => {
  const dispatch = useDispatch();

  // this is the json data from ImportComp.jsx, which gets stored in the redux store
  const {
    data: reduxJson,
    status: status,
    error: error
  } = useSelector(state => state.json);

  const [db, setDb] = useState(null);
  const [runInterval, setRunInterval] = useState([]);
  let tableStartTime = null;

  let intervals = [];

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

    setRunInterval(intervals);
  };

  // sets to true when the table is created
  // when true, the SqlResults component is rendered
  const [isTableCreated, setIsTableCreated] = useState(false);

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
      addInterval('to load the wasm file');

      // creates a new empty database
      const newDb = new SQL.Database();
      addInterval('to initialize the sql database');

        // Check that reduxJson is defined and has at least one element
    if (reduxJson && reduxJson.length > 0) {
      // Create columns from the keys of the first element in the array
      // i.e., the names of the fields in the JSON data
      const columns = Object.keys(reduxJson[0]).join(', ');
      // Create the table using the columns variable for the field names
      tableStartTime = Date.now();
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


      console.log(reduxJson.length,`rows originally in my_spotify_data.zip`);
      console.log(rowCount[0].values[0][0], 'rows added to Table');
      console.log(countNotAdded,`rows not added to Table. ${errorRecords.length} rows with errors, ${duplicateCount} duplicate rows, ${nullCount} null rows`);;
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
          console.error(`Error renaming column ${key} to ${fieldMap[key]}`);
          console.error(error);
        }
      }
      addInterval('to rename the columns');
      // Updates the db local state after inserting the data and renaming the columns
      setDb(newDb);
      // Sets isTableCreated to true so that the SqlResults component is rendered
      setIsTableCreated(true);
      const tableEndTime = Date.now();

      addInterval();


    }

    } catch (err) {
      console.error(err);
    }
  };
  // when reduxJson changes, makeSql is called
  useEffect(() => {
    if (reduxJson && reduxJson.length > 0) {
      // saveJsonAsFile();
      addInterval('to invoke makeSql');
      makeSql();
    }
  }, [reduxJson]); // Adds reduxJson as a dependency, i.e. only runs when reduxJson changes

  // a placeholder component that renders the results of the SQL query
  function ResultsTable({ columns, values }) {
    // addInterval('ResultsTable: before return');
    const tableRef = useRef(null);

    useEffect(() => {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
      // `border-collapse`: specifies whether a table's borders should be collapsed into a single border or separated
      <table ref={tableRef} style={{ width: '100%', color: 'black', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {/* maps over the columns array and renders a table header for each column */}
            {columns.map((column, index) => (
              <th key={index} style={{ border: '1px solid black', padding: '8px' }}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* maps over the values array and renders a table row for each row of data */}
          {values.map((value, index) => (
            <tr key={index}>
              {value.map((cell, index) => (
              <th key={index} style={{ border: '1px solid black', padding: '8px' }}>{cell}</th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // a random query and the results rendered to test/demo
  // destructuring the db prop directly from the props object passed in.
  function SqlResults({ db }) {

    // for storing the results of the query in local state
    const [results, setResults] = useState([]);

    // addInterval('SqlResults: before query');
    useEffect(() => {
        // runs a SQL query to get the most recent 50 tracks by RÜFÜS DU SOL
        // however, right now (2024-01-25_02-19-AM) we're only getting 16,000 records of the 160,000 total,
        // so the results are incomplete.
        // db.exec in sql.js. db.all in sqlite3.
        // const res = db.exec(`
        //   SELECT track_name, artist_name, album_name, track_uri, ts
        //   FROM sessions
        //   WHERE artist_name = 'RÜFÜS DU SOL'
        //   ORDER BY ts DESC
        //   LIMIT 50
        // `);
        const res = db.exec(`
        select
        track_name,
        artist_name,
        sum(ms_played) / 3600000 as total_hours_played,
        sum(ms_played) / 86400000 as total_days_played,
        sum(ms_played) as total_ms_played
      from
        sessions
      where
       artist_name is not null
      group by
        track_name,
        artist_name
      order by
        total_ms_played desc
      limit
        10`);
        // storing the results in local state
        setResults(res);
    }, [db]); // Adds db as a dependency, i.e. the effect only runs when db changes
    // addInterval('SqlResults: after query');
    // addInterval('SqlResults: before return');
    return (
      <div>
        {/* maps over the results array and renders a ResultsTable component for each result */}
        {results.map((result, index) => (
          // the ResultsTable component is passed the columns and values props
          <ResultsTable key={index} columns={result.columns} values={result.values} />
        ))}
      </div>
    );

  }
  return (
    <div>
        {/* if isTableCreated flag is true, passes the db prop to the <SqlResults /> component and renders it*/}
        {isTableCreated && <SqlResults db={db} />}
    </div>
  );

}

export default SQLComp
