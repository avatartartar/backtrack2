// DataContext.jsx
import React, { createContext, useContext, useState } from 'react';

import dexdb from './dexdb.js'; // Dexie instance

// useContext is a hook for sharing data between components without having to explicitly pass a prop through every level of the tree.
// it works by creating a context object and passing it to the useContext hook.
// every component that needs access to the context object must be wrapped in the <DataContext.Provider> component.
// we do that in SqlParentComp.jsx

// in this case, it returns the sqlFile and setSqlFile values
// which are null at first.
// if and when a sqlFile is dropped onto the site, the setSqlFile function is invoked
// updating the sqlFIle variable to the dropped-in file.
// the sqlFile variable in each component that invokes it via useContext immediately receives the updated variable, i.e. the file.

// creating the context
const DataContext = createContext();

// the below DataProvider component is called in SqlParentComp.jsx
// each of the components invoked in SqlParentComp.jsx are wrapped in the provider component
// this allows them to access the 'context' object and makes them 'consumers' of the context object
// here, they are named 'children', as in 'children of the provider component' (SqlParentComp.jsx)
export const DataProvider = ({ children }) => {
  const [sqlFile, setSqlFile] = useState(null);
  const [db, setDb] = useState(null);
  const [dbBool, setDbBool] = useState(false);

  const contextValue = {
    sqlFile, setSqlFile,
    db, setDb,
    dbBool, setDbBool
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// custom hook for using DataContext
export const useData = () => useContext(DataContext);
