// sqlParentComp.jsx
import React, { useState } from 'react';
import DataContext from './DataContext.jsx';
import ImportComp from './ImportComp.jsx';
import SqlLoadComp from './SqlLoadComp.jsx';
import SqlResultsComp from './SqlResultsComp.jsx';

function SqlParentComp() {
  console.log("SqlParentComp is rendering");
  const [sqlFile, setSqlFile] = useState(null);

  return (
    <DataContext.Provider value={{ sqlFile, setSqlFile }}>
      <ImportComp />

      <SqlLoadComp />
      {/* <SqlResultsComp /> */}
    </DataContext.Provider>
  );
}

export default SqlParentComp;
