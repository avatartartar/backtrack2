// SqlResultsComp.js
// not being used atm 2024-01-26_04-37-AM

import React, { useEffect, useContext, useRef, useState } from 'react';
import { useData } from './DataContext.jsx';
import { useDispatch, useSelector } from "react-redux";

import { setResults } from '../features/slice.js';
import dexdb from './dexdb.js';

function SqlResultsComp() {


  // getting the sqlDb and a boolen of it from the shared context with the other sqlComponents
  const { sqlDb } = useData();

  // a function to download the SQL database as a binary file
//   const downloadSql = () => {
//     const sqlDbBinary = sqlDb.export();
//     // octet-stream means binary file type
//     const sqlData = new Blob([sqlDbBinary], { type: 'application/octet-stream' });
//     // asks the user where to save the file
//     saveAs(sqlData, 'my_spotify_history_database.sql');
//     };

    const dispatch = useDispatch();

    // the year from the slider
    const { year: chosenYear } = useSelector(state => state.chosen);

    // a place to store and fetch queries themselves
    const { tracks, albums, artists } = useSelector(state => state.query);


    const [filteredMonth, setFilteredMonth] = useState('');
    const monthOptions = ['', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

    const [filteredType, setFilteredType] = useState('tracks');
    const typeOptions = ['tracks', 'albums', 'artists'];

    const [lastLocalQuery, setLastLocalQuery] = useState('');

    // a place to store and fetch results of queries
    const results = useSelector((state) => state.results.recent);


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

    function Chart(results) {
        return (
            <div>Insert chart here</div>
        )
    }
    function SqlResults() {
        const typeMap = { tracks, albums, artists };

        // a helper function that takes in the type and month and executes the query from the store that matches both
        // utilizes chosenYear from the redux store
        const executeFilter = (type, month) => {
            let res;
            console.log('type, year, month', type, month);
            console.log('chosenYear', chosenYear);
            const typeObject = typeMap[type];
            if (chosenYear === 2024) {
                if (month) {
                    return null;
                }
                res = sqlDb.exec(typeObject.allTime);
                }
            else {
                if (!month) {
                    res = sqlDb.exec(typeObject.byYear(chosenYear));
                } else {
                    res = sqlDb.exec(typeObject.byYearByMonth(chosenYear, month));
                }
            }
            dispatch(setResults(res));
        };

        const [localQuery, setLocalQuery] = useState('');


    // a function to execute the query and store the results in the store
    const executeLiveQuery = () => {
        try {
            setLastLocalQuery(localQuery);
            const res = sqlDb.exec(localQuery);
            dispatch(setResults(res));

        } catch (error) {
            console.error('Error executing query:', error);
            alert('Error executing query. Check the console for more details.');
        }
    };

    const executeRef = useRef(null);
    // // scrolls to the execute button when that component mounts (which is when the sqlDb is loaded)
    useEffect(() => {
        executeRef.current.scrollIntoView({ behavior: 'smooth' });
    }, []);

        return (

            <div >
                <form>
                     <select
                        value={filteredType}
                        onChange={e => setFilteredType(e.target.value)}
                    >
                        {typeOptions.map(type => {
                            return <option key={type} value={type}>{type}</option>
                        })}
                    </select>

                    <select
                        value={filteredMonth}
                        onChange={e => {
                            setFilteredMonth(e.target.value);
                            console.log(`filtered month is ${filteredMonth}`)
                        }}
                    >
                        {monthOptions.map(month => {
                            return <option key={month} value={month}>{month}</option>
                        })}
                    </select>
                </form>

                {/* type and month dropdowns  */}
                <form onSubmit={
                    (e) => {
                        executeFilter(filteredType, filteredMonth, e);
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
                        Get Top {filteredType} {chosenYear === 2024 ? 'all-time' : `in ${chosenYear}` } {filteredMonth && `in ${filteredMonth}`}
                    </button>
                </form>

                {/* start: query testing area during development */}
                <textarea
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    style={{ width: '100%', height: '300px', maxheight: '500px', marginBottom: '10px', color: 'white', backgroundColor: 'black'}}
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
                    onClick={executeLiveQuery}
                >
                    Execute Query
                </button>
                 {lastLocalQuery && (
                 <div style={{ marginTop: '0 auto', color: 'white', backgroundColor: 'black', padding: '8px' }}>
                     <strong>Query:</strong> {lastLocalQuery}
                </div>
                 )}
                {/* end: query testing area during development */}

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
        <div style={{ width: '80%', margin: '0 auto' }}>
            {/* {sqlDb && (
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
            )} */}
            {sqlDb && <SqlResults />}
        </div>
    );
}

export default SqlResultsComp;
