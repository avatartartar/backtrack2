// SqlResultsComp.js
// not being used atm 2024-01-26_04-37-AM

import React, { useEffect, useContext, useRef, useCallback, useState } from 'react';
import DataContext from './DataContext.jsx';
import { useDispatch, useSelector } from "react-redux";

import { setResults } from '../features/slice.js';

function SqlResultsComp() {
  const dispatch = useDispatch();
  const results = useSelector((state) => state.results.recent);
  const [ localResults, setLocalResults ] = useState(null);
  const [showResults, setShowResults] = useState(false); // New state to control the display of results


  const { db, dbBool } = useContext(DataContext);

  // a function to download the SQL database as a binary file
  const downloadSql = () => {
    const sqlData = db.export();
    // octet-stream means binary file type
    const sqlBlob = new Blob([sqlData], { type: 'application/octet-stream' });
    // asks the user where to save the file
    saveAs(sqlBlob, 'my_spotify_history_database.sql');
  }

  function ResultsTable({ columns, values }) {
    const resultsRef = useRef(null);
    console.log('resultsTable is rendering');
    console.log('columns: ', columns);
    console.log('values: ', values);

    useEffect(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <table ref={resultsRef} style={{ width: '100%', color: 'black', borderCollapse: 'collapse' }}>
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index} style={{ border: '1px solid black', padding: '8px' }}>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
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

  function SqlResults() {
    const executeQuery = async () => {
        console.log('executeQuery in SqlResultsComp.jsx is running');
        const res = await db.exec(`
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
            10`
        );
        console.log('res: ', res);
        setLocalResults(res);
        dispatch(setResults(res))
        setShowResults(true); // Set to true to show results after query execution
        // .then(() => {
        //   console.log('dispatched results to store');
        // }
        // );
    };

    const executeRef = useRef(null);

    useEffect(() => {
        executeRef.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <div>
            <button
                ref={executeRef}
                style={{
                    width: '500px',
                    height: '50px',
                    margin: '0 auto',
                    cursor: 'pointer',
                    border: '1px solid black',
                    padding: '8px',
                    alignSelf: 'center',
                }}
                onClick={executeQuery}
            >
                Execute Query
            </button>
            {showResults && results.map((result, index) => (
                <ResultsTable key={index} columns={result.columns} values={result.values} />
            ))}
        </div>
    );
  }

  return (
      <div>
          {dbBool && (
              <button
                  style={{
                      width: '500px',
                      height: '50px',
                      margin: '0 auto',
                      cursor: 'pointer',
                      border: '1px solid black',
                      padding: '8px',
                      alignSelf: 'center',
                  }}
                  onClick={downloadSql}
              >
                  Download your Spotify History Database!
              </button>
          )}
          {dbBool && <SqlResults />}
      </div>
  );
              }

export default SqlResultsComp;
