// SqlResultsComp.js
// not being used atm 2024-01-26_04-37-AM

import React, { useEffect, useContext, useRef, useCallback, useState } from 'react';
import DataContext from './DataContext.jsx';
import { useDispatch, useSelector } from "react-redux";

import { setResults } from '../features/slice.js';

function SqlResultsComp() {
  const dispatch = useDispatch();

  // a place to store and fetch queries themselves
  const { tracks, albums, artists } = useSelector(state => state.query);
  const tracksAllTimeQuery = tracks.allTime;
  // const albumsAllTimeQuery = albums.allTime;
  // const artistsAllTimeQuery = artists.allTime;

  // a place to store and fetch results of queries
  const results = useSelector((state) => state.results.recent);

  // getting the db and a boolen of it from the shared context with the other sqlComponents
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
    console.log('resultsTable is rendering');

    return (
        <table style={{ width: '100%', color: 'black', borderCollapse: 'collapse' }}>
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
    // a function to execute the query and store the results in the store
    const executeQuery = () => {
        const res = db.exec(tracksAllTimeQuery);
        // not yet built out. stores in the recent array at the moment
        dispatch(setResults(res))
    };

    const executeRef = useRef(null);
    // scrolls to the execute button when that component mounts (which is when the db is loaded)
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
            {/* we need this to conditionally render based upon whether there has been any change to results,
            otherwise it tries to map an empty array and errors */}
            {results && results.map((result, index) => (
                <ResultsTable key={index} columns={result.columns} values={result.values} />
            ))}
        </div>
    );
  }

  return (
      <div>
          {db && (
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
          {db && <SqlResults />}
      </div>
  );
              }

export default SqlResultsComp;
