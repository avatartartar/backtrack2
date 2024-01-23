/**
* @file LogStateComp.jsx
* @description: Provides a utility component that logs the current state of the Redux store to the console when the user presses cmd+enter.
* It is designed to be used during development to easily inspect the current state of the store at any point in time.
* @requires react: To utilize React hooks for lifecycle management.
* @requires react-redux: To access the Redux store using the useStore hook.
* @imports
* - '../store/store.js': Imports the logState function to log the current state of the store.
* @methods
* - handleKeyDown: if cmd+enter, triggers the logState function.
* @consumers
* - client/src/app/App.jsx
*/
import React, { useEffect } from 'react';
import { useStore } from 'react-redux';
import { logState } from '../store/store.js';

// allows us to log the state of the store to the console by pressing cmd+enter anywhere on the site
const LogStateComp = () => {
  const store = useStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey && event.key === 'Enter') {
        logState(store);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [store]);

  return null; // because this component doesn't render anything
};

export default LogStateComp;
