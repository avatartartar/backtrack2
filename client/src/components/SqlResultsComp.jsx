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
    const albumsByYearByMonthQuery = albums.byYearByMonth(chosenYear, chosenMonth);
    const artistsByYearByMonthQuery = artists.byYearByMonth(chosenYear, chosenMonth);
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

    function Chart(results) {
        return (
            <div>Insert chart here</div>
        )
    }

    function SqlResults() {
        // a function to execute the query and store the results in the store
        const executeTopTracks = () => {
            // const res = db.exec(tracksAllTimeQuery);
            const res = db.exec(tracksAllTimeQuery);
            // not yet built out. stores in the recent array at the moment
            dispatch(setResults(res))
        };
        const executeTopAlbum = () => {
            // const res = db.exec(tracksAllTimeQuery);
            const res = db.exec(albumsAllTimeQuery);
            // not yet built out. stores in the recent array at the moment
            dispatch(setResults(res))
        };
        const executeTopArtist = () => {
            // const res = db.exec(tracksAllTimeQuery);
            const res = db.exec(artistsAllTimeQuery);
            // not yet built out. stores in the recent array at the moment
            dispatch(setResults(res))
        };

        const executeTopTracksByYear = (e) => {
            e.preventDefault();
            const res = db.exec(tracksByYearQuery);
            // not yet built out. stores in the recent array at the moment
            dispatch(setResults(res))
        };

        const executeTopAlbumsByYear = (e) => {
            e.preventDefault();
            // const res = db.exec(tracksAllTimeQuery);
            const res = db.exec(albumsByYearQuery);
            // not yet built out. stores in the recent array at the moment
            dispatch(setResults(res))
        };

        const executeTopArtistsByYear = (e) => {
            e.preventDefault();
            const res = db.exec(artistsByYearQuery);
            dispatch(setResults(res));
        }

        const executeTopTracksByYearByMonth = (e) => {
            e.preventDefault();
            const res = db.exec(tracksByYearByMonthQuery);
            dispatch(setResults(res));
        }

        const executeTopAlbumsByYearByMonth = (e) => {
            e.preventDefault();
            const res = db.exec(albumsByYearByMonthQuery);
            dispatch(setResults(res));
        }

        const executeTopArtistsByYearByMonth = (e) => {
            e.preventDefault();
            const res = db.exec(artistsByYearByMonthQuery);
            dispatch(setResults(res));
        }


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
        // scrolls to the execute button when that component mounts (which is when the db is loaded)
        useEffect(() => {
            executeRef.current.scrollIntoView({ behavior: 'smooth' });
        }, []);

        return (

            <div>
                {/* <button
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
                    onClick={executeTopTracks}
                >
                    Get Top Tracks
                </button> */}
                {/* Top album button copy/pasted from above */}
                {/* <button
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
                    onClick={executeTopArtist}
                >
                    Get Top Artists
                </button> */}
                {/* Top Artist button  */}
                {/* <button
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
                    onClick={executeTopAlbum}
                >
                    Get Top Albums
                </button> */}

                <form>
                    <select
                        value={chosenYear}
                        onChange={e => setChosenYear(e.target.value)}
                    >
                        {yearOptions.map(year => {
                            return <option key={year} value={year}>{year}</option>
                        })}
                    </select>

                    <select
                        value={chosenMonth}
                        onChange={e => {
                            setChosenMonth(e.target.value);
                            console.log(`chosen month is ${chosenMonth}`)
                        }}
                    >
                        {monthOptions.map(month => {
                            return <option key={month} value={month}>{month}</option>
                        })}
                    </select>
                </form>

                {/* Top Tracks by year and month button  */}
                <form onSubmit={
                    (e) => {
                        if (!chosenYear && !chosenMonth) {
                            executeTopTracks();
                        } else if (!chosenMonth) {
                            executeTopTracksByYear(e)
                        } else {
                            executeTopTracksByYearByMonth(e);
                        }
                    }
                }>
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
                        type="submit"
                    >
                        Get Top Tracks {chosenYear && `in ${chosenYear}`} {chosenMonth && `and ${chosenMonth}`}
                    </button>
                </form>




                {/* Top Artists by year and monthbutton  */}
                <form onSubmit={ e => {
                    if (!chosenYear && !chosenMonth) {
                        executeTopArtist();
                    } else if (!chosenMonth) {
                        executeTopArtistsByYear(e);
                    } else {
                        executeTopArtistsByYearByMonth(e);
                    }
                }
                    }>


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
                        type="submit"
                    >
                        Get Top Artists {chosenYear && `in ${chosenYear}`} {chosenMonth && `and ${chosenMonth}`}
                    </button>
                </form>


                {/* Top Albums by year button  */}
                <form onSubmit={ e => {
                    if (!chosenMonth && !chosenYear) {
                        executeTopAlbum();
                    } else if (!chosenMonth) {
                        executeTopAlbumsByYear(e);
                    } else {
                        executeTopAlbumsByYearByMonth(e);
                    }
                }
                    }>


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
                        type="submit"
                    >
                        Get Top Albums {chosenYear && `in ${chosenYear}`} {chosenMonth && `and ${chosenMonth}`}
                    </button>
                </form>

                {/* we need this to conditionally render based upon whether there has been any change to results,
            otherwise it tries to map an empty array and errors */}
                {results && results.map((result, index) => (
                    <ResultsTable key={index} columns={result.columns} values={result.values} />
                ))}
                {/* executeQuery div around  */}
                <Chart results={results} />
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
    /*
      <div>
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
    */
}

export default SqlResultsComp;
