// DataContext.jsx
import React from 'react';

// useContext is a hook for sharing data between components without having to explicitly pass a prop through every level of the tree.
// it works by creating a context object and passing it to the useContext hook.
// every component that needs access to the context object must be wrapped in the <DataContext.Provider> component.
// we do that in SqlParentComp.jsx

// in this case, it returns the sqlFile and setSqlFile values
// which are null at first.
// if and when a sqlFile is dropped onto the site, the setSqlFile function is invoked
// updating the sqlFIle variable to the dropped-in file.
// the sqlFile variable in each component that invokes it via useContext immediately receives the updated variable, i.e. the file.

const DataContext = React.createContext(
  { sqlFile: null, setSqlFile: () => {},
    db: null, setDb: () => {},
    dbBool: false, setDbBool: () => {},
  }
);

export default DataContext;
