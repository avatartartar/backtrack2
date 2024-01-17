import React, { useEffect } from 'react';
import { useStore } from 'react-redux';
import { logState } from '../store/store.js';

// allows us to log the state of the store to the console by pressing cmd+enter anywhere on the site
const LogStateComp = () => {
  const store = useStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.metaKey && event.key === 'Enter') {
        console.log('logging state');
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
