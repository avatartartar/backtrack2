// sqlParentComp.jsx
import React, { useState } from 'react';
import dexdb from './dexdb.js';

import { DataProvider } from './DataContext.jsx';
import ImportComp from './ImportComp.jsx';
import SqlLoadComp from './SqlLoadComp.jsx';
import SqlResultsComp from './SqlResultsComp.jsx';

function SqlParentComp() {
  console.log("SqlParentComp is rendering");
  return (
    <DataProvider>
      <ImportComp />
      <SqlLoadComp />
      <SqlResultsComp />
    </DataProvider>
  );
}

export default SqlParentComp;
