// SqlResultsComp.js
// not being used atm 2024-01-26_04-37-AM

import React, { useEffect, useContext, useRef, useState } from 'react';
import { useData } from './DataContext.jsx';
import { useDispatch, useSelector } from "react-redux";

import { setResults } from '../features/slice.js';
import dexdb from './dexdb.js';

function SqlResultsComp() {


  // getting the db and a boolen of it from the shared context with the other sqlComponents
  const { db, dbBool, setDb  } = useData();

  // a function to download the SQL database as a binary file
  const downloadSql = () => {
    const sqlBinary = db.export();
    // octet-stream means binary file type
    const sqlData = new Blob([sqlBinary], { type: 'application/octet-stream' });
    // asks the user where to save the file
    saveAs(sqlData, 'my_spotify_history_database.sql');
    };

    const dispatch = useDispatch();

    // a place to store and fetch queries themselves
    const { tracks, albums, artists } = useSelector(state => state.query);
    const [chosenYear, setChosenYear] = useState('');
    const [chosenMonth, setChosenMonth] = useState('');
    const yearOptions = ['', 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
    const monthOptions = ['', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

    const [lastLocalQuery, setLastLocalQuery] = useState('');

    const tracksAllTimeQuery = tracks.allTime;
    const albumsAllTimeQuery = albums.allTime;
    const artistsAllTimeQuery = artists.allTime;
    const tracksByYearQuery = tracks.byYear(chosenYear);
    const albumsByYearQuery = albums.byYear(chosenYear);
    const artistsByYearQuery = artists.byYear(chosenYear);
    const tracksByYearByMonthQuery = tracks.byYearByMonth(chosenYear, chosenMonth);
    // a place to store and fetch results of queries
    const results = useSelector((state) => state.results.recent);

    // getting the db and a boolen of it from the shared context with the other sqlComponents


    function ResultsTable({ columns, values }) {
        console.log('resultsTable is rendering');

    return (
        <table style={{ width: '100%', color: 'white', backgroundColor: 'black', borderCollapse: 'collapse' }}>
            <thead>
                <tr>{columns.map((column, index) => (
                        <th key={index} style={{ border: '1px solid white', padding: '8px' }}>{column}</th>
                    ))}</tr>
            </thead>
            <tbody>
                {values.map((value, index) => (
                    <tr key={index}>{value.map((cell, index) => (
                            <th key={index} style={{ border: '1px solid white', padding: '8px' }}>{cell}</th>
                        ))}</tr>
                ))}
            </tbody>
        </table>
    );
    }
function SqlResults() {
    const [localQuery, setLocalQuery] = useState('');


    // a function to execute the query and store the results in the store
    const executeQuery = () => {
        try {
            setLastLocalQuery(localQuery);
            const res = db.exec(localQuery);
            dispatch(setResults(res));

        } catch (error) {
            console.error('Error executing query:', error);
            alert('Error executing query. Check the console for more details.');
        }
    };

    const executeRef = useRef(null);
    // // scrolls to the execute button when that component mounts (which is when the db is loaded)
    useEffect(() => {
        executeRef.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

    return (
        <div ref={executeRef} >
            <textarea
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        style={{ width: '100%', height: '500px', marginBottom: '10px', color: 'white', backgroundColor: 'black'}}
        placeholder="Type your SQL query here"
            />

            <button
                style={{
                    width: '500px',
                    height: '50px',
                    margin: '0 auto',
                    cursor: 'pointer',
                    border: '1px solid',
                    padding: '8px',
                    alignSelf: 'center',
                    color: 'white',
                    backgroundColor: 'black'
                }}
                onClick={executeQuery}
            >
                Execute Query
            </button>
            {lastLocalQuery && (
                <div style={{ marginTop: '0 auto', color: 'white', backgroundColor: 'black', padding: '8px' }}>
                <strong>Query:</strong> {lastLocalQuery}
                </div>
            )}
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
                      border: '1px solid',
                      padding: '8px',
                      alignSelf: 'center',
                      color: 'white',
                      backgroundColor: 'black'
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
