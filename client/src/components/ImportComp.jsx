/**
* @file ImportComp.jsx
* @description: Component for importing and converting JSON files to CSV format.
* This component allows users to drag and drop a zip file containing JSON files. It then converts each JSON file to CSV using the PapaParse library. The converted CSV files can be downloaded.
* @requires react: For building the component using React hooks and lifecycle.
* @requires jszip: For working with zip files.
* @requires papaparse: For parsing CSV data.
* @imports
* - React: For building the component using React hooks and lifecycle.
* - useState: For managing the state of the isDragging variable.
* - JSZip: For working with zip files.
* - Papa: For parsing CSV data.
* @methods
* - handleDragOver: Handles the drag over event and sets the isDragging state to true.
* - handleDragLeave: Handles the drag leave event and sets the isDragging state to false.
* - handleDrop: Handles the drop event, reads the dropped file, and converts the JSON data to CSV format.
* @consumers
* - /Navbar.jsx
*/

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import JSZip from 'jszip'; // Importing JSZip library for working with zip files
// import Papa from 'papaparse'; // Importing PapaParse library for parsing CSV data

import { setJson } from '../features/slice.js';// import store from '../store/store.js';

const ImportComp = () => {
  const dispatch = useDispatch();

  const [isDragging, setIsDragging] = useState(false);

  // Function to handle drag over event
  const handleDragOver = (event) => {
    console.log('dragging over');
    event.preventDefault(); // Prevent the default behavior of the drag over event, which is to open the file in the browser
    setIsDragging(true);
  };

  // Function to handle drag leave event
  const handleDragLeave = () => {
    console.log('dragging left');
    setIsDragging(false);
  };

  // Function to handle drop event
  const handleDrop = (event) => {
    console.log('dropped');
  event.preventDefault();
  setIsDragging(false);

  const file = event.dataTransfer.files[0]; // Get the dropped file from the event
  const reader = new FileReader(); // Create a FileReader object to read the file contents

  // Array to store each json file's data
  const jsonData = [];
  let lastJsonData = jsonData[jsonData.length - 2];
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
        jsonData.push(parsedData);

      }
    });

    console.log('conversion complete');

      setTimeout(() => {
        lastJsonData = jsonData.slice(-2)[0];
        const lastArray = lastJsonData.slice(-1000);
        // const selectedData = jsonData
        const selectedData = lastJsonData

        dispatch(setJson(selectedData));

        // saves the data to a json file
        // const selectedDataBlob = new Blob([JSON.stringify(selectedData)], { type: 'application/json' });
        // const selectedDataUrl = URL.createObjectURL(selectedDataBlob);
        // const selectedDataLink = document.createElement('a');
        // selectedDataLink.href = selectedDataUrl;
        // selectedDataLink.download = `${selectedData.name}.json`;
        // document.body.appendChild(selectedDataLink);
        // selectedDataLink.click();

        // Combine all CSV data into one file
        // const csvFile = csvData.join('\n');
        // const csvBlob = new Blob([csvFile], { type: 'text/csv' });
        // const csvUrl = URL.createObjectURL(csvBlob);
        // const csvLink = document.createElement('a');
        // csvLink.href = csvUrl;
        // csvLink.download = 'data.csv';
        // document.body.appendChild(csvLink);
        // csvLink.click();

        // Repeat the process for the last CSV file
        // const lastCsvBlob = new Blob([lastCsv], { type: 'text/csv' });
        // const lastCsvUrl = URL.createObjectURL(lastCsvBlob);
        // const lastCsvLink = document.createElement('a');
        // lastCsvLink.href = lastCsvUrl;
        // lastCsvLink.download = 'last_data.csv';
        // document.body.appendChild(lastCsvLink);
        // lastCsvLink.click();
      }, 3000);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
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
  );
};

export default ImportComp;
