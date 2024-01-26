// DataContext.jsx
import React from 'react';

const DataContext = React.createContext({ sqlFile: null, setSqlFile: () => {} });

export default DataContext;
