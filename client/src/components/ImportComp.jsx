/**
* @file ImportComp.jsx
* @description: Component for importing and converting JSON files to CSV format.
* This component allows users to drag and drop a zip file containing JSON files. It then converts each JSON file to CSV using the PapaParse library. The converted CSV files can be downloaded.
* @requires
* - react: For building the component using React hooks and lifecycle.
* - useState: For using state in functional components.
* - useDispatch: To dispatch actions to the Redux store.
* - jszip: For working with zip files.
* @imports
* - setJson: Redux action for setting the JSON data in the Redux store.
* @methods
* - handleDragOver: Handles the drag over event and sets the isDragging state to true.
* - handleDragLeave: Handles the drag leave event and sets the isDragging state to false.
* - handleDrop: Handles the drop event, reads the dropped file, and converts the JSON data to CSV format.
* @consumers
* - /Navbar.jsx
*/

import React, { useState, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import JSZip from 'jszip'; // Importing JSZip library for working with zip files
import { useData } from './DataContext.jsx';

import { setJson, setUserFacts } from '../features/slice.js';

const ImportComp = () => {
  const { setSqlFile, sqlDb } = useData()
  const dispatch = useDispatch();

  const [isDragging, setIsDragging] = useState(false);
  const [loadingText, setLoadingText] = useState('Drop Your Spotify Extended History File Here')
  const [fileDrop, setFileDrop] = useState(false);

  // Function to handle drag over event
  const handleDragOver = (event) => {
    // console.log('dragging over');
    event.preventDefault(); // Prevent the default behavior of the drag over event, which is to open the file in the browser
    setIsDragging(true);
  };

  // Function to handle drag leave event
  const handleDragLeave = () => {
    // console.log('dragging left');
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0]; // Get the dropped file from the event
    const reader = new FileReader(); // Create a FileReader object to read the file contents

    const handleFileSql = (file) => {

      console.log('SQL file dropped');

      console.log('file.type', file);
      console.log('setting sql file in context');
      reader.onload = async function () {
        const arrayBuffer = reader.result;
        const data = new Uint8Array(arrayBuffer);
        setSqlFile(data); // Set this Uint8Array to your state or context
      };
      reader.readAsArrayBuffer(file); // Read as ArrayBuffer for binary files
      return;
    }

    const handleFileZip = (file) => {
      const timeDropped = Date.now();
      console.log('Zip file dropped');
      setFileDrop(true);
      setLoadingText('Parsing your Spotify data...')
      console.log('shoudl of changes set file droppppppppppp')
      // Array to store each json file's data
      let jsonData = [];
      reader.onload = async function () {
        const data = reader.result; // Get the file contents from the FileReader
        const zip = new JSZip(); // Create a JSZip object to work with the zip file
        const contents = await zip.loadAsync(data); // Load the zip file contents asynchronously
        const fileNames = Object.keys(contents.files).sort(); // Get the file names from the zip file
        let firstTrackRecord = null;

       // Iterate through each file in the zip
        for (const fileName of fileNames) {
        const zipEntry = contents.files[fileName];
          // Run the following code if the file ends with .json
          if (fileName.endsWith('.json') && !fileName.includes('Video')) {
            const fileData = await zipEntry.async('text'); // Read the data from the zip file dropped in by the user
            // console.log('fileName', fileName);
            const parsedData = JSON.parse(fileData); // Parse the JSON data
            jsonData = jsonData.concat(parsedData);

                // Extract the year from the file name
                const start = fileName.indexOf('Streaming_History_Audio_') + 'Streaming_History_Audio_'.length;
                const year = fileName.substring(start, start + 4);

                            // Add the year to yearsInUserHistory if it's not already there
                // getting the first track
        if (!firstTrackRecord && parsedData.length > 0) {
          firstTrackRecord = parsedData[0];
        }
              }
        };

        const firstTs = firstTrackRecord.ts;
        const firstYear = new Date(firstTs).getFullYear();
        const username = firstTrackRecord.username;
        const firstTrack = firstTrackRecord.master_metadata_track_name
        const firstArtist = firstTrackRecord.master_metadata_album_artist_name
        const firstAlbum = firstTrackRecord.master_metadata_album_album_name
        const firstTrackUri = firstTrackRecord.spotify_track_uri.substring(14);

        const pctLifeSinceFirstTrack = (Date.now() - firstTs) / (Date.now() - new Date(firstYear, 0, 1).getTime());
        console.log('pctLifeSinceFirstTrack', pctLifeSinceFirstTrack);

        dispatch(setUserFacts({ firstYear }));
        dispatch(setUserFacts({ firstTrack }));
        dispatch(setUserFacts({ firstArtist }));
        dispatch(setUserFacts({ firstAlbum }));
        dispatch(setUserFacts({ firstTs }));
        dispatch(setUserFacts({ username }));
        dispatch(setUserFacts({ firstTrackUri }));

        setTimeout(() => {
          dispatch(setJson(jsonData));
        }, 3000);

      };

        reader.readAsArrayBuffer(file);
    };

    if (file.name.includes('.sql')){
      handleFileSql(file);
      return;
    }

    // Check if the file is a zip file with the title "my_spotify_data.zip"
    if (file.type !== 'application/zip') {
      console.log('Invalid file format');
      return;
    }
    if (!file.name.includes('my_spotify_data')) {
      console.log('Invalid file name. Expected "my_spotify_data.zip"');
      return;
    }
    handleFileZip(file);
  }

  return (

    <div className="importComp">
      {!sqlDb && (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

<div style={{ position: 'absolute', top: '60%' }}>{loadingText}</div>

{fileDrop && (
        <div className="loading-spinner" style={{ position: 'absolute', top: '70%'  }}></div>
      )}



    </div>
      )}
    </div>
  );
};

export default ImportComp;
