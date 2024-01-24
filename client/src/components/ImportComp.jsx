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
import JSZip from 'jszip'; // Importing JSZip library for working with zip files
import Papa from 'papaparse'; // Importing PapaParse library for parsing CSV data

const ImportComp = () => {
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

    // Array to store each json file's conerted CSV data
    const csvData = [];
    let lastCsv = null; // Variable to store the last CSV data, which will be downloaded separately.


    reader.onload = async function() {
      const data = reader.result; // Get the file contents from the FileReader
      const zip = new JSZip(); // Create a JSZip object to work with the zip file
      const contents = await zip.loadAsync(data); // Load the zip file contents asynchronously

      // Iterate through each file in the zip
      contents.forEach(async (relativePath, zipEntry) => {
        // Run the following code if the file ends with .json
        if (relativePath.endsWith('.json')) {

          const fileData = await zipEntry.async('text'); // Read the data from the zip file dropped in by the user
          const jsonData = JSON.parse(fileData); // Parse the JSON data

          // Convert JSON to CSV using PapaParse library
          const csv = Papa.unparse(jsonData); // Papa.unparse() converts JSON to CSV
          lastCsv = csv;
          csvData.push(csv);
        }
      });

      console.log('conversion complete');

      // Delay the execution of the following code by 5 seconds
      setTimeout(() => {

        // Combine all CSV data into one file
        const csvFile = csvData.join('\n');

        // Create a new Blob object from the CSV data. A Blob object represents
        // a file-like object of immutable, raw data. Blobs represent data that
        // isn't necessarily in a JavaScript-native format.
        const csvBlob = new Blob([csvFile], {type: 'text/csv'});

        // Create a URL for the Blob object. The URL.createObjectURL() static
        // method creates a DOMString containing a URL representing the object
        // in the parameter. The URL lifetime is tied to the document in the
        // window on which it was created. The new object URL represents the
        // specified File object or Blob object.
        const csvUrl = URL.createObjectURL(csvBlob);

        // Create a new anchor element. The document.createElement() method
        // creates the HTML element specified by tagName, or an HTMLUnknownElement
        // if tagName isn't recognized.
        const csvLink = document.createElement('a');

        // Set the href of the anchor element to the Blob URL. The href property
        // sets or returns the value of the href attribute of a link.
        csvLink.href = csvUrl;

        // Set the download attribute of the anchor element to the desired file name.
        // The download attribute specifies that the target will be downloaded when
        // a user clicks on the hyperlink.
        csvLink.download = 'data.csv';

        // Append the anchor element to the body of the document. The
        // Node.appendChild() method adds a node to the end of the list of children
        // of a specified parent node. If the given child is a reference to an
        // existing node in the document, appendChild() moves it from its current
        // position to the new position.
        document.body.appendChild(csvLink);

        // Programmatically click the anchor element to start the download. The
        // HTMLElement.click() method simulates a mouse click on an element.
        csvLink.click();

        // Repeat the process for the last CSV file
        const lastCsvBlob = new Blob([lastCsv], {type: 'text/csv'});
        const lastCsvUrl = URL.createObjectURL(lastCsvBlob);
        const lastCsvLink = document.createElement('a');
        lastCsvLink.href = lastCsvUrl;
        lastCsvLink.download = 'last_data.csv';
        document.body.appendChild(lastCsvLink);
        lastCsvLink.click();
        // when set to 1 second the file was incomplete. it works at 2 seconds on my computer.
        // setting it to 3 in case anyone on the team's computer is slower than mine.
        // the speed will vary with performance and file size.
        // this was a quick way of going about this. we can find a a better way to do this.
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
