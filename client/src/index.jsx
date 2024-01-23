/**
 * @file index.jsx
 * @description This file is the entry point for the React application. It sets up the root component with strict mode, redux provider, and the main App component.
 * @requires react: The React library is required for building components and utilizing React features.
 * @requires react-dom/client: It is used for DOM-specific methods, in this case, to create a root container in which to render the App component.
 * @requires react-redux: It allows React components to interact with the Redux store.
 *
 * @requires ../src/app/App.jsx: The main App component that represents the root of the React component tree.
 * @requires ./store/store.js: The Redux store that holds the complete state tree of the app.
 *
 * @methods
 * - None: it only initializes and renders the React application.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from '../src/app/App.jsx';
import store from './store/store.js';

const root = createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
