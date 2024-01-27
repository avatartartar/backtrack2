import React, { useEffect, useState } from 'react';
import Dexie from 'dexie';

const db = new Dexie('backtrackDb');
db.version(1).stores({
  userDatabase: '++id'
});

const LandingComp = () => {
  // state variables for tracking if the database is initialized and if the component is loading
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [isDbLoading, setIsDbLoading] = useState(true);

  // useEffect hook that runs once after the component is first rendered
  useEffect(() => {
    // count the number of records in the 'userDatabase' table
    db.userDatabase.count().then(count => {
      // if the count is greater than 0, set 'isDbInitialized' to true
      if (count > 0) {
        setIsDbInitialized(true);
        setIsDbLoading(false);
      }
    });
  }, []);

  // if there is no data in the database, render a landing page.
  // if (isDbLoading) {
  //   return (
  //     <div style={{
  //       position: 'fixed', // Fixed positioning
  //       top: 0, // Start from the top
  //       left: 0, // Start from the left
  //       width: '100%', // Cover the full width
  //       height: '100%', // Cover the full height
  //       backgroundColor: '#07004e', // Semi-transparent background
  //       color: 'white', // White text color
  //       display: 'flex', // Use flexbox for centering text
  //       justifyContent: 'center', // Center text horizontally
  //       alignItems: 'center', // Center text vertically
  //       zIndex: 1000, // High z-index to ensure it's on top of other elements
  //     }}>
  //       Loading...
  //     </div>
  //   );
  // }
}

export default LandingComp;
