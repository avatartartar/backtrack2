// Importing necessary modules
import React from 'react';

// Importing custom components
import { DataProvider } from './DataContext.jsx';
import ImportComp from './ImportComp.jsx';
import SqlLoadComp from './SqlLoadComp.jsx';
import SqlResultsComp from './SqlResultsComp.jsx';
import LandingComp from '../components/LandingComp.jsx';
import QueryComp from './QueryComp';
import FirstAndLastTrackComp from './FirstAndLastTrackComp.jsx';
import TotalMinPlayedComp from './TotalMinPlayedComp.jsx';
import VolumePatternsComp from './VolumePatternsComp.jsx';

function SqlParentComp() {
  return (
    // Wrapping child components with the DataProvider context
    <DataProvider>
      <QueryComp />
      <ImportComp />
      <LandingComp />
      <SqlLoadComp />
      <SqlResultsComp />
      <FirstAndLastTrackComp />
      <TotalMinPlayedComp />
      <VolumePatternsComp />
    </DataProvider>
  );
}

// Exporting the SqlParentComp component as the default export
export default SqlParentComp;
