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

import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import JSZip from 'jszip'; // Importing JSZip library for working with zip files
import { useData } from './DataContext.jsx';

import { setJson } from '../features/slice.js';

const ImportComp = () => {
  const { setSqlFile } = useData()
  const dispatch = useDispatch();

  const [isDragging, setIsDragging] = useState(false);

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

      // Array to store each json file's data
      let jsonData = [];
      reader.onload = async function () {
        const data = reader.result; // Get the file contents from the FileReader
        const zip = new JSZip(); // Create a JSZip object to work with the zip file
        const contents = await zip.loadAsync(data); // Load the zip file contents asynchronously

        // Iterate through each file in the zip
        contents.forEach(async (relativePath, zipEntry) => {
          // Run the following code if the file ends with .json
          if (relativePath.endsWith('.json')) {
            const fileData = await zipEntry.async('text'); // Read the data from the zip file dropped in by the user
            const parsedData = JSON.parse(fileData); // Parse the JSON data
            jsonData = jsonData.concat(parsedData);
          }
        });

        const timeParsed = Date.now();
        const timeElapsed = timeParsed - timeDropped;
        console.log(`${timeElapsed}ms to parse my_spotify_data.zip`);


        setTimeout(() => {
          dispatch(setJson(jsonData));
          // const lastArray = jsonData.slice(-1000);
          // console.log('dispatching json data to Redux store');
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
    if (file.name !== 'my_spotify_data.zip') {
      console.log('Invalid file name. Expected "my_spotify_data.zip"');
      return;
    }
    handleFileZip(file);
  }

  return (
    <div className="importComp">
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        height: '80px',
        width: '200px',
        position: 'absolute',
        top: 0,
        right: 0,
        background: 'transparent',
        border: '2px solid white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}
    >
      <div>Drop file here</div>
    </div>
    </div>
  );
};

export default ImportComp;
