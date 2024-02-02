import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Dexie from 'dexie';
import initSqlJs from 'sql.js';

import ImportComp from './ImportComp.jsx';
import logo from '../../assets/logo.png';
import {setJson} from '../features/slice.js';
import dexdb from './dexdb.js'; // Dexie instance
import { useData } from './DataContext.jsx';

const LandingComp = () => {
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
    sqlDb,
    setSqlDb,
    sqlDbBool,
    setSqlDbBool,
    // tracksTable,
    // setTracksTable,
    // albumsTable,
    // setAlbumsTable,
  } = useData();

  const dispatch = useDispatch();

  const [promptUpload, setPromptUpload] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        console.log('LandingComp: invoked loadData()');
        const SQL = await initSqlJs();
        console.log('LandingComp: sql initialized');

        try {
          const sqlDbItem = await dexdb.sqlDbBinary.get(1);
          console.log('sqlDbItem from dexie in LandingComp:', sqlDbItem);

          if (sqlDbItem && sqlDbItem.data) {
            console.log('prior user database found in dexie. Loading...');
            const loadedSqlDb = new SQL.Database(new Uint8Array(sqlDbItem.data));

            setSqlDb(loadedSqlDb);
            setSqlDbBool(true);
            setPromptUpload(false);
          } else {
            console.log('Database not found in dexie. Prompting user to upload.');
            setPromptUpload(true); // Trigger user prompt to upload a file
          }
        } catch (error) {
          console.error('Error accessing sqlDbBinary store:', error);
          setPromptUpload(true);
        }
      } catch (error) {
        console.error('Error initializing SQL.js or accessing dexie:', error);
        setPromptUpload(true); // Fallback to prompting user in case of any error
      }
    }

    loadData();
  }, []);

  // if the sqlDb file that we generate and allow user to download is dropped onto the site, this useEffect is invoked.
  // it loads that file into the SQL.js database and sets the sqlDb local state to that database.
  useEffect(() => {
    const loadSqlFile = async () => {
      if (sqlFile) {
        try {
          // initializes a SQL.js instance asynchronously using the initSqlJs function.
          const SQL = await initSqlJs({ locateFile: () => SQLWasm });
          // creates a new database with the sqlFile binary data
          const newSqlDb = new SQL.Database(sqlFile); // Load the binary data
          // sets the sqlDb local state to the database
          setSqlDb(newSqlDb)
          setSqlDbBool(true);
          console.log('table set in SqlLoadComp.jsx');
          dispatch(setJson([]));
        } catch (error) {
          console.error('Error processing SQL file:', error);
        }
      }
    };

    loadSqlFile();
  }, [sqlFile]
  ); // Adds sqlFile as a dependency, i.e. the effect only runs when sqlFile changes


  return (
    <div>
      {/* Overlay */}
      {(!sqlDbBool) && (
        <div className="overlay">
          <img src={logo} alt="Logo" />
          {/* <div className="loading-spinner"></div> */}
          <div>{promptUpload ? 'Please upload your file.' : <><p>'Loading...'</p> <div className="loading-spinner"></div></>}</div>
          {promptUpload && <ImportComp />}
        </div>
      )}
    </div>
  );
}


export default LandingComp;

// to-do: style the landing page. 2024-01-27_05-00-PM
// to-do: move the import button to the landing page. 2024-01-27_05-00-PM
