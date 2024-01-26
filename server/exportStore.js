import fs from 'fs';
import path from 'path';
import store from '/Users/home/ptri/backtrack2/client/src/store/store.js'
import { useSelector } from 'react-redux';

let priorJsonState;

const exportStore = () => {
  // Get the current state of the store
  const { data: jsonState, status, error } = useSelector(state => state.json);


 // Check if the interesting part of the state has changed
 if (jsonState !== priorJsonState) {
  console.log('writing store to file');
   priorJsonState = jsonState;

   // Convert the state to a JSON string
   const stateJson = JSON.stringify(state.json, null, 2);

   // Write the state to a file
   fs.writeFile('storeState.json', stateJson, (err) => {
     if (err) throw err;
     console.log('The file has been saved!');
   });
 }
}

export default exportStore;
