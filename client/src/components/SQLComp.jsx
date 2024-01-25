import React, { useState, useEffect } from "react";
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

  // sets to true when the table is created
  // when true, the SqlResults component is rendered
  const [isTableCreated, setIsTableCreated] = useState(false);

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

      // creates a new empty database
      const newDb = new SQL.Database();

        // Check that reduxJson is defined and has at least one element
    if (reduxJson && reduxJson.length > 0) {
      // Create columns from the keys of the first element in the array
      // i.e., the names of the fields in the JSON data
      const columns = Object.keys(reduxJson[0]).join(', ');
      // Create the table using the columns variable for the field names
      newDb.run(`CREATE TABLE sessions (${columns})`);

      let errorRecords = []; // Array to store records that cause errors
      // Insert each json object into the table as a row
      reduxJson.forEach(row => {
        const keys = Object.keys(row);
        //
        const values = Object.values(row).map((value, index) => {
          // null values need to be inserted as the string 'NULL'
          // undefined values would cause an error
          if (value === null) {
            return 'NULL';
            // if the value is a string,

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


        try {
          // Inserts one row into the sessions table, using the keys array for the field names
          // and the values array for the values
          newDb.run(`INSERT INTO sessions (${keys.join(', ')}) VALUES (${values})`);
        } catch (error) {
          // console.error(`Error inserting record: ${JSON.stringify(row)}`, error);
          errorRecords.push(row); // Add the record to the errorRecords array
        }
      });
      console.log('# of rows not added because of errors', errorRecords.length);

      // executes a SQL query to count the rows in the sessions table
      const row = newDb.exec("SELECT COUNT(*) as count FROM sessions");
      console.log(`# of rows in sessions: ${row[0].values[0][0]}`);

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
      // Updates the db local state after inserting the data and renaming the columns
      setDb(newDb);
      // Sets isTableCreated to true so that the SqlResults component is rendered
      setIsTableCreated(true);
    }

    } catch (err) {
      console.error(err);
    }
  };
  // when reduxJson changes, makeSql is called
  useEffect(() => {
      makeSql();
  }, [reduxJson]); // Adds reduxJson as a dependency, i.e. only runs when reduxJson changes

  // a placeholder component that renders the results of the SQL query
  function ResultsTable({ columns, values }) {
    return (
      // `border-collapse`: specifies whether a table's borders should be collapsed into a single border or separated
      <table style={{ width: '100%', color: 'black', borderCollapse: 'collapse' }}>
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

    useEffect(() => {
        // runs a SQL query to get the most recent 50 tracks by RÜFÜS DU SOL
        // however, right now (2024-01-25_02-19-AM) we're only getting 16,000 records of the 160,000 total,
        // so the results are incomplete.
        // db.exec in sql.js. db.all in sqlite3.
        const res = db.exec(`
          SELECT track_name, artist_name, album_name, track_uri, ts
          FROM sessions
          WHERE artist_name = 'RÜFÜS DU SOL'
          ORDER BY ts DESC
          LIMIT 50
        `);
        // storing the results in local state
        setResults(res);
    }, [db]); // Adds db as a dependency, i.e. the effect only runs when db changes

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
