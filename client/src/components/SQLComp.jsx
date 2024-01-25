import React, { useState, useEffect } from "react";

import initSqlJs from 'sql.js';
import SQLWasm from '/node_modules/sql.js/dist/sql-wasm.wasm';

// import "/Users/home/ptri/backtrack2/client/styles/styleSQL.css";

const SQLComp = () => {
  const [db, setDb] = useState(null);
  const [error, setError] = useState(null);

  const makeSql = async() => {
    // sql.js needs to fetch its wasm file, so we cannot immediately instantiate the database
    // without any configuration, initSqlJs will fetch the wasm files directly from the same path as the js
    // see ../craco.config.js
    try {
      const SQL = await initSqlJs({ locateFile: () => SQLWasm });
      setDb(new SQL.Database());
      // console.log('db', db);
    } catch (err) {
      setError(err);
    }
  };

/**
 * A simple SQL read-eval-print-loop
 * @param {{db: import("sql.js").Database}} props
 */
const SQLRepl = ({ db }) => {
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);
  // console.log('SQLrepl above exec, results', results);
  const exec = (sql) =>{
    try {
      // The sql is executed synchronously on the UI thread.
      // You may want to use a web worker here instead
      setResults(db.exec(sql)); // an array of objects is returned
      // console.log('results', results);
      setError(null);
    } catch (err) {
      // exec throws an error when the SQL statement is invalid
      setError(err);
      setResults([]);
    }
  }


  return (
    <div className="SQLComp">
      <h1>React SQL interpreter oh hi Mark</h1>

      <textarea
        onChange={(e) => exec(e.target.value)}
        placeholder="Enter some SQL. No inspiration ? Try “select sqlite_version()”"
      ></textarea>

      <pre className="error">{(error || "").toString()}</pre>

      <pre>
        {
          // results contains one object per select statement in the query
          results.map(({ columns, values }, i) => (
            <ResultsTable key={i} columns={columns} values={values} />
          ))
        }
      </pre>
    </div>
  );
}


/**
 * Renders a single value of the array returned by db.exec(...) as a table
 * @param {import("sql.js").QueryExecResult} props
 */
function ResultsTable({ columns, values }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((columnName, i) => (
            <td key={i}>{columnName}</td>
          ))}
        </tr>
      </thead>

      <tbody>
        {
          // values is an array of arrays representing the results of the query
          values.map((row, i) => (
            <tr key={i}>
              {row.map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
  );

  }
  makeSql();
  return <SQLRepl db={db} />;

}

export default SQLComp
